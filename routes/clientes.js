const express = require('express');

const {createClient, findClient, getAllClients, delClient} = require('../controllers/clientes.js');

const router = express.Router();



//Get Client Information  and save
router.post('/new',  createClient);

//Get All Client
router.get('/',  getAllClients);

//Get Client
router.get('/find',  findClient);


//delete Client
router.delete('/:cuit',  delClient);



module.exports = router;