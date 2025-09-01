import { v2 as cloudinary } from "cloudinary";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma/index";
import { Readable } from "stream";
import { auth } from "@clerk/nextjs/server";
const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResponse {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

function bufferToStream(buffer: Buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function POST(request: NextRequest) {
  try {
    console.log("API route called");

    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    console.log("User authenticated:", userId);

    try {
      await prisma.$connect();
      console.log("Database connected successfully");
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return new NextResponse("Database connection failed", { status: 500 });
    }

    console.log("Environment check:", {
      hasCloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    });

    if (!process.env.DATABASE_URL) {
      console.error("Missing DATABASE_URL");
      return new NextResponse(
        "Missing DATABASE_URL. Please check your .env.local file.",
        { status: 500 }
      );
    }

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Missing Cloudinary credentials");
      const missingVars = [];
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
        missingVars.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
      if (!process.env.CLOUDINARY_API_KEY)
        missingVars.push("CLOUDINARY_API_KEY");
      if (!process.env.CLOUDINARY_API_SECRET)
        missingVars.push("CLOUDINARY_API_SECRET");

      return new NextResponse(
        `Missing Cloudinary credentials: ${missingVars.join(
          ", "
        )}. Please check your .env.local file.`,
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    if (!title || title.trim() === "") {
      return new NextResponse("Title is required", { status: 400 });
    }

    console.log("Form data received:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      title,
      description,
      originalSize,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "saas-pro-videos-upload",
            transformation: [{ quality: "auto", fetch_format: "mp4" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResponse);
          }
        );
        bufferToStream(buffer).pipe(uploadStream);
      }
    );

    console.log("Cloudinary upload result:", {
      public_id: result.public_id,
      bytes: result.bytes,
      duration: result.duration,
    });

    if (!result.public_id) {
      throw new Error("Failed to get public_id from Cloudinary upload");
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: result.public_id,
        originalSize,
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("Error uploading video:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
    });
    return new NextResponse(
      `Error uploading video: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
