import { Request, Response, NextFunction } from "express";
import { AppError, AuthenticationError, ValidationError } from "./errors";
import { ApiResponse } from "./types";

// Request validation middleware
export function validateRequest<T>(
  validator: (data: any) => { success: boolean; data?: T; error?: any }
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = validator(req.body);
    if (!validation.success) {
      throw new ValidationError(
        "Request validation failed",
        validation.error?.flatten?.()
      );
    }
    (req as any).validatedData = validation.data;
    next();
  };
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req as any).session?.clubId) {
    throw new AuthenticationError("Club login required");
  }
  next();
}

// Response formatting middleware
export function responseFormatter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const originalJson = res.json;

  res.json = function (body: any) {
    if (body instanceof AppError || body.code) {
      return originalJson.call(this, {
        success: false,
        error: {
          code: body.code || "UNKNOWN_ERROR",
          message: body.message || "An error occurred",
          details: body.details,
        },
        timestamp: new Date().toISOString(),
      } as ApiResponse<any>);
    }

    return originalJson.call(this, {
      success: true,
      data: body,
      timestamp: new Date().toISOString(),
    } as ApiResponse<any>);
  };

  next();
}

// Error handler middleware
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[${new Date().toISOString()}] Error:`, err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      timestamp: new Date().toISOString(),
    });
  }

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
    timestamp: new Date().toISOString(),
  });
}

// Async handler wrapper
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
