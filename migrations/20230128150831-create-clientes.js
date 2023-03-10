'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clientes', {
      id: {
        type: Sequelize.INTEGER,
      },
      cuit: {
        type: Sequelize.BIGINT,
        primaryKey:true,
      },
      tipoDoc: {
        type: Sequelize.STRING
      },
      nombre: {
        type: Sequelize.STRING
      },
      condIva: {
        type: Sequelize.STRING
      },
      domicilio: {
        type: Sequelize.STRING
      },
      ciudad: {
        type: Sequelize.STRING
      },
      provincia: {
        type: Sequelize.STRING
      },
      tel: {
        type: Sequelize.BIGINT
      },
      email: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Clientes');
  }
};