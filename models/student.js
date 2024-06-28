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
      Student.belongsTo(models.User);
    }
  }
  Student.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNull: { msg: 'USER_ID_NULL' },
          notEmpty: { msg: 'USER_ID_EMPTY' },
        },
      },
      MajorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNull: { msg: 'MAJOR_ID_NULL' },
          notEmpty: { msg: 'MAJOR_ID_EMPTY' },
        },
      },
      LecturerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNull: { msg: 'LECTURER_ID_NULL' },
          notEmpty: { msg: 'LECTURER_ID_EMPTY' },
        },
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNull: { msg: 'SEMESTER_NULL' },
          notEmpty: { msg: 'SEMESTER_EMPTY' },
          min: {
            args: [1],
            msg: 'SEMESTER_INVALID',
          },
          max: {
            args: [14],
            msg: 'SEMESTER_INVALID',
          },
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
