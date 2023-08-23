import express from 'express'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/cart.routes.js'
import { __dirname } from "./path.js"
import path from "path"
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { Socket } from 'dgram'
import { ProductManager } from './controllers/productManager.js'


const PORT = 4000

const app = express()

const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})


const productManager = new ProductManager("./models/productos.txt")
const io = new Server(server);

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
		rutaJS: 'realTimeProducts',
	});
});


app.use('/static', express.static(path.join(__dirname, '/public')));

// Socket.io

io.on("connection", socket =>{

    socket.on('cargarJuegos', async () => {
		const productos = await productManager.getProducts();
		socket.emit('productos', productos);
	});

    socket.on('productoNuevo', async (product) => {
		await productManager.addProduct(product);
		const productos = await productManager.getProducts();
		socket.emit('productos', productos);
	});

})

app.get("*",(req,res)=>{
    res.send("Not found")
})
