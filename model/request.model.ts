import {Schema, model} from "mongoose";

const RequestSchema = new Schema({
    branch : String,
    request : [{
        _id : String,
        name : String,
        quantity : Number,
        price : Number
    }],
    total : Number,
    date : String,
    status : String
});


export default model("Request", RequestSchema);