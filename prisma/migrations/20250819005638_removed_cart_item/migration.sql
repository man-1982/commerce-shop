/*
  Warnings:

  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uid]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pid` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."CartItem" DROP CONSTRAINT "CartItem_cid_fkey";

-- DropForeignKey
ALTER TABLE "public"."CartItem" DROP CONSTRAINT "CartItem_pid_fkey";

-- AlterTable
ALTER TABLE "public"."Cart" ADD COLUMN     "pid" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "public"."CartItem";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_uid_key" ON "public"."Cart"("uid");

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_pid_fkey" FOREIGN KEY ("pid") REFERENCES "public"."Product"("pid") ON DELETE CASCADE ON UPDATE CASCADE;
