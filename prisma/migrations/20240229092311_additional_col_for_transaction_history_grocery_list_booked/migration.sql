/*
  Warnings:

  - Added the required column `isPurchaseConfirmed` to the `GroceryListBooked` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionStatus` to the `GroceryListBooked` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionStatus` to the `TransactionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroceryListBooked" ADD COLUMN     "isPurchaseConfirmed" BOOLEAN NOT NULL,
ADD COLUMN     "transactionStatus" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TransactionHistory" ADD COLUMN     "transactionStatus" TEXT NOT NULL;
