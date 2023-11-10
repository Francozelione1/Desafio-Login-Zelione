import CustomError from "../services/errors/customErrors.js";
import EErrors from "../services/errors/enums.js";
import { generateUserErrorInfo } from "../services/errors/info.js";

export const getRegister = async (req, res) => {
    res.render('register')
}

export const validateUserData = (req,res,next) => {
    
    const { email, password, first_name, last_name, age} = req.body

    try {
       
        if ((!email) || (!password) || (!first_name) || (!last_name) || (!age)) {
            throw CustomError.createError({
                name: EErrors.MISSING_REQUIRED_FIELDS.name,
                cause: generateUserErrorInfo({ email, password, first_name, last_name, age }),
                message: 'Error al registrar usuario',
                code: EErrors.MISSING_REQUIRED_FIELDS.code
            })
        }

        next()

    } catch (error){
        next(error);
    }

}

export const postRegister = async (req, res) => {

    //console.log("estoy en el post de register");

    try {
        req.session.login = true
        req.session.nombre = req.nombre
        return res.status(200).send({ mensaje: 'Usuario creado', status: 200 })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al crear usuario: ${error.message}` })
    }

}
