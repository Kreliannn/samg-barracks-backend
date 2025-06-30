import {Schema, model} from "mongoose";

const branchSchema = new Schema({
    branch: { type: String, required: true }
});



export default model("Branch", branchSchema);
