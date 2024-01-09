import productoModel from "../models/productos.model.js"
import CustomError from "../services/errors/customErrors.js"
import EErrors from '../services/errors/enums.js';
import { generateProductErrorInfo } from '../services/errors/info.js';

export const getProducts = async (req, res) => {
    const { limit, page, filter, sort } = req.query

    const pag = page ? page : 1
    const lim = limit ? limit : 10
    const ord = sort == 'asc' ? 1 : -1

    try {
        const products = await productoModel.paginate({ filter: filter }, { limit: lim, page: pag, sort: { price: ord } })

        if (products) {
            return res.status(200).send(products)
        }

        return res.status(404).send({ error: "Productos no encontrados" })

    } catch (error) {
        return res.status(500).send({ error: `Error en consultar productos ${error}` })
    }

}

export const getProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await productoModel.findById(id)

        if (product) {
            return res.status(200).send(product)
        }

        return res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        return res.status(500).send({ error: `Error en consultar producto ${error}` })
    }
}


export const validateProductData = (req,res,next) => {
    
    const { title, description, code, price, stock, category } = req.body

    try {
       
        if ((!title && !description && !code && !price && !stock && !category)) {
            throw CustomError.createError({
                name: EErrors.MISSING_REQUIRED_FIELDS.name,
                cause: generateProductErrorInfo({ title, description, code, price, stock, category }),
                message: 'Error al crear producto',
                code: EErrors.MISSING_REQUIRED_FIELDS.code
            })
        }

        next()

    } catch (error){
        next(error);
    }

}


export const postProduct = async (req, res) => {

    try {

        const { title, description, code, price, stock, category } = req.body

        const product = await productoModel.create({ title, description, code, price, stock, category })

        if (product) {
            return res.status(201).send(product)
        }

        return res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).send({ error: `Llave duplicada` })
        } else {
            return res.status(500).send({ error: `Error en crear producto: ${error}`})
        }

    }
}

export const putProduct = async (req, res) => {
    const { id } = req.params
    const { title, description, code, price, stock, category } = req.body
    try {

        /*if ((!title || !description || !code || !price || !stock || !category)) {
            CustomError.createError({
                name: 'Error de creación de producto',
                cause: generateProductErrorInfo({ title, description, code, price, stock, category }),
                message: 'Error al crear producto',
                code: EErrors.MISSING_OR_INVALID_PRODUCT_DATA
            })
        }*/
        
        const product = await productoModel.findByIdAndUpdate(id, { title, description, code, price, stock, category }, { new: true })

        if (product) {
            return res.status(200).send(product)
        }

        return res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        return res.status(500).send({ error: `Error en actualizar producto ${error}` })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params

    try {
        const product = await productoModel.findByIdAndDelete(id)

        if (product) {
            return res.status(200).send(product)
        }

        return res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        return res.status(500).send({ error: `Error en eliminar producto ${error}` })
    }
}

export const getStockByIdProduct = async (req, res) => {
    const { id } = req.params

    try {
        const product = await productoModel.findById(id)

        if (product) {
            return res.status(200).send({ stock: product.stock })
        }

        return res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        return res.status(500).send({ error: `Error en consultar stock ${error}` })
    }
}