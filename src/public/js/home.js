const socket = io()

const contenedorProductos = document.getElementById("contenedorProductos")

/*const mensajeBienvenida = document.getElementById("mensajeBienvenida")*/

socket.emit("cargarJuegos")

socket.on("productos", productos => {

  contenedorProductos.innerHTML = ""
  productos.forEach(prod => {
    contenedorProductos.innerHTML +=
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

//mensajeBienvenida.innerText = `Bienvenido/a: ${nombre}`
logout.innerText = "Logout"
logout.className = ("logoutButton")


logout.addEventListener("click", () => {

  fetch("http://localhost:4000/api/sessions/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
      window.location.href = res.url;
    })
    .catch((error) => console.log(error))

})

