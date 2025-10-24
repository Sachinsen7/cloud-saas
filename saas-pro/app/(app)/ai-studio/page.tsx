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
        description: 'Remove background from images using AI (Updated Method)',
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
            // Create a proper download link with CORS handling
            fetch(processedImage.processedUrl)
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${processedImage.title}_processed.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Download failed:', error);
                    // Fallback to direct link
                    const link = document.createElement('a');
                    link.href = processedImage.processedUrl;
                    link.download = `${processedImage.title}_processed.png`;
                    link.target = '_blank';
                    link.click();
                });
        }
    };

    const selectedFeatureData = AI_FEATURES.find(
        (f) => f.id === selectedFeature
    );

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-[#4d4af0] bg-clip-text text-transparent">
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
                            className={`card cursor-pointer transition-all duration-200 ${selectedFeature === feature.id
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
                                {/* Processed Images */}
                                {processedImage.processedUrl && (
                                    <div>
                                        <h3 className="font-semibold mb-2">
                                            Processed Image:
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Standard Background Removal */}
                                            <div className="bg-white p-3 rounded-lg border">
                                                <h4 className="font-medium mb-2">Standard Background Removal</h4>
                                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2">
                                                    <img
                                                        src={processedImage.processedUrl}
                                                        alt="Background Removed"
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = processedImage.processedUrl;
                                                        link.download = `${processedImage.title}_bg_removed.png`;
                                                        link.target = '_blank';
                                                        link.rel = 'noopener noreferrer';
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download PNG
                                                </button>
                                            </div>

                                            {/* Fine Edges Background Removal */}
                                            {processedImage.processedData?.fineEdgesUrl && (
                                                <div className="bg-white p-3 rounded-lg border">
                                                    <h4 className="font-medium mb-2">Fine Edges (Better Quality)</h4>
                                                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2">
                                                        <img
                                                            src={processedImage.processedData.fineEdgesUrl}
                                                            alt="Background Removed - Fine Edges"
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => {
                                                            const link = document.createElement('a');
                                                            link.href = processedImage.processedData.fineEdgesUrl;
                                                            link.download = `${processedImage.title}_fine_edges.png`;
                                                            link.click();
                                                        }}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download Fine Edges PNG
                                                    </button>
                                                </div>
                                            )}
                                        </div>
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

                                {/* AI Caption */}
                                {processedImage.processedData?.aiCaption && (
                                    <div>
                                        <h3 className="font-semibold mb-2">AI Caption:</h3>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-sm">{processedImage.processedData.aiCaption}</p>
                                            <button
                                                className="btn btn-sm btn-outline mt-2"
                                                onClick={() => copyToClipboard(processedImage.processedData.aiCaption)}
                                            >
                                                <Copy className="w-4 h-4" />
                                                Copy Caption
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Quality Analysis */}
                                {processedImage.processedData?.qualityScore !== undefined && (
                                    <div>
                                        <h3 className="font-semibold mb-2">Quality Analysis:</h3>
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="text-sm font-medium">Score: {(processedImage.processedData.qualityScore * 100).toFixed(1)}%</p>
                                                    <p className="text-sm">Level: <span className="capitalize">{processedImage.processedData.qualityLevel}</span></p>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-orange-500 h-2 rounded-full"
                                                            style={{ width: `${processedImage.processedData.qualityScore * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Watermark Detection */}
                                {processedImage.processedData?.watermarkDetected && (
                                    <div>
                                        <h3 className="font-semibold mb-2">Watermark Detection:</h3>
                                        <div className="bg-pink-50 p-4 rounded-lg">
                                            <span className={`badge ${processedImage.processedData.watermarkDetected === 'clean' ? 'badge-success' :
                                                processedImage.processedData.watermarkDetected === 'watermark' ? 'badge-warning' :
                                                    'badge-error'
                                                }`}>
                                                {processedImage.processedData.watermarkDetected.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Object Detection */}
                                {processedImage.processedData?.objectDetection && processedImage.processedData.objectDetection.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-2">Detected Objects:</h3>
                                        <div className="bg-teal-50 p-4 rounded-lg">
                                            <div className="space-y-2">
                                                {processedImage.processedData.objectDetection.slice(0, 5).map((obj: any, index: number) => (
                                                    <div key={index} className="flex justify-between items-center">
                                                        <span className="text-sm font-medium capitalize">{obj.object}</span>
                                                        <span className="text-xs text-gray-500">{(obj.confidence * 100).toFixed(1)}%</span>
                                                    </div>
                                                ))}
                                            </div>
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
