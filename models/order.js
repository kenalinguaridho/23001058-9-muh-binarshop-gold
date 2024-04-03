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
          as: 'user',
          targetKey: 'id',
          foreignKey: 'userId'
        })

      Order.belongsTo(models.PaymentMethod, {
        as: 'paymentMethod',
        targetKey: 'id',
        foreignKey: 'paymentId'
      })

      Order.belongsTo(models.Address, {
        as: 'address',
        targetKey: 'id',
        foreignKey: 'addressId'
      })
    }
  }
  Order.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: DataTypes.UUID,
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
      allowNull: false
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