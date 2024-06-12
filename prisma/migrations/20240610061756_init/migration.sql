-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'EMPLOYEE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "activationLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "birthday" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "title" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "CartProduct" (
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "WishlistProduct" (
    "wishlistId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT[],
    "sku" TEXT NOT NULL DEFAULT '',
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CupSize" (
    "id" SERIAL NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "CupSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnderbustSize" (
    "id" SERIAL NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "UnderbustSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClothingSize" (
    "id" SERIAL NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "ClothingSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariation" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProductVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInfo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToSubCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToUnderbustSize" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CupSizeToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ClothingSizeToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_phone_key" ON "Profile"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_refreshToken_key" ON "RefreshToken"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CartProduct_cartId_productId_key" ON "CartProduct"("cartId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_key" ON "Wishlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistProduct_wishlistId_productId_key" ON "WishlistProduct"("wishlistId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariation_id_key" ON "ProductVariation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductInfo_id_key" ON "ProductInfo"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductInfo_productId_key" ON "ProductInfo"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToSubCategory_AB_unique" ON "_ProductToSubCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToSubCategory_B_index" ON "_ProductToSubCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToUnderbustSize_AB_unique" ON "_ProductToUnderbustSize"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToUnderbustSize_B_index" ON "_ProductToUnderbustSize"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CupSizeToProduct_AB_unique" ON "_CupSizeToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CupSizeToProduct_B_index" ON "_CupSizeToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClothingSizeToProduct_AB_unique" ON "_ClothingSizeToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ClothingSizeToProduct_B_index" ON "_ClothingSizeToProduct"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProduct" ADD CONSTRAINT "CartProduct_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProduct" ADD CONSTRAINT "CartProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistProduct" ADD CONSTRAINT "WishlistProduct_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistProduct" ADD CONSTRAINT "WishlistProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariation" ADD CONSTRAINT "ProductVariation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInfo" ADD CONSTRAINT "ProductInfo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSubCategory" ADD CONSTRAINT "_ProductToSubCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSubCategory" ADD CONSTRAINT "_ProductToSubCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToUnderbustSize" ADD CONSTRAINT "_ProductToUnderbustSize_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToUnderbustSize" ADD CONSTRAINT "_ProductToUnderbustSize_B_fkey" FOREIGN KEY ("B") REFERENCES "UnderbustSize"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CupSizeToProduct" ADD CONSTRAINT "_CupSizeToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "CupSize"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CupSizeToProduct" ADD CONSTRAINT "_CupSizeToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClothingSizeToProduct" ADD CONSTRAINT "_ClothingSizeToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "ClothingSize"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClothingSizeToProduct" ADD CONSTRAINT "_ClothingSizeToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
