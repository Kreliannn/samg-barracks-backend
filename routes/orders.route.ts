import { Router } from "express";
import { createOrderController, getActiveOrderController, getCompletedOrderController, updateStatusOrderController, getMonthSalesController} from "../controller/orders.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const route = Router()

route.post("/order", authenticateJWT, createOrderController)
route.put("/order", authenticateJWT, updateStatusOrderController)
route.get("/order/active", authenticateJWT,   getActiveOrderController)
route.get("/order/completed", authenticateJWT,   getCompletedOrderController)
route.get("/order/sales",  getMonthSalesController)


export default route