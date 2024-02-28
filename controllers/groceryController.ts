import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import {
  createErrorResponse,
  createSuccessResponse,
} from "../services/createResponse";
import { findRecordById } from "../services/HelperFunctions/findRecord";

const prisma = new PrismaClient();

export const createGroceryController = async (req: Request, res: Response) => {
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
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const updateGroceryController = async (req: Request, res: Response) => {
  const updateFields = req.body;
  const { groceryId } = req.query;
  try {
    // Check if groceryId is a string
    if (typeof groceryId !== "string") {
      return createErrorResponse(res, 400, {}, "Invalid groceryId");
    }
    const parsedGroceryId = parseInt(groceryId);

    const isExist = await findRecordById(groceryId, "groceryList", false);

    if (!isExist) return createErrorResponse(res, 400, {}, "Invalid groceryId");

    const newgrocery = await prisma.groceryList.update({
      where: {
        id: parsedGroceryId,
      },
      data: updateFields,
    });

    createSuccessResponse(res, 200, newgrocery, "Grocery Updated");
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const deleteGroceryController = async (req: Request, res: Response) => {
  const { groceryId } = req.query;
  try {
    // Check if groceryId is a string
    if (typeof groceryId !== "string") {
      return createErrorResponse(res, 400, {}, "Invalid groceryId");
    }
    const parsedGroceryId = parseInt(groceryId);

    const isExist = await findRecordById(groceryId, "groceryList", false);

    if (!isExist) return createErrorResponse(res, 400, {}, "Invalid groceryId");

    await prisma.groceryList.delete({
      where: {
        id: parsedGroceryId,
      },
    });

    return createSuccessResponse(res, 200, {}, "Grocery deleted");
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const listGroceriesController = async (req: Request, res: Response) => {
  try {
    const groceryList = await prisma.groceryList.findMany();

    createSuccessResponse(
      res,
      200,
      { groceryList: groceryList },
      "Groceries list Retrieved"
    );
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const groceryDetailsController = async (req: Request, res: Response) => {
  const { groceryId } = req.query;
  try {
    // Check if groceryId is a string
    if (typeof groceryId !== "string") {
      return createErrorResponse(res, 400, {}, "Invalid groceryId");
    }
    // const parsedGroceryId = parseInt(groceryId);

    const grocery = await findRecordById(groceryId, "groceryList", true);

    return createSuccessResponse(res, 200, { groceryDetails: grocery }, "");
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};
