/*
  Warnings:

  - You are about to alter the column `groceryPrice` on the `GroceryList` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(8,2)`.
  - You are about to alter the column `groceryPrice` on the `GroceryListBooked` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(8,2)`.

*/
-- AlterTable
ALTER TABLE "GroceryList" ALTER COLUMN "groceryPrice" SET DATA TYPE DECIMAL(8,2);

-- AlterTable
ALTER TABLE "GroceryListBooked" ALTER COLUMN "groceryPrice" SET DATA TYPE DECIMAL(8,2);

-- AlterTable
ALTER TABLE "TransactionHistory" ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(16,2);
