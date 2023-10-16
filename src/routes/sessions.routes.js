import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageErrors.js";
import { generateToken } from "../utils/jwt.js";


const routerSessions = Router()


routerSessions.get('/login', (req, res) => {
    res.render('login', { rutaCSS: 'login', rutaJS: 'login' });
    console.log("metodo GET");
});

routerSessions.get('/testJWT', passport.authenticate('jwt', { session: true }), async (req, res) => {
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

routerSessions.post('/login', passport.authenticate("login") ,async(req,res)=>{
    console.log('Ruta POST /login alcanzada');

    try{

        if (!req.user) { // Si no existe el usuario
            console.log("Usuario invalido");
            return res.status(401).send({ mensaje: "Usuario invalido" })
        }

        req.session.user = { // defino el user de la session
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.rol
        }

        const user= req.session.user

        const token = generateToken(req.user)
        console.log("este es mi token"+ token);

        res.cookie('jwtCookie', token, {
            maxAge: 43200000,
            httpOnly: false
        })

        req.session.nombre = req.nombre // defino el nombre de la session
        req.session.login = true // defino la session como true

        console.log("Usuario logueado");

        res.status(200).send({url: "http://localhost:4000/static/", user})

        //res.redirect("http://localhost:4000/static/") // redirecciono al home

        //res.status(200).send({ mensaje: "Usuario logueado", user: req.session.user, url: "http://localhost:4000/static/" }) // envio el user de la session // funciona pero no se bien como

    }
    catch(error){
        res.status(500).send({ mensaje: error})
    }
});

routerSessions.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.status(200).send({ mensaje: 'Usuario creado' })
})


routerSessions.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ mensaje: 'Session creada' })
})

routerSessions.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.clearCookie('jwtCookie')
    res.status(200).send({url: "http://localhost:4000/api/sessions/login", mensaje: 'Login eliminado'})
    //res.redirect("http://localhost:4000/api/sessions/login")
})



export default routerSessions