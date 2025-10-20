import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (body.notification_type === 'info' && body.info_kind === 'aspose') {
            const { public_id, info_status } = body;

            const document = await prisma.document.findFirst({
                where: { originalPublicId: public_id },
            });

            if (!document) {
                console.error('Document not found for public_id:', public_id);
                return new NextResponse('Document not found', { status: 404 });
            }

            if (info_status === 'complete') {
                const pdfPublicId = `${public_id}.pdf`;

                try {
                    const thumbnailPublicId = `${public_id}_thumb`;

                    await prisma.document.update({
                        where: { id: document.id },
                        data: {
                            conversionStatus: 'complete',
                            pdfPublicId: public_id,
                            thumbnailPublicId: public_id,
                        },
                    });

                    console.log('Document conversion completed:', public_id);
                } catch (error) {
                    console.error('Error updating document:', error);

                    await prisma.document.update({
                        where: { id: document.id },
                        data: { conversionStatus: 'failed' },
                    });
                }
            } else if (info_status === 'failed') {
                await prisma.document.update({
                    where: { id: document.id },
                    data: { conversionStatus: 'failed' },
                });

                console.error('Document conversion failed:', public_id);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return new NextResponse('Webhook error', { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
