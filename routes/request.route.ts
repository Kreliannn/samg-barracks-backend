import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import { createRequestController , getRequuestByBranchController, updateReqeustStatusController, CompletedReqeustStatusController} from "../controller/request.controller";

const route = Router()

route.post("/request", authenticateJWT, createRequestController)
route.get("/request/branch", authenticateJWT, getRequuestByBranchController)
route.patch("/request/status", authenticateJWT, updateReqeustStatusController)
route.patch("/request/completed", authenticateJWT, CompletedReqeustStatusController)

export default route