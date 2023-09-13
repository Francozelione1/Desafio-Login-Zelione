import { Schema, model } from "mongoose";
import  paginate  from "mongoose-paginate-v2";

const cartSchema = new Schema({
    products: {
        type: [
            {
                idProd: {
                    type: Schema.Types.ObjectId, //Id autogenerado de MongoDB
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true //default: 1
                }
            }
        ],
        default: ()=>{
            return []
        }
    }
        
})

cartSchema.plugin(paginate)

const cartModel = model("carts", cartSchema)

export default cartModel