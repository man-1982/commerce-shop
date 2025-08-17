-- CreateTable
CREATE TABLE "public"."User" (
    "uid" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'autorised',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "mid" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "imageData" TEXT NOT NULL,
    "title" VARCHAR(64),
    "pid" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("mid")
);

-- CreateTable
CREATE TABLE "public"."Stock" (
    "sid" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "pid" INTEGER NOT NULL,
    "event" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "pid" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "title" VARCHAR(64) NOT NULL,
    "sku" VARCHAR(64) NOT NULL,
    "price" DECIMAL(8,2) NOT NULL,
    "description" VARCHAR(2048),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("pid")
);

-- CreateTable
CREATE TABLE "public"."Cart" (
    "cid" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "uid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "public"."CartItem" (
    "ci_id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "cartId" INTEGER NOT NULL,
    "pid" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(8,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("ci_id")
);

-- CreateTable
CREATE TABLE "public"."_CartToCartItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CartToCartItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "public"."User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_uid_status_idx" ON "public"."User"("uid", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Image_uuid_key" ON "public"."Image"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_uuid_key" ON "public"."Stock"("uuid");

-- CreateIndex
CREATE INDEX "Stock_sid_pid_event_idx" ON "public"."Stock"("sid", "pid", "event");

-- CreateIndex
CREATE UNIQUE INDEX "Product_uuid_key" ON "public"."Product"("uuid");

-- CreateIndex
CREATE INDEX "Product_pid_status_idx" ON "public"."Product"("pid", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_uuid_key" ON "public"."Cart"("uuid");

-- CreateIndex
CREATE INDEX "Cart_cid_status_uid_idx" ON "public"."Cart"("cid", "status", "uid");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_uuid_key" ON "public"."CartItem"("uuid");

-- CreateIndex
CREATE INDEX "CartItem_ci_id_pid_idx" ON "public"."CartItem"("ci_id", "pid");

-- CreateIndex
CREATE INDEX "_CartToCartItem_B_index" ON "public"."_CartToCartItem"("B");

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_pid_fkey" FOREIGN KEY ("pid") REFERENCES "public"."Product"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Stock" ADD CONSTRAINT "Stock_pid_fkey" FOREIGN KEY ("pid") REFERENCES "public"."Product"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_pid_fkey" FOREIGN KEY ("pid") REFERENCES "public"."Product"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CartToCartItem" ADD CONSTRAINT "_CartToCartItem_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Cart"("cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CartToCartItem" ADD CONSTRAINT "_CartToCartItem_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."CartItem"("ci_id") ON DELETE CASCADE ON UPDATE CASCADE;
