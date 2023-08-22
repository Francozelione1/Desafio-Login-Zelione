import express from 'express'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/cart.routes.js'
import { __dirname } from "./path.js"
import path from "path"


const PORT = 4000

const server = express()

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Routes
server.use('/api/products', routerProd);
server.use('/api/carts', routerCart);

server.use('/static', express.static(path.join(__dirname, '/public')));

server.get("*",(req,res)=>{
    res.send("Not found")
})

server.listen(PORT, ()=>{
    console.log(`Esta logeado en el puerto ${PORT}`);
})

