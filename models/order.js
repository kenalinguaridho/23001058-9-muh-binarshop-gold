'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.OrderProduct, {
        as: 'orderProducts',
        sourceKey: 'id',
        foreignKey: 'orderId'
      }),

      Order.belongsTo(models.User, {
        targetKey: 'id',
        foreignKey : 'userId'
      })

      Order.belongsTo(models.PaymentMethod, {
        targetKey: 'id',
        foreignKey: 'paymentMethodId'
      })

      Order.belongsTo(models.Address, {
        targetKey: 'id',
        foreignKey: 'addressId'
      })
    }
  }
  Order.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: DataTypes.INTEGER,
    paymentId: {
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
    status: DataTypes.STRING,
    expiresOn: {
      type: DataTypes.DATE,
      defaultValue: new Date(new Date().setHours(new Date().getHours() + 2))
    },
    totalPrice: DataTypes.REAL,
    addressId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Order',
    timestamps: true,
    paranoid: true
  });
  return Order;
};