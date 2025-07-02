import { Router } from "express";
import { registerController, loginController } from "../controller/auth.controller";
import { authenticateJWT } from "../middleware/auth.middleware";    

const route = Router()

route.post("/register", registerController)
route.post("/login", loginController)



    
export default route