import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import {
  createErrorResponse,
  createSuccessResponse,
} from "../services/createResponse";

const prisma = new PrismaClient();

export const groceryCreateController = async (req: Request, res: Response) => {
  const { groceryName, groceryPrice, groceryType, groceryStockCount } =
    req.body;
  try {
    const newgrocery = await prisma.groceryList.create({
      data: {
        groceryName: groceryName,
        groceryPrice: groceryPrice,
        groceryType: groceryType,
        groceryStockCount: groceryStockCount,
      },
    });

    createSuccessResponse(res, 201, newgrocery, "Grocery created");
  } catch (error: any) {
    createSuccessResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const groceryUpdateController = async (req: Request, res: Response) => {
  const updateFields = req.body;
  const { groceryId } = req.query;
  try {
    // Check if groceryId is a string
    if (typeof groceryId !== "string") {
      return createErrorResponse(res, 400, {}, "Invalid groceryId");
    }
    const parsedGroceryId = parseInt(groceryId);
    const newgrocery = await prisma.groceryList.update({
      where: {
        id: parsedGroceryId,
      },
      data: updateFields,
    });

    createSuccessResponse(res, 200, newgrocery, "Grocery created");
  } catch (error: any) {
    createSuccessResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const groceryDeleteController = async (req: Request, res: Response) => {
  const { groceryId } = req.query;
  try {
    // Check if groceryId is a string
    if (typeof groceryId !== "string") {
      return createErrorResponse(res, 400, {}, "Invalid groceryId");
    }
    const parsedGroceryId = parseInt(groceryId);
    await prisma.groceryList.delete({
      where: {
        id: parsedGroceryId,
      },
    });
    return createSuccessResponse(res, 200, {}, "Grocery deleted");
  } catch (error: any) {
    createSuccessResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const groceryListController = async (req: Request, res: Response) => {
  try {
    const groceryList = await prisma.groceryList.findMany();

    createSuccessResponse(
      res,
      200,
      { groceryList: groceryList },
      "On List Route"
    );
  } catch (error: any) {
    createSuccessResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const groceryDetailsController = async (req: Request, res: Response) => {
  const { groceryId } = req.query;
  try {
    // Check if groceryId is a string
    if (typeof groceryId !== "string") {
      return createErrorResponse(res, 400, {}, "Invalid groceryId");
    }
    const parsedGroceryId = parseInt(groceryId);
    const grocery = await prisma.groceryList.findUnique({
      where: {
        id: parsedGroceryId,
      },
    });
    return createSuccessResponse(
      res,
      200,
      { groceryDetails: grocery },
      "Grocery deleted"
    );
  } catch (error: any) {
    createSuccessResponse(res, 500, {}, error.message || error.stack || error);
  }
};
