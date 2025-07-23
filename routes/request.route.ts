import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import { getRequuestByIdController ,createRequestController , getRequuestByBranchController, updateReqeustStatusController, CompletedReqeustStatusController} from "../controller/request.controller";

const route = Router()

route.post("/request", authenticateJWT, createRequestController)
route.get("/request/branch", authenticateJWT, getRequuestByBranchController)
route.post("/request/one", authenticateJWT, getRequuestByIdController)
route.patch("/request/status", authenticateJWT, updateReqeustStatusController)
route.patch("/request/completed", authenticateJWT, CompletedReqeustStatusController)

export default route