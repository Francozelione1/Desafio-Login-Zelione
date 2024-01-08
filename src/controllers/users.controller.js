import CustomError from "../services/errors/customErrors.js";
import EErrors from "../services/errors/enums.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import logger from "../utils/logger.js";
import userModel from "../models/users.models.js";
import { sendEmailDeleteAccount } from "../config/nodemailer.js";
import cartModel from "../models/carts.model.js";
import { generateToken } from "../utils/jwt.js";

export const getRegister = async (req, res) => {
    res.render('register')
}

export const validateUserData = (req, res, next) => {

    const { email, password, first_name, last_name, age } = req.body

    try {

        if ((!email) || (!password) || (!first_name) || (!last_name) || (!age)) {
            logger.error("Faltan datos para crear el usuario")
            throw CustomError.createError({
                name: EErrors.MISSING_REQUIRED_FIELDS.name,
                cause: generateUserErrorInfo({ email, password, first_name, last_name, age }),
                message: 'Error al registrar usuario',
                code: EErrors.MISSING_REQUIRED_FIELDS.code
            })
        }

        next()

    } catch (error) {
        next(error);
    }

}

export const postRegister = async (req, res) => {

    //console.log("estoy en el post de register");

    try {
        const token = generateToken(req.user)

        res.cookie('jwtCookie', token, {
            maxAge: 60*1000,
            httpOnly: false
        })

        req.session.user = req.user
        req.session.login = true
        req.session.nombre = req.nombre
        req.session.cart = req.cart
        return res.status(200).send({ mensaje: 'Usuario creado', status: 200 })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al crear usuario: ${error.message}` })
    }

}

export const deleteInactiveUsers = async (req, res) => {
    try {
        const users = await userModel.find({ last_connection: { $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } })

        if (users.length === 0) {
            logger.warn(`No se encontraron usuarios inactivos`);
            return res.status(400).send({ error: `No se encontraron usuarios inactivos` });
        }

        for (const user of users) {
            try {
                await userModel.findByIdAndDelete(user._id)
                await cartModel.findByIdAndDelete(user.cart)
                sendEmailDeleteAccount(user.email)
            }
            catch (error) {
                res.status(500).send({ mensaje: `Error al eliminar usuarios inactivos: ${error.message}` })
            }
        }
        logger.info(`Usuarios inactivos eliminados correctamente: ${users.length}`);
        res.status(200).send({ mensaje: `Se eliminaron ${users.length} usuarios inactivos` })
    }
    catch (error) {
        logger.error(`Error al eliminar usuarios inactivos: ${error.message}`);
        res.status(400).send({ mensaje: `Error al eliminar usuarios inactivos: ${error.message}` })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userMail = req.body.email
        const user = await userModel.findOne({ email: userMail })
        await userModel.findByIdAndDelete(user._id)
        await cartModel.findByIdAndDelete(user.cart)
        sendEmailDeleteAccount(user.email)
        res.status(200).send({ mensaje: `Se elimino el usuario ${userMail}`, status: 200 })
    }
    catch (error) {
        console.log("soy el error"+error.message)
        res.status(400).send({ mensaje: `Error al eliminar el usuario ${userMail}: ${error.message}` })
    }
}

export const getModifyUsers = async (req, res) => {

    const users = await userModel.find({})

    users.forEach(user => console.log(user))

    res.render("modificarUsuarios", {
        users: users
    })
}

export const modifyUser = async (req, res) => {
    try{
        const userMail = req.body.email
        const user = await userModel.findOne({ email: userMail }) //email del usuario a modificar
        const newRol = req.body.rol
        await userModel.findByIdAndUpdate(user._id, { rol: newRol })
        res.status(200).send({ mensaje: `Se modifico el usuario ${userMail}`, status: 200 })
    }
    catch(error){
        res.status(400).send({ mensaje: `Error al modificar el usuario: ${error.message}` })
    }
}
