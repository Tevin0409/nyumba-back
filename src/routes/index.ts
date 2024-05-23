import { Router } from "express";
import authRoutes from "./auth";
import listingRoutes from "./listings";
import leasingRoutes from "./lease";
// Combines all the routes into one large route file
const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/listings", listingRoutes);
rootRouter.use("/leases", leasingRoutes);
export default rootRouter;
