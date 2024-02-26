/*
  Warnings:

  - Changed the type of `groceryPrice` on the `GroceryList` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `groceryPrice` on the `GroceryListBooked` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "GroceryList" DROP COLUMN "groceryPrice",
ADD COLUMN     "groceryPrice" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GroceryListBooked" DROP COLUMN "groceryPrice",
ADD COLUMN     "groceryPrice" INTEGER NOT NULL;
