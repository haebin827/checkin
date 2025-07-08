const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const EmailService = require('./EmailService');
const AppError = require("../middlewares/AppError");
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
      console.error('ChildService/findAllChildren:', err);
      throw err;
    }
  },

  async findChildrenByLocation(locationId) {
    try {
      const children = await Child.findAll({
        where: {
          locationId: locationId,
        },
      });
      return children;
    } catch (err) {
      console.error('ChildService/findChildrenByLocation:', err);
      throw err;
    }
  },

  async createChild(childData) {
    if (!childData.engName || !childData.location_id) {
      throw new AppError('Invalid credentials', 400);
    }

    childData.phone = childData.phone === '' ? null : childData.phone;
    childData.korName = childData.korName === '' ? null : childData.korName;

    try {
      const child = await Child.create(childData);
      return child;
    } catch (err) {
      console.error('ChildService/createChild:', err);
      throw err;
    }
  },

  async updateChild(childId, childData) {
    const transaction = await db.sequelize.transaction();
    try {
      const child = await Child.findByPk(childId);
      if (!child) {
        throw new Error('Child not found');
      }

      await child.update(childData, { transaction });
      await transaction.commit();
      return child;
    } catch (err) {
      await transaction.rollback();
      console.error('ChildService/updateChild:', err);
      throw err;
    }
  },

  async deleteChild(childId) {
    const transaction = await db.sequelize.transaction();
    try {
      const child = await Child.findByPk(childId);
      if (!child) {
        throw new Error('Child not found');
      }

      // Soft delete by updating status
      await child.update({ status: '0' }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.error('ChildService/deleteChild:', err);
      throw err;
    }
  },

  async sendInviteEmail(guardianEmail, childId, locationId) {
    console.log('Data: ', guardianEmail, childId, locationId);
    const transaction = await db.sequelize.transaction();
    try {
      const child = await Child.findByPk(childId);
      if (!child) {
        throw new Error('Child not found');
      }

      const guardian = await User.findOne({
        where: {
          email: guardianEmail,
          role: 'guardian',
        },
      });

      if (!guardian) {
        throw new Error('Guardian with this email not found');
      }

      await db.userChild.create(
        {
          user_id: guardian.id,
          child_id: childId,
          location_id: locationId,
          relationship: 'parent',
        },
        { transaction },
      );

      await EmailService.sendInviteEmail(guardianEmail, child.engName);

      await transaction.commit();

      return {
        success: true,
        message: 'Invitation sent and relationship created successfully',
      };
    } catch (error) {
      await transaction.rollback();
      console.error('ChildService/sendInviteEmail:', error);

      let errorMessage = 'Failed to send invitation';
      if (error.message === 'Guardian with this email not found') {
        errorMessage = 'No registered guardian found with this email address';
      } else if (error.message === 'Child not found') {
        errorMessage = 'Selected child not found';
      } else if (error.message === 'Child does not belong to this location') {
        errorMessage = 'Child is not registered to this location';
      }

      throw {
        success: false,
        message: errorMessage,
      };
    }
  },

  async showChildrenAndLocationList(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      switch (user.role) {
        case 'guardian':
          // 보호자의 경우 자신과 연결된 아이들과 해당 아이들의 모든 위치 정보를 반환
          const guardianData = await User.findByPk(userId, {
            include: [
              {
                model: Child,
                as: 'children',
                through: {
                  attributes: ['relationship', 'isSms'], // userChild 테이블에서 relationship 필드만 포함
                },
                include: [
                  {
                    model: Location,
                    as: 'location',
                  },
                ],
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
          // 매니저의 경우 자신의 위치에 있는 모든 아이들 정보를 반환
          const managerChildren = await Child.findAll({
            where: {
              locationId: user.location_id,
            },
            include: [
              {
                model: Location,
                as: 'location',
              },
            ],
          });

          return {
            children: managerChildren,
            locations: [await Location.findByPk(user.location_id)],
          };

        case 'admin':
          // 관리자의 경우 모든 아이들과 모든 위치 정보를 반환
          const [allChildren, allLocations] = await Promise.all([
            Child.findAll({
              include: [
                {
                  model: Location,
                  as: 'location',
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
          throw new Error('Invalid user role');
      }
    } catch (error) {
      console.error('ChildService/showChildrenAndLocationList:', error);
      throw error;
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
        where: {
          childId: childId,
          isSms: '1',
        },
        attributes: ['user_id'],
      });

      const guardianIds = smsEnabledGuardians.map(guardian => guardian.user_id);
      console.log('SMS enabled guardian IDs:', guardianIds);

      // 날짜 포맷 변환
      const date = new Date(history.createdAt);
      const formattedDate = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')} ${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

      // 각 guardian의 이메일 찾기
      const guardianEmails = await Promise.all(
        guardianIds.map(async guardianId => {
          const guardian = await User.findOne({
            where: { id: guardianId },
            attributes: ['email'],
          });
          return guardian?.email || null; // guardian이 없는 경우 null 반환
        }),
      );

      // null 값 필터링하여 유효한 이메일만 추출
      const validEmails = guardianEmails.filter(email => email !== null);
      console.log('Valid emails:', validEmails, formattedDate);

      // 유효한 이메일로만 체크인 알림 발송
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
          } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
            // 개별 이메일 전송 실패는 전체 프로세스를 중단하지 않음
          }
        }),
      );

      await transaction.commit();
      return history;
    } catch (error) {
      await transaction.rollback();
      console.error('ChildService/forceCheckin:', error);
      throw error;
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
        throw new Error('Guardian-Child relationship not found');
      }

      // 설정 업데이트
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
      console.error('ChildService/updateGuardianSettings:', error);
      throw error;
    }
  },

  async findChildByPhone(phone) {
    try {
      const count = await Child.count({
        where: { phone },
      });

      console.log("COUNT: ", count)
      return count > 0;
    } catch (err) {
      console.error('Phone check error:', err);
      throw err;
    }
  },
};

module.exports = ChildService;
