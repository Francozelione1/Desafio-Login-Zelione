import { Router } from "express";
import { CartManager } from "../controllers/cartManager.js";
import cartModel from "../models/carts.model.js";

const manager = new CartManager("./models/cart.txt")

const routerCart = Router()

routerCart.get("/:cid", async(req,res)=>{

    const {cid}= req.params
    const carrito = await cartModel.findById(cid)
    
    if(carrito){
        res.status(200).send(carrito)
    }else{
        res.status(404).send("Not found")
    }

})


routerCart.post("/", async(req,res)=>{

    const newCarrito= await manager.newCart()

    res.status(200).send(newCarrito)

})


routerCart.post("/:cid/product/:pid", async(req,res)=>{

    const {cid, pid} = req.params

    const productoNuevo = manager.addProduct(Number(cid),Number(pid))

    if(productoNuevo){
        res.status(200).send("Producto agregado o aumentada la cantidad")
    }
    else{
        res.status(404).send("Not found")
    }

})




export default routerCart