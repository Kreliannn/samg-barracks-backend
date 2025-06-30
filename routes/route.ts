import { Router } from "express";
import authRoutes from "./auth.routes";
import branchRoutes from "./branch.route";
import ingredientsRoutes from "./ingredients.route";

const routes = Router()

routes.use(authRoutes)
routes.use(branchRoutes)
routes.use(ingredientsRoutes)

export default routes