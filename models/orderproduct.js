'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderProduct.belongsTo(models.Order, {
        targetKey: 'id',
        as: 'order',
        foreignKey: 'orderId'
      })

      OrderProduct.belongsTo(models.Product, {
        targetKey: 'id',
        as: 'product',
        foreignKey: 'productId',
      })
    }
  }

  OrderProduct.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    orderId: DataTypes.INTEGER,
    productId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: `product id can't contain empty number`
        },
        isInt: {
          args: true,
          msg: 'please input valid number'
        },
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: `product id can't contain empty number`
        },
        isInt: {
          args: true,
          msg: 'please input valid number'
        },
      }
    },
    subTotal: DataTypes.REAL
  }, {
    sequelize,
    modelName: 'OrderProduct',
    timestamps: true,
    paranoid: true
  });

  return OrderProduct;
};