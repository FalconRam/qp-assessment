import express, { Request, Response } from "express";

import {
  listGroceriesController,
  groceryDetailsController,
  updateGroceryController,
  deleteGroceryController,
  createGroceryController,
} from "../../controllers/groceryController";
import { checkAdminMiddleware } from "../../middleware/checkAdminMiddleware";

const router = express.Router();

/* Public Routes */

router.get("/list", listGroceriesController);

router.get("/", groceryDetailsController);

/* Admin Only Routes */

router.use(checkAdminMiddleware); // Validates Is Admin

router.patch("/", updateGroceryController);

router.delete("/", deleteGroceryController);

router.post("/create-grocery", createGroceryController);

export default router;
