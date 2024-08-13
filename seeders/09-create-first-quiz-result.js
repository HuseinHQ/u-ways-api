'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = require('../data/quizResults.json');
    data = data.map((el) => {
      el.answer = JSON.stringify(el.answer);
      return el;
    });
    await queryInterface.bulkInsert('QuizResults', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('QuizResults', null, {});
  },
};
