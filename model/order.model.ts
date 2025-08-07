
import {Schema, model} from "mongoose";

const orderSchema = new Schema({
    orders : [{
        item_id : { type: String, required: true },
        _id : { type: String, required: true },
        name: { type: String, required: true },
        ingredients: [{
            id : String,
            name : String,
            qty : Number,
        }],
        price : { type: Number, required: true },
        branch: { type: String, required: true },
        img : { type: String, required: true },
        type : { type: String, required: true }, 
        discount : { type: Number, required: true },
        discountType : { type: String, required: true },
        qty : { type: Number, required: true },
        total : { type: Number, required: true },
    }],
    subTotal : { type: Number, required: true },
    vat : { type: Number, required: true },
    total : { type: Number, required: true },
    totalDiscount : { type: Number, required: true },
    grandTotal : { type: Number, required: true },
    branch: { type: String, required: true },
    table   : { type: String, required: true },
    orderType : { type: String, required: true }, 
    cashier : { type: String, required: true },
    date : { type: String, required: true },
    time : { type: String, required: true },
    status : { type: String, required: true },
    serviceFee : { type: Number, required: true },
    paymentMethod : { type: String, required: true },
});



export default model("Order", orderSchema);