-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_pid_fkey";

-- CreateIndex
CREATE INDEX "Image_pid_idx" ON "public"."Image"("pid");

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_pid_fkey" FOREIGN KEY ("pid") REFERENCES "public"."Product"("pid") ON DELETE CASCADE ON UPDATE CASCADE;
