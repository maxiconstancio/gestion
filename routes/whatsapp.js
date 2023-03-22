var express = require('express');
const { isConnected } = require('../controllers/whatsapp');
var router = express.Router();

/* GET home page. */
router.get('/', isConnected);

module.exports = router;