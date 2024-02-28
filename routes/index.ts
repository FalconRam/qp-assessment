import express, { Request, Response } from "express";

import authRotues from "./Auth/index.ts";
import userRotues from "./User/index.ts";
import groceryRotues from "./Grocery/index.ts";
import { createErrorResponse } from "../services/createResponse/index.ts";

const router = express.Router();

router.use("/auth", authRotues);
router.use("/user", userRotues);
router.use("/grocery", groceryRotues);

router.use("*", (req: Request, res: Response) => {
  createErrorResponse(res, 404, {}, "Not Found");
});

export default router;
