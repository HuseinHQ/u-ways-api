'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Student, {
        foreignKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.hasOne(models.Lecturer, {
        foreignKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.Quiz);
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
          isEmail: { msg: 'INVALID' },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
          len: { args: [8, 255], msg: 'LENGTH' },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
          len: { args: [8, 255], msg: 'LENGTH' },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
          isIn: {
            args: [['admin', 'mahasiswa', 'dosen']],
            msg: 'INVALID',
          },
        },
      },
      isComplete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      hooks: {
        beforeCreate: (user) => {
          user.password = hashPassword(user.password);
        },
      },
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
