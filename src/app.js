import {ProductManager} from "./main.js"
import express from "express"


const PORT = 4000

const server = express()

const manager = new ProductManager()

server.use(express.urlencoded({ extended: true }));

server.get("/products", async (req,res)=>{
    const {limite} = req.query
    const productos = await manager.getProducts()
    if(limite){
        res.send(productos.slice(0, limite))
    }
    else{
        res.send(productos)
    }
})

server.get("/products/:id", async (req,res)=>{
    const prod = await manager.getProductById(Number(req.params.id))
    prod ? res.send(prod) : res.send("Not Found")
})

server.get("*",(req,res)=>{
    res.send("Not found")
})

server.listen(PORT, ()=>{
    console.log(`Esta logeado en el puerto ${PORT}`);
})

