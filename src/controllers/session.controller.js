import { generateToken } from '../utils/jwt.js'
import userModel from '../models/users.models.js'

export const getLogin = async (req, res) => {
    return res.render('login', { rutaJS: 'login' })
}

export const postLogin = async (req, res) => {

    try{
        if (!req.user) { // Si no existe el usuario
            return res.status(401).send({ mensaje: "Usuario invalido" })
        }

        req.session.user = { // defino el user de la session
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.rol,
            id: req.user._id,
            cart: req.user.cart,
            last_connection: req.user.last_connection,
            documents: req.user.documents
        }

        const user = req.session.user
        const token = generateToken(user)
        
        res.cookie('jwtCookie', token, {
            maxAge: 600*1000,
            httpOnly: false
        })

        req.session.nombre = req.nombre // defino el nombre de la session
        req.session.login = true // defino la session como true
        req.session.cart = req.user.cart // defino el carrito de la session

        console.log("Usuario logueado");

        return res.status(200).send({url: "http://localhost:4000/static/", user, status: 200 , token})
    }
    catch(error){
        return res.status(500).send({ mensaje: error.message})
    }

}

export const getGithub = async (req, res) => {
    try{
        return res.status(200).send({ message: 'Usuario creado', status: 200 })
    }
    catch(error){
        return res.status(500).send({ mensaje: error.message})
    }
}

export const getGithubSession = async (req, res) => {
    console.log('Callback de GitHub alcanzado');
    try{
        req.session.user = req.user
        req.session.nombre = req.user.first_name
        req.session.cart = req.session.user.cart
        const token = generateToken(req.session.user)
        
        res.cookie('jwtCookie', token, {
            maxAge: 600*1000,
            httpOnly: false
        })
        console.log('Estado de la sesión:', req.session);
        res.redirect('http://localhost:4000/home/');
        //return res.status(200).send({ message: 'Usuario creado' })
    }
    catch(error){
        return res.status(500).send({ message: error.message})
    }
}

export const getLogout = async (req, res) => {
    try{
        await userModel.findByIdAndUpdate(req.user._id, { last_connection: Date.now() }) // actualizo la ultima conexion del usuario
        req.session.destroy()
        res.clearCookie('jwtCookie')
        return res.status(200).send({url: "http://localhost:4000/api/session/login", mensaje: 'Login eliminado'})
    }
    catch(error){
        return res.status(500).send({ message: error.message})
    }
}
