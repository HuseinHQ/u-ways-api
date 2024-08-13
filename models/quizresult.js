'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuizResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QuizResult.belongsTo(models.Quiz);
      QuizResult.belongsTo(models.Student);
    }
  }
  QuizResult.init(
    {
      StudentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
        },
      },
      QuizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
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
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          min: {
            args: [0],
            msg: 'MIN',
          },
          max: {
            args: [1],
            msg: 'MAX',
          },
        },
      },
      score: {
        type: DataTypes.DECIMAL,
      },
      answer: {
        type: DataTypes.JSONB,
      },
    },
    {
      sequelize,
      modelName: 'QuizResult',
    }
  );
  return QuizResult;
};
