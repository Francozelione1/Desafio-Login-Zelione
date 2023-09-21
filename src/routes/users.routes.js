import  userModel  from "../models/users.models.js";
import  Router  from "express";

const routerUsers = Router()

routerUsers.get("/register", async (req,res) => {
    res.render("register")
})

routerUsers.post("/register", async (req,res)=>{

    const { first_name, last_name, email, password, age } = req.body
    try {
        const usuarioExistente = await userModel.findOne({email:email})
        if(usuarioExistente){
            res.status(300).send({mensaje: "usuario ya existente"})
        }
        else{
            const response = await userModel.create({ first_name, last_name, email, password, age })
            req.session.login=true
            res.status(200).send({ mensaje: 'Usuario creado', respuesta: response })
        }
    } catch (error) {
        res.status(400).send({ mensaje: `Error en create user: ${error}` })
    }
})

export default routerUsers