'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = require('../data/quizzes.json');
    data = data.map((el) => {
      el.details = JSON.stringify(el.details);
      return el;
    });
    await queryInterface.bulkInsert('Quizzes', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Quizzes', null, {});
  },
};
