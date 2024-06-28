'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/faculties.json');
    await queryInterface.bulkInsert('Faculties', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Faculties', null, {});
  },
};
