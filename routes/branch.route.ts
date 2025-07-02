import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";    
import { createBranchController , getBranchController} from "../controller/branch.controller";

const route = Router()

route.post("/branch", authenticateJWT, createBranchController)
route.get("/branch", authenticateJWT, getBranchController)

    
export default route