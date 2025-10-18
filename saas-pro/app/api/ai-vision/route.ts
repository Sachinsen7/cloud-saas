import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// AI Vision API endpoints
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
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body: AIVisionRequest = await request.json();
        const { mode, imageUrl, publicId, tagDefinitions, rejectionQuestions, prompts } = body;

        // Prepare authentication
        const auth = Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64');

        let endpoint = '';
        let payload: any = {
            source: { uri: imageUrl }
        };

        // Configure based on mode
        switch (mode) {
            case 'tagging':
                endpoint = `${AI_VISION_BASE_URL}/ai_vision_tagging`;
                if (!tagDefinitions || tagDefinitions.length === 0) {
                    return new NextResponse("Tag definitions are required for tagging mode", { status: 400 });
                }
                payload.tag_definitions = tagDefinitions.slice(0, 10); // Max 10 tags
                break;

            case 'moderation':
                endpoint = `${AI_VISION_BASE_URL}/ai_vision_moderation`;
                if (!rejectionQuestions || rejectionQuestions.length === 0) {
                    return new NextResponse("Rejection questions are required for moderation mode", { status: 400 });
                }
                payload.rejection_questions = rejectionQuestions.slice(0, 10); // Max 10 questions
                break;

            case 'general':
                endpoint = `${AI_VISION_BASE_URL}/ai_vision_general`;
                if (!prompts || prompts.length === 0) {
                    return new NextResponse("Prompts are required for general mode", { status: 400 });
                }
                payload.prompts = prompts.slice(0, 10); // Max 10 prompts
                break;

            default:
                return new NextResponse("Invalid mode. Must be 'tagging', 'moderation', or 'general'", { status: 400 });
        }

        // Make request to Cloudinary AI Vision API
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('AI Vision API error:', errorText);
            return new NextResponse(`AI Vision API error: ${response.status}`, { status: response.status });
        }

        const result = await response.json();

        // Update database if publicId is provided
        if (publicId) {
            try {
                const image = await prisma.image.findFirst({
                    where: { publicId: publicId }
                });

                if (image) {
                    const updateData: any = {
                        tokensUsed: result.limits?.usage?.count || 0
                    };

                    switch (mode) {
                        case 'tagging':
                            updateData.aiVisionTags = result.data.analysis;
                            break;
                        case 'moderation':
                            updateData.aiVisionModeration = result.data.analysis;
                            break;
                        case 'general':
                            updateData.aiVisionGeneral = result.data.analysis;
                            break;
                    }

                    await prisma.image.update({
                        where: { id: image.id },
                        data: updateData
                    });
                }
            } catch (dbError) {
                console.error('Database update error:', dbError);
                // Continue even if DB update fails
            }
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error("AI Vision error:", error);
        return new NextResponse("AI Vision processing failed", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// GET endpoint to retrieve AI Vision results for an image
export async function GET(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get("publicId");

        if (!publicId) {
            return new NextResponse("Public ID is required", { status: 400 });
        }

        const image = await prisma.image.findFirst({
            where: { publicId: publicId },
            select: {
                id: true,
                title: true,
                publicId: true,
                aiVisionTags: true,
                aiVisionModeration: true,
                aiVisionGeneral: true,
                tokensUsed: true
            }
        });

        if (!image) {
            return new NextResponse("Image not found", { status: 404 });
        }

        return NextResponse.json(image);

    } catch (error) {
        console.error("Error fetching AI Vision data:", error);
        return new NextResponse("Failed to fetch AI Vision data", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}