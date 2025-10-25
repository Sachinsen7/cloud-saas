import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResponse {
    public_id: string;
    bytes: number;
    format: string;
    info?: {
        detection?: {
            adv_face?: {
                status: string;
                data: FaceDetectionData[];
            };
        };
    };
    [key: string]: unknown;
}

interface FaceDetectionData {
    bounding_box: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
    attributes: {
        glasses?: string;
        blur?: {
            blurLevel: string;
            value: number;
        };
        exposure?: {
            exposureLevel: string;
            value: number;
        };
        noise?: {
            noiseLevel: string;
            value: number;
        };
        accessories?: Array<{
            type: string;
            confidence: number;
        }>;
        occlusion?: {
            foreheadOccluded: boolean;
            eyeOccluded: boolean;
            mouthOccluded: boolean;
        };
        head_pose?: {
            pitch: number;
            roll: number;
            yaw: number;
        };
    };
    facial_landmarks?: {
        mouth?: Array<{ x: number; y: number }>;
        eyebrow?: Array<{ x: number; y: number }>;
        eye?: Array<{ x: number; y: number }>;
        nose?: Array<{ x: number; y: number }>;
    };
}

export async function POST(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const processType = formData.get('processType') as string;

        if (!file) {
            return new NextResponse('No file uploaded', { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<CloudinaryUploadResponse>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'saas-pro-face-detection',
                        resource_type: 'image',
                        detection: 'adv_face',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResponse);
                    }
                );
                uploadStream.end(buffer);
            }
        );

        const faceData = uploadResult.info?.detection?.adv_face;
        const faces = faceData?.data || [];

        const processedData = await processFaceDetection(
            uploadResult.public_id,
            faces,
            processType
        );

        const image = await prisma.image.create({
            data: {
                title: title || file.name,
                description: description || '',
                publicId: uploadResult.public_id,
                originalSize: uploadResult.bytes.toString(),
                fileType: uploadResult.format,
                tags: processedData.tags || [],
                facialAttributes: faces,
                faceCount: faces.length,
                hasFaces: faces.length > 0,
                facesBoundingBoxes: faces.map(
                    (face) => face.bounding_box
                ),
                facialLandmarks: faces
                    .map((face) => face.facial_landmarks)
                    .filter(Boolean),
            },
        });

        return NextResponse.json({
            ...image,
            faceDetectionData: processedData,
            originalUrl: cloudinary.url(uploadResult.public_id),
            processedUrls: processedData.processedUrls || {},
        });
    } catch (error) {
        console.error('Error processing face detection:', error);
        return new NextResponse('Error processing face detection', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}

async function processFaceDetection(
    publicId: string,
    faces: FaceDetectionData[],
    processType: string
) {
    const processedUrls: Record<string, string> = {};
    const tags: string[] = [];

    if (faces.length === 0) {
        tags.push('no-faces-detected');
        return { tags, processedUrls, faceCount: 0 };
    }

    tags.push(`${faces.length}-faces-detected`);

    switch (processType) {
        case 'face-detection':
            processedUrls.faceDetection = cloudinary.url(publicId, {
                overlay: 'text:Arial_20_bold:Face%20Detected',
                gravity: 'adv_faces',
                color: 'red',
            });
            tags.push('face-detection-applied');
            break;

        case 'face-crop':
            processedUrls.faceCropSingle = cloudinary.url(publicId, {
                width: 300,
                height: 300,
                crop: 'thumb',
                gravity: 'adv_face',
            });

            processedUrls.faceCropAll = cloudinary.url(publicId, {
                width: 400,
                height: 300,
                crop: 'fill',
                gravity: 'adv_faces',
            });

            tags.push('face-crop-applied');
            break;

        case 'face-overlay':
            processedUrls.faceOverlay = cloudinary.url(publicId, {
                transformation: [
                    { overlay: 'text:Arial_30_bold:😊' },
                    { flags: 'region_relative', width: '0.8', crop: 'scale' },
                    { flags: 'layer_apply', gravity: 'adv_faces' },
                ],
            });

            processedUrls.eyesOverlay = cloudinary.url(publicId, {
                transformation: [
                    { overlay: 'text:Arial_20_bold:👀' },
                    { flags: 'region_relative', width: '1.2', crop: 'scale' },
                    { flags: 'layer_apply', gravity: 'adv_eyes' },
                ],
            });

            tags.push('face-overlay-applied');
            break;

        case 'red-eye-removal':
            processedUrls.redEyeRemoval = cloudinary.url(publicId, {
                effect: 'adv_redeye',
            });

            tags.push('red-eye-removal-applied');
            break;

        default:
            processedUrls.faceDetection = cloudinary.url(publicId, {
                overlay: 'text:Arial_16_bold:Faces%20Detected',
                gravity: 'adv_faces',
                color: 'white',
                background: 'black',
            });

            processedUrls.faceThumbnail = cloudinary.url(publicId, {
                width: 200,
                height: 200,
                crop: 'thumb',
                gravity: 'adv_face',
            });
    }

    faces.forEach((face, index) => {
        const attrs = face.attributes;

        if (attrs.glasses && attrs.glasses !== 'NoGlasses') {
            tags.push('glasses-detected');
        }

        if (attrs.blur && attrs.blur.blurLevel === 'high') {
            tags.push('blurry-face');
        }

        if (attrs.occlusion) {
            if (attrs.occlusion.eyeOccluded) tags.push('eyes-occluded');
            if (attrs.occlusion.mouthOccluded) tags.push('mouth-occluded');
            if (attrs.occlusion.foreheadOccluded)
                tags.push('forehead-occluded');
        }

        if (attrs.accessories && attrs.accessories.length > 0) {
            tags.push('accessories-detected');
        }
    });

    return {
        tags: [...new Set(tags)],
        processedUrls,
        faceCount: faces.length,
        type: processType,
    };
}

export async function GET(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get('publicId');

        if (!publicId) {
            return new NextResponse('Public ID is required', { status: 400 });
        }

        const image = await prisma.image.findFirst({
            where: { publicId: publicId },
        });

        if (!image) {
            return new NextResponse('Image not found', { status: 404 });
        }

        return NextResponse.json({
            id: image.id,
            title: image.title,
            publicId: image.publicId,
            facialAttributes: image.facialAttributes,
            faceCount: image.faceCount,
            hasFaces: image.hasFaces,
            facesBoundingBoxes: image.facesBoundingBoxes,
            facialLandmarks: image.facialLandmarks,
        });
    } catch (error) {
        console.error('Error fetching face detection data:', error);
        return new NextResponse('Failed to fetch face detection data', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}
