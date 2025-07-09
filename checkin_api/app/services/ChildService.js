const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const EmailService = require('./EmailService');
const AppError = require('../middlewares/AppError');
const Child = db.child;
const User = db.user;
const Location = db.location;
const History = db.history;
const UserChild = db.userChild;
const { Op } = db.Sequelize;

const ChildService = {
  async findAllChildren() {
    try {
      const children = await Child.findAll();
      return children;
    } catch (err) {
      throw new AppError('Something went wrong');
    }
  },

  async findChildrenByLocation(locationId) {
    try {
      const children = await Child.findAll({
        attributes: ['id', 'engName', 'phone'],
        where: {
          locationId: locationId,
        },
      });
      return children;
    } catch (err) {
      throw new AppError('Something went wrong');
    }
  },

  async createChild(childData) {
    if (!childData.engName || !childData.location_id) {
      throw new AppError('Invalid request', 400);
    }

    childData.phone = childData.phone === '' ? null : childData.phone;
    childData.korName = childData.korName === '' ? null : childData.korName;

    try {
      const child = await Child.create(childData);
      return child;
    } catch (err) {
      throw new AppError('Failed to add a new child. Please contact to the system team.', 500);
    }
  },

  async updateChild(childId, childData) {
    const transaction = await db.sequelize.transaction();
    try {
      const child = await Child.findByPk(childId);
      if (!child) {
        throw new AppError('Invalid request', 400);
      }
      await child.update(childData, { transaction });
      await transaction.commit();
      return child;
    } catch (err) {
      await transaction.rollback();
      throw new AppError('Failed to update a child information. Please contact to the system team.', 400);
    }
  },

  async deleteChild(childId) {
    const transaction = await db.sequelize.transaction();
    try {
      const child = await Child.findByPk(childId);
      if (!child) {
        throw new AppError('Invalid request', 400);
      }
      await child.update({ status: '0' }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw new AppError('Failed to delete a child information. Please contact to the system team.', 400);
    }
  },

  async sendInviteEmail(guardianEmail, childId, locationId) {
    const transaction = await db.sequelize.transaction();
    try {
      const child = await Child.findByPk(childId);
      if (!child) {
        throw new AppError('Failed to send invitation. Please contact to the system team.', 404);
      }

      const guardian = await User.findOne({
        attributes: ['id'],
        where: {
          email: guardianEmail,
          role: 'guardian',
        },
      });

      if (!guardian) {
        throw new AppError('No registered guardian found with this email address', 404);
      }

      await db.userChild.create(
        {
          user_id: guardian.id,
          child_id: childId,
          location_id: locationId,
        },
        { transaction },
      );

      await EmailService.sendInviteEmail(guardianEmail, child.engName);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw new AppError('Invalid request', 400);
    }
  },

  async showChildrenAndLocationList(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('Invalid request', 400);
      }

      switch (user.role) {
        case 'guardian':
        const guardianData = await User.findByPk(userId, {

          include: [
            {
              model: Child,
              as: 'children',
              attributes: ['id', 'engName', 'korName', 'birth', 'phone', 'location_id'],
              where: {status: '1'},
              through: {
                attributes: ['relationship', 'isSms'],
              },
              include: [
                {
                  model: Location,
                  as: 'location',
                  attributes: ['id', 'name'],
                },
              ]
            },
          ],
        });

          return {
            children: guardianData.children,
            locations: guardianData.children
              .map(child => child.location)
              .filter(
                (location, index, self) => index === self.findIndex(l => l.id === location.id),
              ),
          };

        case 'manager':
          const managerChildren = await Child.findAll({
            attributes: ['id', 'engName', 'korName', 'birth', 'phone', 'location_id'],
            where: {
              locationId: user.location_id,
              status: '1'
            },
            include: [
              {
                model: Location,
                as: 'location',
                attributes: ['id', 'name'],
              },
            ],
          });

          const managerLocation = await Location.findByPk(user.location_id);
          if (!managerLocation) {
            throw new AppError('Location not found', 404);
          }

          return {
            children: managerChildren,
            locations: [managerLocation],
          };

        case 'admin':
          // 관리자의 경우 모든 아이들과 모든 위치 정보를 반환
          const [allChildren, allLocations] = await Promise.all([
            Child.findAll({
              attributes: ['id', 'engName', 'korName', 'birth', 'phone', 'location_id'],
              where: {status: '1'},
              include: [
                {
                  model: Location,
                  as: 'location',
                  attributes: ['id', 'name'],
                },
              ],
            }),
            Location.findAll(),
          ]);

          return {
            children: allChildren,
            locations: allLocations,
          };

        default:
          throw new AppError('Invalid request.', 404);
      }
    } catch (error) {
      throw new AppError('Invalid request.', 404);
    }
  },

  async forceCheckin(data) {
    const { userId, locationId, childId, childName, name, locationName, attemptMaker } = data;

    const transaction = await db.sequelize.transaction();
    try {
      const history = await History.create({
        child_id: childId,
        location_id: locationId,
        checkin_by: userId,
      });

      // SMS 알림을 받기로 한 보호자들의 userId 찾기
      const smsEnabledGuardians = await UserChild.findAll({
        attributes: ['user_id'],
        where: {
          childId: childId,
          isSms: '1',
          status: '1',
        },
      });

      const guardianIds = smsEnabledGuardians.map(guardian => guardian.user_id);

      const date = new Date(history.createdAt);
      const formattedDate = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')} ${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

      // 각 guardian의 이메일 찾기
      const guardianEmails = await Promise.all(
        guardianIds.map(async guardianId => {
          const guardian = await User.findOne({
            where: { id: guardianId },
            attributes: ['email'],
          });
          return guardian?.email || null;
        }),
      );

      const validEmails = guardianEmails.filter(email => email !== null || email !== '');

      await Promise.all(
        validEmails.map(async email => {
          try {
            await EmailService.sendCheckinEmail({
              email,
              checkinTime: formattedDate,
              childName,
              locationName,
              name,
              attemptMaker,
            });
          } catch (err) {
            throw err;
          }
        }),
      );

      await transaction.commit();
      return history;
    } catch (err) {
      await transaction.rollback();
      throw new AppError('Invalid request', 404);
    }
  },

  async updateGuardianSettings(childId, userId, { relationship, isSms }) {
    const transaction = await db.sequelize.transaction();
    try {
      // 해당 user_child 레코드 찾기
      const userChild = await UserChild.findOne({
        where: {
          childId: childId,
          userId: userId,
        },
      });

      if (!userChild) {
        throw new AppError('Invalid request', 404);
      }

      await userChild.update(
        {
          relationship,
          isSms,
        },
        { transaction },
      );

      await transaction.commit();
      return userChild;
    } catch (error) {
      await transaction.rollback();
      throw new AppError('Invalid request', 404);
    }
  },

  async findChildByPhone(phone) {
    try {
      const child = await Child.findOne({
        where: { phone },
      });
      return !!child;
    } catch (err) {
      throw new AppError('Invalid request', 400);
    }
  },
};

module.exports = ChildService;
