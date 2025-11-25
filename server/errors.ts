import { ErrorCode } from "./types";

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, details);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(ErrorCode.AUTHENTICATION_ERROR, message, 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(ErrorCode.AUTHORIZATION_ERROR, message, 403);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(ErrorCode.NOT_FOUND, `${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(ErrorCode.CONFLICT, message, 409);
    this.name = "ConflictError";
  }
}

export class PaymentError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCode.PAYMENT_ERROR, message, 402, details);
    this.name = "PaymentError";
  }
}

export class StripeError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCode.STRIPE_ERROR, message, 500, details);
    this.name = "StripeError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(ErrorCode.DATABASE_ERROR, message, 500);
    this.name = "DatabaseError";
  }
}

export class InternalError extends AppError {
  constructor(message: string = "Internal server error") {
    super(ErrorCode.INTERNAL_ERROR, message, 500);
    this.name = "InternalError";
  }
}
