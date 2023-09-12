const socket = io();

let contenedorProductos = document.getElementById("contenedorProductos");

socket.emit("cargarJuegos");

socket.on('productos', productos => {
	contenedorProductos.innerHTML = "";
	productos.forEach(prod => {
		contenedorProductos.innerHTML += `
    <div class="contenedorProducto">
      <p>Id: ${prod._id}</p>
      <p>Title: ${prod.title}</p>
      <p>Description: ${prod.description}</p>
      <p>Price: ${prod.price}</p>
      <p>Status: ${prod.status}</p>
      <p>Code: ${prod.code}</p>
      <p>Stock: ${prod.stock}</p>

    </div>
    `
	});
});