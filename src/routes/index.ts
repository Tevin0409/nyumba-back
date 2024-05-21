import { Router } from "express";
import authRoutes from "./auth";
import listingRoutes from "./listings";
// Combines all the routes into one large route file
const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/listings", listingRoutes);
export default rootRouter;
