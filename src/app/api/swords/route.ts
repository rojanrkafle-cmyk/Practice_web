import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('10'),
  category: z.enum(['KATANA', 'WAKIZASHI', 'TANTO']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['price', 'createdAt']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validated = querySchema.parse(Object.fromEntries(searchParams));
    const { page, limit, category, search, sortBy, order } = validated;

    const skip = (page - 1) * limit;
    
    const where = {
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { nameJapanese: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [swords, total] = await Promise.all([
      prisma.sword.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.sword.count({ where }),
    ]);

    return NextResponse.json({
      swords,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Swords fetch error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}