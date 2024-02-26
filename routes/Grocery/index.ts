import express, { Request, Response } from "express";

import {
  groceryCreateController,
  groceryDeleteController,
  groceryDetailsController,
  groceryListController,
  groceryUpdateController,
} from "../../controllers/groceryController";

const router = express.Router();

router.patch("/", groceryUpdateController);

router.delete("/", groceryDeleteController);

router.get("/", groceryDetailsController);

router.get("/list", groceryListController);

router.post("/create-grocery", groceryCreateController);

export default router;
