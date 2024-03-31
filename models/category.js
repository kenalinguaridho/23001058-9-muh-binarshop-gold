'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Product,
        {
          as: 'products',
          sourceKey: 'id',
          foreignKey: 'categoryId'
        }
      )
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^[a-zA-Z\s]*$/,
          msg: 'category name must be a string'
        },
        notEmpty: {
          msg: `category name can't contain empty string`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
    timestamps: true,
    paranoid: true
  });
  return Category;
};