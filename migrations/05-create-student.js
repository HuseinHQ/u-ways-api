'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Students', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      MajorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Majors',
          key: 'id',
        },
      },
      LecturerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Lecturers',
          key: 'id',
        },
      },
      semester: {
        type: Sequelize.INTEGER,
      },
      npm: {
        type: Sequelize.STRING,
      },
      cohort: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Students');
  },
};
