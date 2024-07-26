'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuestionDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QuestionDetail.belongsTo(models.Question);
    }
  }
  QuestionDetail.init(
    {
      QuestionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
        },
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
        },
      },
    },
    {
      sequelize,
      modelName: 'QuestionDetail',
    }
  );
  return QuestionDetail;
};
