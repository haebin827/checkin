const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const Location = db.location;
const { Op } = db.Sequelize;

const LocationService = {
  async findAllLocations() {
    try {
      const locations = await Location.findAll();
      return locations;
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
};

module.exports = LocationService;
