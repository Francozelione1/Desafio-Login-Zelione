import  userModel  from "../models/users.models.js";
import  {Router}  from "express";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import passport from "passport";
import { getRegister, postRegister, finalizarCompra } from "../controllers/users.controller.js";

const userRouter = Router()

userRouter.get("/register", getRegister) // RENDERIZA EL FORMULARIO DE REGISTRO

userRouter.post("/register", passport.authenticate("register"), postRegister) // REGISTRA UN USUARIO

userRouter.get("/:cid/finalizarCompra", finalizarCompra) // FINALIZA LA COMPRA


export default userRouter