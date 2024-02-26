/*
  Warnings:

  - You are about to drop the column `groceryStockCount` on the `GroceryListBooked` table. All the data in the column will be lost.
  - Added the required column `transactionId` to the `GroceryListBooked` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroceryListBooked" DROP COLUMN "groceryStockCount",
ADD COLUMN     "groceryQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "transactionId" INTEGER NOT NULL;
