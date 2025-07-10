import { Router } from "express";
import authRoutes from "./auth.routes";
import branchRoutes from "./branch.route";
import ingredientsRoutes from "./ingredients.route";
import menuRoutes from "./menu.route";
import accountRoutes from "./account.route";
import orderRoutes from "./orders.route";   
import requestRoutes from "./request.route"

const routes = Router()

routes.use(authRoutes)
routes.use(branchRoutes)
routes.use(accountRoutes)
routes.use(ingredientsRoutes)
routes.use(menuRoutes)
routes.use(orderRoutes)
routes.use(requestRoutes)

export default routes