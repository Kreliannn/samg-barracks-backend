import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";    
import { createBranchController , getBranchController, getTablesController, updateTableController, getManagerDashboardController, getCashierDashboardController} from "../controller/branch.controller";


const route = Router()

route.post("/branch", authenticateJWT, createBranchController)
route.get("/branch", authenticateJWT, getBranchController)
route.get("/branch/manager", authenticateJWT, getManagerDashboardController)
route.get("/branch/cashier", authenticateJWT, getCashierDashboardController)
route.get("/branch/tables", authenticateJWT, getTablesController)
route.put("/branch/tables", authenticateJWT, updateTableController)
        
export default route