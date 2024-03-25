'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, {
        as: 'category',
        foreignKey: "id",
        sourceKey: "categoryId"
      })
    }
  }
  Product.init({
    categoryId: DataTypes.INTEGER,
    sku: {
      type: DataTypes.STRING,
      validate: {
        notNull: {
          args: 'sku should be in request body'
        },
        notEmpty: {
          msg: `category name can't contain empty string`
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notNull: {
          args: 'name should be in request body'
        },
        notEmpty: {
          msg: `category name can't contain empty string`
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notNull: {
          args: 'description should be in request body'
        },
        notEmpty: {
          msg: `description can't contain empty string`
        }
      }
    },
    price: {
      type: DataTypes.REAL,
      validate: {
        is: {
          args: 0,
          msg: `price can't be 0`
        },
        notNull: {
          args: 'price should be in request body'
        },
        isNumeric: {
          args: true,
          msg: 'please input valid number'
        },
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        is: {
          args: 0,
          msg: `price can't be 0`
        },
        notNull: {
          args: 'price should be in request body'
        },
        isInt: {
          args: true,
          msg: 'please input valid number'
        },
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
    timestamps: true,
    paranoid: true
  });

  return Product;
};