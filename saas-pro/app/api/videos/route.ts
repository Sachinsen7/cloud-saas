import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const video = await prisma.video.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(video);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
