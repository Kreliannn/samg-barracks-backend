import {Schema, model} from "mongoose";

const RequestSchema = new Schema({
    branch : String,
    request : [{
        _id : { type: String, required: true },
        name : String,
        quantity :{ type: Number, required: true },
        price : Number
    }],
    total : Number,
    date : String,
    status : String,
    manager : String
});


export default model("Request", RequestSchema);