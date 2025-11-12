import {Schema, model} from "mongoose";

const changeSchema = new Schema({
    date: { type: String, required: true },
    change : { type: Number, required: true },
    branch : { type: String, required: true },
    start : { type: String, required: true },
    end : { type: String, required: true }
});



export default model("Change", changeSchema);
