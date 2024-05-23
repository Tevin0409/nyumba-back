import { z } from "zod";

export const LeaseSchema = z.object({
  listingId: z.string().min(1, { message: "Listing ID is required" }),
  leaseInfo: z.object({
    endDate: z.string(),
    startDate: z.string(),
    propertyDetails: z.string(),
    leaseTerms: z.number().positive("Monthly price must be a positive number"),
  }),
});
