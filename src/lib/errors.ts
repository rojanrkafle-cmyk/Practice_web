import { logger } from './logger';
import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: unknown) => {
  if (error instanceof APIError) {
    logger.logError(error, {
      statusCode: error.statusCode,
      code: error.code,
    });

    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle unknown errors
  const unknownError = error instanceof Error ? error : new Error('An unknown error occurred');
  logger.logError(unknownError, {
    type: 'UnhandledError',
    originalError: error,
  });

  return NextResponse.json(
    {
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
    { status: 500 }
  );
};

// Utility to create consistent error responses
export const createErrorResponse = (
  message: string,
  statusCode: number = 500,
  code?: string
) => {
  throw new APIError(message, statusCode, code);
};