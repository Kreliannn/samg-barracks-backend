import { Router } from "express";
import {  startTimerController,getTransactionReportController, getTransactionReportCustomDateController,  getOrderHistoryByDateController,applyDiscountToOrderontroller , getOrderHistoryController , cancelOrderontroller,splitOrderontroller ,mergeOrderontroller ,moveOrderontroller,refundOrderontroller,createOrderController, getActiveOrderController, getCompletedOrderController, updateStatusOrderController, getBranchSalesController} from "../controller/orders.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { editDate } from "../service/order.service";

const route = Router()

route.post("/order", authenticateJWT, createOrderController)
route.put("/order", authenticateJWT, updateStatusOrderController)
route.get("/order/active", authenticateJWT,   getActiveOrderController)
route.get("/order/completed", authenticateJWT,   getCompletedOrderController)
route.get("/order/orderHistory", authenticateJWT,   getOrderHistoryController)
route.get("/order/orderHistory/:date", authenticateJWT,   getOrderHistoryByDateController)
route.patch("/order/refund", authenticateJWT,  refundOrderontroller )
route.put("/order/applyDiscount", authenticateJWT,  applyDiscountToOrderontroller )
route.put("/order/cancel/:id", authenticateJWT,  cancelOrderontroller )
route.put("/order/move", authenticateJWT,  moveOrderontroller )
route.put("/order/merge", authenticateJWT,  mergeOrderontroller )
route.put("/order/split", authenticateJWT,  splitOrderontroller )
route.get("/order/sales/:branch/:type", authenticateJWT,  getBranchSalesController) 
route.get("/order/report/:type", authenticateJWT, getTransactionReportController) 
route.post("/order/report",  authenticateJWT, getTransactionReportCustomDateController) 
route.put("/order/startTimer",  authenticateJWT, startTimerController) 

route.get("/order/editDate", async (request, response) => {
    await editDate()
    response.send("succes")
})


export default route