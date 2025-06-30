import { Router } from "express";
import { createIngredientsController } from "../controller/ingredients.controller";
import { upload } from "../utils/upload";


const route = Router()

route.post("/ingredients", upload.single("file"), createIngredientsController)

export default route