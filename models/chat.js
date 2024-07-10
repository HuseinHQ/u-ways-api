'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.belongsTo(models.Student);
      Chat.belongsTo(models.Lecturer);
    }
  }
  Chat.init(
    {
      StudentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
        },
      },
      LecturerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Chat',
    }
  );
  return Chat;
};
