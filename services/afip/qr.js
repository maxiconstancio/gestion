
const getQR =  (data,cuit) => {
    const fecha = (data.CbteFech).slice(0,4) + "-" + data.CbteFech.slice(4,6) + "-"  + data.CbteFech.slice(6,8);
   objQr =JSON.stringify({ver: 1, fecha: fecha, cuit: parseInt(cuit), ptoVta: data.ptoVenta, tipoCmp: data.cbteTipo, nroCmp: data.Cbte, importe: data.ImpTotal, moneda: "PES", ctz: 1, tipoDocRec: data.DocTipo, nroDocRec: data.DocNro, tipoCodAut: "E", codAut: parseInt(data.CAE)   })
    
  
   const buff = Buffer.from(objQr).toString('base64')

    return ('https://www.afip.gob.ar/fe/qr/?p=' + buff)
}

module.exports = getQR