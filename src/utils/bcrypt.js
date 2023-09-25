import bcrypt from 'bcrypt'

//Encriptar contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT))) // El primer parametro es la contraseña y el segundo es el numero de veces que se va a encriptar

//Validar contraseña encriptada
export const validatePassword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD) // El primer parametro es la contraseña que se envia y el segundo es la contraseña que esta en la base de datos