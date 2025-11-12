import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";    
import { getBranchShift,endShiftController , getBranchActivities ,getChangeController ,changeController,deleteBranch,createBranchController , getBranchController, getTablesController, updateTableController, getManagerDashboardController, getCashierDashboardController} from "../controller/branch.controller";


const route = Router()

route.post("/branch", authenticateJWT, createBranchController)
route.get("/branch", authenticateJWT, getBranchController)
route.get("/branch/activities", authenticateJWT, getBranchActivities)
route.delete("/branch/:branch", authenticateJWT, deleteBranch)
route.get("/branch/manager", authenticateJWT, getManagerDashboardController)
route.get("/branch/cashier/:date", authenticateJWT, getCashierDashboardController)
route.get("/branch/tables", authenticateJWT, getTablesController)
route.put("/branch/tables", authenticateJWT, updateTableController)
route.post("/branch/change", authenticateJWT, changeController)
route.patch("/branch/endShift", authenticateJWT, endShiftController)
route.get("/branch/change/:date", authenticateJWT, getChangeController)
route.get("/branch/shift", authenticateJWT, getBranchShift)    

export default route