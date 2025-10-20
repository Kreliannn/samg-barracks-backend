import { Router } from "express";
import {   getRefillController, createIngredientsController, getIngredientsController, EditIngredientsController, deductIngredientController } from "../controller/ingredients.controller";
import { upload } from "../utils/upload";
import { authenticateJWT } from "../middleware/auth.middleware";

const route = Router()

route.post("/ingredients", authenticateJWT, upload.single("file"), createIngredientsController)
route.put("/ingredients", authenticateJWT, EditIngredientsController)
route.put("/ingredients/refill", authenticateJWT, deductIngredientController)
route.get("/ingredients/refill/:date", authenticateJWT, getRefillController)
route.get("/ingredients", authenticateJWT, getIngredientsController)

export default route