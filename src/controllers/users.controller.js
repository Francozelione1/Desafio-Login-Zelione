import ticketModel from "../models/tickets.model.js";
import cartModel from "../models/carts.model.js";
import productoModel from "../models/productos.model.js";
import userModel from "../models/users.models.js";

export const getRegister = async (req, res) => {
    res.render('register')
}

export const postRegister = async (req, res) => {

    console.log("estoy en el post de register");

    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: 'Usuario ya existente' })
        }
        req.session.login = true
        req.session.nombre = req.nombre
        return res.status(200).send({ mensaje: 'Usuario creado', status: 200 })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
    }

}


export const finalizarCompra = async (req, res) => {

    try {
        const { cid } = req.params

        const carrito = await cartModel.findById(cid) // Busco el carrito del usuario
        const productos = await productoModel.find({})// Busco todos los productos de la base de datos

        const productosProcesados = []
        const productosNoProcesados = []

        for (const productoUsuario of carrito.products) {
            // Busco el producto en la base de datos
            const productoEncontrado = productos.find(producto => producto._id.equals(productoUsuario.idProd));

            if (productoEncontrado) {
                // Productos que se pueden comprar
                if (productoUsuario.quantity <= productoEncontrado.stock) {
                    productoEncontrado.stock -= productoUsuario.quantity
                    productosProcesados.push({ price: productoEncontrado.price, quantity: productoUsuario.quantity, idProd: productoEncontrado._id })
                    await productoEncontrado.save()
                    // OTRA OPCION ERA IR FILTRANDO DEL CARRITO DE USUARIO LOS PRODUCTOS QUE SE PUEDEN COMPRAR
                }
                //Productos que no se pueden comprar
                else {
                    productosNoProcesados.push({ idProd: productoEncontrado._id, quantity: productoUsuario.quantity })
                }
            }
            //Productos que se lleguen a agregar al carrito pero no existan en la base de datos
            else {
                res.status(400).send({ message: "No se encontro el producto" })
            }
        }

        // Guardo en el carrito del usuario los productos que no se pudieron comprar

        const precioFinal = productosProcesados.reduce((total, producto) => total + (producto.price * producto.quantity), 0);

        const userEmail = req.session.user.email

        const nuevoTicket = await ticketModel.create({
            products: productosProcesados,
            user: userEmail,
            total: precioFinal
        })

        //Verifico si se pudo crear el ticket para luego modificar el carrito del usuario
        if (nuevoTicket) {
            carrito.products = []
            carrito.products = [...productosNoProcesados]
            await carrito.save()
            res.status(200).send({ message: nuevoTicket })
        }

    }
    catch (error) {
        res.status(404).send({ message: error })
    }

}

/*const cumplenConStock = async (carrito) => {
    return Promise.all(
      carrito.map(async (productoUsuario) => {
        const producto = await productModel.findById(productoUsuario._id);
        return producto.stock >= productoUsuario.quantity;
      })
    ).then((resultados) => {
      return resultados.every((resultado) => resultado);
    })
    .catch((error) => console.log(error))
};*/