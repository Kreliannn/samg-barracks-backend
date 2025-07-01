import { Router } from "express";
import { getAccount } from "../controller/accounts.controller";
import { authenticateJWT } from "../middleware/auth.middleware";    

const route = Router()


route.get("/account", authenticateJWT, getAccount)


    
export default route