/*
  Warnings:

  - Added the required column `groceryPriceByQuantity` to the `GroceryListBooked` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroceryListBooked" ADD COLUMN     "groceryPriceByQuantity" DECIMAL(8,2) NOT NULL;
