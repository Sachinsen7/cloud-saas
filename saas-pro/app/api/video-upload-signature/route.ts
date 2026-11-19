import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { VIDEO_FOLDER, VIDEO_UPLOAD_TRANSFORMATION } from '@/lib/video';

// Returns a short-lived signature so the browser can upload a video straight
// to Cloudinary. This keeps the file out of the serverless function, which
// hosts like Vercel limit to ~4.5 MB per request body.
export async function POST() {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse('Unauthorized User', { status: 401 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        return new NextResponse('Cloudinary is not configured on the server', {
            status: 500,
        });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = {
        folder: VIDEO_FOLDER,
        timestamp,
        transformation: VIDEO_UPLOAD_TRANSFORMATION,
    };
    const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        apiSecret
    );

    return NextResponse.json({
        cloudName,
        apiKey,
        timestamp,
        signature,
        folder: VIDEO_FOLDER,
        transformation: VIDEO_UPLOAD_TRANSFORMATION,
    });
}
