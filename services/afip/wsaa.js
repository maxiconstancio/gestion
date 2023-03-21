
const soap = require("soap");
var debug = require('debug')('gestion:server');
var fs = require('fs');
var path = require('path')
const xml2js = require("xml2js");

const { addTimeExp, getDateAfip } = require ("../../utils/dates.js");
require ('dotenv').config();


const pem = fs.readFileSync(path.resolve()+process.env.FILE_PEM, "utf-8");
const key = fs.readFileSync(path.resolve()+process.env.FILE_KEY, "utf-8");

const CUIT = process.env.CUIT;

const  createCms = require ("./config/TRA.js");


let url = process.env.URL_WSAA;

const wsaa = async (_service) => {
  
  const now = new Date();
  const isoDate = await getDateAfip(now);
  let expTime = new Date();
  
  expTime = await addTimeExp(expTime);
  
  const TRA =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    "<loginTicketRequest>" +
    "<header>" +
    "<uniqueId>89779000</uniqueId>" +
    "<generationTime>" +
    isoDate +
    "</generationTime>" +
    "<expirationTime>" +
    expTime +
    "</expirationTime>" +
    "</header>" +
    "<service>" +
    _service +
    "</service>" +
    "</loginTicketRequest>";
  
  let cms = await createCms(pem, key, TRA);
  
  
  let args = { in0: cms.replaceAll("\r\n", "") };
 
  
  
  try {
    
    let client = await soap.createClientAsync(url);
    let result = await client.loginCmsAsync(args);
    
    const resultObj = await new Promise ((resolve, reject) =>  xml2js.Parser().parseString(result[0].loginCmsReturn, (error, res) => {
      if (error) reject (error);
      else {
        
        const token = (res.loginTicketResponse.credentials[0].token);
        const sign = (res.loginTicketResponse.credentials[0].sign[0]);
      resolve ({Token: token[0], Sign: sign, Cuit: CUIT});
      }
      
    }))
    
    return resultObj;
  
  } catch (error) {
    if (error) {
      console.log(error)
      return {error};
    }
  }
  

}

module.exports = wsaa;