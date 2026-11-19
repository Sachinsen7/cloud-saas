import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// Public endpoint: reports only booleans, never values or error details.
export async function GET() {
    const env = {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasCloudinaryCloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        hasCloudinaryApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasCloudinaryApiSecret: !!process.env.CLOUDINARY_API_SECRET,
        hasClerkPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        hasClerkSecretKey: !!process.env.CLERK_SECRET_KEY,
    };

    let databaseConnected = false;
    try {
        await prisma.$queryRaw`SELECT 1`;
        databaseConnected = true;
    } catch (error) {
        console.error('Health check database error:', error);
    }

    const ok = databaseConnected && Object.values(env).every(Boolean);

    return NextResponse.json(
        {
            status: ok ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            environment: env,
            databaseConnected,
        },
        { status: ok ? 200 : 500 }
    );
}
