/*
  Warnings:

  - You are about to drop the column `hasCompletedOnboarding` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `manageFor` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `useFor` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "hasCompletedOnboarding",
DROP COLUMN "manageFor",
DROP COLUMN "useFor";

-- AlterTable
ALTER TABLE "public"."Workspace" ADD COLUMN     "hasCompletedOnboarding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "manageFor" TEXT,
ADD COLUMN     "useFor" TEXT;
