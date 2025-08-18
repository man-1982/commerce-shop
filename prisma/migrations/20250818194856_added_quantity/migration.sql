/*
  Warnings:

  - You are about to drop the `Stock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Stock" DROP CONSTRAINT "Stock_pid_fkey";

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "public"."Stock";

-- Add check constraint to the Product table
ALTER TABLE "Product" ADD CONSTRAINT "Product_quantity_check" CHECK ("quantity" >= 0);
