import { Router } from "express";
import { getAccount , deleteAccount, updateRoleController} from "../controller/accounts.controller";
import { authenticateJWT } from "../middleware/auth.middleware";    

const route = Router()


route.get("/account", authenticateJWT, getAccount)
route.delete("/account/:id", authenticateJWT, deleteAccount)
route.patch("/account/role", authenticateJWT, updateRoleController)
    
export default route