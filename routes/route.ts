import { Router } from "express";
import authRoutes from "./auth.routes";
import branchRoutes from "./branch.route";

const routes = Router()

routes.use(authRoutes)
routes.use(branchRoutes)


export default routes