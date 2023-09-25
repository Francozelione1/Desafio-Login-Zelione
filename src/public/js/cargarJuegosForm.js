const form = document.getElementById("formProduct")
const contenedorProductos = document.getElementById("contenedorProductos")

const socket = io();

form.addEventListener('submit', e => {
	e.preventDefault();
	const dataForm = new FormData(e.target);
	const producto = Object.fromEntries(dataForm);
	socket.emit('productoNuevo', producto);
    e.target.reset()
});

