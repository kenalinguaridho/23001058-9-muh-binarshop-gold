'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id'
      })

      Address.hasMany(models.Order, {
        as: 'orders',
        sourceKey: 'id',
        foreignKey: 'addressId'
      })
    }
  }
  Address.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'address should be in request body'
        },
        notEmpty: {
          msg: `address can't be empty string`
        }
      }
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    receiver: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'receiver name should be in request body'
        },
        notEmpty: {
          msg: `receiver name can't be empty string`
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'phone number should be in request body'
        },
        notContains: {
          args: ' ',
          msg: `phone number can't contain spaces`
        },
        notEmpty: {
          msg: `phone number can't be empty string`
        }
      }
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Address',
  });
  return Address;
};