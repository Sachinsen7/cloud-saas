import { v2 as cloudinary } from 'cloudinary';
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@clerk/nextjs/server';
import { VIDEO_FOLDER } from '@/lib/video';

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// The browser uploads the video straight to Cloudinary (see
// /api/video-upload-signature). This route only saves the record, and reads
// the stored (compressed) size from Cloudinary itself.
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized User', { status: 401 });
        }

        if (
            !process.env.DATABASE_URL ||
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return new NextResponse('Server is missing configuration', {
                status: 500,
            });
        }

        const { publicId, title, description, originalSize, duration } =
            (await request.json()) as {
                publicId?: string;
                title?: string;
                description?: string;
                originalSize?: string;
                duration?: number;
            };

        if (!title || title.trim() === '') {
            return new NextResponse('Title is required', { status: 400 });
        }

        if (!publicId || !publicId.startsWith(`${VIDEO_FOLDER}/`)) {
            return new NextResponse('Invalid video reference', {
                status: 400,
            });
        }

        const resource = await cloudinary.api.resource(publicId, {
            resource_type: 'video',
        });

        const video = await prisma.video.create({
            data: {
                title: title.trim(),
                description,
                publicId: resource.public_id,
                originalSize: String(originalSize ?? resource.bytes),
                compressedSize: String(resource.bytes),
                // Cloudinary's Admin API doesn't return duration for videos,
                // so take it from the upload response the browser received.
                duration:
                    typeof duration === 'number' &&
                    Number.isFinite(duration) &&
                    duration >= 0
                        ? duration
                        : 0,
            },
        });

        return NextResponse.json(video);
    } catch (error) {
        console.error('Error saving video:', error);
        return new NextResponse(
            `Error saving video: ${
                error instanceof Error ? error.message : 'Unknown error'
            }`,
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
