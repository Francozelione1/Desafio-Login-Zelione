import 'dotenv/config'
import express from 'express'
import { __dirname } from "./path.js"
import path from "path"
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import { initializePassport } from './config/passport.js'
import passport from 'passport'
import router from './routes/index.js'
import eventosSocket from './eventosSocket/eventosSocket.js'
import errorHandler from './services/errors/errorHandler.js';
import logger from './utils/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import productoModel from './models/productos.model.js';
import cors from 'cors'
import axios from 'axios';

const PORT = 4000

const app = express()

export const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server);

mongoose.connect(process.env.MONGO_URL)
    .then(req => {
        logger.info("BD conectada");
    })
    .catch(error => {
        console.log("Error en conexion a MongoDb Atlas: ", error);
    })

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.JWT_SECRET)) //Firmo la cookie
app.use(session({ //Configuracion de la sesion de mi app
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 1800 //Segundos, no en milisegundos
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        maxAge: 1800 * 1000
    }
}))
app.use(cors({
    origin: 'http://localhost:4000'
}));

// Definir el helper 'getProp'
const getProp = (object, propertyName) => {
    return object[propertyName];
}

// Definir el helper 'json'
const json = (context) => {
    return JSON.stringify(context);
}

// Configurar Handlebars con el helper incluido
app.engine('handlebars', engine({
    helpers: {
        getProp: getProp,
        json: json
    }
}))

app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

// Routes

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

eventosSocket(io); // Se administran los eventos de socket.io

app.get('/home/', async (req, res) => {

    const nombre = req.session.nombre || false
    const productos = await productoModel.find({})
    let cartUser = req.session.cart || false;
    let esAdmin = req.session.user ? req.session.user.rol == "admin" : false;

    res.render('home', {
        nombre: nombre,
        productos: productos,
        cartUser: cartUser,
        esAdmin: esAdmin
    })
})

app.get('/home/cargarJuegosForm', async (req, res) => {
    try {
        const user = req.session.user || null
        console.log(user);

        if (user.rol == "admin") {
            res.render('cargarJuegosForm')
        }
        else {
            res.render("accesoDenegado")
        }
    }
    catch (e) {
        res.status(400).send({ error: e })
    }
})

app.use('/static/', express.static(path.join(__dirname, '/public')));
app.use('/', router)
app.use(errorHandler)

// Socket.io

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentacion de tienda',
            decription: 'Api de tienda',
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.get("*", (req, res) => {
    res.send("Not found")
})
