import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../db/prisma";
import { User } from "@prisma/client";
import { ListingSchema } from "../schemas/listings";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { NotFoundException } from "../exceptions/not-found";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const createListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  ListingSchema.parse(req.body);
  const user = req.user!;
  const { title } = req.body;

  let listing = await prismaClient.listing.findFirst({
    where: { title: title },
  });

  if (listing) {
    next(
      new BadRequestsException(
        "House with the same name already exists",
        ErrorCode.LISTING_ALREADY_EXISTS
      )
    );
  } else {
    listing = await prismaClient.listing.create({
      data: {
        listingCreatedById: user.id,
        ...req.body,
      },
    });

    res.json(listing);
  }
};

export const fetchAllListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listings = await prismaClient.listing.findMany();
    res.json(listings);
  } catch (error) {
    next(error);
  }
};

// Fetch Listing by ID Function
export const fetchListingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listingId = req.params.id;
  console.log("FETCHIN");

  const listing = await prismaClient.listing.findUnique({
    where: { id: listingId },
    include: {
      listingCreatedBy: true, // Include the user who created the listing
      leases: true, // Include related leases
    },
  });

  if (!listing) {
    next(
      new NotFoundException(
        "listing does not exist",
        ErrorCode.LISTING_NOT_FOUND
      )
    );
  } else {
    const ownerInfo = {
      email: listing.listingCreatedBy.email,
      firstName: listing.listingCreatedBy.firstName,
      lastName: listing.listingCreatedBy.lastName,
    };
    const leasingStatus = listing.leases.length > 0 ? "Leased" : "Available";
    const propertyInfo = {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      locationType: listing.locationType,
      placeType: listing.placeType,
      mapData: listing.mapData,
      placeAmenities: listing.placeAmenities,
      placeSpace: listing.placeSpace,
      photos: listing.photos,
      titleDeed: listing.titleDeed,
      location: listing.location,
    };
    res.json({
      ownerInfo,
      leasingStatus,
      propertyInfo,
    });
  }
};

export const fetchUserListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;

    const listings = await prismaClient.listing.findMany({
      where: { listingCreatedById: user.id },
    });

    if (!listings.length) {
      next(
        new NotFoundException(
          "No listings found for this user",
          ErrorCode.USER_DOESNT_HAVE_LISTINGS
        )
      );
    }

    res.json(listings);
  } catch (error) {
    next(error);
  }
};

// Edit Listing Function
export const editListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.id;
    const user = req.user!;
    ListingSchema.parse(req.body);

    const listing = await prismaClient.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      next(
        new NotFoundException(
          "No listings found for this user",
          ErrorCode.USER_DOESNT_HAVE_LISTINGS
        )
      );
    }

    if (listing!.listingCreatedById !== user.id) {
      next(
        new UnauthorizedException(
          "You do not have permission to perform this action",
          ErrorCode.UNAUTHORIZED
        )
      );
    }
    const leaseCount = await prismaClient.lease.count({
      where: { listingId: listingId },
    });

    if (leaseCount > 0) {
      next(
        new BadRequestsException(
          "Cannot update listing  tied to a lease",
          ErrorCode.LISTING_IS_LOCKED
        )
      );
    }

    const updatedListing = await prismaClient.listing.update({
      where: { id: listingId },
      data: { ...req.body },
    });

    res.json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// Delete Listing Function
export const deleteListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.id;
    const user = req.user!;

    const listing = await prismaClient.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      next(
        new NotFoundException(
          "No listings found for this user",
          ErrorCode.USER_DOESNT_HAVE_LISTINGS
        )
      );
    }

    if (listing!.listingCreatedById !== user.id) {
      next(
        new UnauthorizedException(
          "You do not have permission to perform this action",
          ErrorCode.UNAUTHORIZED
        )
      );
    }

    const leaseCount = await prismaClient.lease.count({
      where: { listingId: listingId },
    });

    if (leaseCount > 0) {
      next(
        new BadRequestsException(
          "Cannot delete listing tied to a lease",
          ErrorCode.LISTING_IS_LOCKED
        )
      );
    }

    await prismaClient.listing.delete({
      where: { id: listingId },
    });

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};
