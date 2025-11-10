import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const swordSchema = z.object({
  name: z.string().min(1),
  nameJapanese: z.string().min(1),
  category: z.enum(['KATANA', 'WAKIZASHI', 'TANTO']),
  price: z.number().positive(),
  description: z.string().min(10),
  craftsman: z.string().min(1),
  era: z.string().min(1),
  image: z.string().url(),
  specifications: z.record(z.string()),
  available: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sword = await prisma.sword.findUnique({
      where: { id: params.id },
    });

    if (!sword) {
      return NextResponse.json(
        { error: 'Sword not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sword);
  } catch (error) {
    console.error('Sword fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check
    const isAdmin = true; // Placeholder for auth check

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = swordSchema.parse(body);

    const sword = await prisma.sword.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(sword);
  } catch (error) {
    console.error('Sword update error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid sword data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check
    const isAdmin = true; // Placeholder for auth check

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.sword.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Sword deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sword deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}