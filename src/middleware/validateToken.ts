import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HTTP_STATUS_CODE } from "../constants";
import { AppRequest } from "../types";

export const validateToken = (
  req: AppRequest,
  res: any,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization") || req.headers.authorization;
  const token = authHeader?.startsWith("Bearer")
    ? authHeader.split(" ")[1]
    : "";

  if (!token) {
    return res
      .status(HTTP_STATUS_CODE.TOKEN_NOT_FOUND)
      .json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    req.user = {
      id: decoded.id ?? decoded.userId ?? decoded.hrId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.TOKEN_NOT_FOUND)
      .json({ message: "Token failed" });
  }
};
