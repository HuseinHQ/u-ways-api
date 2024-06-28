'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Major extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Major.belongsToMany(models.Faculty);
    }
  }
  Major.init(
    {
      FacultyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNull: { msg: 'FACULTY_ID_NULL' },
          notEmpty: { msg: 'FACULTY_ID_EMPTY' },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNull: { msg: 'MAJOR_NAME_NULL' },
          notEmpty: { msg: 'MAJOR_NAME_EMPTY' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Major',
    }
  );
  return Major;
};
