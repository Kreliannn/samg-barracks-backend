import { Router } from "express";
import { createIngredientsController, getIngredientsController, EditIngredientsController } from "../controller/ingredients.controller";
import { upload } from "../utils/upload";
import { authenticateJWT } from "../middleware/auth.middleware";

const route = Router()

route.post("/menu", authenticateJWT, upload.single("file"), createIngredientsController)


export default route