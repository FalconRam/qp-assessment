/*
  Warnings:

  - You are about to alter the column `purchaseQuantity` on the `GroceryListBooked` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(8,2)`.

*/
-- AlterTable
ALTER TABLE "GroceryListBooked" ALTER COLUMN "purchaseQuantity" DROP DEFAULT,
ALTER COLUMN "purchaseQuantity" SET DATA TYPE DECIMAL(8,2);
