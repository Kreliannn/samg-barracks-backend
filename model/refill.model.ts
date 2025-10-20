import {Schema, model} from "mongoose";

const refillSchema = new Schema({
    ingredient: { type: String, required: true },
    qty : { type: Number, required: true },
    branch: { type: String, required: true },
    date: { type: String, required: true },
});



export default model("Refill", refillSchema);
