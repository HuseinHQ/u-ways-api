'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/chats.json');
    await queryInterface.bulkInsert('Chats', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Chats', null, {});
  },
};
