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
        as: 'order',
        foreignKey: 'orderId',
        sourceKey: 'id'
      })

      OrderProduct.belongsTo(models.Product, {
        as: 'product',
        foreignKey: 'productId',
        sourceKey: 'id'
      })
    }
  }

  OrderProduct.init({
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    subTotal: DataTypes.REAL
  }, {
    hooks: {
      afterBulkCreate: async (orderProduct) => {
        try {
          
          for (let i = 0; i < orderProduct.length; i++) {
            let product = await orderProduct[i].getProduct()
            product.stock -= orderProduct[i].amount
            total_price += orderProduct[i].subTotal
            await product.save()
          }

        } catch (error) {
          console.log(error)
        }
      }
    },
    sequelize,
    modelName: 'OrderProduct',
    timestamps: true,
    paranoid: true
  });

  return OrderProduct;
};