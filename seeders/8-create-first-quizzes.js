'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/quizzes.json');
    await queryInterface.bulkInsert('Quizzes', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Quizzes', null, {});
  },
};
