import { log } from 'console';
import { promises as fs } from 'fs';

export class CartManager {

    constructor(pathFile){
        this.path= pathFile
        this.carts= []
        this.productId = 0
    }

    async newCart(){
        
       this.productId++
        
        const newCart = {
            id: this.productId,
            products: []
        }
        
        const carritos = JSON.parse(await fs.readFile(this.path, "utf-8"))
        this.carts= carritos
       // const carritoRepetido = carritos.find(cart => cart.id === newCart.id)
        this.carts.push(newCart)
        await fs.writeFile(this.path, JSON.stringify(this.carts))
        return newCart;
        
    }

    async getCartById(id){

        const carritos = JSON.parse(await fs.readFile(this.path, "utf-8"))

        const carritoBuscado = carritos.find(carrito => carrito.id===id)

        if(carritoBuscado){
            return carritoBuscado
        }
        else{
            return false
        }

    }

    async addProduct(cid, pid){

        const carritos = JSON.parse(await fs.readFile(this.path, "utf-8"))

        this.carts= carritos

        const carritoBuscado = carritos.findIndex(carrito => carrito.id === cid)

        if(carritoBuscado!=-1){

            const carrito = this.carts[carritoBuscado]
            
            const productoParaAgregar = carrito.products.find((prod) => prod.id===pid)

            if(productoParaAgregar){
                productoParaAgregar.quantity ? productoParaAgregar.quantity++ : productoParaAgregar.quantity=1
                this.carts[carritoBuscado].products.map(prod=> prod.id === pid ? prod={id:pid, quantity: prod.quantity} : prod)
                await fs.writeFile(this.path, JSON.stringify(this.carts))
                return true
                //console.log("Producto ya existente, se incrementó en 1 la cantidad");
            }
            else{
                this.carts[carritoBuscado].products.push({id:pid, quantity:1})
                await fs.writeFile(this.path, JSON.stringify(this.carts))
                return true
                //console.log("Producto agregado");
            }

        }
        else{
            return false
           // console.log("carrito inexistente");
        }
    }
    
}

/*
const cartManager = new CartManager()

await cartManager.newCart()
await cartManager.newCart()
await cartManager.newCart()

await cartManager.addProduct(1,1)*/