import express, { Request, Response } from "express";

import {
  listGroceriesController,
  groceryDetailsController,
  updateGroceryController,
  deleteGroceryController,
  createGroceryController,
} from "../../controllers/groceryController";
import checkAdminMiddleware from "../../middleware/checkAdminMiddleware";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

/* User Routes */
router.use(authMiddleware);

router.get("/list", listGroceriesController);

router.get("/", groceryDetailsController);

/* Admin Only Routes */

router.patch("/", checkAdminMiddleware, updateGroceryController);

router.delete("/", checkAdminMiddleware, deleteGroceryController);

router.post("/create-grocery", checkAdminMiddleware, createGroceryController);

export default router;
