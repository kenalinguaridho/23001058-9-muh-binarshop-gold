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
        foreignKey: "categoryId",
        sourceKey: "id"
      })

      Product.hasMany(models.Image, {
        as: 'images',
        sourceKey: 'id',
        foreignKey: 'parentId'
      })
    }
  }
  Product.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    categoryId: DataTypes.INTEGER,
    sku: {
      type: DataTypes.STRING,
      allowNull:false,
      unique: {
        msg: 'sku is already used'
      },
      validate: {
        notNull: {
          args: 'sku should be in request body'
        },
        notEmpty: {
          msg: `sku can't contain empty string`
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false,
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
      allowNull:false,
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
      allowNull:false,
      validate: {
        min: {
          args: 1,
          msg: `price can't be 0`
        },
        notNull: {
          msg: 'price should be in request body'
        },
        isNumeric: {
          args: true,
          msg: 'please input valid number'
        },
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        min: {
          args: 1,
          msg: `stock can't be less than 1`
        },
        notNull: {
          args: 'stock should be in request body'
        },
        isNumeric: {
          args: true,
          msg: 'stock is only allow numbers'
        },
        isInt: {
          msg: 'stock is only allow integer number'
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