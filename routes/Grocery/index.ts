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
  reduceGroceries,
  getAllTransactionsController,
  getAllOrdersControllers,
  getAllGroceriesControllers,
} from "../../controllers/groceryController";
import checkAdminMiddleware from "../../middleware/checkAdminMiddleware";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

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
// Can be acheived, if Payment gateway intergrated
router.post("/updatePayment", updatePaymentController);

/* Admin Only Routes */

router.use(checkAdminMiddleware);

router.patch("/", updateGroceryController);

router.delete("/", deleteGroceryController);

router.post("/create-grocery", createGroceryController);

router.get("/getAll-groceries", getAllGroceriesControllers);

router.get("/getAll-orders", getAllOrdersControllers);

router.get("/getAll-transactions", getAllTransactionsController);

// router.delete("/deleteAll", deleteController); // For Development purpose

// router.post("/insert-grocery", insertManyController); // For Development purpose

export default router;
