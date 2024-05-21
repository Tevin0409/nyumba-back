/*
  Warnings:

  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `county` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postalCode` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `identificationNumber` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "county" SET NOT NULL,
ALTER COLUMN "postalCode" SET NOT NULL,
ALTER COLUMN "identificationNumber" SET NOT NULL;
