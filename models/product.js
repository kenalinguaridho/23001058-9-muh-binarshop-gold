'use strict';
const {
  Model
} = require('sequelize');
const { category } = require('../models/category');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasOne(models.Category, {
        foreignKey: "id",
        sourceKey: "categoryId"
      })
    }
  }
  Product.init({
    categoryId: DataTypes.INTEGER,
    sku: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.REAL,
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    timestamps: true,
    paranoid: true
  });

  return Product;
};