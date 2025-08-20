/*
  Warnings:

  - A unique constraint covering the columns `[uid,pid]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Cart_uid_key";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_uid_pid_key" ON "public"."Cart"("uid", "pid");
