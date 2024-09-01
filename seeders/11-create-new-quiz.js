'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/newQuiz.json');
    await queryInterface.bulkInsert('NewQuizzes', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('NewQuizzes', null, {});
  },
};
