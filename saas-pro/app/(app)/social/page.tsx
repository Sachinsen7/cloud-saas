"use client";

import React from "react";
import { useEffect, useState, useRef } from "react";
import { CldImage } from "next-cloudinary";

export const SOCIAL_FRAMES = {
  igSquare: {
    id: "ig-square",
    platform: "instagram",
    label: "Instagram Square",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  igPortrait: {
    id: "ig-portrait",
    platform: "instagram",
    label: "Instagram Portrait",
    width: 1080,
    height: 1350, // 4:5
    aspectRatio: "4:5",
  },
  xPost: {
    id: "x-post",
    platform: "x",
    label: "Twitter/X Post",
    width: 1200,
    height: 675, // 16:9
    aspectRatio: "16:9",
  },
  xHeader: {
    id: "x-header",
    platform: "x",
    label: "Twitter/X Header",
    width: 1500,
    height: 500, // 3:1
    aspectRatio: "3:1",
  },
  fbCover: {
    id: "fb-cover",
    platform: "facebook",
    label: "Facebook Cover",
    width: 820,
    height: 312, // 205:78
    aspectRatio: "205:78",
  },
};

type socialFormat = keyof typeof SOCIAL_FRAMES;

export default function SocialSqaure() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] =
    useState<socialFormat>("igSquare");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      setUploadedImage(data.public_id);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "-")
          .toLowerCase()}.png`;
        link.click();
        document.body.appendChild(link);
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      });
  };

  return <div>Social Square</div>;
}
