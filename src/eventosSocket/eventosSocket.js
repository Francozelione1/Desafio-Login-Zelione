import productoModel from '../models/productos.model.js';
import cartModel from '../models/carts.model.js';

const eventosSocket = (io) => {

    io.on('connection', (socket) => {

        socket.on('cargarJuegos', async () => {
            const productos = await productoModel.find();
            socket.emit('productos', productos);
        });

        socket.on('productoNuevo', async (product) => {
            const productoCreado = await productoModel.create({ ...product });
            let mensaje = ""
            if (productoCreado) {
                mensaje = "Producto creado"
            }
            else {
                mensaje = "Fallo al crear producto"
            }
            socket.emit('productoCreado', { mensaje });
        });


        socket.on("cargarJuegosSegunCarrito", async (cid) => {

            try {
                const carrito = await cartModel.findById(cid)
                console.log(cid);
                socket.emit('productosCarrito', carrito.products);
            }
            catch (e) {
                console.log(e);
            }
        })

        
        productoModel.watch().on('change', async (change) => {
            if (change.operationType === 'update' && change.updateDescription.updatedFields.stock !== undefined) {
                const newStock = change.updateDescription.updatedFields.stock;
                await socket.emit(`stockChanged-${change.documentKey._id}`, newStock);
            }
        });

        cartModel.watch().on('change', async (change) => {
            if (change.operationType === 'update' && change.updateDescription.updatedFields.products !== undefined) {
                const updatedCart = await cartModel.findById(change.documentKey._id);
                io.emit(`cartUpdated-${change.documentKey._id}`, updatedCart); // Emite a todos los clientes
            }
        });

    });
};

export default eventosSocket;