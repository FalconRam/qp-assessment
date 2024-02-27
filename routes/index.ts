import express, { Request, Response } from "express";

import groceryRotues from "./Grocery/index.ts";
import userRotues from "./User/index.ts"
import { createErrorResponse } from "../services/createResponse/index.ts";

const router = express.Router();

router.use("/user", userRotues);

router.use("/grocery", groceryRotues);

router.use("*", (req: Request, res: Response) => {
  createErrorResponse(res, 404, {}, "Not Found");
});

export default router;
