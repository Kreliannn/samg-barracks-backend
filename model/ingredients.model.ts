import {Schema, model} from "mongoose";

const ingredientsSchema = new Schema({
    name: { type: String, required: true },
    stocks: { type: Number, required: true },
    branch: { type: String, required: true },
    img : { type: String, required: true },
});



export default model("Ingredients", ingredientsSchema);