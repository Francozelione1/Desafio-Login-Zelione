import  userModel  from "../models/users.models.js";
import  {Router}  from "express";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import passport from "passport";
import { getRegister, postRegister } from "../controllers/users.controller.js";
import { validateUserData } from "../controllers/users.controller.js";

const userRouter = Router()

userRouter.get("/register", getRegister) // RENDERIZA EL FORMULARIO DE REGISTRO

userRouter.post("/register", validateUserData ,passport.authenticate("register"), postRegister) // REGISTRA UN USUARIO

export default userRouter