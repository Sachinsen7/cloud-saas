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
                        folder: 'saas-pro-ai-images',
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResponse);
                    }
                );
                uploadStream.end(buffer);
            }
        );

        let processedData: Record<string, unknown> = {};

        switch (processType) {
            case 'background-removal':
                processedData = await processBackgroundRemoval(
                    uploadResult.public_id
                );
                break;
            case 'ocr':
                processedData = await processOCR(uploadResult.public_id);
                break;
            case 'auto-tag':
                processedData = await processAutoTag(uploadResult.public_id);
                break;
            case 'enhance':
                processedData = await processEnhancement(
                    uploadResult.public_id
                );
                break;
            case 'quality-analysis':
                processedData = await processImageQuality(
                    uploadResult.public_id
                );
                break;
            case 'watermark-detection':
                processedData = await processWatermarkDetection(
                    uploadResult.public_id
                );
                break;
            case 'captioning':
                processedData = await processImageCaptioning(
                    uploadResult.public_id
                );
                break;
            case 'object-detection':
                processedData = await processAdvancedObjectDetection(
                    uploadResult.public_id
                );
                break;
            default:
                processedData = { tags: [], extractedText: null };
        }

        const image = await prisma.image.create({
            data: {
                title: title || file.name,
                description: description || '',
                publicId: uploadResult.public_id,
                originalSize: uploadResult.bytes.toString(),
                fileType: uploadResult.format,
                tags: Array.isArray(processedData.tags)
                    ? (processedData.tags as string[])
                    : [],
                extractedText:
                    typeof processedData.extractedText === 'string'
                        ? processedData.extractedText
                        : null,
                hasBackgroundRemoved: processType === 'background-removal',
                isEnhanced: processType === 'enhance',
                aiCaption:
                    typeof processedData.aiCaption === 'string'
                        ? processedData.aiCaption
                        : null,
                qualityScore:
                    typeof processedData.qualityScore === 'number'
                        ? processedData.qualityScore
                        : null,
                qualityLevel:
                    typeof processedData.qualityLevel === 'string'
                        ? processedData.qualityLevel
                        : null,
                watermarkDetected:
                    typeof processedData.watermarkDetected === 'string'
                        ? processedData.watermarkDetected
                        : null,
                objectDetection: {
                    processType: processType,
                    processedUrls: {
                        processedUrl:
                            typeof processedData.processedUrl === 'string'
                                ? processedData.processedUrl
                                : null,
                        fineEdgesUrl:
                            typeof processedData.fineEdgesUrl === 'string'
                                ? processedData.fineEdgesUrl
                                : null,
                    },
                    processedAt: new Date().toISOString(),
                    originalData: processedData.objectDetection || null,
                },
            },
        });

        const processedUrl =
            typeof processedData.processedUrl === 'string'
                ? processedData.processedUrl
                : null;

        const responseData = {
            ...image,
            processedData: {
                ...processedData,
            },
            originalUrl: cloudinary.url(uploadResult.public_id),
            processedUrl: processedUrl,
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Error processing image:', error);
        const errorMessage =
            error instanceof Error ? error.message : 'Error processing image';
        return new NextResponse(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        await prisma.$disconnect();
    }
}

async function processBackgroundRemoval(publicId: string) {
    try {
        const processedUrl = cloudinary.url(publicId, {
            effect: 'background_removal',
            format: 'png',
            sign_url: true,
            type: 'upload',
        });

        const fineEdgesUrl = cloudinary.url(publicId, {
            effect: 'background_removal:fineedges_y',
            format: 'png',
            sign_url: true,
            type: 'upload',
        });

        return {
            processedUrl,
            fineEdgesUrl,
            tags: ['background-removed'],
            type: 'background-removal',
        };
    } catch (error) {
        console.error('Background removal error:', error);
        return {
            processedUrl: null,
            fineEdgesUrl: null,
            tags: [],
            type: 'background-removal',
        };
    }
}

async function processOCR(publicId: string) {
    try {
        const result = await cloudinary.uploader.explicit(publicId, {
            type: 'upload',
            resource_type: 'image',
            ocr: 'adv_ocr',
        });

        let extractedText = '';
        if (result.info?.ocr?.adv_ocr?.data) {
            const ocrData = result.info.ocr.adv_ocr.data;
            if (Array.isArray(ocrData) && ocrData.length > 0) {
                extractedText = ocrData
                    .map(
                        (block: {
                            textAnnotations?: Array<{ description?: string }>;
                        }) => block.textAnnotations?.[0]?.description || ''
                    )
                    .filter((text: string) => text)
                    .join(' ');
            }
        }

        return {
            extractedText,
            tags: extractedText ? ['text-detected'] : ['no-text'],
            type: 'ocr',
        };
    } catch (error) {
        console.error('OCR processing error:', error);
        return { extractedText: '', tags: ['ocr-failed'], type: 'ocr' };
    }
}

async function processAutoTag(publicId: string) {
    try {
        const result = await cloudinary.uploader.explicit(publicId, {
            type: 'upload',
            resource_type: 'image',
            detection: 'coco',
            auto_tagging: 0.6,
        });

        const tags = result.tags || [];
        const detectionData =
            result.info?.detection?.object_detection?.data || {};

        const detectedObjects: string[] = [];
        for (const [model, data] of Object.entries(detectionData)) {
            if (data && typeof data === 'object' && 'tags' in data) {
                const modelTags = (data as { tags: Record<string, unknown> })
                    .tags;
                for (const [objectName, detections] of Object.entries(
                    modelTags
                )) {
                    if (Array.isArray(detections)) {
                        detectedObjects.push(objectName);
                    }
                }
            }
        }

        const allTags = [...new Set([...tags, ...detectedObjects])]; // Remove duplicates

        return {
            tags: allTags.slice(0, 10), // Limit to 10 tags
            type: 'auto-tag',
        };
    } catch (error) {
        console.error('Auto-tagging error:', error);
        return { tags: ['auto-tag-failed'], type: 'auto-tag' };
    }
}

async function processEnhancement(publicId: string) {
    try {
        const processedUrl = cloudinary.url(publicId, {
            quality: 'auto:best',
            format: 'auto',
            fetch_format: 'auto',
            sign_url: true,
            type: 'upload',
            transformation: [
                {
                    quality: 'auto:best',
                    fetch_format: 'auto',
                },
            ],
        });

        return {
            processedUrl,
            tags: ['enhanced', 'quality-improved'],
            type: 'enhancement',
        };
    } catch (error) {
        console.error('Enhancement error:', error);
        return {
            processedUrl: null,
            tags: ['enhancement-failed'],
            type: 'enhancement',
        };
    }
}

async function processImageQuality(publicId: string) {
    try {
        const result = await cloudinary.uploader.explicit(publicId, {
            type: 'upload',
            resource_type: 'image',
            detection: 'iqa',
        });

        const qualityData =
            result.info?.detection?.iqa?.data?.[0]?.tags?.['iqa-analysis']?.[0];

        const score = qualityData?.attributes?.score || 0;
        const quality = qualityData?.attributes?.quality || 'unknown';

        return {
            qualityScore: typeof score === 'number' ? score : 0,
            qualityLevel: typeof quality === 'string' ? quality : 'unknown',
            tags: [`quality-${quality}`],
            type: 'quality-analysis',
        };
    } catch (error) {
        console.error('Quality analysis error:', error);
        return {
            qualityScore: 0,
            qualityLevel: 'unknown',
            tags: ['quality-failed'],
            type: 'quality-analysis',
        };
    }
}

async function processWatermarkDetection(publicId: string) {
    try {
        const result = await cloudinary.uploader.explicit(publicId, {
            type: 'upload',
            resource_type: 'image',
            detection: 'watermark-detection',
        });

        const watermarkData =
            result.info?.detection?.['watermark-detection']?.data?.[0]?.tags;

        let watermarkType = 'clean';

        if (watermarkData?.banner?.[0]?.confidence > 0.5) {
            watermarkType = 'banner';
        } else if (watermarkData?.watermark?.[0]?.confidence > 0.5) {
            watermarkType = 'watermark';
        }

        return {
            watermarkDetected: watermarkType,
            tags: [watermarkType],
            type: 'watermark-detection',
        };
    } catch (error) {
        console.error('Watermark detection error:', error);
        return {
            watermarkDetected: 'unknown',
            tags: ['watermark-failed'],
            type: 'watermark-detection',
        };
    }
}

async function processImageCaptioning(publicId: string) {
    try {
        const result = await cloudinary.uploader.explicit(publicId, {
            type: 'upload',
            resource_type: 'image',
            detection: 'captioning',
        });

        const caption =
            result.info?.detection?.captioning?.data?.[0]?.caption || '';

        return {
            aiCaption: caption,
            tags: caption ? ['captioned'] : ['caption-failed'],
            type: 'captioning',
        };
    } catch (error) {
        console.error('Captioning error:', error);
        return { aiCaption: '', tags: ['caption-failed'], type: 'captioning' };
    }
}

async function processAdvancedObjectDetection(publicId: string) {
    try {
        const result = await cloudinary.uploader.explicit(publicId, {
            type: 'upload',
            resource_type: 'image',
            detection: 'coco',
            auto_tagging: 0.6,
        });

        const detectionData =
            result.info?.detection?.object_detection?.data || {};
        const detectedObjects: Array<{
            object: string;
            confidence: number;
            boundingBox: unknown;
            model: string;
        }> = [];

        for (const [model, data] of Object.entries(detectionData)) {
            if (data && typeof data === 'object' && 'tags' in data) {
                const modelTags = (data as { tags: Record<string, unknown> })
                    .tags;
                for (const [objectName, detections] of Object.entries(
                    modelTags
                )) {
                    if (Array.isArray(detections)) {
                        detectedObjects.push(
                            ...detections.map(
                                (detection: {
                                    confidence: number;
                                    [key: string]: unknown;
                                }) => ({
                                    object: objectName,
                                    confidence: detection.confidence || 0,
                                    boundingBox:
                                        detection['bounding-box'] || null,
                                    model: model,
                                })
                            )
                        );
                    }
                }
            }
        }

        return {
            objectDetection: detectedObjects,
            tags: detectedObjects.map((obj) => obj.object).slice(0, 10),
            type: 'object-detection',
        };
    } catch (error) {
        console.error('Object detection error:', error);
        return {
            objectDetection: [],
            tags: ['object-detection-failed'],
            type: 'object-detection',
        };
    }
}
