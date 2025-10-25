import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const images = await prisma.image.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        return NextResponse.json(
            { error: 'Failed to fetch images' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const imageId = searchParams.get('id');

        if (!imageId) {
            return new NextResponse('Image ID required', { status: 400 });
        }

        await prisma.image.delete({
            where: { id: imageId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting image:', error);
        return NextResponse.json(
            { error: 'Failed to delete image' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
