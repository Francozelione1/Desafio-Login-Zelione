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

const PORT = 4000

const app = express()

export const server = app.listen(PORT, () => {
	console.log(`Server on port ${PORT}`)
})

const io = new Server(server);

mongoose.connect(process.env.MONGO_URL)
	.then(req => {
		console.log("BD conectada");
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
        ttl: 60 //Segundos, no en milisegundos
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
	cookie: {
        httpOnly: false,
        // Otras opciones de cookie si las necesitas
    }
	/*cookie: {
        expires: new Date(Date.now() + (5 * 60 * 1000)) // 5 minutos
    }*/ //No se si es necesario y no lo entiendo bien
}))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

// Routes

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.get('/static/', (req, res) => {

	let session = req.session.login
	let nombre= req.session.nombre

	console.log(nombre);

	res.render('home', {
		nombre,
		rutaCSS: 'home',
		rutaJS: 'home',
		session: session
	});
});

app.use('/static/', express.static(path.join(__dirname, '/public')));

app.use('/', router)
app.use(errorHandler)

// Socket.io

eventosSocket(io); // Se administran los eventos de socket.io

app.get("*", (req, res) => {
	res.send("Not found")
})
