const { Clientes } = require("../models");

const clients = {
  createClient: async (req, res) => {
    try {
      const client = req.body;

      const userFound = await Clientes.findOne({ cuit: client.cuit });

      if (userFound) {
        return res.status(409).json("Client Already Exist");
      }
      const newClient = await Clientes.create({
        cuit: client.cuit,
        tipoDoc: client.tipoDoc, // ej: DNI, CUIT, CUIL, etc
        nombre: client.nombre,
        condIva: client.condIva, //ej: Resp. Inscripto - Exento, etc
        domicilio: client.domicilio,
        ciudad: client.ciudad,
        provincia: client.provincia,
        tel: client.tel,
        email: client.email,
      });
      return res
        .status(200)
        .json(`Client ${newClient.nombre} Created Successfully`);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getAllClients: async (req, res) => {
    try {
      const allClients = await Clientes.findAll();
      res.status(200).json(allClients);
    } catch (error) {
      res.status(500).json("hay error" + error);
    }
  },
  findClient: async (req, res) => {
    try {
      const client = await Clientes.findOne(req.query);
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  delClient: async (req, res) => {
    const client = req.params.cuit;
    const userFound = await Clientes.findByPk({ cuit: client });
    try {
      if (!userFound) {
        res.json(401).json("Client not found");
      } else {
        await userFound.destroy();
        res.status(204).json("client deleted successfully");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = clients;