'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('PaymentMethods', [
      {
        name: 'Mandiri Virtual Account',
      },
      {
        name: 'BCA Virtual Account',
      },
      {
        name: 'BRIVA',
      },
      {
        name: 'BNI Virtual Account',
      },
      {
        name: 'BTN Virtual Account',
      },
      {
        name: 'Danamon Virtual Account',
      },
      {
        name: 'CIMB Virtual Account',
      },
      {
        name: 'Bank Syariah Indonesia',
      },
      {
        name: 'Bank Muamalat',
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('PaymentMethods', null, {});
  }
};
