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
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
    },
    address: {
      type: DataTypes.TEXT,
      validate: {
        notNull: {
          args: 'description should be in request body'
        },
        notEmpty: {
          msg: `description can't contain empty string`
        }
      }
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Address',
  });
  return Address;
};