import  userModel  from "../models/users.models.js";
import  {Router}  from "express";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import passport from "passport";
import { getRegister, postRegister, deleteUser, getModifyUsers, modifyUser } from "../controllers/users.controller.js";
import { validateUserData } from "../controllers/users.controller.js";
import { deleteInactiveUsers } from "../controllers/users.controller.js";
import { authorization } from "../utils/messageErrors.js";

const userRouter = Router()

userRouter.get("/register", getRegister) // RENDERIZA EL FORMULARIO DE REGISTRO

userRouter.get("/modifyUsers", authorization("admin"), getModifyUsers) // RENDERIZA LOS USUARIOS PERMITIENDO MODIFICARLOS O ELIMINARLOS

userRouter.delete("/deleteUser", authorization("admin"), deleteUser)// ELIMINA UN USUARIO

userRouter.put("/modifyUser", authorization("admin"), modifyUser ) // MODIFICA UN USUARIO 

//userRouter.post("/register", validateUserData ,passport.authenticate("register"), postRegister) // REGISTRA UN USUARIO

userRouter.delete("/", authorization("admin"), deleteInactiveUsers) // ELIMINA USUARIOS INACTIVOS  

export default userRouter