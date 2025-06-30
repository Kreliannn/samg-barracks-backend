import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";    
import { createBranchController } from "../controller/branch.controller";

const route = Router()

route.post("/branch", authenticateJWT, createBranchController)


    
export default route