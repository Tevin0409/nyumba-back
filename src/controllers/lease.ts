import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../db/prisma";
import { LeaseSchema } from "../schemas/lease";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";

export const createLease = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate the incoming lease data
  LeaseSchema.parse(req.body);
  const user = req.user!;
  const { listingId } = req.body;

  // Check if the user already has an active lease
  const existingLease = await prismaClient.lease.findFirst({
    where: { userId: user.id },
  });

  if (existingLease) {
    return next(
      new BadRequestsException(
        "You already have an active lease.",
        ErrorCode.USER_HAS_EXISTING_LEASE
      )
    );
  }

  // Check if the user is trying to lease their own property
  const listing = await prismaClient.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    return next(
      new BadRequestsException("Listing not found", ErrorCode.LISTING_NOT_FOUND)
    );
  }

  if (listing.listingCreatedById === user.id) {
    return next(
      new BadRequestsException(
        "You cannot lease your own property.",
        ErrorCode.CANNOT_CREATE_LEASE
      )
    );
  }

  // Create the lease
  const lease = await prismaClient.lease.create({
    data: {
      userId: user.id,
      ...req.body,
    },
  });

  res.json(lease);
};

export const fetchAllLeases = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;

    // Fetch leases of properties belonging to the logged-in user
    const leases = await prismaClient.lease.findMany({
      where: {
        listing: {
          listingCreatedById: user.id,
        },
      },
      include: {
        listing: true,
        user: true,
      },
    });

    res.json(leases);
  } catch (error) {
    next(error);
  }
};

export const fetchLeaseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const leaseId = req.params.id;

    const lease = await prismaClient.lease.findUnique({
      where: { id: leaseId },
      include: {
        listing: true,
        user: true,
      },
    });

    if (!lease) {
      return res.status(404).json({ message: "Lease not found" });
    }

    res.json(lease);
  } catch (error) {
    next(error);
  }
};

export const deleteLease = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const leaseId = req.params.id;
    const user = req.user!;

    const lease = await prismaClient.lease.findUnique({
      where: { id: leaseId },
    });

    if (!lease) {
      return res.status(404).json({ message: "Lease not found" });
    }

    if (lease.userId !== user.id) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this lease" });
    }

    await prismaClient.lease.delete({
      where: { id: leaseId },
    });

    res.json({ message: "Lease deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const fetchLeasesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;

    const leases = await prismaClient.lease.findMany({
      where: {
        userId: user.id,
      },
      include: {
        listing: true,
      },
    });

    res.json(leases);
  } catch (error) {
    next(error);
  }
};
