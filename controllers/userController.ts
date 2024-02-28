import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import {
  createErrorResponse,
  createSuccessResponse,
} from "../services/createResponse";
import { PrismaClient } from "@prisma/client";
import { signAccessToken } from "../services/HelperFunctions/jwtService";

const prisma = new PrismaClient();

export const createUserController = async (req: Request, res: Response) => {
  const { username, emailId, password, adminKey } = req.body;
  try {
    let hashedPassword, hashedAdminSecret;
    if (!adminKey) {
      // Public User Logic
      if (!username || !emailId || password.length < 6) {
        return createErrorResponse(
          res,
          400,
          {},
          "Request format received is incorrect"
        );
      }
      hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await prisma.user.create({
        data: {
          username,
          emailId,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          emailId: true,
        },
      });
      const accessToken = await signAccessToken(req, false);
      return createSuccessResponse(
        res,
        201,
        { ...newUser, accessToken },
        "User Created"
      );
    } else if (typeof adminKey === "string" && adminKey.length === 12) {
      // Admin Logic
      hashedPassword = await bcrypt.hash(password, 12);
      hashedAdminSecret = await bcrypt.hash(adminKey, 12);
      const newAdmin = await prisma.user.create({
        data: {
          username,
          emailId,
          isAdmin: true,
          password: hashedPassword,
          adminKey: hashedAdminSecret,
        },
        select: {
          id: true,
          username: true,
          emailId: true,
          isAdmin: true,
        },
      });
      const accessToken = await signAccessToken(
        req,
        adminKey ? true : false,
        adminKey
      );
      return createSuccessResponse(
        res,
        201,
        { ...newAdmin, accessToken },
        "Admin Created"
      );
    }
    return createErrorResponse(
      res,
      400,
      {},
      "Request format received is incorrect"
    );
  } catch (error: any) {
    return createErrorResponse(
      res,
      500,
      {},
      error.message || error.stack || error
    );
  }
};
