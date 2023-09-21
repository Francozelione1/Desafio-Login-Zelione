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


const PORT = 4000

const app = express()

const server = app.listen(PORT, () => {
	console.log(`Server on port ${PORT}`)
})

const io = new Server(server);

mongoose.connect("mongodb+srv://fzelionelenzi:coderhousefzelionelenzi@cluster0.z3ja11i.mongodb.net/?retryWrites=true&w=majority")
	.then(req => {
		console.log("BD conectada");
	})
	.catch(error => {
		console.log("Error en conexion a MongoDb Atlas: ", error);
	})

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE)) //Firmo la cookie
app.use(session({ //Configuracion de la sesion de mi app
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 60 //Segundos, no en milisegundos
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

// Routes
app.use('/api/products', routerProd);
app.use('/api/carts', routerCart);
app.use("/api/users", routerUsers)
app.use("/api/sessions", routerSessions)

app.get('/static', (req, res) => {

	let session = req.session.login

	res.render('home', {
		rutaCSS: 'home',
		rutaJS: 'home',
		session: session
	});
});

app.use('/static', express.static(path.join(__dirname, '/public')));

app.get('/static/cargarJuegosForm', (req, res) => {
	res.render('cargarJuegosForm', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'cargarJuegosForm'
	});
});

app.get('/static/:cid', (req, res) => {
	const {cid} = req.params
	console.log(cid);
	res.render('home', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'cargarJuegosSegunCarrito',
		cid
	});
});


//LOGIN



// SESSIONS

app.get('/session', (req, res) => {
    if (req.session.counter) { //Si existe la variable counter en la asesion
        req.session.counter++
        res.send(`Has entrado ${req.session.counter} veces a mi pagina`)
    } else {
        req.session.counter = 1
        res.send("Hola, por primera vez")
    }
})

//Cookies

app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'Esto es el valor de una cookie', { maxAge: 60000, signed: true }).send('Cookie creada') //Cookie de un minuto firmada
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies) //Consultar solo las cookies firmadas
    //res.send(req.cookies) Consultar TODAS las cookies
})


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
