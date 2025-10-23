
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
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        example: 'Perfect for profile photos and Product images',

    },
    {
        id: 'ocr',
        name: 'Text Extraction (OCR)',
        description: 'Extract text from images, documents, and creenshots',
        icon: FileText,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        example: 'Digitize receipts, business cards, and documents',
    },
    {
        id: 'auto-tag',
        name: 'Smart Auto Tagging',
        description: 'Automatically categorize and tag your images with AI',
        icon: Tags,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        example: 'Organize your photo library Effortlessly',
    },
    {
        id: 'enhance',
        name: 'Image Enhancement',
        description:
            'Improve image quality, clarity, and lighting automatically',
        icon: Sparkles,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        example: 'Enhance old photos and low-quality images',
    },
    {
        id: 'quality-analysis',
        name: 'Quality Analysis',
        description: 'AI-powered image quality scoring and assessment',
        icon: Sparkles,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        example: 'Automatically assess image quality levels',
    },
    {
        id: 'watermark-detection',
        name: 'Watermark Detection',
        description: 'Detect watermarks and banners in images',
        icon: Scissors,
        color: 'text-pink-500',
        bgColor: 'bg-pink-50',
        example: 'Identify protected or branded content',
    },
    {
        id: 'captioning',
        name: 'AI Image Captioning',
        description: 'Generate descriptive captions for images automatically',
        icon: FileText,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-50',
        example: 'Create alt text and descriptions automatically',
    },
    {
        id: 'document-conversion',
        name: 'Document Conversion',
        description: 'Convert Office documents to PDF with Aspose AI',
        icon: FileText,
        color: 'text-teal-500',
        bgColor: 'bg-teal-50',
        example: 'Word, Excel, PowerPoint to PDF conversion',
    },
    {
        id: 'face-detection',
        name: 'Advanced Face Detection',
        description: 'Detect faces and facial attributes with Azure AI',
        icon: Sparkles,
        color: 'text-rose-500',
        bgColor: 'bg-rose-50',
        example: 'Face cropping, overlays, and red-eye removal',
    },
    {
        id: 'ai-vision',
        name: 'AI Vision Analysis',
        description: 'LLM-powered visual content understanding and analysis',
        icon: Wand2,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        example: 'Smart tagging, moderation, and general image analysis',
    },
];

export default function AIFeatureShowcase() {
    return (
        <div className="bg-gray-900/70  p-6 shadow-md  border-gray-700">

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 bg-[#5552dd] bg-clip-text text-transparent">
                    AI-Powered Image Processing
                </h2>
                <p className="text-gray-600 text-lg">
                    Transform your images with cutting-edge AI technology
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {AI_FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={feature.id}
                            className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 
             p-6 border border-gray-700/50 
             transition-all duration-300 ease-out"
                        >
                            <div
                                className={`w-12 h-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-4`}
                            >
                                <Icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">
                                {feature.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                                {feature.description}
                            </p>
                            <p className="text-xs text-gray-500 italic">
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
        </div >
    );
}
