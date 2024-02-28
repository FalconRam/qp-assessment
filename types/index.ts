import express from "express";
import { JwtPayload } from "jsonwebtoken";

export interface Request extends express.Request {
  emailId: string;
  isAdmin?: boolean;
  adminKey?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    emailId: string;
    isAdmin?: boolean;
    adminKey?: string;
  }
}

export type UserDetails = {
  id: number;
  username: string;
  emailId: string;
  password: string;
  isAdmin: boolean;
};

export type GroceryDetails = {
  id: number;
  groceryName: string;
  groceryPrice: number;
  groceryType: string;
  groceryStockCount: number;
};

export type RecordDetails = UserDetails | GroceryDetails | boolean;

export interface userTokenInterface extends JwtPayload {
  email: string;
  isAdmin: boolean;
  adminKey?: string;
}
