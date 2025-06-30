import { Router } from "express";
import { registerController, loginController, testJwt } from "../controller/auth.controller";
import { authenticateJWT } from "../middleware/auth.middleware";    

const route = Router()

route.post("/register", registerController)
route.post("/login", loginController)
route.get("/jwt", authenticateJWT, testJwt)


    
export default route