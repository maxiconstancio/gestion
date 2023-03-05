'use strict';
const {
  Model
} = require('sequelize');
const Clientes = require('./clientes');
module.exports = (sequelize, DataTypes) => {
  class Facturas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Facturas.belongsTo(models.Clientes)
    }
  }
  Facturas.init({
    cuit: DataTypes.BIGINT,
    ClienteId: DataTypes.INTEGER,
    ptoVenta: DataTypes.INTEGER,
    nroComprobante: DataTypes.INTEGER,
    fechaComprobante: DataTypes.DATE,
    neto: DataTypes.DOUBLE,
   /* IVA21: DataTypes.DOUBLE,
    IVA105: DataTypes.DOUBLE,
    imp1: DataTypes.DOUBLE,
    imp2: DataTypes.DOUBLE,
    imp3: DataTypes.DOUBLE,*/
    total: DataTypes.DOUBLE,
    CAEVto: DataTypes.DATE,
    CAE: DataTypes.BIGINT,
    detalle: DataTypes.JSON,
    tipoComprobante: DataTypes.INTEGER,
    fchServDesde: DataTypes.DATE,
    fchServHasta: DataTypes.DATE,
    fchVtoPago: DataTypes.DATE,
    concepto: DataTypes.INTEGER,
    cbtesAsoc: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'Facturas',
    paranoid: true,
  });

  
  return Facturas;
};

