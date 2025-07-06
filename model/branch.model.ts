import {Schema, model} from "mongoose";

const branchSchema = new Schema({
    branch: { type: String, required: true },
    tables : [{
        table : String,
        x : Number,
        y : Number
    }]
});



export default model("Branch", branchSchema);
