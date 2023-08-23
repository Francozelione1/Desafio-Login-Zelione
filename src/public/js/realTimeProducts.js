const socket = io();

const form = document.getElementById("formProduct")
const contenedorProductos = document.getElementById("contenedorProductos")


socket.emit("cargarJuegos");

form.addEventListener('submit', e => {
	e.preventDefault();
	const dataForm = new FormData(e.target);
	const producto = Object.fromEntries(dataForm);
	socket.emit('productoNuevo', producto);
    e.target.reset()
});

socket.on('productos', productos => {
	contenedorProductos.innerHTML = "";
	productos.forEach(prod => {
		contenedorProductos.innerHTML += `
    <div class="contenedorProducto">
      <p>Id: ${prod.id}</p>
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