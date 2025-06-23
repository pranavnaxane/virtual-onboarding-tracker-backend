import { Request, Response, NextFunction } from "express";

const httpErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = req.statusCode ?? 500;

  res.status(statusCode).json({ message: err.message, stack: err.stack });
};

export default httpErrorHandler;
