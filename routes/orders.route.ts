import { Router } from "express";
import { createOrderController, getActiveOrderController, getCompletedOrderController, updateStatusOrderController, getBranchSalesController} from "../controller/orders.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { editDate } from "../service/order.service";

const route = Router()

route.post("/order", authenticateJWT, createOrderController)
route.put("/order", authenticateJWT, updateStatusOrderController)
route.get("/order/active", authenticateJWT,   getActiveOrderController)
route.get("/order/completed", authenticateJWT,   getCompletedOrderController)
route.get("/order/sales/:branch",  getBranchSalesController)
route.get("/order/editDate", async (request, response) => {
    await editDate()
    response.send("succes")
})


export default route