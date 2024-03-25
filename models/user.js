'use strict';
const { hashSync } = require('bcryptjs');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, {
        as: 'orders',
        sourceKey: 'id',
        foreignKey: 'userId'
      })
      User.hasMany(models.Address, {
        as: 'address',
        sourceKey: "id",
        foreignKey: 'userId'
      })
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
        validate: {
          notNull: {
            args: 'name should be in request body'
          },
          notEmpty: {
            msg: `name can't contain empty string`
          }
        }
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        msg: 'username is already used'
      },
      allowNull: false,
      validate: {
        notNull: {
          args: 'username should be in request body'
        },
        notContains: {
          args: ' ',
          msg: `username can't contain spaces`
        },
        notEmpty: {
          msg: `username can't contain empty string`
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'email is already used'
      },
      validate: {
        notNull: {
          args: 'email should be in request body'
        },
        isEmail : {
          msg : `email field must contain valid email`
        },
        notContains: {
          args: ' ',
          msg: `email can't contain spaces`
        },
        notEmpty: {
          msg: `email can't contain empty string`
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      unique: {
        msg: 'phone number is already used'
      },
      validate: {
        notNull: {
          args: 'phone number should be in request body'
        },
        notContains: {
          args: ' ',
          msg: `phone number can't contain spaces`
        },
        notEmpty: {
          msg: `phone number can't contain empty string`
        }
      }
    },
    isAdmin:{
      type: DataTypes.BOOLEAN
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notNull: {
          args: 'password should be in request body'
        },
        notEmpty: {
          msg: `password can't contain empty string`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true
  });

  User.beforeCreate(user => {
    const hashedPassword = hashSync(user.password, 10)
    user.password = hashedPassword
    user.username = user.username.toLowerCase()
    user.email = user.email.toLowerCase()
  })

  User.beforeUpdate(async (user) => {
    const hashedPassword = await hashSync(user.password, 10)
    user.password = hashedPassword
    user.username = user.username.toLowerCase()
    user.email = user.email.toLowerCase()
  })

  return User;
};