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
    [key: string]: any;
}

const SUPPORTED_FORMATS = [
    'doc',
    'docx',
    'docm',
    'dotx',
    'rtf',
    'txt',
    'xls',
    'xlsx',
    'xlsm',
    'pot',
    'potm',
    'potx',
    'pps',
    'ppsm',
    'pptx',
    'ppt',
    'pptm',
];

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

        if (!file) {
            return new NextResponse('No file uploaded', { status: 400 });
        }

        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_SIZE) {
            return new NextResponse('File size exceeds 10MB limit', {
                status: 400,
            });
        }

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !SUPPORTED_FORMATS.includes(fileExtension)) {
            return new NextResponse(
                `Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`,
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<CloudinaryUploadResponse>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'raw',
                        folder: 'saas-pro-documents',
                        raw_convert: 'aspose',
                        public_id: `${title.replace(/\s+/g, '_')}_${Date.now()}`,
                        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/document-webhook`,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResponse);
                    }
                );
                uploadStream.end(buffer);
            }
        );

        const document = await prisma.document.create({
            data: {
                title: title || file.name,
                description: description || '',
                originalPublicId: uploadResult.public_id,
                originalSize: uploadResult.bytes.toString(),
                fileType: fileExtension,
                conversionStatus: 'pending',
            },
        });

        return NextResponse.json({
            ...document,
            originalUrl: cloudinary.url(uploadResult.public_id, {
                resource_type: 'raw',
            }),
            message:
                'Document uploaded successfully. PDF conversion in progress...',
        });
    } catch (error) {
        console.error('Error uploading document:', error);
        return new NextResponse('Error uploading document', { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
