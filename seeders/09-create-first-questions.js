'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/questions.json');
    queryInterface.bulkInsert('Questions', data, {});
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('Questions', null, {});
  },
};
