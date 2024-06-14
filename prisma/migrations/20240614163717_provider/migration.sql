-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'YANDEX');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "Provider";
