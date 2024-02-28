import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { createErrorResponse } from "../services/createResponse";

import { Request, userTokenInterface } from "../types";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!process.env.AUTH_ACCESS_TOKEN_SECRET_KEY)
      throw new Error("Access token secret key is not defined");
    if (
      req.headers.authorization &&
      req.headers.authorization.includes("Bearer ")
    ) {
      const encodedtoken = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(
        encodedtoken,
        process.env.AUTH_ACCESS_TOKEN_SECRET_KEY
      ) as userTokenInterface;

      req.emailId = decodedToken.emailId;
      req.isAdmin = decodedToken.isAdmin;

      next();
      return;
    }
    createErrorResponse(res, 401, {}, "Unauthorized");
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export default authMiddleware;
