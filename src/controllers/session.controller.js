import { generateToken } from '../utils/jwt.js'
import { CustomError } from '../services/customErrors.js'

export const getLogin = async (req, res) => {
    return res.render('login', { rutaCSS: 'login', rutaJS: 'login' })
}

export const postLogin = async (req, res) => {

    try{

        if (!req.user) { // Si no existe el usuario
            throw CustomError.createError("Error", "No se encontró el usuario", "Usuario no encontrado", 3)
            //return res.status(401).send({ mensaje: "Usuario invalido" })
        }

        req.session.user = { // defino el user de la session
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.rol
        }

        const user = req.session.user
        const token = generateToken(user)
        
        res.cookie('jwtCookie', token, {
            maxAge: 43200000,
            httpOnly: false
        })

        req.session.nombre = req.nombre // defino el nombre de la session
        req.session.login = true // defino la session como true

        console.log("Usuario logueado");

        return res.status(200).send({url: "http://localhost:4000/static/", user, status: 200 , token})

    }
    catch(error){
        return res.status(500).send({ mensaje: error.message})
    }

}

export const getGithub = async (req, res) => {
    return res.status(200).send({ mensaje: 'Usuario creado' })
}

export const getGithubSession = async (req, res) => {
    req.session.user = req.user
    return res.status(200).send({ mensaje: 'Usuario creado' })
}

export const getLogout = async (req, res) => {
    req.session.destroy()
    res.clearCookie('jwtCookie')
    return res.status(200).send({url: "http://localhost:4000/api/sessions/login", mensaje: 'Login eliminado'})
}















/*   

get('/testJWT', passport.authenticate('jwt', { session: true }), async (req, res) => {
    console.log("metodo GET del testJWT");
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    
    const usuario = req.session.user
    console.log("aca va mi usuario");
    console.log(usuario);

    res.status(200).send({ usuario})
}) 


routerSessions.get('/current', passportError('jwt'), authorization('user'), (req, res) => {
    res.send(req.user)
})


//res.redirect("http://localhost:4000/static/") // redirecciono al home

//res.status(200).send({ mensaje: "Usuario logueado", user: req.session.user, url: "http://localhost:4000/static/" }) // envio el user de la session // funciona pero no se bien como




*/