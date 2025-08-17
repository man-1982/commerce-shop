/*
  Warnings:

  - You are about to drop the column `cartId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the `_CartToCartItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cid,pid]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cid` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_CartToCartItem" DROP CONSTRAINT "_CartToCartItem_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CartToCartItem" DROP CONSTRAINT "_CartToCartItem_B_fkey";

-- AlterTable
ALTER TABLE "public"."CartItem" DROP COLUMN "cartId",
ADD COLUMN     "cid" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."_CartToCartItem";

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cid_pid_key" ON "public"."CartItem"("cid", "pid");

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_cid_fkey" FOREIGN KEY ("cid") REFERENCES "public"."Cart"("cid") ON DELETE CASCADE ON UPDATE CASCADE;
