import 'dotenv/config'
import express from 'express'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/cart.routes.js'
import { __dirname } from "./path.js"
import path from "path"
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose'
import productoModel from './models/productos.model.js'
import cartModel from './models/carts.model.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import routerSessions from './routes/sessions.routes.js'
import routerUsers from './routes/users.routes.js'
import cookieParser from 'cookie-parser'
import { initializePassport } from './config/passport.js'
import passport from 'passport'
import router from './routes/index.js'

const PORT = 4000

const app = express()

const server = app.listen(PORT, () => {
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
app.use('/', router)
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

app.use('/static', express.static(path.join(__dirname, '/public')));


// Socket.io

io.on("connection", socket => {

	socket.on('cargarJuegos', async () => {
		const productos = await productoModel.find();
		socket.emit('productos', productos);
	});

	socket.on('productoNuevo', async (product) => {
		await productoModel.create({...product});
		const productos = await productoModel.find();
		socket.emit('productos', productos);
	});


	socket.on("cargarJuegosSegunCarrito", async (cid) =>{

		try{
			const carrito= await cartModel.findById(cid)
			console.log(cid);
			socket.emit('productosCarrito', carrito.products);
		}
		catch(e){
			console.log(e);
		}
	})
})

app.get("*", (req, res) => {
	res.send("Not found")
})
