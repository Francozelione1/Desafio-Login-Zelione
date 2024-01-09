import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageErrors.js";
import { generateToken } from "../utils/jwt.js";
import { getLogin, postLogin, getGithub, getGithubSession, getLogout } from "../controllers/session.controller.js";
import { postRegister, validateUserData } from "../controllers/users.controller.js";


const sessionRouter = Router()


sessionRouter.get('/login', getLogin) // RENDERIZA EL FORMULARIO DE LOGIN

sessionRouter.post('/login', passport.authenticate("login"), postLogin) // LOGUEA UN USUARIO

sessionRouter.post('/register', validateUserData ,passport.authenticate("register"), postRegister) // LOGUEA UN USUARIO Y GENERA UN TOKEN

sessionRouter.get('/githubSession', passport.authenticate('github'), getGithubSession) // LOGUEA UN USUARIO CON GITHUB

sessionRouter.get('/logout', getLogout) // DESLOGUEA UN USUARIO

sessionRouter.get('/current', passportError('jwt'), (req, res) => {
    res.send(req.user)
})
//sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), getGithub) // CREA UN USUARIO CON GITHUB

export default sessionRouter