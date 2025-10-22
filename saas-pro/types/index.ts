export interface Video {
    id: string;
    title: string;
    description: string | null;
    publicId: string;
    originalSize: string;
    compressedSize: string;
    duration: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Image {
    id: string;
    title: string;
    description?: string | null;
    publicId: string;
    originalSize: string;
    fileType: string;
    tags: string[];
    extractedText?: string | null;
    hasBackgroundRemoved: boolean;
    isEnhanced: boolean;
    aiCaption?: string | null;
    qualityScore?: number | null;
    qualityLevel?: string | null;
    watermarkDetected?: string | null;
    objectDetection?: any;
    aiVisionTags?: any;
    aiVisionModeration?: any;
    aiVisionGeneral?: any;
    tokensUsed?: number | null;
    // Advanced Facial Attributes Detection fields
    facialAttributes?: any;
    faceCount?: number | null;
    hasFaces: boolean;
    facesBoundingBoxes?: any;
    facialLandmarks?: any;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Document {
    id: string;
    title: string;
    description?: string | null;
    originalPublicId: string;
    pdfPublicId?: string | null;
    thumbnailPublicId?: string | null;
    originalSize: string;
    fileType: string;
    conversionStatus: string;
    pageCount?: number | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}
