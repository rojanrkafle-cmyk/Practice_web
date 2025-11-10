import { NextResponse } from 'next/server';
import { z } from 'zod';
import { headers } from 'next/headers';
import { handleAPIError, createErrorResponse } from '@/lib/errors';
import { logger } from '@/lib/logger';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

// In-memory store for rate limiting (consider using Redis in production)
const ipRequests = new Map<string, { count: number; timestamp: number }>();

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  interest: z.enum(['katana', 'wakizashi', 'tanto', 'custom', 'consultation']),
  message: z.string().min(10).max(1000),
  acceptTerms: z.boolean().refine(val => val === true),
});

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    
    // Check rate limit
    const now = Date.now();
    const userRequests = ipRequests.get(ip);
    
    if (userRequests) {
      if (now - userRequests.timestamp < RATE_LIMIT_WINDOW) {
        if (userRequests.count >= MAX_REQUESTS) {
          createErrorResponse(
            'Too many requests. Please try again later.',
            429,
            'RATE_LIMIT_EXCEEDED'
          );
        }
        userRequests.count++;
      } else {
        ipRequests.set(ip, { count: 1, timestamp: now });
      }
    } else {
      ipRequests.set(ip, { count: 1, timestamp: now });
    }

    // Parse and validate request body
    const body = await request.json();
    try {
      const validatedData = contactSchema.parse(body);
      logger.logInfo('Contact form submission received', {
        name: validatedData.name,
        email: validatedData.email,
        interest: validatedData.interest,
      });

      // TODO: Send confirmation email
      // This is a placeholder for email sending functionality
      // Consider using services like SendGrid, AWS SES, or similar
      
      return NextResponse.json(
        { message: 'Contact form submitted successfully' },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        createErrorResponse(
          'Invalid form data',
          400,
          'VALIDATION_ERROR'
        );
      }
      throw error; // Let the outer catch block handle other errors
    }
  } catch (error) {
    return handleAPIError(error);
  }
}