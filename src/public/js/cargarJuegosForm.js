const form = document.getElementById("formProduct")
const productoCreado = document.getElementById("productoCreado")

const socket = io();

form.addEventListener('submit', e => {
	e.preventDefault();
	const dataForm = new FormData(e.target);
	const producto = Object.fromEntries(dataForm);
	socket.emit('productoNuevo', producto);
	socket.on('productoCreado', (data) => {
		productoCreado.innerText= `${data.mensaje}`
	})
    e.target.reset()
});

