import { Response, Request, NextFunction } from 'express';

export class ApiResponse {
  static success(res: Response, data: any = null, message: string = 'Success', statusCode: number = 200) {
    const response = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string = 'Error occurred', statusCode: number = 500, errors: any = null) {
    const response = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(response);
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

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error: any) => error.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors
    });
  }

  // Handle mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: 'Duplicate Field',
      message: `${field} already exists`
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid Token'
    });
  }

  // Handle JWT expiry errors
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token Expired'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
}; 