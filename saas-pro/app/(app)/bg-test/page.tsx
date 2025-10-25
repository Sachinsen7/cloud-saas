"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";

export default function BackgroundRemovalTest() {
    const [testImageUrl, setTestImageUrl] = useState("");
    const [processedUrls, setProcessedUrls] = useState<any>({});

    const testImages = [
        {
            name: "Person Portrait",
            publicId: "samples/people/boy-snow-hoodie",
            description: "Test with a person photo"
        },
        {
            name: "Product Image",
            publicId: "samples/ecommerce/leather-bag-gray",
            description: "Test with a product photo"
        },
        {
            name: "Animal Photo",
            publicId: "samples/animals/kitten-playing",
            description: "Test with an animal photo"
        }
    ];

    const generateBackgroundRemovalUrls = (publicId: string) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

        const urls = {
            original: `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`,
            standard: `https://res.cloudinary.com/${cloudName}/image/upload/e_background_removal,f_png/${publicId}`,
            fineEdges: `https://res.cloudinary.com/${cloudName}/image/upload/e_background_removal:fineedges_y,f_png/${publicId}`,
            withShadow: `https://res.cloudinary.com/${cloudName}/image/upload/e_background_removal/e_dropshadow,f_png/${publicId}`,
        };

        setProcessedUrls(urls);
        setTestImageUrl(publicId);
    };

    const downloadImage = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4  bg-[#5754e8]  bg-clip-text text-transparent">
                    Background Removal Test
                </h1>
                <p className="text-lg text-gray-600">
                    Test the updated Cloudinary background removal functionality
                </p>
            </div>

            {/* Test Image Selection */}
            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <h2 className="card-title">Select Test Image</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {testImages.map((image, index) => (
                            <button
                                key={index}
                                className="btn btn-outline h-auto p-4 flex-col"
                                onClick={() => generateBackgroundRemovalUrls(image.publicId)}
                            >
                                <h3 className="font-semibold">{image.name}</h3>
                                <p className="text-sm opacity-70">{image.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            {testImageUrl && processedUrls.original && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Original Image */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Original Image</h2>
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={processedUrls.original}
                                    alt="Original"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Processed Images */}
                    <div className="space-y-4">
                        {/* Standard Background Removal */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body p-4">
                                <h3 className="font-semibold mb-2">Standard Background Removal</h3>
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                                    <img
                                        src={processedUrls.standard}
                                        alt="Background Removed"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => downloadImage(processedUrls.standard, 'bg_removed_standard.png')}
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>

                        {/* Fine Edges Background Removal */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body p-4">
                                <h3 className="font-semibold mb-2">Fine Edges (Better Quality)</h3>
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                                    <img
                                        src={processedUrls.fineEdges}
                                        alt="Background Removed - Fine Edges"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => downloadImage(processedUrls.fineEdges, 'bg_removed_fine_edges.png')}
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>

                        {/* With Drop Shadow */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body p-4">
                                <h3 className="font-semibold mb-2">With Drop Shadow</h3>
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                                    <img
                                        src={processedUrls.withShadow}
                                        alt="Background Removed with Shadow"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <button
                                    className="btn btn-sm btn-accent"
                                    onClick={() => downloadImage(processedUrls.withShadow, 'bg_removed_shadow.png')}
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="alert alert-info mt-8">
                <div>
                    <h3 className="font-bold">How to Test:</h3>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Click on one of the test images above</li>
                        <li>Compare the original with the processed versions</li>
                        <li>Try downloading the processed images</li>
                        <li>Check if the background removal is working properly</li>
                    </ol>
                </div>
            </div>

            {/* Technical Info */}
            <div className="alert alert-warning mt-4">
                <div>
                    <h3 className="font-bold">Updated Method:</h3>
                    <p className="mt-2">
                        We're now using <code>e_background_removal</code> instead of the deprecated <code>background: "remove"</code> method.
                        This should provide better results and proper PNG format with transparency.
                    </p>
                </div>
            </div>
        </div>
    );
}