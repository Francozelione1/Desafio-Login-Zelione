import ticketModel from "../models/tickets.model.js";
import cartModel from "../models/carts.model.js";
import productoModel from "../models/productos.model.js";
import logger from "../utils/logger.js";
import { sendEmailPurchase } from "../config/nodemailer.js";
import CustomError from "../services/errors/customErrors.js";

export const finalizarCompra = async (req, res) => {
    try {
        const { cid } = req.params

        const carrito = await cartModel.findById(cid) // Busco el carrito del usuario
        const productos = await productoModel.find({})// Busco todos los productos de la base de datos
        let sumaTotal= 0
        const productosProcesados = []

        for (const productoUsuario of carrito.products) {
            // Busco el producto en la base de datos
            const productoEncontrado = productos.find(producto => producto._id.equals(productoUsuario.idProd));

            if (productoEncontrado) {
                // Productos que se pueden comprar
                if (productoUsuario.quantity <= productoEncontrado.stock) {
                    productoEncontrado.stock -= productoUsuario.quantity
                    sumaTotal += productoEncontrado.price * productoUsuario.quantity
                    productosProcesados.push({ price: productoEncontrado.price, quantity: productoUsuario.quantity, idProd: productoEncontrado._id })
                    // OTRA OPCION ERA IR FILTRANDO DEL CARRITO DE USUARIO LOS PRODUCTOS QUE SE PUEDEN COMPRAR
                }
                else{  
                    //Productos que no se pueden comprar por falta de stock
                    const productoSinStock = await productoModel.findById(productoEncontrado._id)
                    throw CustomError.createError({
                        message: "No hay stock suficiente",
                        productoSinStock: productoSinStock,
                        code: 3
                    });                    
                }
            }
            //Productos que se lleguen a agregar al carrito pero no existan en la base de datos
            else {
                res.status(400).send({ message: "No se encontro el producto" })
            }
        }

        const userEmail = req.session.user.email

        const nuevoTicket = await ticketModel.create({
            products: productosProcesados,
            purchaser: userEmail,
            amount: sumaTotal
        })

        //Verifico si se pudo crear el ticket para luego modificar el carrito del usuario y ademas descontar el stock de los productos
        if (nuevoTicket) {
            carrito.products = []
            await carrito.save()
            for (const prod of productos){
                await prod.save()
            }
            sendEmailPurchase(`${nuevoTicket.purchaser}`, "Compra realizada", `Resumen: ${nuevoTicket.products}, Total: ${nuevoTicket.amount}` )
            res.status(200).send({ message: nuevoTicket, status: 200 })
        }
    }
    catch (error) {
        if(error instanceof CustomError){
            logger.error("Error generando ticket: " + error.message);
            res.status(400).send({ message: error.message, productosSinStock: error.productoSinStock, status: 400 });
        }
        else{
            logger.error("Error generando ticket: "+error.message)
            res.status(404).send({ message: error.message })
        }
    }
}