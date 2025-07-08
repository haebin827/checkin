'use strict';

// This is a mock data for testing, and is not associated with any real information.

module.exports = {
  async up(queryInterface, Sequelize) {

    const children = await queryInterface.sequelize.query(
      'SELECT id, locationId FROM child ORDER BY id',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const userChildMappings = await queryInterface.sequelize.query(
      'SELECT childId, userId FROM user_child',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const managers = await queryInterface.sequelize.query(
      'SELECT id, locationId FROM User WHERE role = "manager"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const locationManagers = {};
    managers.forEach(manager => {
      if (!locationManagers[manager.locationId]) {
        locationManagers[manager.locationId] = [];
      }
      locationManagers[manager.locationId].push(manager.id);
    });

    const childGuardians = {};
    userChildMappings.forEach(mapping => {
      if (!childGuardians[mapping.childId]) {
        childGuardians[mapping.childId] = [];
      }
      childGuardians[mapping.childId].push(mapping.userId);
    });

    const historyRecords = [];
    const now = new Date();

    children.forEach(child => {
      const numRecords = Math.floor(Math.random() * 5) + 3;
      
      for (let i = 0; i < numRecords; i++) {
        let checkinBy;
        if (Math.random() < 0.5 && childGuardians[child.id]?.length > 0) {
          const guardians = childGuardians[child.id];
          checkinBy = guardians[Math.floor(Math.random() * guardians.length)];
        } else {
          const managers = locationManagers[child.locationId] || [];
          if (managers.length > 0) {
            checkinBy = managers[Math.floor(Math.random() * managers.length)];
          } else {
            const guardians = childGuardians[child.id] || [];
            checkinBy = guardians[Math.floor(Math.random() * guardians.length)];
          }
        }

        const checkinDate = new Date(now);
        checkinDate.setDate(checkinDate.getDate() - Math.floor(Math.random() * 30));
        checkinDate.setHours(9 + Math.floor(Math.random() * 3));
        checkinDate.setMinutes(Math.floor(Math.random() * 60));

        const checkoutDate = new Date(checkinDate);
        checkoutDate.setHours(checkoutDate.getHours() + 4 + Math.floor(Math.random() * 4));

        let checkoutBy;
        if (Math.random() < 0.5 && childGuardians[child.id]?.length > 0) {
          const guardians = childGuardians[child.id];
          checkoutBy = guardians[Math.floor(Math.random() * guardians.length)];
        } else {
          const managers = locationManagers[child.locationId] || [];
          if (managers.length > 0) {
            checkoutBy = managers[Math.floor(Math.random() * managers.length)];
          } else {
            const guardians = childGuardians[child.id] || [];
            checkoutBy = guardians[Math.floor(Math.random() * guardians.length)];
          }
        }

        historyRecords.push({
          childId: child.id,
          locationId: child.locationId,
          checkinBy: checkinBy,
          status: '1',
          created_at: checkinDate,
          updated_at: checkinDate,
        });
      }
    });

    // 생성된 레코드들을 데이터베이스에 삽입
    await queryInterface.bulkInsert('history', historyRecords, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('history', null, {});
  }
};
