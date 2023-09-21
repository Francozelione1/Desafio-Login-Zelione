const socket = io();

let contenedorProductos = document.getElementById("contenedorProductos");

socket.emit("cargarJuegosSegunCarrito", cid);

socket.on('productosCarrito', productos => {
	contenedorProductos.innerHTML = "";
	productos.forEach(prod => {
		contenedorProductos.innerHTML += `
    <div class="contenedorProducto">
      <p>Id: ${prod.idProd}</p>
      <p>Quantity: ${prod.quantity}</p>
    </div>
    `
	});
});
