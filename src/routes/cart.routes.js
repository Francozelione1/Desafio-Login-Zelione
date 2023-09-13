import { Router } from "express";
import { CartManager } from "../controllers/cartManager.js";
import cartModel from "../models/carts.model.js";

const manager = new CartManager("./models/cart.txt")

const routerCart = Router()

routerCart.get("/", async(req, res)=>{ // TRAE TODOS LOS CARRITOS

    try{
        const carritos = await cartModel.find()
        res.status(200).send({resultado: "ok", message: carritos})
    }
    catch(e){
        res.status(400).send({error: e})
    }
})

routerCart.get("/:cid", async(req,res)=>{ // TRAE EL CARRITO POR EL CARRITO ID

    const {cid}= req.params
    const carrito = await cartModel.findById(cid)
    
    if(carrito){
        res.status(200).send(carrito)
    }else{
        res.status(404).send("Not found")
    }

})


routerCart.post("/", async(req,res)=>{ // CREA UN NUEVO CARRITO
    try {
		const respuesta = await cartModel.create({});
		res.status(200).send({ resultado: 'OK', message: respuesta });
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
})

routerCart.put("/:cid", async(req,res)=>{ // AGREGA UN PRODUCTO AL CARRITO
    const {cid} = req.params
    const {productosParaAgregar} = req.body

    try{

        const carrito = await cartModel.findById(cid)

        productosParaAgregar.forEach(productoAgregar => {
            
            let productoEncontrado = carrito.products.find(productoCarrito => productoCarrito.idProd == productoAgregar.idProd)

            if(productoEncontrado){
                productoEncontrado.quantity += productoAgregar.quantity 
            }
            else{
                carrito.products.push(productoAgregar)
            }
        
        })

        await carrito.save()

        carrito ? res.status(200).send({resultado: "Ok", message: carrito}) : res.status(404).send({resultado: "Not Found"})

    }
    catch(e){
        res.status(400).send({resultado: e})
        console.log(e);
    }

})

routerCart.put("/:cid/products/:pid", async (req,res)=>{

    const {cid} = req.params

    const {productoParaActualizar} = req.body

    try{

        const carrito = await cartModel.findById(cid)

        const productoEncontrado = carrito.products.find(prod=> prod.idProd == productoParaActualizar.idProd)
        
        if(productoEncontrado){
            productoEncontrado.quantity+= productoParaActualizar.quantity
            await carrito.save()
            res.status(200).send({resultado: "ok", message: carrito})
        }else{
            res.status(404).send({resultado: "Not Found"})
        }

    }
    catch(e){
        res.status(400).send({resultado: e})
        console.log(e);
    }
})

routerCart.delete("/:cid/products/:pid", async(req,res)=>{ //ELIMINA PRODUCTOS DE UN CARRITO EN ESPECIFICO
    
    const {cid, pid} = req.params

    try{
        const carrito = await cartModel.findById(cid)
        const numeroAntesDeEliminar = carrito.products.length
        carrito.products = carrito.products.filter(prod => prod.idProd != pid);
        await carrito.save()
        const numeroDespuesDeEliminar = carrito.products.length
        numeroAntesDeEliminar != numeroDespuesDeEliminar ? res.status(200).send({resultado: "Ok", message: carrito}) : res.status(404).send({resultado: "Not Found"})
    }
    catch(e){
        res.status(400).send({ error: e });
    }   

})

routerCart.delete("/:cid", async(req,res)=>{

    const {cid} = req.params

    try{
        const carrito = await cartModel.findById(cid)
        carrito.products = []
        carrito.save()
        res.status(200).send({resultado: "ok"})
    }
    catch(e){
        res.status(400).send({resultado: e})
    }
})

export default routerCart