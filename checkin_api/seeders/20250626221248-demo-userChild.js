'use strict';

// This is a mock data for testing, and is not associated with any real information.

const relationships = [
  'Mother',
  'Father',
  'Grandmother',
  'Grandfather',
  'Uncle',
  'Aunt',
  'Guardian'
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const children = await queryInterface.sequelize.query(
      'SELECT id, locationId FROM child ORDER BY id',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM User WHERE role = "guardian" ORDER BY id',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const userChildRecords = [];

    children.forEach(child => {
      const numGuardians = Math.floor(Math.random() * 3) + 1;

      const usedRelationships = new Set();
      const usedGuardians = new Set();
      
      for (let i = 0; i < numGuardians; i++) {
        let selectedUser;
        let attempts = 0;
        const maxAttempts = 10;

        do {
          selectedUser = users[Math.floor(Math.random() * users.length)];
          attempts++;
          if (attempts >= maxAttempts) break;
        } while (usedGuardians.has(selectedUser.id));

        if (attempts >= maxAttempts) continue;

        usedGuardians.add(selectedUser.id);

        let relationship;
        do {
          relationship = relationships[Math.floor(Math.random() * relationships.length)];
        } while (usedRelationships.has(relationship));
        usedRelationships.add(relationship);

        userChildRecords.push({
          userId: selectedUser.id,
          childId: child.id,
          locationId: child.locationId,
          relationship: relationship,
          is_sms: Math.random() < 0.8 ? '1' : '0',
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    });

    await queryInterface.bulkInsert('user_child', userChildRecords, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_child', null, {});
  }
};
