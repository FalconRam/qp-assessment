import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import {
  createErrorResponse,
  createSuccessResponse,
} from "../services/createResponse";
import { findRecordById } from "../services/HelperFunctions/findRecord";
import { createUUID } from "../services/HelperFunctions/createUUID";
import { GroceryDetails, OrderTransIDMappedItem, UserDetails } from "../types";

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
    const groceryList = await prisma.groceryList.findMany({
      select: {
        id: true,
        groceryName: true,
        groceryPrice: true,
        groceryType: true,
      },
    });

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

export const purchaseGroceryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactionId = await createUUID();
    const userDetails = await findRecordById<UserDetails>(
      req.emailId,
      "user",
      true
    );

    if (!userDetails)
      return createErrorResponse(res, 404, {}, "User not found");

    // Below fn will map each order with userId & TransactionId,
    // and add each grocery Price by Quantity, then calculates the total orders price
    let totalPurchaseAmount = 0;
    let transIdMappedPurchaseOrder: OrderTransIDMappedItem[] =
      req.body.purchaseOrder.map((order: OrderTransIDMappedItem) => {
        let groceryPriceByQuantity =
          Math.round(order.groceryPrice * order.purchaseQuantity * 100) / 100; // Round to two decimal places
        order = {
          ...order,
          transactionId,
          userId: userDetails.id,
          groceryPriceByQuantity,
        };

        totalPurchaseAmount =
          Math.round((totalPurchaseAmount + groceryPriceByQuantity) * 100) /
          100; // Round to two decimal places

        return order;
      });

    await prisma.groceryListBooked.createMany({
      data: transIdMappedPurchaseOrder,
      skipDuplicates: true,
    });

    const newGroceryList = await prisma.groceryListBooked.findMany({
      where: {
        transactionId: transactionId,
      },
      select: {
        groceryId: true,
        groceryName: true,
        groceryPrice: true,
        groceryType: true,
        purchaseQuantity: true,
        groceryPriceByQuantity: true,
      },
    });
    res.locals.groceryListBooked = {
      orderDetails: newGroceryList,
      transactionId,
      totalPurchaseAmount,
    };
    // return createSuccessResponse(
    //   res,
    //   200,
    //   {
    //     orderDetails: newGroceryList,
    //     transactionId,
    //     totalPurchaseAmount,
    //   },
    //   "Order Created"
    // );
    next();
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const reduceGroceries = async (req: Request, res: Response) => {
  try {
    await res.locals.groceryListBooked.orderDetails.map(
      async (orderDetails: OrderTransIDMappedItem) => {
        const existingGroceryDetails = await findRecordById<GroceryDetails>(
          orderDetails.groceryId.toString(),
          "groceryList",
          true
        );
        return await prisma.groceryList.update({
          where: {
            id: orderDetails.groceryId,
          },
          data: {
            groceryStockCount:
              existingGroceryDetails.groceryStockCount -
              orderDetails.purchaseQuantity,
          },
        });
      }
    );

    return createSuccessResponse(
      res,
      201,
      res.locals.groceryListBooked,
      "Order Created"
    );
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const confirmPurchaseGroceryController = async (
  req: Request,
  res: Response
) => {
  try {
    const { totalPurchaseAmount, transactionId } = req.body;
    const pendingOrderDetails = await prisma.groceryListBooked.findMany({
      where: {
        transactionId: transactionId,
      },
    });
    const confirmedOrders = await Promise.all(
      pendingOrderDetails.map(async (orderdetails) => {
        return await prisma.groceryListBooked.update({
          where: {
            id: orderdetails.id,
          },
          data: {
            isPurchaseConfirmed: true,
            transactionStatus: "Captured",
          },
          select: {
            id: true,
            groceryId: true,
            groceryName: true,
            groceryPrice: true,
            groceryType: true,
            purchaseQuantity: true,
            groceryPriceByQuantity: true,
            isPurchaseConfirmed: true,
            transactionStatus: true,
            userId: true,
          },
        });
      })
    );

    const transactionHistory = await prisma.transactionHistory.create({
      data: {
        transactionId: transactionId,
        totalAmount: totalPurchaseAmount,
        transactionStatus: "Captured",
        userId: confirmedOrders[0].userId,
      },
      select: {
        id: true,
        transactionId: true,
        transactionStatus: true,
        totalAmount: true,
      },
    });

    return createSuccessResponse(
      res,
      200,
      {
        confirmedOrders,
        transactionDetails: transactionHistory,
      },
      "Order Purchased"
    );
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const updatePaymentController = async (req: Request, res: Response) => {
  try {
    createSuccessResponse(res, 200, {}, "Payment Updated");
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const getAllGroceriesControllers = async (
  req: Request,
  res: Response
) => {
  try {
    const groceries = await prisma.groceryList.findMany();
    createSuccessResponse(res, 200, { groceries }, "Orders Retrieved");
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const getAllOrdersControllers = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.groceryListBooked.findMany();
    createSuccessResponse(res, 200, { orders }, "Orders Retrieved");
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export const getAllTransactionsController = async (
  req: Request,
  res: Response
) => {
  try {
    const transactions = await prisma.transactionHistory.findMany();
    createSuccessResponse(res, 200, { transactions }, "Transactions Retrieved");
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

// For Development purpose
// export const deleteController = async (req: Request, res: Response) => {
//   try {
//     // await prisma.groceryListBooked.deleteMany();
//     createSuccessResponse(res, 200, {}, "All groceries deleted");
//   } catch (error: any) {
//     createErrorResponse(res, 500, {}, "Deleted");
//   }
// };

// // For Development purpose
// export const insertManyController = async (req: Request, res: Response) => {
//   try {
//     // const result = await prisma.groceryList.createMany({
//     //   data: req.body.groceryList,
//     // });
//     createSuccessResponse(res, 200, {}, "Groceries Inserted");
//   } catch (error: any) {
//     createErrorResponse(res, 500, {}, "Deleted");
//   }
// };
