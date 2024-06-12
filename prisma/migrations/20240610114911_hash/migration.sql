-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hash" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "hashedRt" TEXT DEFAULT '';
