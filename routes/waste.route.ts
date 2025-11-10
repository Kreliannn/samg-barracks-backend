import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import { getWasteController, createWasteController } from "../controller/waste.controller";
const route = Router()

route.post("/waste", authenticateJWT, createWasteController)
route.get("/waste/:month", authenticateJWT, getWasteController)


export default route