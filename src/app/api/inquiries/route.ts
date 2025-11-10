import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const inquirySchema = z.object({
  userId: z.string().cuid(),
  swordId: z.string().cuid().optional(),
  interest: z.enum(['KATANA', 'WAKIZASHI', 'TANTO', 'CUSTOM', 'CONSULTATION']),
  message: z.string().min(10).max(1000),
});

export async function POST(request: Request) {
  try {
    // TODO: Add authentication check
    const isAuthenticated = true; // Placeholder for auth check

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = inquirySchema.parse(body);

    const inquiry = await prisma.inquiry.create({
      data: validated,
      include: {
        user: true,
        sword: true,
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error('Inquiry creation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid inquiry data', details: error.format() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // TODO: Add authentication check
    const isAuthenticated = true; // Placeholder for auth check

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const inquiries = await prisma.inquiry.findMany({
      where: {
        ...(userId && { userId }),
      },
      include: {
        user: true,
        sword: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Inquiries fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}