import { PrismaClient } from "@prisma/client";
import { GroceryDetails, RecordDetails, UserDetails } from "../../types";

const prisma = new PrismaClient();

const findRecordById = async <T extends RecordDetails>(
  searchId: string,
  modelName: string,
  requiredDetails?: boolean
): Promise<T> => {
  let details;
  switch (modelName) {
    case "groceryList":
      console.log(searchId);

      details = await prisma.groceryList.findUnique({
        where: { id: +searchId },
        select: {
          id: true,
          groceryName: true,
          groceryPrice: true,
          groceryType: true,
          groceryStockCount: true,
        },
      });
      console.log(details);

      break;
    case "user":
      details = await prisma.user.findUnique({
        where: { emailId: searchId },
        select: {
          id: true,
          username: true,
          emailId: true,
          password: true,
          isAdmin: true,
        },
      });

      break;
    case "user":
      details = await prisma.user.findUnique({
        where: { emailId: searchId },
        select: {
          id: true,
          username: true,
          emailId: true,
          password: true,
          adminKey: true,
          isAdmin: true,
        },
      });
      break;
    default:
      return false as T;
  }
  if (requiredDetails) {
    return details as T;
  }
  return details ? (true as T) : (false as T);
};

export { findRecordById };
