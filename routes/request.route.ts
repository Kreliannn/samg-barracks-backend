import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import { createRequestController } from "../controller/request.controller";

const route = Router()

route.post("/request", authenticateJWT, createRequestController)



export default route