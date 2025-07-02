import { Router } from "express";
import { createOrderController, getOrderController } from "../controller/orders.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const route = Router()

route.post("/order", authenticateJWT, createOrderController)
route.get("/order", authenticateJWT,   getOrderController)


export default route