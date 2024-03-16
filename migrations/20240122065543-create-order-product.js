'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'Orders'
        }
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'Products'
        }
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      subTotal: {
        type: Sequelize.REAL,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderProducts');
  }
};