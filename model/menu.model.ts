
import {Schema, model} from "mongoose";

const menuSchema = new Schema({
    name: { type: String, required: true },
    variants : [{
        variant : String,
        price : Number,
        ingredients: [{
            id : String,
            name : String,
            qty : Number
        }],
    }],
    branch: { type: String, required: true },
    img : { type: String, required: true },
    type : { type: String, required: true }, 
});



export default model("Menu", menuSchema);