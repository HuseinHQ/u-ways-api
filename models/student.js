'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Student.belongsTo(models.Lecturer);
      Student.belongsTo(models.Major);
      Student.belongsTo(models.User, {
        foreignKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Student.hasOne(models.Chat);
    }
  }
  Student.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        validate: {
          notNull: { msg: 'NULL' },
        },
      },
      MajorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
        },
      },
      LecturerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
        },
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          min: {
            args: [1],
            msg: 'MIN',
          },
          max: {
            args: [14],
            msg: 'MAX',
          },
        },
      },
      npm: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
        },
      },
      cohort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Student',
    }
  );
  return Student;
};
