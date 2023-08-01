import { log } from 'console'
import {promises as fs} from 'fs'

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

    async addProduct(producto){

        const productosJson= JSON.parse(await fs.readFile("./productos.txt", "utf-8"))

        const productoRepetido = productosJson.find( prod => prod.code === producto.codes)

        if(!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock){
            console.log("Todos los campos son obligatorios")
            return
        }
        else if(productoRepetido){
            console.log("El producto ya se encuentra en el carrito")
            return
        }

        this.productos.push({...producto, id: this.productId})
        this.productId++
        await fs.writeFile("./productos.txt", JSON.stringify(this.productos))
        
    }

    async getProducts(){

        const contenidoTxt = await fs.readFile("./productos.txt","utf-8")

        const productosJson= {contenido: contenidoTxt}

        JSON.parse(productosJson)

        return console.log(productosJson);
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

    async updateProduct(id, campoActualizar){

        const productosJson = JSON.parse(await fs.readFile("./productos.txt","utf-8"))

        this.productos=[]

        productosJson.map((prod)=>{
            prod.id === id ? prod={...prod, ...campoActualizar} : prod
            prod.id === id ? console.log("Producto atualizado") : null
            this.productos.push(prod)
        })
        
        await fs.writeFile("./productos.txt",JSON.stringify(this.productos))

        console.log(this.productos);
    }
    
    async deleteProduct(id){
        const productosJson = JSON.parse(await fs.readFile('./productos.txt', 'utf-8'))
        const productosRestantes = productosJson.filter(prod => prod.id != id)
        await fs.writeFile('./productos.txt', JSON.stringify(productosRestantes))
        console.log(productosRestantes);
    }
}

const productManager= new ProductManager()

await productManager.addProduct({
    title: "God Of War",
    description: "JuegoPsn",
    price: 20,
    thumbnail: "img",
    code: "godofwar",
    stock: 10,
})

await productManager.addProduct({
    title: "Uncharted",
    description: "JuegoPsn",
    price: 20,
    thumbnail: "img",
    code: "uncharted",
    stock: 10,
})

productManager.getProductById(1)
productManager.getProductById(2)

await productManager.updateProduct(1, {stock: 7})
await productManager.deleteProduct(2)


