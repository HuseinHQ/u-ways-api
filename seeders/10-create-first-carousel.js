'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/carousels.json');
    await queryInterface.bulkInsert('Carousels', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carousels', null, {});
  },
};
