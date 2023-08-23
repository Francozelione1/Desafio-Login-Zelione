import {ProductManager} from "../controllers/productManager.js"
import { Router } from "express"


const manager = new ProductManager("./models/productos.txt")
const routerProd = Router()


routerProd.get("/", async (req,res)=>{
    const {limite} = req.query
    const productos = await manager.getProducts()
    if(limite){
        res.status(200).send(productos.slice(0, Number(limite)))
    }
    else{
        res.status(404).send(productos)
    }
})

routerProd.get("/:pid", async (req,res)=>{
    const {pid} = req.params
    const prod = await manager.getProductById(Number(pid))
    prod ? res.status(200).send(prod) : res.status(404).send("Not Found")
})


routerProd.post("/", async(req,res)=>{

    const productoNuevo= req.body

    const productoRepetido = await manager.addProduct(productoNuevo)

    if(productoRepetido){
        res.status(404).send("Producto ya existente")
    }
    else{
        res.status(200).send("Producto agregado correctamente")
    }

})

routerProd.put("/:pid", async(req,res)=>{

    const {pid} = req.params

    const productoExistente = await manager.updateProduct(Number(pid), req.body)
    
    if(productoExistente){
        res.status(200).send("Producto actualizado correctamente")
    }
    else{
        res.status(404).send("Producto no existente")
    }

})

routerProd.delete("/:pid", async(req,res)=>{

    const {pid} = req.params

    const productoExistente = await manager.deleteProduct(Number(pid))

    if(productoExistente){
        res.status(200).send("Producto eliminado correctamente")
    }
    else{
        res.status(404).send("Producto no encontrado")
    }
})

export default routerProd