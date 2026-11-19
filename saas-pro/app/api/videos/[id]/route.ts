import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Deletes the video from Cloudinary and then from the database.
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized User', { status: 401 });
        }

        const { id } = await params;

        const video = await prisma.video.findUnique({ where: { id } });
        if (!video) {
            return new NextResponse('Video not found', { status: 404 });
        }

        const result = await cloudinary.uploader.destroy(video.publicId, {
            resource_type: 'video',
            invalidate: true,
        });

        // "not found" means the file is already gone, so still clean up the row.
        if (result.result !== 'ok' && result.result !== 'not found') {
            return new NextResponse(
                `Could not delete the video file: ${result.result}`,
                { status: 502 }
            );
        }

        await prisma.video.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting video:', error);
        return new NextResponse(
            `Error deleting video: ${
                error instanceof Error ? error.message : 'Unknown error'
            }`,
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
