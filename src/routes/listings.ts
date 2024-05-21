import { Router } from "express";
import { errorHandler } from "../error-handler";
import {
  createListing,
  deleteListing,
  editListing,
  fetchAllListings,
  fetchListingById,
  fetchUserListings,
} from "../controllers/listings";
import authMiddleware from "../middlewares/auth";

const listingRoutes: Router = Router();

listingRoutes.post(
  "/create-listing",
  [authMiddleware],
  errorHandler(createListing)
);
listingRoutes.get("/fetch-listings", errorHandler(fetchAllListings));
listingRoutes.get(
  "/fetch-listings/user/",
  [authMiddleware],
  errorHandler(fetchUserListings)
);
listingRoutes.get("/fetch-listing/:id", fetchListingById);
listingRoutes.put(
  "/update-listing/:id",
  [authMiddleware],
  errorHandler(editListing)
);
listingRoutes.delete(
  "/delete-listing/:id",
  [authMiddleware],
  errorHandler(deleteListing)
);
export default listingRoutes;
