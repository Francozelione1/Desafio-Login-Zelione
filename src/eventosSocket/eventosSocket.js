import productoModel from '../models/productos.model.js';
import cartModel from '../models/carts.model.js';

const eventosSocket = (io) => {

    io.on('connection', (socket) => {

        socket.on('cargarJuegos', async () => {
            const productos = await productoModel.find();
            socket.emit('productos', productos);
        });
    
        socket.on('productoNuevo', async (product) => {
            const productoCreado = await productoModel.create({...product});
            let mensaje= ""
            if(productoCreado){
                mensaje = "Producto creado"
            }
            else{
                mensaje = "Fallo al crear producto"
            }
            socket.emit('productoCreado', {mensaje});
        });
    
    
        socket.on("cargarJuegosSegunCarrito", async (cid) =>{
    
            try{
                const carrito= await cartModel.findById(cid)
                console.log(cid);
                socket.emit('productosCarrito', carrito.products);
            }
            catch(e){
                console.log(e);
            }
        })

    });
};

export default eventosSocket;