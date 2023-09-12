import productoModel from "../models/productos.model.js"
import { Router } from "express"

const routerProd = Router()

routerProd.get("/", async (req,res)=>{
    let { category, limit, page } = req.query
    Number(page)
    Number(limit)
    const options = {
        page: req.query.page || 1,  
        limit: req.query.limit || 10, 
    };
    category = category || "psn"
    try{
        const productos= await productoModel.paginate({category}, options)
        res.status(200).send({resultado: "Ok", contenido: productos})
    }
    catch(e){
        res.status(404).send({resultado: "error", error: e})
    }
})

routerProd.get("/:pid", async (req,res)=>{
    const {pid} = req.params
    try{
        const producto= await productoModel.findById(pid)
        res.status(200).send({resultado: "Ok", contenido: producto})
    }
    catch(e){
        res.status(404).send({resultado: "error", error: e})
    }
})

routerProd.post("/", async(req,res)=>{

    const { title, description, stock, code, price, category,  status, thumbnails } = req.body

    try{
        const productoNuevo= await productoModel.create({
            title, description, stock, code, price, category, status, thumbnails})
        res.status(200).send({resultado: "Ok", contenido: productoNuevo})
    }
    catch(e){
        res.status(404).send({resultado: "error", error: e})
    }
})

routerProd.put("/:pid", async(req,res)=>{

    const {pid} = req.params
    const { title, description, stock, code, price, category } = req.body

    try{
        const productoActualizado = await productoModel.findByIdAndUpdate(pid, { title, description, stock, code, price, category })
        if(productoActualizado){
            res.status(200).send({resultado: "Ok", contenido: productoActualizado})
        }
        else{
            res.status(404).send({resultado: "error", error: "Producto no encontrado"})
        }
    }
    catch(e){
        res.status(404).send({resultado: "error", error: e})
    }
})

routerProd.delete("/:pid", async(req,res)=>{

   const {pid} = req.params

   try{
        const productoEliminado = await productoModel.findByIdAndDelete(pid)
        if(productoEliminado){
            res.status(200).send({resultado: "ok", contenido: productoEliminado})
        }
        else{
            res.status(404).send({resultado: "error", error: "Producto no encontrado"})
        }
   }
   catch(e){
        res.status(404).send({resultado: "error", error: e})
   }
})

export default routerProd