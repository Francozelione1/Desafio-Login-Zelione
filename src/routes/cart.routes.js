import { Router } from "express";
import cartModel from "../models/carts.model.js";
import { passportError, authorization } from "../utils/messageErrors.js";
import { getCarts, getCartById, postCart, postProductCart, putProductCart ,deleteCart, deleteProductCart, getCartUserById, resetCart } from "../controllers/carts.controller.js";
import { finalizarCompra } from "../controllers/tickets.controller.js";

const routerCart = Router()

routerCart.get("/", passportError('jwt'), authorization('admin'), getCarts) // TRAE TODOS LOS CARRITOS // SOLO ADMIN

routerCart.get("/:cid", passportError('jwt'), getCartById) // TRAE EL CARRITO POR EL CARRITO ID 

routerCart.get("/userCart/:cid", passportError('jwt'), authorization('user'), getCartUserById) // TRAE EL CARRITO POR EL CARRITO ID // SOLO USER

routerCart.post("/", postCart) // CREA UN NUEVO CARRITO

routerCart.post("/:cid/product/:id", passportError('jwt') ,authorization('user') ,postProductCart) // AGREGA UN PRODUCTO AL CARRITO

routerCart.post("/:cid/checkout", passportError('jwt'), authorization('user') , finalizarCompra) // VACÍA UN CARRITO Y CREA UN TICKET CON LOS PRODUCTOS DEL CARRITO

routerCart.put("/:cid/product/:id", passportError('jwt'), authorization('user') ,putProductCart) // MODIFICA LA CANTIDAD DE UN PRODUCTO EN UN CARRITO

routerCart.delete("/:cid/product/:pid", passportError('jwt'), authorization('user') ,deleteProductCart) // ELIMINA UN PRODUCTO DE UN CARRITO

routerCart.delete("/:cid/resetCart", authorization('user'), resetCart) // VACÍA UN CARRITO

routerCart.delete("/:cid", authorization('admin') ,deleteCart) // ELIMINA UN CARRITO

export default routerCart