/*
  Warnings:

  - You are about to drop the column `attempts` on the `VerificationCode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."VerificationCode" DROP COLUMN "attempts";
