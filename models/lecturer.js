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
      Lecturer.belongsTo(models.User, {
        foreignKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Lecturer.belongsTo(models.Major);
      Lecturer.hasMany(models.Chat);
    }
  }
  Lecturer.init(
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
      nip: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'NULL' },
          notEmpty: { msg: 'EMPTY' },
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
