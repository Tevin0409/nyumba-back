import { z } from "zod";

export const LeaseSchema = z.object({
  listingId: z.string().min(1, { message: "Listing ID is required" }),
  leaseInfo: z.object({
    duration: z.string().min(1, { message: "Duration is required" }),
    monthlyPrice: z
      .number()
      .positive("Monthly price must be a positive number"),
  }),
});
