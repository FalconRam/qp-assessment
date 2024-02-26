import { Response } from "express";

export const createSuccessResponse = (
  res: Response,
  statusCode: number,
  payload: {},
  customMessage: string
) => {
  return res.status(statusCode).json({
    status: true,
    data: payload,
    message: customMessage || "Success",
  });
};

export const createErrorResponse = (
  res: Response,
  statusCode: number,
  payload: {},
  customMessage: string
) => {
  return res.status(statusCode).json({
    status: false,
    data: payload,
    message: customMessage,
  });
};
