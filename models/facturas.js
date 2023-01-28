'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Facturas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Facturas.init({
    cuit: DataTypes.BIGINT,
    ptoVenta: DataTypes.INTEGER,
    nroComprobante: DataTypes.INTEGER,
    fechaComprobante: DataTypes.DATE,
    neto: DataTypes.DOUBLE,
    imp1: DataTypes.DOUBLE,
    imp2: DataTypes.DOUBLE,
    imp3: DataTypes.DOUBLE,
    total: DataTypes.DOUBLE,
    CAE: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Facturas',
  });
  return Facturas;
};