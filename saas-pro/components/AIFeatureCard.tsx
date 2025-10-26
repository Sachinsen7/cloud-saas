import React from 'react';
import Link from 'next/link';
import {
    Wand2,
    Scissors,
    FileText,
    Tags,
    Sparkles,
    ArrowRight,
} from 'lucide-react';

const AI_FEATURES = [
    {
        id: 'background-removal',
        name: 'AI Background Removal',
        description:
            'Remove backgrounds from images instantly using advanced AI',
        icon: Scissors,
        color: 'text-error',
        bgColor: 'bg-error/10',
        example: 'Perfect for profile photos and Product images',
    },
    {
        id: 'ocr',
        name: 'Text Extraction (OCR)',
        description: 'Extract text from images, documents, and screenshots',
        icon: FileText,
        color: 'text-info',
        bgColor: 'bg-info/10',
        example: 'Digitize receipts, business cards, and documents',
    },
    {
        id: 'auto-tag',
        name: 'Smart Auto Tagging',
        description: 'Automatically categorize and tag your images with AI',
        icon: Tags,
        color: 'text-success',
        bgColor: 'bg-success/10',
        example: 'Organize your photo library effortlessly',
    },
    {
        id: 'enhance',
        name: 'Image Enhancement',
        description:
            'Improve image quality, clarity, and lighting automatically',
        icon: Sparkles,
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        example: 'Enhance old photos and low-quality images',
    },
    {
        id: 'quality-analysis',
        name: 'Quality Analysis',
        description: 'AI-powered image quality scoring and assessment',
        icon: Sparkles,
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        example: 'Automatically assess image quality levels',
    },
    {
        id: 'watermark-detection',
        name: 'Watermark Detection',
        description: 'Detect watermarks and banners in images',
        icon: Scissors,
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        example: 'Identify protected or branded content',
    },
    {
        id: 'captioning',
        name: 'AI Image Captioning',
        description: 'Generate descriptive captions for images automatically',
        icon: FileText,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        example: 'Create alt text and descriptions automatically',
    },
    {
        id: 'document-conversion',
        name: 'Document Conversion',
        description: 'Convert Office documents to PDF with Aspose AI',
        icon: FileText,
        color: 'text-info',
        bgColor: 'bg-info/10',
        example: 'Word, Excel, PowerPoint to PDF conversion',
    },
    {
        id: 'face-detection',
        name: 'Advanced Face Detection',
        description: 'Detect faces and facial attributes with Azure AI',
        icon: Sparkles,
        color: 'text-error',
        bgColor: 'bg-error/10',
        example: 'Face cropping, overlays, and red-eye removal',
    },
    {
        id: 'ai-vision',
        name: 'AI Vision Analysis',
        description: 'LLM-powered visual content understanding and analysis',
        icon: Wand2,
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        example: 'Smart tagging, moderation, and general image analysis',
    },
];

export default function AIFeatureShowcase() {
    return (
        <div className="bg-base-100 p-6 rounded-lg shadow-md">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-primary">
                    AI-Powered Image Processing
                </h2>
                <p className="text-base-content/70 text-lg">
                    Transform your images with cutting-edge AI technology
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {AI_FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={feature.id}
                            className="bg-base-100 p-6 border border-base-300 rounded-lg hover:shadow-lg hover:border-primary/30 transition-all duration-300 ease-out"
                        >
                            <div
                                className={`w-12 h-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-4`}
                            >
                                <Icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-base-content">
                                {feature.name}
                            </h3>
                            <p className="text-base-content/60 text-sm mb-3">
                                {feature.description}
                            </p>
                            <p className="text-xs text-base-content/50 italic">
                                {feature.example}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="text-center">
                <Link href="/ai-studio" className="btn btn-primary btn-lg">
                    <Wand2 className="w-5 h-5 mr-2" />
                    Try AI Studio Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
            </div>
        </div>
    );
}
