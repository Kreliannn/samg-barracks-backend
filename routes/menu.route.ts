import { Router } from "express";
import { createMenuController, getMenusController } from "../controller/menu.controller";
import { upload } from "../utils/upload";
import { authenticateJWT } from "../middleware/auth.middleware";

const route = Router()

route.post("/menu", authenticateJWT, upload.single("file"), createMenuController)
route.get("/menu", authenticateJWT,   getMenusController)

export default route