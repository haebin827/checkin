const db = require('../models');
const AppError = require('../middlewares/AppError');
const User = db.user;
const Child = db.child;
const UserChild = db.userChild;
const Location = db.location;
const History = db.history;
const { Op } = db.Sequelize;

const HistoryService = {
  async showHistoriesAndLocationList(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('Invalid request', 404);
      }

      switch (user.role) {
        case 'guardian':
          const userChildRecords = await UserChild.findAll({
            where: { userId: userId },
            attributes: ['child_id', 'location_id'],
          });

          const childIds = userChildRecords.map(record => record.child_id);

          const histories = await History.findAll({
            attributes: ['id', 'createdAt'],
            where: {
              childId: {
                [Op.in]: childIds,
              },
              status: '1',
            },
            include: [
              {
                model: Child,
                attributes: ['engName', 'korName'],
                required: true,
              },
              {
                model: Location,
                attributes: ['id', 'name'],
                required: true,
              },
              {
                model: User,
                as: 'checkedInBy',
                attributes: ['engName', 'role'],
                required: true,
              },
            ],
            order: [['createdAt', 'DESC']],
          });

          const historyLocationIds = [...new Set(histories.map(history => history.location.id))];

          const userLocations = await Location.findAll({
            where: {
              id: {
                [Op.in]: historyLocationIds,
              },
            },
            attributes: ['id', 'name'],
          });

          return {
            histories,
            locations: userLocations,
          };

        case 'manager':
          const manager = await User.findByPk(userId, {
            attributes: ['location_id'],
          });
          const location = await Location.findByPk(manager.location_id, {
            attributes: ['id', 'name'],
          });
          const managerHistories = await History.findAll({
            attributes: ['id', 'createdAt'],
            where: {
              locationId: manager.location_id,
              status: '1',
            },
            include: [
              {
                model: Child,
                attributes: ['engName', 'korName'],
                required: true,
              },
              {
                model: Location,
                attributes: ['id', 'name'],
                required: true,
              },
              {
                model: User,
                as: 'checkedInBy',
                attributes: ['engName', 'role'],
                required: true,
              },
            ],
            order: [['createdAt', 'DESC']],
          });

          return {
            histories: managerHistories,
            locations: [location],
          };

        case 'admin':
          const [allHistories, allLocations] = await Promise.all([
            History.findAll({
              attributes: ['id', 'createdAt'],
              where: {
                status: '1',
              },
              include: [
                {
                  model: Child,
                  attributes: ['engName', 'korName'],
                  required: true,
                },
                {
                  model: Location,
                  attributes: ['id', 'name'],
                  required: true,
                },
                {
                  model: User,
                  as: 'checkedInBy',
                  attributes: ['engName', 'role'],
                  required: true,
                },
              ],
              order: [['createdAt', 'DESC']],
            }),
            Location.findAll(),
          ]);

          return {
            histories: allHistories,
            locations: allLocations,
          };

        default:
          throw new Error('Invalid user role');
      }
    } catch (err) {
      throw new AppError('Invalid request', 404);
    }
  },
};

module.exports = HistoryService;
