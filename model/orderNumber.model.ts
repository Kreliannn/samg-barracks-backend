import {Schema, model} from "mongoose";

const OrderNumberSchema = new Schema({
    branch : String,
    date : String,
    num : Number
});


export default model("OrderNumber", OrderNumberSchema);