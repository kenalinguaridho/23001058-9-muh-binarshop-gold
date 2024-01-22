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
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Fashion',
      },
      {
        name: 'Sepatu dan Sandal',
      },
      {
        name: 'Elektronik',
      },
      {
        name: 'Aksesoris',
      },
      {
        name: 'Mainan dan Hobi',
      },
      {
        name: 'Dapur',
      },
      {
        name: 'Pertukangan',
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
