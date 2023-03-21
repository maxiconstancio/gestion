const { Facturas, Clientes } = require("../models");
const wsaa = require("../services/afip/wsaa");


const cuit = process.env.CUIT;

const { Op } = require("sequelize");
const {
  FECompUltimoAutorizado,
  FECAESolicitar,
  FEPtosVenta,
} = require("../services/afip/wsfe");
const getQR = require("../services/afip/qr");
const { validationResult } = require("express-validator");

function dateString(fecha) {
  return (new Date(fecha)).getFullYear().toString() + ((new Date(fecha)).getMonth() +1).toString().padStart(2,0) + (new Date(fecha)).getDate().toString().padStart(2,0)
}


const facturas = {
  

  
  createFacturas: async (req, res) => {
    try {
      
          
      const body = req.body; 
      
      const cliente = await Clientes.findOne({
        where: { id: body.cuit },
      });
      if (!cliente) return res.status(409).json("Client No Exist");
      
      
      const strFech = dateString(body.cbteFech);
      const FchServDesde = body.fchServDesde ? dateString(body.fchServDesde) : null
      const FchServHasta = body.fchServHasta ? dateString(body.fchServHasta) : null
      const FchVtoPago = body.fchVtoPago ? dateString(body.fchVtoPago) : null
     

      let cbteAsoc = ""
      if (body.cbteAsoc === undefined ) {
        cbteAsoc = null;
      } else {
        cbteAsoc = [body.cbteAsoc]
      }
      /* if (body.tipoCbte === '12' || body.tipoCbte === '13') {
        
        <ar:Tipo>short</ar:Tipo>
<ar:PtoVta>int</ar:PtoVta>
<ar:Nro>Long</ar:Nro>
Si el comprobante es Debito o Credito, enviar estructura CbteAsoc o PeriodoAsoc.
        
       console.log(body.tipoCbte)
        cbteAsoc = [{Tipo: 11, PtoVta: 2, Nro: 452}]

      }*/  


      //Genera CAE Autorizado
      
      const comp =
        (await FECompUltimoAutorizado(
          { Token: body.Token, Sign: body.Sign, Cuit: cuit },
          body.ptoVenta,
          body.tipoComprobante
        )) + 1;
      const data = {
        Auth: { Token: body.Token, Sign: body.Sign, Cuit: cuit },
        ptoVenta: parseInt(body.ptoVenta),
        cbteTipo: body.tipoComprobante,
        Concepto: body.concepto,
        DocTipo: body.docTipo,
        DocNro: cliente.cuit,
        Cbte: comp,
        CbteFech: strFech,
        ImpTotal: body.impTotal,
        tipoComprobante: body.tipoComprobante,
        FchServDesde: FchServDesde,
        FchServHasta: FchServHasta,
        FchVtoPago: FchVtoPago,
        cbteAsoc: cbteAsoc
      };
      
      try {
       

        const CAEResult = await FECAESolicitar(data);
        
        if (data.ImpTotal <= 0) return res.status(500).json('Importe total no puede ser igual o menor a 0 ')

        if (CAEResult[0].FECAESolicitarResult.hasOwnProperty("Errors")) {
         
          return res
            .status(500)
            .json(CAEResult[0].FECAESolicitarResult.Errors.Err);
        } else {
          
          data.CAE = CAEResult[0].FECAESolicitarResult.FeDetResp.FECAEDetResponse[0].CAE;

          if (!data.CAE) {
              
            res.status(500).json(CAEResult[0].FECAESolicitarResult.FeDetResp.FECAEDetResponse[0].Observaciones.Obs) 

          }
          data.QR = getQR(data, cuit)
          const CAEVto = (CAEResult[0].FECAESolicitarResult.FeDetResp.FECAEDetResponse[0].CAEFchVto);
          data.CAEVto  = new Date (CAEVto.substring(0,4), CAEVto.substring(4,6)-1, CAEVto.substring(6,8) )
          
          if (CAEResult[0].FECAESolicitarResult.FeDetResp.FECAEDetResponse[0].Resultado === 'A') {
            
           await Facturas.create({
            cuit: cliente.cuit,
            ClienteId: cliente.id,
            ptoVenta: data.ptoVenta, 
            nroComprobante: data.Cbte,
            fechaComprobante: body.cbteFech,
            neto: data.ImpTotal,
            /* IVA21: factura.IVA21,
        IVA105: factura.IVA21,
        imp1: factura.imp1,
        imp2: factura.imp2,
        imp3: factura.imp1,*/
            total: data.ImpTotal,
            CAE: data.CAE,
            CAEVto: data.CAEVto,
            detalle: body.detalle,
            cbtesAdoc: body.cbtesAsoc,
            tipoComprobante: body.tipoComprobante,
            fchServDesde: body.fchServDesde,
            fchServHasta: body.fchServHasta,
            fchVtoPago: body.fchVtoPago,
            concepto: body.concepto,
            ctesAsoc: body.cbteAsoc,
            QR: data.QR
          });
          
          return res
            .status(200)
            .json({data, cliente});
        } else {
          return new Error (CAEResult[0].FECAESolicitarResult.FeDetResp.FECAEDetResponse[0].Observaciones.Obs)
        }
      }
      } catch (error) {
        return (res.status(500).json("error al solicitar CAE" + error));
      }
    } catch (error) {
      return res.status(500).json( error);
    }
  },

  getAllFacturas: async (req, res) => {
    try {
      const allFacturas = await Facturas.findAll();
      res.status(200).json(allFacturas);
    } catch (error) {
      res.status(500).json("hay error" + error);
    }
  },
  findFactura: async (req, res) => {
    try {
      const factura = await Facturas.findAll({ where: req.query });
      res.status(200).json(factura);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  queryDateFC: async (req, res) => {
    try {
      const to = `${req.query.to}`;
      const from = `${req.query.from}`;

      const factura = await Facturas.findAll({
        where: {
          fechaComprobante: { [Op.between]: [from, to] },
        },
        order: [["fechaComprobante", "ASC"]],
        include: [
          {
            model: Clientes,
            attributes: ["cuit", "nombre", "condIva", "domicilio", "ciudad", "provincia", "tipoDoc"],
          },
        ],
      });
      res.status(200).json(factura);
    } catch (error) {
      res.status(500).json("Error: " + error);
    }
  },
  delFactura: async (req, res) => {
    const factura = req.params.id;

    try {
      if (!factura) {
        res.json(401).json("Comprobante not found");
      } else {
        await Facturas.destroy({
          where: {
            id: factura,
          },
        });
        res.status(204).json("factura deleted successfully");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getWsaa: async (req, res, next) => {
    try {
      res.json(await wsaa("wsfe"));
    } catch (error) {
      res.status(500).json("error" + error);
    }
  },

  getUltComprobante: async (req, res, next) => {
    try {
      const body = req.body;
      
      res
        .status(200)
        .json(
          await FECompUltimoAutorizado(
            { Token: body.Token, Sign: body.Sign, Cuit: cuit },
            parseInt(body.ptoVenta),
            body.tipoCbte
          )
        );
    } catch (error) {
      res.status(500).json("error" + error);
    }
  },

  getPtoVenta: async (req, res, next) => {
    try {
      const body = req.body;
      res
        .status(200)
        .json(
          await FEPtosVenta({
            Token: body.Token,
            Sign: body.Sign,
            Cuit: body.cuit,
          })
        );
    } catch (error) {
      res.status(500).json("error" + error);
    }
  },
};

module.exports = facturas;
