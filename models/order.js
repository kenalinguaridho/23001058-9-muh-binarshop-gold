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
        foreignKey: 'orderId',
        sourceKey: 'id'
      }),

      Order.belongsTo(models.User, {
        as:'user',
        foreignKey : 'userId',
        sourceKey:'id'
      })

      Order.belongsTo(models.PaymentMethod, {
        as: 'payment'
      })
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    paymentId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    expiresIn: {
      type: DataTypes.DATE,
      defaultValue: new Date(new Date().setHours(new Date().getHours() + 2))
    },
    totalPrice: DataTypes.REAL,
    address: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Order',
    timestamps: true,
    paranoid: true
  });
  return Order;
};