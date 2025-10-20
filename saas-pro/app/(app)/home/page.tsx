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
    const [error, setError] = useState(null);

    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get('/api/videos');
            if (Array.isArray(response.data)) {
                setVideos(response.data);
            } else {
                throw new Error('Invalid response data');
            }
        } catch (error: any) {
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
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Cloud SaaS Media Platform
                </h1>
                <p className="text-xl text-gray-600 mb-8">
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

            <div className="mb-8">
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
                ) : videos.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <VideoIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            No videos yet
                        </h3>
                        <p className="text-gray-500 mb-4">
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="stat bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl">
                    <div className="stat-figure text-blue-200">
                        <VideoIcon className="w-8 h-8" />
                    </div>
                    <div className="stat-title text-blue-100">Total Videos</div>
                    <div className="stat-value">{videos.length}</div>
                    <div className="stat-desc text-blue-200">
                        Uploaded and processed
                    </div>
                </div>

                <div className="stat bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl">
                    <div className="stat-figure text-purple-200">
                        <Wand2 className="w-8 h-8" />
                    </div>
                    <div className="stat-title text-purple-100">
                        AI Features
                    </div>
                    <div className="stat-value">9</div>
                    <div className="stat-desc text-purple-200">
                        Advanced AI tools available
                    </div>
                </div>

                <div className="stat bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl">
                    <div className="stat-figure text-teal-200">
                        <FileTextIcon className="w-8 h-8" />
                    </div>
                    <div className="stat-title text-teal-100">
                        Document Formats
                    </div>
                    <div className="stat-value">12</div>
                    <div className="stat-desc text-teal-200">
                        Office formats supported
                    </div>
                </div>

                <div className="stat bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl">
                    <div className="stat-figure text-green-200">
                        <Image className="w-8 h-8" />
                    </div>
                    <div className="stat-title text-green-100">
                        Social Formats
                    </div>
                    <div className="stat-value">5</div>
                    <div className="stat-desc text-green-200">
                        Social media formats supported
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
