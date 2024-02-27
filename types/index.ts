import express from "express";

export interface Request extends express.Request {
  adminId: string;
}

declare module "express-serve-static-core" {
  interface Request {
    adminId: string;
  }
}
