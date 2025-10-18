import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const documents = await prisma.document.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(documents);
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const documentId = searchParams.get("id");

        if (!documentId) {
            return new NextResponse("Document ID required", { status: 400 });
        }

        await prisma.document.delete({
            where: { id: documentId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting document:", error);
        return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}