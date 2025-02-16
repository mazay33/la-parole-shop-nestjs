-- AlterTable
ALTER TABLE "products" ADD COLUMN     "isBestseller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT false;
