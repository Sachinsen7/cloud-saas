'use client';

import React, { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import {
    Users,
    Eye,
    Smile,
    Scissors,
    Upload,
    Download,
    Copy,
    Zap,
    Target,
    Glasses,
} from 'lucide-react';

interface ProcessedFaceImage {
    id: string;
    title: string;
    publicId: string;
    faceCount: number;
    hasFaces: boolean;
    facialAttributes?: any[];
    facesBoundingBoxes?: any[];
    facialLandmarks?: any[];
    faceDetectionData?: any;
    originalUrl?: string;
    processedUrls?: any;
}

const FACE_FEATURES = [
    {
        id: 'face-detection',
        name: 'Face Detection',
        description: 'Detect and locate faces in images with bounding boxes',
        icon: Users,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
    },
    {
        id: 'face-crop',
        name: 'Smart Face Cropping',
        description: 'Automatically crop images to focus on detected faces',
        icon: Scissors,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
    },
    {
        id: 'face-overlay',
        name: 'Face & Eye Overlays',
        description: 'Add overlays precisely positioned on faces and eyes',
        icon: Target,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
    },
    {
        id: 'red-eye-removal',
        name: 'Advanced Red-Eye Removal',
        description: 'Remove red-eye effects using precise eye detection',
        icon: Eye,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
    },
];

export default function FaceStudio() {
    const [selectedFeature, setSelectedFeature] =
        useState<string>('face-detection');
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedImage, setProcessedImage] =
        useState<ProcessedFaceImage | null>(null);
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
            const response = await fetch('/api/face-detection', {
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

    const downloadProcessedImage = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    };

    const selectedFeatureData = FACE_FEATURES.find(
        (f) => f.id === selectedFeature
    );

    const renderFaceAttributes = (attributes: any[]) => {
        if (!attributes || attributes.length === 0) return null;

        return (
            <div className="space-y-4">
                <h4 className="font-semibold">
                    Detected Faces ({attributes.length}):
                </h4>
                {attributes.map((face, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Face {index + 1}</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {face.attributes?.glasses && (
                                <div className="flex items-center gap-2">
                                    <Glasses className="w-4 h-4" />
                                    <span>
                                        Glasses: {face.attributes.glasses}
                                    </span>
                                </div>
                            )}
                            {face.attributes?.blur && (
                                <div>
                                    <span>
                                        Blur Level:{' '}
                                        {face.attributes.blur.blurLevel}
                                    </span>
                                </div>
                            )}
                            {face.attributes?.exposure && (
                                <div>
                                    <span>
                                        Exposure:{' '}
                                        {face.attributes.exposure.exposureLevel}
                                    </span>
                                </div>
                            )}
                            {face.attributes?.noise && (
                                <div>
                                    <span>
                                        Noise Level:{' '}
                                        {face.attributes.noise.noiseLevel}
                                    </span>
                                </div>
                            )}
                            {face.attributes?.head_pose && (
                                <div className="col-span-2">
                                    <span>
                                        Head Pose: Pitch{' '}
                                        {face.attributes.head_pose.pitch}°, Roll{' '}
                                        {face.attributes.head_pose.roll}°, Yaw{' '}
                                        {face.attributes.head_pose.yaw}°
                                    </span>
                                </div>
                            )}
                        </div>

                        {face.bounding_box && (
                            <div className="mt-2 text-xs text-gray-500">
                                Position: ({face.bounding_box.left},{' '}
                                {face.bounding_box.top}) Size:{' '}
                                {face.bounding_box.width}×
                                {face.bounding_box.height}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-[#5754e8] bg-clip-text text-transparent">
                    Face Detection Studio
                </h1>
                <p className="text-lg text-gray-600">
                    Advanced facial attributes detection powered by Azure AI
                    Services
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {FACE_FEATURES.map((feature) => {
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
                                        <Zap className="w-4 h-4" />
                                        Detect Faces
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
                            Results & Preview
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
                                <div className="alert alert-success">
                                    <Users className="w-5 h-5" />
                                    <div>
                                        <h4 className="font-semibold">
                                            {processedImage.hasFaces
                                                ? `${processedImage.faceCount} face(s) detected!`
                                                : 'No faces detected in this image'}
                                        </h4>
                                        <p className="text-sm">
                                            Advanced facial analysis completed
                                        </p>
                                    </div>
                                </div>

                                {processedImage.processedUrls &&
                                    Object.keys(processedImage.processedUrls)
                                        .length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-2">
                                                Processed Results:
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {Object.entries(
                                                    processedImage.processedUrls
                                                ).map(([key, url]) => (
                                                    <div
                                                        key={key}
                                                        className="bg-gray-50 p-3 rounded-lg"
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h4 className="font-medium capitalize">
                                                                {key.replace(
                                                                    /([A-Z])/g,
                                                                    ' $1'
                                                                )}
                                                            </h4>
                                                            <button
                                                                className="btn btn-sm btn-outline"
                                                                onClick={() =>
                                                                    downloadProcessedImage(
                                                                        url as string,
                                                                        `${processedImage.title}_${key}.jpg`
                                                                    )
                                                                }
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="aspect-video bg-white rounded overflow-hidden">
                                                            <img
                                                                src={
                                                                    url as string
                                                                }
                                                                alt={`Processed: ${key}`}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                {processedImage.facialAttributes &&
                                    processedImage.facialAttributes.length >
                                    0 && (
                                        <div>
                                            <h3 className="font-semibold mb-2">
                                                Facial Analysis:
                                            </h3>
                                            {renderFaceAttributes(
                                                processedImage.facialAttributes
                                            )}
                                        </div>
                                    )}

                                {processedImage.faceDetectionData?.tags &&
                                    processedImage.faceDetectionData.tags
                                        .length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-2">
                                                Detection Tags:
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {processedImage.faceDetectionData.tags.map(
                                                    (
                                                        tag: string,
                                                        index: number
                                                    ) => (
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

                                {/* Cloudinary URLs for developers */}
                                {processedImage.processedUrls && (
                                    <div className="collapse collapse-arrow bg-base-200">
                                        <input type="checkbox" />
                                        <div className="collapse-title text-sm font-medium">
                                            Developer URLs (Click to expand)
                                        </div>
                                        <div className="collapse-content">
                                            <div className="space-y-2">
                                                {Object.entries(
                                                    processedImage.processedUrls
                                                ).map(([key, url]) => (
                                                    <div
                                                        key={key}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                                            {key}:
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={
                                                                url as string
                                                            }
                                                            readOnly
                                                            className="input input-xs input-bordered flex-1 font-mono text-xs"
                                                        />
                                                        <button
                                                            className="btn btn-xs btn-outline"
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    url as string
                                                                )
                                                            }
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
