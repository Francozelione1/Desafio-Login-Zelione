import cartModel from "../models/carts.model.js";
import productoModel from "../models/productos.model.js";


export const getCarts = async (req, res) => {

    try {
        const carts = await cartModel.find()
        res.status(200).send({ resultado: "OK", message: carts })
    }
    catch (e) {
        res.status(400).send({ error: e })
    }

}

export const getCart = async (req, res) => {

    const { cid } = req.params

    try {
        const cart = await cartModel.findById(cid)
        if(cart){
            return res.status(200).send({ resultado: "OK", message: cart })
        }
        return res.status(404).send({resultado: "Carrito no encontrado"})
    }
    catch (e) {
        res.status(400).send({ error: e })
    }

}

export const postCart = async (req, res) => {

    try {
        const cart = await cartModel.create({})
        res.status(201).send({ resultado: "OK", message: cart })
    }
    catch (e) {
        res.status(400).send({ error: e })
    }


}

export const putCart = async (req, res) => {

    const { cid } = req.params
    const { productosParaAgregar } = req.body

    try {

        const cart = await cartModel.findById(cid)

        for (let productoAgregar of productosParaAgregar) {
            
            const productoExistente = await productoModel.findById(productoAgregar.idProd)

            if(!productoExistente){
                throw CustomError.createError("Error", "Error en los datos ingresados", "No existe tal producto", 3)
            }

            let productoEncontrado = cart.products.find(productoCarrito => productoCarrito.idProd == productoAgregar.idProd)

            if (productoEncontrado) {
                productoEncontrado.quantity += productoAgregar.quantity
            }
            else {
                cart.products.push(productoAgregar)
            }

        }

        const cartUpdated = await cartModel.findByIdAndUpdate(cid, cart, { new: true })

        res.status(200).send({ resultado: "OK", message: cartUpdated })

    }
    catch (e) {
        res.status(400).send({ error: e.message})
    }

}

export const putProductCart = async (req, res) => {

    const { cid, pid } = req.params
    const { productoParaActualizar } = req.body

    try {

        const cart = await cartModel.findById(cid)

        const productoEncontrado = cart.products.find(prod => prod.idProd == pid)

        if (productoEncontrado) {
            productoEncontrado.quantity += productoParaActualizar.quantity
            await cart.save()
            res.status(200).send({ resultado: "OK", message: cart })
        } else {
            res.status(404).send({ resultado: "Producto no econtrado" })
        }

    }
    catch (e) {
        res.status(400).send({ error: e })
    }

}

export const deleteProductCart = async (req, res) => {

    const { cid, pid } = req.params

    try {

        const cart = await cartModel.findById(cid)

        const productoEncontrado = cart.products.find(prod => prod.idProd == pid)

        if (productoEncontrado) {
            cart.products = cart.products.filter(prod => prod.idProd != pid)
            await cart.save()
            res.status(200).send({ resultado: "OK", message: cart })
        } else {
            res.status(404).send({ resultado: "Producto no econtrado" })
        }

    }
    catch (e) {
        res.status(400).send({ error: e })
    }


}

export const deleteCart = async (req, res) => {

    const { cid } = req.params

    try {

        const cart = await cartModel.findByIdAndDelete(cid)

        if (cart) {
            res.status(200).send({ resultado: "OK", message: cart })
        } else {
            res.status(404).send({ resultado: "Carrito no encontrado" })
        }

    }
    catch (e) {
        res.status(400).send({ error: e })
    }

}