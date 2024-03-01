/*
  Warnings:

  - You are about to drop the column `groceryQuantity` on the `GroceryListBooked` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GroceryListBooked" DROP COLUMN "groceryQuantity",
ADD COLUMN     "purchaseQuantity" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "isPurchaseConfirmed" SET DEFAULT false,
ALTER COLUMN "transactionStatus" SET DEFAULT 'Approved';
