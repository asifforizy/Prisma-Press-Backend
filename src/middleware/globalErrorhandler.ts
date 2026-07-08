import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import httpStatus from "http-status";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorDetails: any = null;

  // Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      // Unique Constraint Failed
      case "P2002":
        statusCode = httpStatus.CONFLICT;
        message = `Duplicate value for ${err.meta?.target}`;
        break;

      // Record Not Found
      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        message = "Record not found";
        break;

      // Foreign Key Constraint Failed
      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Foreign key constraint failed";
        break;

      // Value Too Long
      case "P2000":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Input value is too long";
        break;

      // Null Constraint Violation
      case "P2011":
        statusCode = httpStatus.BAD_REQUEST;
        message = "A required field cannot be null";
        break;

      default:
        statusCode = httpStatus.BAD_REQUEST;
        message = err.message;
    }

    errorDetails = err.meta;
  }

  // Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Prisma validation error";
  }

  // Prisma Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Database connection failed";
  }

  // Prisma Rust Panic
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Prisma engine crashed";
  }

  // Custom Error (if you create an AppError class)
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Normal JavaScript Error
  else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode : statusCode,
    message : message,
    error:
      process.env.NODE_ENV === "development"
        ? errorDetails || err
        : undefined,
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
};