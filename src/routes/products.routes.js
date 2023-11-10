import { Router } from "express";
import productoModel from "../models/productos.model.js";
import { passportError, authorization } from "../utils/messageErrors.js";
import { getProduct, getProducts, postProduct , putProduct, deleteProduct, validateProductData } from "../controllers/products.controller.js";

const routerProd = Router()

routerProd.get("/", getProducts) // TRAE TODOS LOS PRODUCTOS

routerProd.get("/:pid", getProduct) // TRAE EL PRODUCTO POR EL PRODUCTO ID

routerProd.post("/", validateProductData ,passportError('jwt'), authorization('admin') , postProduct) // CREA UN NUEVO PRODUCTO // SOLO ADMIN

routerProd.put("/:pid", validateProductData ,passportError('jwt'), authorization('admin'), putProduct) // MODIFICA UN PRODUCTO // SOLO ADMIN

routerProd.delete("/:pid", passportError('jwt'), authorization('admin'), deleteProduct) // ELIMINA UN PRODUCTO // SOLO ADMIN

export default routerProd