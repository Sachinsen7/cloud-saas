import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

const AI_VISION_BASE_URL = `https://api.cloudinary.com/v2/analysis/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/analyze`;

interface AIVisionTagDefinition {
    name: string;
    description: string;
}

interface AIVisionRequest {
    mode: 'tagging' | 'moderation' | 'general';
    imageUrl: string;
    publicId?: string;
    tagDefinitions?: AIVisionTagDefinition[];
    rejectionQuestions?: string[];
    prompts?: string[];
}

export async function POST(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body: AIVisionRequest = await request.json();
        const {
            mode,
            imageUrl,
            publicId,
            tagDefinitions,
            rejectionQuestions,
            prompts,
        } = body;

        const auth = Buffer.from(
            `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`
        ).toString('base64');

        let endpoint = '';
        const payload: {
            source: { uri: string };
            tag_definitions?: Array<{ name: string; description: string }>;
            rejection_questions?: string[];
            prompts?: string[];
        } = {
            source: { uri: imageUrl },
        };

        switch (mode) {
            case 'tagging':
                endpoint = `${AI_VISION_BASE_URL}/ai_vision_tagging`;
                if (!tagDefinitions || tagDefinitions.length === 0) {
                    return new NextResponse(
                        'Tag definitions are required for tagging mode',
                        { status: 400 }
                    );
                }
                const sanitizedTags = tagDefinitions.slice(0, 10).map((tag) => {
                    const sanitizedName = tag.name
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9-]/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');

                    if (!sanitizedName) {
                        throw new Error(
                            `Invalid tag name: "${tag.name}". Tag names can only contain lower-case alphanumeric characters or hyphens.`
                        );
                    }

                    return {
                        name: sanitizedName,
                        description: tag.description.trim(),
                    };
                });
                payload.tag_definitions = sanitizedTags;
                break;

            case 'moderation':
                endpoint = `${AI_VISION_BASE_URL}/ai_vision_moderation`;
                if (!rejectionQuestions || rejectionQuestions.length === 0) {
                    return new NextResponse(
                        'Rejection questions are required for moderation mode',
                        { status: 400 }
                    );
                }
                payload.rejection_questions = rejectionQuestions.slice(0, 10);
                break;

            case 'general':
                endpoint = `${AI_VISION_BASE_URL}/ai_vision_general`;
                if (!prompts || prompts.length === 0) {
                    return new NextResponse(
                        'Prompts are required for general mode',
                        { status: 400 }
                    );
                }
                payload.prompts = prompts.slice(0, 10);
                break;

            default:
                return new NextResponse(
                    "Invalid mode. Must be 'tagging', 'moderation', or 'general'",
                    { status: 400 }
                );
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMessage = `AI Vision API error: ${response.status}`;
            try {
                const errorText = await response.text();
                if (errorText) {
                    try {
                        const errorData = JSON.parse(errorText);
                        if (errorData.error?.details?.message) {
                            errorMessage = errorData.error.details.message;
                        } else if (errorData.error?.message) {
                            errorMessage = errorData.error.message;
                        }
                    } catch {
                        errorMessage = errorText || errorMessage;
                    }
                }
            } catch (err) {
                console.error('Error reading error response:', err);
            }
            console.error('AI Vision API error:', errorMessage);
            return new NextResponse(
                JSON.stringify({ error: { message: errorMessage } }),
                {
                    status: response.status,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const result = await response.json();

        if (publicId) {
            try {
                const image = await prisma.image.findFirst({
                    where: { publicId: publicId },
                });

                if (image) {
                    let updateData: {
                        tags?: string[];
                        aiCaption?: string;
                        objectDetection?: unknown;
                        tokensUsed?: number;
                        aiVisionTags?: unknown;
                        aiVisionModeration?: unknown;
                        aiVisionGeneral?: unknown;
                    } = {
                        tokensUsed: result.limits?.usage?.count || 0,
                    };

                    switch (mode) {
                        case 'tagging':
                            updateData = {
                                ...updateData,
                                aiVisionTags: result.data?.analysis || null,
                            };
                            break;
                        case 'moderation':
                            updateData = {
                                ...updateData,
                                aiVisionModeration:
                                    result.data?.analysis || null,
                            };
                            break;
                        case 'general':
                            updateData = {
                                ...updateData,
                                aiVisionGeneral: result.data?.analysis || null,
                            };
                            break;
                    }

                    await prisma.image.update({
                        where: { id: image.id },
                        data: updateData as Record<string, unknown>,
                    });
                }
            } catch (dbError) {
                console.error('Database update error:', dbError);
            }
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('AI Vision error:', error);
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'AI Vision processing failed';
        return new NextResponse(
            JSON.stringify({ error: { message: errorMessage } }),
            {
                status:
                    error instanceof Error &&
                    errorMessage.includes('Invalid tag')
                        ? 400
                        : 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } finally {
        await prisma.$disconnect();
    }
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

        return NextResponse.json(image);
    } catch (error) {
        console.error('Error fetching AI Vision data:', error);
        return new NextResponse('Failed to fetch AI Vision data', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}
