import { Schema, model } from "mongoose";
import paginate  from "mongoose-paginate-v2";

const productoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    thumbnails: []

})

productoSchema.plugin(paginate)

const productoModel = model("productos", productoSchema)

export default productoModel