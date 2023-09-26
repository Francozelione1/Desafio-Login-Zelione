import local from 'passport-local' //Estrategia
import passport from 'passport' //Manejador de las estrategias
import { createHash, validatePassword } from '../utils/bcrypt.js'
import userModel  from '../models/users.models.js'
import GithubStrategy from 'passport-github2'

//Defino la estrategia a utilizar
const LocalStrategy = local.Strategy

export const initializePassport = () => {
    //done es como si fuera un res.status(), el callback de respuesta
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password , done) => { //Defino como voy a registrar un user // Defino que mi username va a ser el email
            
            console.log("estoy en el register de passport");

            const { first_name, last_name, email, age, rol } = req.body
            try {
                const usuarioExistente = await userModel.findOne({ email: username })
                if (usuarioExistente) {
                    return done(null, false, { mensaje: 'Usuario ya existente' }) // el primer parametro es el error (no hay, por eso el null), el segundo es el resultado de la creacion del usuario y el tercero es el mensaje
                }
                else {
                    const contraseñaEncriptada = createHash(password)
                    const usuarioCreado = await userModel.create({
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        password: contraseñaEncriptada,
                        age: age
                    })
                    req.nombre = usuarioCreado.first_name
                    return done(null, usuarioCreado)
                }
            } catch (error) {
                return done(null, error)
            }

        }
    ))

    passport.use("login", new LocalStrategy({passReqToCallback: true ,usernameField: 'email' }, async (req,username, password, done) =>{  //Defino como voy a loguear un user)

        console.log("estoy en el login de passport");

        try {    
            const user = await userModel.findOne({ email: username });
    
            if (!user) {
               return done(null, false, { message: 'Usuario no encontrado' })
            }

            if (validatePassword(password, user.password)) { // Valido la contraseña
               req.nombre=user.first_name 
               return done(null, user)
            }
            
            return done(null, false, { message: 'Contraseña incorrecta' }) // Contraseña invalida
           
        } catch (error) {
           return done(null, error)
        }

    }))

    passport.use("github", new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {

        try{

            const user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                const usuarioCreado = await userModel.create({
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 18, //Edad por defecto ya que no la sabemos
                    password: "password"
                })
                return done(null, usuarioCreado)
            }
            else {
                return done(null, user)
            }

        }
        catch(error){
            return done(null, error)
        }

    }))

    passport.serializeUser((user, done) => { //Activar la session del user
        done(null, user._id)
    })
    
    passport.deserializeUser(async (id, done) => { //Eliminar la session del user
        const user = await userModel.findById(id)
        done(null, user)
    })


}