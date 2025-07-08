'use strict';

// This is a mock data for testing, and is not associated with any real information.

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'location',
      [
        {
          name: 'Manhattan Center',
          address: '350 5th Avenue, Suite 4400, New York, NY 10118, United States',
          uuid: 'f8e912a7b3c564d901e2',
          phone: '1024935835',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Downtown Center',
          address: '525 Market Street, Floor 15, San Francisco, CA 94105, United States',
          uuid: '3d7b92f1c05ea48d67b9',
          phone: '1124935835',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'West End Center',
          address: '1055 West Georgia Street, Suite 2000, Vancouver, BC V6E 3P3, Canada',
          uuid: 'a1e5f09c8b3d27645981',
          phone: '1624935835',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Central Location',
          address: '100 Liverpool Street, Floor 7, London EC2M 2AT, United Kingdom',
          uuid: '72c46b9d85a03fe17924',
          phone: '1025935835',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Harbour Center',
          address: '1 Macquarie Place, Level 25, Sydney NSW 2000, Australia',
          uuid: '09d5f6e4b218c3a7950d',
          phone: '1024925835',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('location', null, {});
  },
};
