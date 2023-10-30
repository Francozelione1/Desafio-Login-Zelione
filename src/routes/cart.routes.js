import { Router } from "express";
import cartModel from "../models/carts.model.js";
import { passportError, authorization } from "../utils/messageErrors.js";
import { getCarts, getCart, postCart, putCart, putProductCart ,deleteCart, deleteProductCart } from "../controllers/carts.controller.js";

const routerCart = Router()

routerCart.get("/", passportError('jwt'), authorization('admin'), getCarts) // TRAE TODOS LOS CARRITOS // SOLO ADMIN

routerCart.get("/:cid", passportError('jwt'), authorization('admin'), getCart) // TRAE EL CARRITO POR EL CARRITO ID // SOLO ADMIN

routerCart.post("/", postCart) // CREA UN NUEVO CARRITO

routerCart.put("/:cid", passportError('jwt'), authorization('user') ,putCart) // AGREGA UN PRODUCTO AL CARRITO

routerCart.put("/:cid/products/:pid", passportError('jwt'), authorization('user') ,putProductCart) // MODIFICA LA CANTIDAD DE UN PRODUCTO EN UN CARRITO

routerCart.delete("/:cid/products/:pid", passportError('jwt'), authorization('user') ,deleteProductCart) // ELIMINA UN PRODUCTO DE UN CARRITO

routerCart.delete("/:cid", authorization('admin') ,deleteCart) // ELIMINA UN CARRITO

export default routerCart