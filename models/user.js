'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Student);
      User.hasOne(models.Lecturer);
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNull: { msg: 'EMAIL_NULL' },
          notEmpty: { msg: 'EMAIL_EMPTY' },
          isEmail: { msg: 'NOT_EMAIL_FORMAT' },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNull: { msg: 'PASSWORD_NULL' },
          notEmpty: { msg: 'PASSWORD_EMPTY' },
          len: { args: [8, 255], msg: 'PASSWORD_LENGTH' },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNull: { msg: 'NAME_NULL' },
          notEmpty: { msg: 'NAME_EMPTY' },
          len: { args: [8, 255], msg: 'NAME_LENGTH' },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNull: { msg: 'ROLE_NULL' },
          notEmpty: { msg: 'ROLE_EMPTY' },
          isIn: {
            args: [['admin', 'mahasiswa', 'dosen']],
            msg: 'ROLE_INVALID',
          },
        },
      },
      isComplete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
