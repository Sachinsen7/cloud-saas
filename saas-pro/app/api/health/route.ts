import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const health = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: {
                nodeEnv: process.env.NODE_ENV,
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasCloudinaryCloudName:
                    !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                hasCloudinaryApiKey: !!process.env.CLOUDINARY_API_KEY,
                hasCloudinaryApiSecret: !!process.env.CLOUDINARY_API_SECRET,
                hasClerkPublishableKey:
                    !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
                hasClerkSecretKey: !!process.env.CLERK_SECRET_KEY,
            },
            database: {
                status: 'unknown',
                error: null as string | null,
            },
        };

        try {
            await prisma.$connect();
            health.database.status = 'connected';
        } catch (error) {
            health.database.status = 'error';
            health.database.error =
                error instanceof Error ? error.message : 'Unknown error';
        } finally {
            await prisma.$disconnect();
        }

        return NextResponse.json(health);
    } catch (error) {
        return NextResponse.json(
            {
                status: 'error',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
