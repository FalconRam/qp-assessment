import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  createErrorResponse,
  createSuccessResponse,
} from "../services/createResponse";
import { findRecordById } from "../services/HelperFunctions/findRecord";
import { UserDetails } from "../types";
import { signAccessToken } from "../services/HelperFunctions/jwtService";

const prisma = new PrismaClient();

export const loginController = async (req: Request, res: Response) => {
  try {
    const { password, adminKey } = req.body;
    if (!req.body.emailId || !password)
      return createErrorResponse(
        res,
        400,
        {},
        "Request format received is incorrect"
      );

    const userDetails = await findRecordById<UserDetails>(
      req.body.emailId,
      "user",
      true
    );

    if (!userDetails)
      return createErrorResponse(res, 404, {}, "User not found");

    const isMatch = await bcrypt.compare(password, userDetails.password);
    if (!isMatch) return createErrorResponse(res, 404, {}, "Invalid password");

    const accessToken = await signAccessToken(
      req,
      adminKey ? true : false,
      adminKey
    );
    const { id, emailId, username, isAdmin } = userDetails;
    return createSuccessResponse(
      res,
      200,
      {
        id,
        username,
        emailId,
        isAdmin,
        accessToken,
      },
      "Login successful"
    );
  } catch (error: any) {
    createErrorResponse(res, 500, {}, error.message || error.stack || error);
  }
};
