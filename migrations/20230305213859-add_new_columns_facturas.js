'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('Facturas', 'tipoComprobante', {
      type: Sequelize.DataTypes.STRING,
    });
    await queryInterface.addColumn('Facturas', 'fchServDesde', {
      type: Sequelize.DataTypes.DATE,
    });
    await queryInterface.addColumn('Facturas', 'fchServHasta', {
      type: Sequelize.DataTypes.DATE,
    });
    await queryInterface.addColumn('Facturas', 'fchVtoPago', {
      type: Sequelize.DataTypes.DATE,
    });
    await queryInterface.addColumn('Facturas', 'ctesAsoc', {
      type: Sequelize.DataTypes.JSON,
    });
    await queryInterface.addColumn('Facturas', 'concepto', {
      type: Sequelize.DataTypes.INTEGER,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Facturas', 'tipoComprobante');
    await queryInterface.removeColumn('Facturas', 'fchServDesde');
    await queryInterface.removeColumn('Facturas', 'fchServHasta');
    await queryInterface.removeColumn('Facturas', 'fchVtoPago');
    await queryInterface.removeColumn('Facturas', 'ctesAsoc');
    await queryInterface.removeColumn('Facturas', 'concepto');
  }
};
