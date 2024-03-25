'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PaymentMethod.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: `category name can't contain empty string`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'PaymentMethod',
    timestamps:true,
    paranoid:true
  });
  return PaymentMethod;
};