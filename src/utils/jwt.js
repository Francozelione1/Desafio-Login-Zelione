import 'dotenv/config'
import jwt from 'jsonwebtoken'

export const generateToken = (user) => {
    const token = jwt.sign({ user }, "coderhouse", { expiresIn: '12h' })// 1° parametro: Objeto asociado al token, 2° parametro: Clave privada para el cifrado, 3° parametro: Tiempo de expiracion
}

//console.log(generateToken({"_id":"651303fab125561823d14bf9","first_name":"Franco","last_name":"Zelione Lenzi","email":"francozelione796@gmail.com","password":"$2b$16$rABlgmZU.gazy0UI6iK6K.K7cIdHBwBqnQJn9jM5IBcW1z1FMSfEy","rol":"user","age":{"$numberInt":"21"}}))// muestro el token generado de mi usuario

export const authToken = (req, res, next) => {
    //Consulto el header
    const authHeader = req.headers.Authorization //Consulto si existe el token
    if (!authHeader) {
        return res.status(401).send({ error: 'Usuario no autenticado' })
    }

    const token = authHeader.split(' ')[1] //Separado en dos mi token y me quedo con la parte valida

    jwt.sign(token, process.env.JWT_SECRET, (error, credentials) => {
        if (error) {
            return res.status(403).send({ error: "Usuario no autorizado" })
        }
        //Descrifo el token
        req.user = credentials.user
        next()
    })
}