'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Quiz.belongsTo(models.User);
    }
  }
  Quiz.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
        },
      },
      score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'MIN',
          },
          max: {
            args: [100],
            msg: 'MAX',
          },
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
      part: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: {
            args: [1],
            msg: 'MIN',
          },
          max: {
            args: [2],
            msg: 'MAX',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Quiz',
    }
  );
  return Quiz;
};
