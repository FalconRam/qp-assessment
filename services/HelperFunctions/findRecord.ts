import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const findRecordById = async (searchId: number, requiredDetails?: boolean) => {
  const details = await prisma.groceryList.findUnique({
    where: { id: searchId },
  });
  if (requiredDetails) {
    return details;
  }
  return !details ? false : true;
};

export { findRecordById };
