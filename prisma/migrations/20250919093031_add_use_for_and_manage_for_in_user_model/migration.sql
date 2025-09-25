-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "hasCompletedOnboarding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "manageFor" TEXT,
ADD COLUMN     "useFor" TEXT;
