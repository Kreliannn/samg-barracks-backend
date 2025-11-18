import { Router } from "express";
import { deletetMenuController , getProductReportCustomDateController ,getProductReportController,createMenuController, getMenusController , updateMenuController, addMenuVariantController} from "../controller/menu.controller";
import { upload } from "../utils/upload";
import { authenticateJWT } from "../middleware/auth.middleware";

const route = Router()

route.post("/menu", authenticateJWT, upload.single("file"), createMenuController)
route.patch("/menu", authenticateJWT, addMenuVariantController)
route.get("/menu", authenticateJWT,   getMenusController)
route.get("/menu/productReport/:reportType/:type", authenticateJWT,   getProductReportController)
route.post("/menu/productReport", authenticateJWT,   getProductReportCustomDateController)
route.put("/menu", authenticateJWT,  updateMenuController)
route.delete("/menu/:id", authenticateJWT,  deletetMenuController)

export default route