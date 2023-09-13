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




const PORT = 4000

const app = express()

const server = app.listen(PORT, () => {
	console.log(`Server on port ${PORT}`)
})

const io = new Server(server);
/*mongoose.connect("mongodb+srv://fzelionelenzi:coderhousefzelionelenzi@cluster0.z3ja11i.mongodb.net/?retryWrites=true&w=majority")
.then(req=>{
	console.log("BD conectada");
})
.catch(error=>{
	console.log("Error en conexion a MongoDb Atlas: ",error);
})*/


mongoose.connect("mongodb+srv://fzelionelenzi:coderhousefzelionelenzi@cluster0.z3ja11i.mongodb.net/?retryWrites=true&w=majority")
	.then(req => {
		console.log("BD conectada");

		/*cartModel.create({
			idProd: new mongoose.Types.ObjectId(), // Genera un nuevo ObjectId automáticamente
  			quantity: 5 // Puedes cambiar la cantidad según tus necesidades
		})*/

	})
	.catch(error => {
		console.log("Error en conexion a MongoDb Atlas: ", error);
	})



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

// Routes
app.use('/api/products', routerProd);
app.use('/api/carts', routerCart);

app.get('/static', (req, res) => {
	res.render('home', {
		rutaCSS: 'home',
		rutaJS: 'home',
	});
});

app.get('/static/realtimeproducts', (req, res) => {
	res.render('realTimeProducts', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'realTimeProducts'
	});
});

app.get('/static/:cid', (req, res) => {
	const {cid} = req.params
	console.log(cid);
	res.render('home', {
		rutaCSS: 'home',
		rutaJS: 'home',
		cid
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
