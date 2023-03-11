const express = require('express');

const {createFacturas, findFactura, getAllFacturas, delFactura, queryDateFC, getWsaa, getUltComprobante, getPtoVenta} = require('../controllers/facturas.js');


const router = express.Router();



//Get Client Information  and save
router.post('/new',  createFacturas);


//Get Client Information  and save
router.get('/wsaa',  getWsaa);

//Get Last Authorized Invoice

router.post('/lastComp', getUltComprobante)

//Get Last Authorized Invoice

router.get('/lastComp', getPtoVenta)

//Get All Client
router.get('/',  getAllFacturas);

//Get Client
router.get('/find',  findFactura);

//Get Client
router.get('/findbydate',  queryDateFC);


//delete Client
router.delete('/:id',  delFactura);




module.exports = router;