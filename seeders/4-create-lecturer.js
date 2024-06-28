'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/lecturers.json');
    await queryInterface.bulkInsert('Lecturers', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Lecturers', null, {});
  },
};
