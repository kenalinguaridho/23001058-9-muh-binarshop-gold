'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [
      {
        id: 'c06fc5ca-d22d-4f34-9b1d-de8a4468c907',
        name: 'User Customer 1',
        username: 'customer1',
        email: 'customer1@example.com',
        phone: '0898918979183',
        isAdmin: false,
        isActive: true,
        password: '$2a$10$xVnvcW45TIdhr/QIOfNVZ.ko8THl1xQE7YxCX/FCUJWC2sKExU1fe',
      },
      {
        id: 'c789e0cc-1ec6-4470-b097-c02b19f00469',
        name: 'User Customer 2',
        username: 'customer2',
        email: 'customer2@example.com',
        phone: '0898918979182',
        isAdmin: false,
        isActive: false,
        password: '$2a$10$xVnvcW45TIdhr/QIOfNVZ.ko8THl1xQE7YxCX/FCUJWC2sKExU1fe',
      },
      {
        id: '103521e7-3eec-4505-a6f6-c25b6f27a05b',
        name: 'User Customer Not Verified',
        username: 'customernotverified',
        email: 'customernotverified@example.com',
        phone: '0898918976652',
        isAdmin: false,
        isActive: false,
        password: '$2a$10$xVnvcW45TIdhr/QIOfNVZ.ko8THl1xQE7YxCX/FCUJWC2sKExU1fe',
      },
      {
        id: '53db2b23-4175-4119-9c2d-85bc9cf56847',
        name: 'User Admin',
        username: 'admin',
        email: 'admin@example.com',
        phone: '0898918971113',
        isAdmin: true,
        isActive: true,
        password: '$2a$10$xVnvcW45TIdhr/QIOfNVZ.ko8THl1xQE7YxCX/FCUJWC2sKExU1fe',
      },
      {
        id: 'ecbd3db9-169d-4ff7-9ee4-5c7280c80fb4',
        name: 'User Admin 2',
        username: 'admin2',
        email: 'admin2@example.com',
        phone: '0898918975513',
        isAdmin: true,
        isActive: false,
        password: '$2a$10$xVnvcW45TIdhr/QIOfNVZ.ko8THl1xQE7YxCX/FCUJWC2sKExU1fe',
      },
      {
        id: '59706d02-dc3f-4b53-b0bb-d8958fdf71da',
        name: 'Deleted User',
        username: 'deleteduser',
        email: 'deleted_user@example.com',
        phone: '0898918975522',
        isAdmin: false,
        isActive: true,
        password: '$2a$10$xVnvcW45TIdhr/QIOfNVZ.ko8THl1xQE7YxCX/FCUJWC2sKExU1fe',
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
