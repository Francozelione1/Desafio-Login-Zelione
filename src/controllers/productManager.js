import {promises as fs} from 'fs'


class Producto {
    constructor(title, description, price, thumbnail, code, stock, status){
        this.title = title,
        this.description =description,
        this.price= price,
        this.status= status
        this.thumbnail= thumbnail,
        this.code=code,
        this.stock = stock
    }
}

export class ProductManager{

    constructor(){
        this.productos=[],
        this.productId = 1
    }

    async addProduct(producto){

        const productosJson= JSON.parse(await fs.readFile("../src/models/productos.txt", "utf-8"))

        const productoRepetido = productosJson.find( prod => prod.code === producto.codes)

        if(!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock){
            console.log("Todos los campos son obligatorios")
            return
        }
        else if(productoRepetido){
            console.log("El producto ya se encuentra en el carrito")
            return true
        }

        this.productos.push({...producto, id: this.productId})
        this.productId++
        await fs.writeFile("../src/models/productos.txt", JSON.stringify(this.productos))
        return false
    }

    async getProducts(){

        const contenidoTxt = JSON.parse(await fs.readFile("../src/models/productos.txt","utf-8"))

        const productosJson= contenidoTxt

        return (productosJson);
    }

    async getProductById(id){

        const productosJson= JSON.parse(await fs.readFile("../src/models/productos.txt","utf-8"))

        const idBuscado = productosJson.find((prod)=> prod.id === id)

        if(idBuscado){
            return(idBuscado);
        }
        else{
            return("Not Found");
        }

    }

    async updateProduct(id, campoActualizar){

        const productosJson = JSON.parse(await fs.readFile("../src/models/productos.txt","utf-8"))

        let productoExistente = false

        this.productos=[]

        productosJson.map((prod)=>{
            prod.id === id ? prod={...prod, ...campoActualizar} : prod
            prod.id === id ? productoExistente = true : null
            this.productos.push(prod)
        })
        
        await fs.writeFile("../src/models/productos.txt",JSON.stringify(this.productos))

        return productoExistente
    }
    
    async deleteProduct(id){
        const productosJson = JSON.parse(await fs.readFile('../src/models/productos.txt', 'utf-8'))
        const productosRestantes = productosJson.filter((prod) => prod.id != id)
        await fs.writeFile('../src/models/productos.txt', JSON.stringify(productosRestantes))
        //console.log(productoExistente);
        return 
    }
}

const productManager= new ProductManager()

await productManager.addProduct({
    title: "God Of War",
    description: "JuegoPsn",
    price: 20,
    status: true,
    thumbnail: "../public/img/imagen1",
    code: "godofwar",
    stock: 10,
})

await productManager.addProduct({
    title: "Uncharted",
    description: "JuegoPsn",
    price: 20,
    status: true,
    thumbnail: "../public/img/imagen2",
    code: "uncharted",
    stock: 10,
})

//productManager.getProductById(1)
//productManager.getProductById(2)

await productManager.updateProduct(1, {stock: 7})
//await productManager.deleteProduct(2)

//await productManager.getProducts()

