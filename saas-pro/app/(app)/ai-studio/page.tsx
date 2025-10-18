'use client';

import React, { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import {
    Wand2,
    Scissors,
    FileText,
    Tags,
    Sparkles,
    Upload,
    Download,
    Copy,
    Eye,
} from 'lucide-react';

interface ProcessedImage {
    id: string;
    title: string;
    publicId: string;
    tags: string[];
    extractedText?: string;
    hasBackgroundRemoved: boolean;
    isEnhanced: boolean;
    processedData?: any;
    originalUrl?: string;
    processedUrl?: string;
}

const AI_FEATURES = [
    {
        id: 'background-removal',
        name: 'Background Removal',
        description: 'Remove background from images using AI',
        icon: Scissors,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
    },
    {
        id: 'ocr',
        name: 'Text Extraction (OCR)',
        description: 'Extract text from images and documents',
        icon: FileText,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
    },
    {
        id: 'auto-tag',
        name: 'Auto Tagging',
        description: 'Automatically tag and categorize images',
        icon: Tags,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
    },
    {
        id: 'enhance',
        name: 'Image Enhancement',
        description: 'Improve image quality and clarity',
        icon: Sparkles,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
    },
    {
        id: 'quality-analysis',
        name: 'Quality Analysis',
        description: 'Analyze image quality with AI scoring',
        icon: Eye,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
    },
    {
        id: 'watermark-detection',
        name: 'Watermark Detection',
        description: 'Detect watermarks and banners in images',
        icon: Wand2,
        color: 'text-pink-500',
        bgColor: 'bg-pink-50',
    },
    {
        id: 'captioning',
        name: 'AI Captioning',
        description: 'Generate descriptive captions for images',
        icon: FileText,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-50',
    },
    {
        id: 'object-detection',
        name: 'Object Detection',
        description: 'Detect and locate objects in images',
        icon: Eye,
        color: 'text-teal-500',
        bgColor: 'bg-teal-50',
    },
];

export default function AIStudio() {
    const [selectedFeature, setSelectedFeature] =
        useState<string>('background-removal');
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(
        null
    );
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setTitle(selectedFile.name.split('.')[0]);

            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);

            setProcessedImage(null);
        }
    };

    const handleProcess = async () => {
        if (!file) {
            alert('Please select a file first');
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('processType', selectedFeature);

        try {
            const response = await fetch('/api/ai-image-process', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process image');
            }

            const result = await response.json();
            setProcessedImage(result);
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Failed to process image. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const downloadProcessedImage = () => {
        if (processedImage?.processedUrl) {
            const link = document.createElement('a');
            link.href = processedImage.processedUrl;
            link.download = `${processedImage.title}_processed.png`;
            link.click();
        }
    };

    const selectedFeatureData = AI_FEATURES.find(
        (f) => f.id === selectedFeature
    );

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    AI Studio
                </h1>
                <p className="text-lg text-gray-600">
                    Transform your images with powerful AI features
                </p>
            </div>

            {/* Feature Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {AI_FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={feature.id}
                            className={`card cursor-pointer transition-all duration-200 ${
                                selectedFeature === feature.id
                                    ? 'ring-2 ring-primary shadow-lg'
                                    : 'hover:shadow-md'
                            }`}
                            onClick={() => setSelectedFeature(feature.id)}
                        >
                            <div className="card-body p-4 text-center">
                                <div
                                    className={`mx-auto w-12 h-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-3`}
                                >
                                    <Icon
                                        className={`w-6 h-6 ${feature.color}`}
                                    />
                                </div>
                                <h3 className="font-semibold text-sm">
                                    {feature.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Upload & Configure
                        </h2>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Select Image</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="file-input file-input-bordered file-input-primary w-full"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input input-bordered w-full"
                                placeholder="Enter image title"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Description (Optional)
                                </span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="textarea textarea-bordered w-full"
                                placeholder="Enter description"
                                rows={3}
                            />
                        </div>

                        {selectedFeatureData && (
                            <div className="alert alert-info">
                                <div className="flex items-center gap-2">
                                    <selectedFeatureData.icon className="w-5 h-5" />
                                    <div>
                                        <h4 className="font-semibold">
                                            {selectedFeatureData.name}
                                        </h4>
                                        <p className="text-sm">
                                            {selectedFeatureData.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="card-actions justify-end">
                            <button
                                className="btn btn-primary"
                                onClick={handleProcess}
                                disabled={!file || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-4 h-4" />
                                        Process Image
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            Preview & Results
                        </h2>

                        {previewUrl && (
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">
                                    Original Image:
                                </h3>
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        )}

                        {processedImage && (
                            <div className="space-y-4">
                                {/* Processed Image */}
                                {processedImage.processedUrl && (
                                    <div>
                                        <h3 className="font-semibold mb-2">
                                            Processed Image:
                                        </h3>
                                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={
                                                    processedImage.processedUrl
                                                }
                                                alt="Processed"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <button
                                            className="btn btn-sm btn-primary mt-2"
                                            onClick={downloadProcessedImage}
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    </div>
                                )}

                                {/* OCR Results */}
                                {processedImage.extractedText && (
                                    <div>
                                        <h3 className="font-semibold mb-2">
                                            Extracted Text:
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm whitespace-pre-wrap">
                                                {processedImage.extractedText}
                                            </p>
                                            <button
                                                className="btn btn-sm btn-outline mt-2"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        processedImage.extractedText!
                                                    )
                                                }
                                            >
                                                <Copy className="w-4 h-4" />
                                                Copy Text
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {processedImage.tags &&
                                    processedImage.tags.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-2">
                                                AI Tags:
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {processedImage.tags.map(
                                                    (tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="badge badge-primary badge-sm"
                                                        >
                                                            {tag}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Success Message */}
                                <div className="alert alert-success">
                                    <span>
                                        ✅ Image processed successfully!
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
