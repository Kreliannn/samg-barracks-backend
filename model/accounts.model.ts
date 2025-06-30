import {Schema, model} from "mongoose";

const accountSchema = new Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    branch: { type: String, required: true },
});



export default model("Account", accountSchema);
