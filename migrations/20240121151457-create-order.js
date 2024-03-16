'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'Users'
        }
      },
      paymentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'PaymentMethods'
        }
      },
      expiresIn: {
        allowNull: false,
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address : {
        type: Sequelize.TEXT,
        allowNull:false
      },
      totalPrice: {
        type: Sequelize.REAL,
        allowNull: true,
        defaultValue : 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : new Date()
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};