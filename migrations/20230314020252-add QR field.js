'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('Facturas', 'QR', {
      type: Sequelize.DataTypes.JSON,
    });
   
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Facturas', 'QR');
    
  }
};
