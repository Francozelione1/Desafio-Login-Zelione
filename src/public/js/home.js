const socket = io()

const contenedorProductos= document.getElementById("contenedorProductos")

socket.emit("cargarJuegos")

socket.on("productos", productos =>{

  contenedorProductos.innerHTML=""
  productos.forEach(prod => {
    contenedorProductos.innerHTML+=
    `
    <div class="game-card">
        <div class="title">Title: ${prod.title}</div>
        <div class="description">Description: ${prod.description}</div>
        <div class="price">Price: ${prod.price}</div>
        <div class="stock">Stock: ${prod.stock}</div>
        <div class="category">Categoría: ${prod.category}</div>
    </div>
    `
  });


})

let logout = document.getElementById("logout")

if(session){
    logout.innerText="Logout"
    logout.className = ("logoutButton")
}

logout.addEventListener("click", ()=>{
    
    if(session){
        window.location.href = "http://localhost:4000/api/sessions/logout";
    }
    else{
        return
    }
})



/*const socket = io();

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

 */