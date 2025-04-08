// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

// Basic error handling middleware
export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction // next is required even if not used for Express to recognize it as error middleware
) => {
  console.error("Error occurred:", err); // Log the error for debugging

  const statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
  const message = err.message || 'An unexpected error occurred.';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Optionally include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};