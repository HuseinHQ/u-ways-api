'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/majors.json');
    await queryInterface.bulkInsert('Majors', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Majors', null, {});
  },
};
