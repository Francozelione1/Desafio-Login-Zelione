class Producto {
    constructor(title, description, price, thumbnail, code, stock){
        this.title = title,
        this.description =description,
        this.price= price,
        this.thumbnail= thumbnail,
        this.code=code,
        this.stock = stock
    }
}

class ProductManager{

    constructor(){
        this.productos=[],
        this.productId = 1
    }

    addProduct(producto){

        const productoRepetido = this.productos.find((prod) => prod.code===producto.code)

        if(!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock){
            console.log("Todos los campos son obligatorios")
            return
        }
        else if(productoRepetido){
            console.log("El producto ya se encuentra en el carrito")
            return
        }
        else{
            const productoAgregado= {...producto, id: this.productId}
            this.productId++
            this.productos.push(productoAgregado)
            console.log(this.productos);
        }
    }

    getProducts(){
        return this.productos
    }

    getProductById(id){

        const idBuscado = this.productos.find((prod)=> prod.id === id)

        if(idBuscado){
            console.log(idBuscado);
        }
        else{
            console.log("Not Found");
        }

    }
}

const productManager= new ProductManager()

productManager.addProduct({
    title: "God Of War",
    description: "JuegoPsn",
    price: 20,
    thumbnail: "img",
    code: "godofwar",
    stock: 10,
})

productManager.addProduct({
    title: "Uncharted",
    description: "JuegoPsn",
    price: 20,
    thumbnail: "img",
    code: "uncharted",
    stock: 10,
})

productManager.addProduct({
    title: "Uncharted",
    description: "JuegoPsn",
    price: 20,
    thumbnail: "img",
    code: "uncharted",
    stock: 10,
})

productManager.getProductById(1)
productManager.getProductById(2)
productManager.getProductById(3)