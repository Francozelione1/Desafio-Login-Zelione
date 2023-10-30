import { Schema, model } from "mongoose";
import  paginate  from "mongoose-paginate-v2";
import { v4 as uuidv4 } from 'uuid';

const id = uuidv4();

const ticketSchema = new Schema({

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
    },
    code: {
        type: String,
        default: id,
        //required: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
        //required: true
    },
    total: {
        type: Number,
        required: true
    }
        
})

const ticketModel = model('ticket', ticketSchema)

export default ticketModel
