import { v2 as cloudinary, UploadStream } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResponse {
  public_id: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResponse>(
      (resolve, reject) => {
        const UploadStream = cloudinary.uploader.upload_stream(
          { folder: "saas-pro-next-cloudinary" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResponse);
            }
          }
        );

        UploadStream.end(buffer);
      }
    );

    return NextResponse.json(
      {
        publicId: result.public_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return new NextResponse("Error uploading image", { status: 500 });
  }
}
