"use client";

import React, { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import {
    Download,
    Eye,
    Trash2,
    Copy,
    Tag,
    FileText,
    Scissors,
    Sparkles
} from "lucide-react";

interface AIImage {
    id: string;
    title: string;
    description?: string;
    publicId: string;
    tags: string[];
    extractedText?: string;
    hasBackgroundRemoved: boolean;
    isEnhanced: boolean;
    createdAt: string;
}

export default function AIGallery() {
    const [images, setImages] = useState<AIImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<AIImage | null>(null);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch("/api/ai-images");
            if (response.ok) {
                const data = await response.json();
                setImages(data);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteImage = async (imageId: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            const response = await fetch(`/api/ai-images?id=${imageId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setImages(images.filter(img => img.id !== imageId));
                setSelectedImage(null);
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const getFilteredImages = () => {
        switch (filter) {
            case "background-removed":
                return images.filter(img => img.hasBackgroundRemoved);
            case "enhanced":
                return images.filter(img => img.isEnhanced);
            case "with-text":
                return images.filter(img => img.extractedText);
            case "tagged":
                return images.filter(img => img.tags.length > 0);
            default:
                return images;
        }
    };

    const filteredImages = getFilteredImages();

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">AI Gallery</h1>
                <a href="/ai-studio" className="btn btn-primary">
                    Process New Image
                </a>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFilter("all")}
                >
                    All Images ({images.length})
                </button>
                <button
                    className={`btn btn-sm ${filter === "background-removed" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFilter("background-removed")}
                >
                    <Scissors className="w-4 h-4" />
                    Background Removed
                </button>
                <button
                    className={`btn btn-sm ${filter === "enhanced" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFilter("enhanced")}
                >
                    <Sparkles className="w-4 h-4" />
                    Enhanced
                </button>
                <button
                    className={`btn btn-sm ${filter === "with-text" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFilter("with-text")}
                >
                    <FileText className="w-4 h-4" />
                    With Text
                </button>
                <button
                    className={`btn btn-sm ${filter === "tagged" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFilter("tagged")}
                >
                    <Tag className="w-4 h-4" />
                    Tagged
                </button>
            </div>

            {filteredImages.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        No images found
                    </div>
                    <a href="/ai-studio" className="btn btn-primary">
                        Process Your First Image
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredImages.map((image) => (
                        <div key={image.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                            <figure className="aspect-square relative">
                                <CldImage
                                    width={300}
                                    height={300}
                                    src={image.publicId}
                                    alt={image.title}
                                    className="w-full h-full object-cover"
                                />

                                {/* Processing badges */}
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    {image.hasBackgroundRemoved && (
                                        <div className="badge badge-error badge-sm">
                                            <Scissors className="w-3 h-3" />
                                        </div>
                                    )}
                                    {image.isEnhanced && (
                                        <div className="badge badge-secondary badge-sm">
                                            <Sparkles className="w-3 h-3" />
                                        </div>
                                    )}
                                    {image.extractedText && (
                                        <div className="badge badge-info badge-sm">
                                            <FileText className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="absolute top-2 right-2 flex flex-col gap-1">
                                    <button
                                        className="btn btn-circle btn-sm btn-primary"
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        className="btn btn-circle btn-sm btn-error"
                                        onClick={() => deleteImage(image.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </figure>

                            <div className="card-body p-4">
                                <h2 className="card-title text-sm">{image.title}</h2>

                                {image.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {image.tags.slice(0, 3).map((tag, index) => (
                                            <span key={index} className="badge badge-outline badge-xs">
                                                {tag}
                                            </span>
                                        ))}
                                        {image.tags.length > 3 && (
                                            <span className="badge badge-outline badge-xs">
                                                +{image.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="card-actions justify-end mt-2">
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${image.publicId}`;
                                            link.download = `${image.title}.jpg`;
                                            link.click();
                                        }}
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Detail Modal */}
            {selectedImage && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-4xl">
                        <h3 className="font-bold text-lg mb-4">{selectedImage.title}</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Image */}
                            <div>
                                <CldImage
                                    width={500}
                                    height={500}
                                    src={selectedImage.publicId}
                                    alt={selectedImage.title}
                                    className="w-full rounded-lg"
                                />
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                {selectedImage.description && (
                                    <div>
                                        <h4 className="font-semibold">Description:</h4>
                                        <p className="text-sm">{selectedImage.description}</p>
                                    </div>
                                )}

                                {selectedImage.tags.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold">AI Tags:</h4>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedImage.tags.map((tag, index) => (
                                                <span key={index} className="badge badge-primary">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedImage.extractedText && (
                                    <div>
                                        <h4 className="font-semibold">Extracted Text:</h4>
                                        <div className="bg-gray-50 p-3 rounded-lg mt-2">
                                            <p className="text-sm whitespace-pre-wrap">{selectedImage.extractedText}</p>
                                            <button
                                                className="btn btn-sm btn-outline mt-2"
                                                onClick={() => copyToClipboard(selectedImage.extractedText!)}
                                            >
                                                <Copy className="w-4 h-4" />
                                                Copy Text
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="font-semibold">Processing Applied:</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedImage.hasBackgroundRemoved && (
                                            <span className="badge badge-error">Background Removed</span>
                                        )}
                                        {selectedImage.isEnhanced && (
                                            <span className="badge badge-secondary">Enhanced</span>
                                        )}
                                        {selectedImage.extractedText && (
                                            <span className="badge badge-info">OCR Processed</span>
                                        )}
                                        {selectedImage.tags.length > 0 && (
                                            <span className="badge badge-success">Auto Tagged</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${selectedImage.publicId}`;
                                    link.download = `${selectedImage.title}.jpg`;
                                    link.click();
                                }}
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                            <button className="btn" onClick={() => setSelectedImage(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}