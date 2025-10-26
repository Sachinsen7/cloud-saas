'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import VideoCard from '@/components/VideoCard';
import AIFeatureShowcase from '@/components/AIFeatureCard';
import { Video } from '@/generated/prisma';
import {
    Upload,
    Video as VideoIcon,
    Wand2,
    Image,
    FileText as FileTextIcon,
    Brain as BrainIcon,
    Users as UsersIcon,
} from 'lucide-react';
import Link from 'next/link';

const Home = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get('/api/videos');
            if (Array.isArray(response.data)) {
                setVideos(response.data);
            } else {
                throw new Error('Invalid response data');
            }
        } catch (error: unknown) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleDownload = useCallback((url: string, title: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${title}.mp4`);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 text-primary">
                    Cloud SaaS Media Platform
                </h1>
                <p className="text-xl text-base-content/70 mb-8">
                    Upload, process, and transform your media with powerful AI
                    tools
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <Link href="/video-upload" className="btn btn-primary">
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Video
                    </Link>
                    <Link href="/ai-studio" className="btn btn-secondary">
                        <Wand2 className="w-5 h-5 mr-2" />
                        AI Studio
                    </Link>
                    <Link href="/face-studio" className="btn btn-success">
                        <UsersIcon className="w-5 h-5 mr-2" />
                        Face Studio
                    </Link>
                    <Link href="/ai-vision" className="btn btn-accent">
                        <BrainIcon className="w-5 h-5 mr-2" />
                        AI Vision
                    </Link>
                    <Link href="/document-studio" className="btn btn-info">
                        <FileTextIcon className="w-5 h-5 mr-2" />
                        Document Studio
                    </Link>
                    <Link href="/social" className="btn btn-outline">
                        <Image className="w-5 h-5 mr-2" />
                        Social Creator
                    </Link>
                </div>
            </div>

            <AIFeatureShowcase />

            <div className="  mt-12 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                        <VideoIcon className="w-8 h-8" />
                        Recent Videos
                    </h2>
                    <Link href="/videos" className="btn btn-outline">
                        View All Videos
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <div className="loading loading-spinner loading-lg"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-error/10 rounded-2xl">
                        <div className="text-error mb-4">
                            <svg
                                className="w-16 h-16 mx-auto mb-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-label="Error icon"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-error mb-2">
                            Error loading videos
                        </h3>
                        <p className="text-error/80 mb-4">
                            {error instanceof Error
                                ? error.message
                                : 'Failed to load videos'}
                        </p>
                        <button
                            onClick={() => {
                                setError(null);
                                fetchVideos();
                            }}
                            className="btn btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="text-center py-12 bg-base-200 rounded-2xl">
                        <VideoIcon className="w-16 h-16 mx-auto text-base-content/40 mb-4" />
                        <h3 className="text-xl font-semibold text-base-content/80 mb-2">
                            No videos yet
                        </h3>
                        <p className="text-base-content/60 mb-4">
                            Upload your first video to get started
                        </p>
                        <Link href="/video-upload" className="btn btn-primary">
                            <Upload className="w-5 h-5 mr-2" />
                            Upload Video
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.slice(0, 6).map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                onDownload={handleDownload}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
