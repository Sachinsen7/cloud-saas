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
    [key: string]: unknown;
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

        const fileNameParts = file.name.split('.');
        const fileExtension = fileNameParts.length > 1 
            ? fileNameParts.pop()?.toLowerCase() 
            : null;
        
        if (!fileExtension || !SUPPORTED_FORMATS.includes(fileExtension)) {
            return new NextResponse(
                JSON.stringify({ 
                    error: `Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`,
                    receivedExtension: fileExtension || 'none'
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const sanitizedTitle = (title || file.name.split('.')[0] || 'document')
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_-]/g, '');
        
        const publicId = `${sanitizedTitle}_${Date.now()}.${fileExtension}`;

        const uploadOptions = {
            resource_type: 'raw' as const,
            folder: 'saas-pro-documents',
            raw_convert: 'aspose',
            public_id: publicId,
            notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/document-webhook`,
        };

        const uploadResult = await new Promise<CloudinaryUploadResponse>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            reject(error);
                        } else {
                            resolve(result as CloudinaryUploadResponse);
                        }
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
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Error uploading document';
        const errorDetails = error instanceof Error && 'http_code' in error
            ? { http_code: (error as { http_code: number }).http_code }
            : {};
        
        return new NextResponse(
            JSON.stringify({ 
                error: errorMessage,
                ...errorDetails
            }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } finally {
        await prisma.$disconnect();
    }
}
