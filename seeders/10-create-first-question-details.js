'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/questionDetails.json');
    queryInterface.bulkInsert('QuestionDetails', data, {});
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('QuestionDetails', null, {});
  },
};
