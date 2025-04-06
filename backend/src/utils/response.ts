import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any = null, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string = 'Error occurred', statusCode: number = 500, errors: any = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}

export class ErrorHandler extends Error {
  statusCode: number;
  errors: any;

  constructor(message: string, statusCode: number = 500, errors: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorMiddleware = (err: any, req: any, res: Response, next: any) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((value: any) => value.message);
    return ApiResponse.error(res, 'Validation Error', 400, message);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field} field`;
    return ApiResponse.error(res, message, 400);
  }

  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    return ApiResponse.error(res, message, 404);
  }

  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Token expired', 401);
  }

  return ApiResponse.error(res, err.message, err.statusCode, err.errors);
}; 