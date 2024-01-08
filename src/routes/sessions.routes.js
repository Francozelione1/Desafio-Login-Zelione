import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageErrors.js";
import { generateToken } from "../utils/jwt.js";
import { getLogin, postLogin, getGithub, getGithubSession, getLogout } from "../controllers/session.controller.js";


const sessionRouter = Router()

sessionRouter.get('/login', getLogin) // RENDERIZA EL FORMULARIO DE LOGIN

sessionRouter.post('/login', passport.authenticate("login"), postLogin) // LOGUEA UN USUARIO

//sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), getGithub) // CREA UN USUARIO CON GITHUB

sessionRouter.get('/githubSession', passport.authenticate('github'), getGithubSession) // LOGUEA UN USUARIO CON GITHUB

sessionRouter.get('/logout', getLogout) // DESLOGUEA UN USUARIO

sessionRouter.get('/current', passportError('jwt'), authorization('user'), (req, res) => {
    res.send(req.user)
})

export default sessionRouter