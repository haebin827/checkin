const db = require('../models');
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
        throw new Error('User not found');
      }

      switch (user.role) {
        case 'guardian':
          const userChildRecords = await UserChild.findAll({
            where: { userId: userId },
            attributes: ['child_id', 'location_id'],
            include: [
              {
                model: Location,
                as: 'location',
                attributes: ['id', 'name', 'address', 'phone'],
                required: false, // LEFT JOIN
              },
            ],
          });

          console.log(userChildRecords);
          const childIds = userChildRecords.map(record => record.child_id);

          const histories = await History.findAll({
            where: {
              childId: {
                [Op.in]: childIds,
              },
              status: '1',
            },
            include: [
              {
                model: Child,
                attributes: ['engName'],
                required: true,
              },
              {
                model: Location,
                attributes: ['name'],
                required: true,
              },
              {
                model: User,
                as: 'checkedInBy', // alias 변경
                attributes: ['engName', 'role'],
                required: true,
              },
            ],
            order: [['createdAt', 'DESC']],
          });

          const historyLocationIds = [...new Set(histories.map(history => history.location_id))];

          const userLocations = await Location.findAll({
            where: {
              id: {
                [Op.in]: historyLocationIds,
              },
            },
            attributes: ['id', 'name', 'address', 'phone'],
          });

          return {
            histories,
            locations: userLocations,
          };

        case 'manager':
          const manager = await User.findByPk(userId);
          const location = await Location.findByPk(manager.location_id);
          const managerHistories = await History.findAll({
            where: {
              locationId: manager.location_id,
              status: '1',
            },
            include: [
              {
                model: Child,
                attributes: ['engName'],
                required: true,
              },
              {
                model: Location,
                attributes: ['name'],
                required: true,
              },
              {
                model: User,
                as: 'checkedInBy', // alias 변경
                attributes: ['engName', 'role'],
                required: true,
              },
            ],
            order: [['createdAt', 'DESC']],
          });

          return {
            histories: managerHistories,
            locations: location,
          };

        case 'admin':
          const [allHistories, allLocations] = await Promise.all([
            History.findAll({
              where: {
                status: '1',
              },
              include: [
                {
                  model: Child,
                  attributes: ['engName'],
                  required: true,
                },
                {
                  model: Location,
                  attributes: ['name'],
                  required: true,
                },
                {
                  model: User,
                  as: 'checkedInBy', // alias 변경
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
    } catch (error) {
      console.error('HistoryService/showHistoriesAndLocationList:', error);
      throw error;
    }
  },
};

module.exports = HistoryService;
