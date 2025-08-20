/*
  Warnings:

  - Added the required column `price` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Cart" ADD COLUMN     "amount" DECIMAL(8,2) NOT NULL DEFAULT 0,
ADD COLUMN     "price" DECIMAL(8,2) NOT NULL;
