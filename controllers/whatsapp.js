const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');





 const whatsapp = {
    isConnected: async (req, res, next) => {
        

const client = new Client({
    authStrategy: new LocalAuth(),
});


client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
  console.log('Authenticated')
});

client.initialize();
        res.header('Content-Type', 'image/png');
 
    }
};

module.exports = whatsapp