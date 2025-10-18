import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Verify this is an Aspose conversion notification
        if (body.notification_type === "info" && body.info_kind === "aspose") {
            const { public_id, info_status } = body;

            // Find the document in our database
            const document = await prisma.document.findFirst({
                where: { originalPublicId: public_id }
            });

            if (!document) {
                console.error("Document not found for public_id:", public_id);
                return new NextResponse("Document not found", { status: 404 });
            }

            if (info_status === "complete") {
                // The PDF version is now available with the same public_id but as an image resource
                const pdfPublicId = `${public_id}.pdf`;

                try {
                    // Generate thumbnail from first page
                    const thumbnailPublicId = `${public_id}_thumb`;

                    // Update document status
                    await prisma.document.update({
                        where: { id: document.id },
                        data: {
                            conversionStatus: "complete",
                            pdfPublicId: public_id, // The converted PDF has the same public_id
                            thumbnailPublicId: public_id // We can use the same public_id for thumbnails
                        }
                    });

                    console.log("Document conversion completed:", public_id);
                } catch (error) {
                    console.error("Error updating document:", error);

                    await prisma.document.update({
                        where: { id: document.id },
                        data: { conversionStatus: "failed" }
                    });
                }
            } else if (info_status === "failed") {
                await prisma.document.update({
                    where: { id: document.id },
                    data: { conversionStatus: "failed" }
                });

                console.error("Document conversion failed:", public_id);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return new NextResponse("Webhook error", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}