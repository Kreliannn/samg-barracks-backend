import {Schema, model} from "mongoose";

const ingredientsSchema = new Schema({
    name: { type: String, required: true },
    stocks: [{
        branch : String,
        stock : Number
    }],
    branch: { type: String, required: true },
    img : { type: String, required: true },
    type : { type: String, required: false },
});



export default model("Ingredients", ingredientsSchema);