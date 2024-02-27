import { NextFunction, Response } from "express";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../services/createResponse";

import { Request } from "../types";

export const checkAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization === process.env.ADMIN_SECRET
    ) {
      //   req.adminId = req.body.emailId;
      next();
      return;
    }
    createErrorResponse(res, 401, {}, "Unauthorized");
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};
