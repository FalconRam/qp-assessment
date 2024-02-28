import { PrismaClient } from "@prisma/client";
import { Request } from "express";

import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const signAccessToken = async (
  req: Request,
  isAdmin?: boolean,
  adminKey?: string
): Promise<string> => {
  try {
    if (!process.env.AUTH_ACCESS_TOKEN_SECRET_KEY)
      throw new Error("Access token secret key is not defined");

    let accessToken;
    if (isAdmin) {
      accessToken = await jwt.sign(
        {
          emailId: req.body.emailId,
          id: req.body.userId,
          isAdmin: true,
          adminKey: adminKey,
        },
        process.env.AUTH_ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRY } // 1hr
      );
      return accessToken;
    }
    accessToken = await jwt.sign(
      { emailId: req.body.emailId, id: req.body.userId, isAdmin: false },
      process.env.AUTH_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRY } // 1hr
    );
    return accessToken;
  } catch (error: any) {
    return error.messsage || error.stack || error;
  }
};
