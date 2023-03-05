const soap = require ('soap');
const url =  "https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL";

async function FEPtosVenta(auth, ptoVenta, cbteTipo) {



  let args = { Auth: auth};


  try {
    let client = await soap.createClientAsync(url);
    let result = await client.FEParamGetPtosVentaAsync(args);
    //Revisar cuando da error porque no salta el catch
    
    return (result[0].FECompUltimoAutorizadoResult.CbteNro);

  } catch (error) {
    return (error);

  }

}

async function FECompUltimoAutorizado(auth, ptoVenta, cbteTipo) {



  let args = { Auth: auth, PtoVta: ptoVenta, CbteTipo: cbteTipo };


  try {
    let client = await soap.createClientAsync(url);
    let result = await client.FECompUltimoAutorizadoAsync(args);
    //Revisar cuando da error porque no salta el catch
    return (result[0].FECompUltimoAutorizadoResult.CbteNro);

  } catch (error) {
    return (error);

  }

}
const FECAESolicitar = async  (data) => {
  

    const auth = data.Auth;

    const FECAEDetRequest = { Concepto: data.Concepto, DocTipo: data.DocTipo, 
      DocNro: data.DocNro, CbteDesde: data.Cbte, CbteHasta: data.Cbte, CbteFch: data.CbteFech, ImpTotal: data.ImpTotal, ImpTotConc:0.00,
      ImpNeto:data.ImpTotal,
      ImpOpEx:0,
      ImpTrib:0,
      ImpIVA:0,
      MonId:"PES",
      MonCotiz:1,
      FchServDesde: data.fchServDesde,
      FchServHasta: data.fchServHasta,
      FchVtoPago: data.fchVtoPago,
      CbtesAsoc: {CbteAsoc: data.cbteAsoc}
      }
    
    if (data.cbteTipo === 12 || data.cbteTipo === 13) FECAEDetRequest.CbtesAsoc ={CbteAsoc: data.CbteAsoc} 
    
    let args =  {Auth: auth, FeCAEReq: {FeCabReq: { CantReg: 1, PtoVta: data.ptoVenta, CbteTipo: data.cbteTipo}, FeDetReq: { FECAEDetRequest: FECAEDetRequest }}};
     
     try {
        let client = await soap.createClientAsync(url);
        let result = await client.FECAESolicitarAsync(args);
        
        return(result);
      
      } catch (error) {
       
        return(error);
        
      }
}


const ListarComprobantes = async ( auth) => {

  try {
    
    let client = await soap.createClientAsync(url);
    let result = await client.FEParamGetTiposCbteAsync(auth);
    
    return result
  } catch (error) {
    
  }
}


 const ListarTiposDoc = async ( auth) => {

  try {
    
    let client = await soap.createClientAsync(url);
    let result = await client.FEParamGetTiposDocAsync(auth);
    
    return result
  } catch (error) {
    
  }
}

const ListarDocs = async ( auth) => {

  try {
    
    let client = await soap.createClientAsync(url);
    let result = await client.FEParamGetTiposDocAsync(auth);
    
    return result
  } catch (error) {
    
  }
}


module.exports = {FECAESolicitar, FECompUltimoAutorizado, ListarComprobantes, ListarDocs, ListarTiposDoc, FEPtosVenta}