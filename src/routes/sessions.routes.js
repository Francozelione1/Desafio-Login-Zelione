import { Schema, model, syncIndexes } from "mongoose";
import userModel from "../models/users.models.js";
import { Router } from "express";

const routerSessions = Router()


routerSessions.get('/login', (req, res) => {
    res.render('login', { rutaCSS: 'login', rutaJS: 'login' });
    console.log("metodo GET");
});

routerSessions.post('/login', async(req,res)=>{
    console.log('Ruta POST /login alcanzada');

    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email: email });

        if (req.session.login) {
           req.session.nombre = user.first_name 
           return res.redirect("http://localhost:4000/static/")
           return res.status(200).json({ resultado: 'Login ya existente' });
        }


        if (user) {
            if (user.password == password) {
                req.session.nombre = user.first_name 
                req.session.login = true;
               return res.redirect("http://localhost:4000/static/")
            } 
            else {
              return res.status(401).send({mensaje: "No autorizado"})
            }
        } 
        else {
            return res.status(404).send("usuario no encontrado")
        }
    } catch (error) {
       return res.status(400).send({error:error})
    }
});

routerSessions.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.redirect("http://localhost:4000/api/sessions/login")
    //res.status(200).send({ resultado: 'Sesion cerrada' })
})


export default routerSessions