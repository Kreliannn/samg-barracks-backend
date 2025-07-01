import { Router } from "express";
import { createMenuController, getMenusController , updateMenuController} from "../controller/menu.controller";
import { upload } from "../utils/upload";
import { authenticateJWT } from "../middleware/auth.middleware";

const route = Router()

route.post("/menu", authenticateJWT, upload.single("file"), createMenuController)
route.get("/menu", authenticateJWT,   getMenusController)
route.put("/menu", authenticateJWT,  updateMenuController)

export default route