import ticketModel from "../models/tickets.model.js";
import cartModel from "../models/carts.model.js";
import productoModel from "../models/productos.model.js";
import userModel from "../models/users.models.js";

export const getRegister = async (req, res) => {
    res.render('register')
}

export const postRegister = async (req, res) => {

    console.log("estoy en el post de register");

    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: 'Usuario ya existente' })
        }
        req.session.login = true
        req.session.nombre = req.nombre
        return res.status(200).send({ mensaje: 'Usuario creado', status: 200 })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
    }

}
