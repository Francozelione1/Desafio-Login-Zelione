import  userModel  from "../models/users.models.js";
import  Router  from "express";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import passport from "passport";

const routerUsers = Router()

routerUsers.get("/register", async (req,res) => {
    res.render("register")
})

routerUsers.post("/register", passport.authenticate("register") , async (req,res)=>{

    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: 'Usuario ya existente' })
        }
        req.session.login=true
        req.session.nombre=first_name
        return res.status(200).send({ mensaje: 'Usuario creado' })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
    }
    
})

export default routerUsers