import { Router } from "express";
import { errorHandler } from "../error-handler";
import {
  createLease,
  deleteLease,
  fetchAllLeases,
  fetchLeaseById,
  fetchLeasesByUser,
} from "../controllers/lease";
import authMiddleware from "../middlewares/auth";

const leasingRoutes: Router = Router();

leasingRoutes.post(
  "/create-lease",
  [authMiddleware],
  errorHandler(createLease)
);
leasingRoutes.get(
  "/fetch-my-leases",
  [authMiddleware],
  errorHandler(fetchAllLeases)
);
leasingRoutes.get(
  "/fetch-lease/user/",
  [authMiddleware],
  errorHandler(fetchLeasesByUser)
);
leasingRoutes.get("/fetch-lease/:id", fetchLeaseById);
// leasingRoutes.put(
//   "/update-lease/:id",
//   [authMiddleware],
//   errorHandler(editListing)
// );
leasingRoutes.delete(
  "/delete-lease/:id",
  [authMiddleware],
  errorHandler(deleteLease)
);
export default leasingRoutes;
