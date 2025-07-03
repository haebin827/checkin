const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const AppError = require('../middlewares/AppError');
const EmailService = require('./EmailService');
const Location = db.location;
const History = db.history;
const Child = db.child;
const UserChild = db.userChild;
const { Op } = db.Sequelize;

const LocationService = {
  async findAllLocations() {
    try {
      return await Location.findAll();
    } catch (err) {
      console.error('LocationService/findAllLocations:', err);
      throw err;
    }
  },

  async createLocation(locationData) {
    if (!locationData.name || !locationData.address) {
      throw new Error('Name and address are required');
    }

    const transaction = await db.sequelize.transaction();
    try {
      const newUuid = uuidv4();
      const location = await Location.create(
        {
          ...locationData,
          uuid: newUuid,
          status: '1',
        },
        { transaction },
      );

      await transaction.commit();
      return location;
    } catch (err) {
      await transaction.rollback();
      console.error('LocationService/createLocation:', err);
      throw err;
    }
  },

  async updateLocation(locationId, locationData) {
    const transaction = await db.sequelize.transaction();
    try {
      const location = await Location.findByPk(locationId);
      if (!location) {
        throw new Error('Location not found');
      }

      if (locationData.name && locationData.name !== location.name) {
        const existingLocation = await Location.findOne({
          where: {
            name: locationData.name,
            id: { [Op.ne]: locationId },
          },
        });

        if (existingLocation) {
          throw new Error('Location with this name already exists');
        }
      }

      await location.update(locationData, { transaction });
      await transaction.commit();
      return location;
    } catch (err) {
      await transaction.rollback();
      console.error('LocationService/updateLocation:', err);
      throw err;
    }
  },

  async deleteLocation(locationId) {
    const transaction = await db.sequelize.transaction();
    try {
      const location = await Location.findByPk(locationId);
      if (!location) {
        throw new Error('Location not found');
      }

      await location.update({ status: '0' }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.error('LocationService/deleteLocation:', err);
      throw err;
    }
  },

  async findLocationById(id) {
    try {
      const location = await Location.findByPk(id);

      if (!location) {
        throw new Error('No location found');
      }
      return location;
    } catch (err) {
      throw err;
    }
  },

  async generateQR(location) {
    try {
      const token = jwt.sign(
        {
          locationId: location.id,
          uuid: location.uuid,
        },
        process.env.JWT_SECRET,
      );

      // create QR code
      const url = `${process.env.CORS_ORIGIN_URL}/location/${location.uuid}?token=${token}`;
      const qrCode = await QRCode.toDataURL(url);

      return { token, url, qrCode };
    } catch (err) {
      throw err;
    }
  },

  async verifyQR(uuid, token, userId, childId) {
    const transaction = await db.sequelize.transaction();
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('DECODED UUID: ', decoded.uuid);
      if (decoded.uuid !== uuid) {
        throw new AppError('Invalid access.', 403);
      }

      const location = await Location.findOne({
        where: { uuid: decoded.uuid },
      });

      const user = await User.findByPk(userId, {
        attributes: ['engName'],
      });

      if (!location || !user) {
        throw new AppError('Location is not found.', 404);
      }

      const child = await Child.findByPk(childId);
      if (location.id !== child.location_id) {
        throw new AppError('Failed to check in.', 404);
      }

      const history = await History.create({
        child_id: childId,
        location_id: location.id,
        checkin_by: userId,
      });

      const smsEnabledGuardians = await UserChild.findAll({
        where: {
          childId: child.id,
          isSms: '1',
        },
        attributes: ['user_id'],
      });

      const guardianIds = smsEnabledGuardians.map(guardian => guardian.user_id);
      console.log('SMS enabled guardian IDs:', guardianIds);

      const date = new Date(history.createdAt);
      const formattedDate = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')} ${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

      const guardianEmails = await Promise.all(
        guardianIds.map(async guardianId => {
          const guardian = await User.findOne({
            where: { id: guardianId },
            attributes: ['email'],
          });
          return guardian?.email || null;
        }),
      );

      const validEmails = guardianEmails.filter(email => email !== null);
      console.log('Valid emails:', validEmails, formattedDate);

      await Promise.all(
        validEmails.map(async email => {
          try {
            await EmailService.sendCheckinEmail({
              email,
              checkinTime: formattedDate,
              childName: child.engName,
              locationName: location.name,
              name: user.engName,
              attemptMaker: 'guardian',
            });
          } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
          }
        }),
      );

      await transaction.commit();
      return history;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};

module.exports = LocationService;
