/*
  Warnings:

  - You are about to alter the column `groceryStockCount` on the `GroceryList` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(8,2)`.

*/
-- AlterTable
ALTER TABLE "GroceryList" ALTER COLUMN "groceryStockCount" SET DEFAULT 0.00,
ALTER COLUMN "groceryStockCount" SET DATA TYPE DECIMAL(8,2);
