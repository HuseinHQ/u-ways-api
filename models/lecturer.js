'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lecturer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Lecturer.hasMany(models.Student);
      Lecturer.belongsTo(models.User);
      Lecturer.belongsTo(models.Major);
    }
  }
  Lecturer.init(
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
    },
    {
      sequelize,
      modelName: 'Lecturer',
    }
  );
  return Lecturer;
};
