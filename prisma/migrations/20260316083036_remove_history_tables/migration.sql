/*
  Warnings:

  - You are about to drop the `locationHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visitHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "locationHistory" DROP CONSTRAINT "locationHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "visitHistory" DROP CONSTRAINT "visitHistory_clientId_fkey";

-- DropForeignKey
ALTER TABLE "visitHistory" DROP CONSTRAINT "visitHistory_userId_fkey";

-- DropTable
DROP TABLE "locationHistory";

-- DropTable
DROP TABLE "visitHistory";
