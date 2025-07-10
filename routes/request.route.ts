import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import { createRequestController , getRequuestByBranchController} from "../controller/request.controller";

const route = Router()

route.post("/request", authenticateJWT, createRequestController)
route.get("/request/branch", authenticateJWT, getRequuestByBranchController)


export default route