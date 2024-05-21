import { z } from "zod";
export const ListingSchema = z.object({
  locationType: z.string(),
  placeType: z.string(),
  mapData: z.object({ longitude: z.number(), latitude: z.number() }),
  placeAmenities: z.array(z.string()),
  placeSpace: z.object({
    bathroom: z.number().min(1),
    beds: z.number().min(1),
    guests: z.number().min(1),
  }),
  photos: z.array(z.string()),
  description: z.string(),
  title: z.string(),
  titleDeed: z.string(),
  price: z.number(),
  location: z.object({
    country: z.string(),
    district: z.string(),
    landmark: z.string(),
    locality: z.string(),
    neighborhood: z.string(),
    place: z.string(),
    postcode: z.string(),
    region: z.string(),
  }),
});
