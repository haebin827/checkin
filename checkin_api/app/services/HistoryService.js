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
          // 1. UserChild 테이블에서 해당 guardian의 모든 childId와 locationId 가져오기
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
          // 2. childId 배열 생성
          const childIds = userChildRecords.map(record => record.child_id);

          // 4. History 테이블에서 해당 childId들의 기록 가져오기
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

          // 5. History에서 사용된 모든 location_id 추출
          const historyLocationIds = [...new Set(histories.map(history => history.location_id))];

          // 6. 모든 필요한 Location 정보 가져오기
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
          // 관리자의 경우도 동일한 조인 적용
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
