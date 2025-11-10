import {Schema, model} from "mongoose";

const wasteSchema = new Schema({
    item: { type: String, required: true },
    qty : { type: Number, required: true },
    branch: { type: String, required: true },
    date: { type: String, required: true },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    reason: { type: String, required: true }
});



export default model("Waste", wasteSchema);
