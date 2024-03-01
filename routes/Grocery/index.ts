import express, { Request, Response } from "express";

import {
  listGroceriesController,
  groceryDetailsController,
  updateGroceryController,
  deleteGroceryController,
  createGroceryController,
  purchaseGroceryController,
  confirmPurchaseGroceryController,
  updatePaymentController,
  deleteController,
  insertManyController,
  reduceGroceries,
} from "../../controllers/groceryController";
import checkAdminMiddleware from "../../middleware/checkAdminMiddleware";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

// router.delete("/deleteAll", deleteController); // For testing purposes, to be removed
// router.post("/insert-grocery", insertManyController); // For testing purposes, to be removed

/* User Routes */

router.use(authMiddleware);

router.get("/list", listGroceriesController);

router.get("/", groceryDetailsController);

// Purchase Controller is to create a purchase order
// and returns the order with transactionId
// Post controller, reduce the groceries quantity by previous purchase order
router.post("/purchase-grocery", purchaseGroceryController, reduceGroceries);

// Confirms the Payment and Initiate the Payment
router.post("/confirm-purchaseGrocery", confirmPurchaseGroceryController);

// Based on Payment Status update Payment status of Grocery Booked list
// and create the Transaction Record
router.post("/updatePayment", updatePaymentController); // Can be acheived, if Payment gateway intergrated

/* Admin Only Routes */

router.patch("/", checkAdminMiddleware, updateGroceryController);

router.delete("/", checkAdminMiddleware, deleteGroceryController);

router.post("/create-grocery", checkAdminMiddleware, createGroceryController);

export default router;
