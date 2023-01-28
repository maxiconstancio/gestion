'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Facturas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cuit: {
        type: Sequelize.BIGINT,
        references:{
          model: 'clientes',
          key: 'cuit'
        }
      },
      ptoVenta: {
        type: Sequelize.INTEGER
      },
      nroComprobante: {
        type: Sequelize.INTEGER
      },
      fechaComprobante: {
        type: Sequelize.DATE
      },
      neto: {
        type: Sequelize.DOUBLE
      },
      imp1: {
        type: Sequelize.DOUBLE
      },
      imp2: {
        type: Sequelize.DOUBLE
      },
      imp3: {
        type: Sequelize.DOUBLE
      },
      total: {
        type: Sequelize.DOUBLE
      },
      CAE: {
        type: Sequelize.BIGINT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Facturas');
  }
};