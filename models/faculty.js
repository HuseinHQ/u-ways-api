'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Faculty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Faculty.hasMany(models.Major);
    }
  }
  Faculty.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNull: { msg: 'FACULTY_NAME_NULL' },
          notEmpty: { msg: 'FACULTY_NAME_EMPTY' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Faculty',
    }
  );
  return Faculty;
};
