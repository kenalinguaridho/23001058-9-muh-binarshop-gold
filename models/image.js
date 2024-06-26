'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'parentId',
        sourceKey: 'id'
      })

      Image.belongsTo(models.Product, {
        as: 'product',
        foreignKey: 'parentId',
        sourceKey: 'id'
      })
    }
  }
  Image.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    usage: DataTypes.STRING,
    parentId: DataTypes.UUID,
    url: DataTypes.STRING,
    publicId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};