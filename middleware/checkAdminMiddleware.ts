import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { createErrorResponse } from "../services/createResponse";

import { Request, userTokenInterface } from "../types";

const checkAdminMiddleware = async (
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

      // verify JWT token
      const decodedToken = jwt.verify(
        encodedtoken,
        process.env.AUTH_ACCESS_TOKEN_SECRET_KEY
      ) as userTokenInterface;

      // If isAdmin is false or adminKey is not set
      if (
        !decodedToken.isAdmin ||
        !decodedToken.adminKey ||
        decodedToken.adminKey === null ||
        decodedToken.adminKey === undefined ||
        decodedToken.adminKey === ""
      )
        return createErrorResponse(res, 403, {}, "No Access for this Route");
      // If Everything okay...
      req.adminKey = decodedToken.adminKey;
      next();
      return;
    }
    createErrorResponse(res, 401, {}, "Unauthorized");
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};

export default checkAdminMiddleware;
