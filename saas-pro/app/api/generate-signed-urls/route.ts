import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { publicId } = await request.json();

        if (!publicId) {
            return new NextResponse("Public ID is required", { status: 400 });
        }

        const urls = {
            original: cloudinary.url(publicId, {
                type: 'upload'
            }),
            standard: cloudinary.url(publicId, {
                effect: 'background_removal',
                format: 'png',
                sign_url: true,
                type: 'upload'
            }),
            fineEdges: cloudinary.url(publicId, {
                effect: 'background_removal:fineedges_y',
                format: 'png',
                sign_url: true,
                type: 'upload'
            }),
            withShadow: cloudinary.url(publicId, {
                transformation: [
                    { effect: 'background_removal' },
                    { effect: 'dropshadow' }
                ],
                format: 'png',
                sign_url: true,
                type: 'upload'
            }),
            enhanced: cloudinary.url(publicId, {
                effect: 'viesus_correct',
                quality: 'auto:best',
                sign_url: true,
                type: 'upload'
            }),
        };

        return NextResponse.json(urls);

    } catch (error) {
        console.error("Error generating signed URLs:", error);
        return new NextResponse("Error generating URLs", { status: 500 });
    }
}