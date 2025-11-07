import {Schema, model} from "mongoose";

const activitiesSchema = new Schema({
    action : { type: String, required: true },
    employee : { type: String, required: true },
    date : { type: String, required: true },
    time : { type: String, required: true },
    role : { type: String, required: true },
    branch: { type: String, required: true },
});



export default model("Activities", activitiesSchema);
