// lib/errorHandler.ts
import { Prisma } from "@prisma/client";

interface ErrorResponse {
  success: false;
  message: string;
  status?: number;
}

export function handleError(error: unknown): ErrorResponse {
  console.error("Global Error Handler:", error); // keep logging for developers

  // Prisma: known request errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          success: false,
          message: "This item already exists.",
          status: 409,
        };
      case "P2025":
        return {
          success: false,
          message: "The requested item was not found.",
          status: 404,
        };
      default:
        return {
          success: false,
          message: "A database error occurred. Please try again later.",
          status: 500,
        };
    }
  }

  // Prisma: initialization
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      success: false,
      message:
        "We’re having trouble connecting to the database. Please try again later.",
      status: 503,
    };
  }

  // Prisma: validation
  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      success: false,
      message:
        "Some information you entered is not valid. Please check and try again.",
      status: 400,
    };
  }

  // Prisma: engine panic
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      success: false,
      message:
        "Something went wrong with the database. Please try again later.",
      status: 500,
    };
  }

  // Node.js / network errors
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code: string }).code;
    if (code === "ETIMEDOUT") {
      return {
        success: false,
        message: "The request took too long. Please try again.",
        status: 504,
      };
    }
    if (code === "ECONNREFUSED") {
      return {
        success: false,
        message: "Unable to connect right now. Please try again later.",
        status: 503,
      };
    }
    if (code === "503") {
      return {
        success: false,
        message:
          "The service is temporarily unavailable. Please try again later.",
        status: 503,
      };
    }
  }

  // JavaScript runtime errors
  if (error instanceof TypeError || error instanceof ReferenceError) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      status: 500,
    };
  }

  // Custom app errors (optional)
  if (typeof error === "object" && error !== null && "isAppError" in error) {
    const e = error as { isAppError: true; message?: string; status?: number };

    return {
      success: false,
      message: e.message ?? "Something went wrong.",
      status: e.status ?? 400,
    };
  }

  // Fallback
  return {
    success: false,
    message: "An unexpected error occurred. Please try again later.",
    status: 500,
  };
}
