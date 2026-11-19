'use client';

import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MAX_VIDEO_SIZE_BYTES } from '@/lib/video';

export default function Video() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const router = useRouter();

    const [progress, setProgress] = useState(0);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
        if (file.size > MAX_VIDEO_SIZE_BYTES) {
            alert(
                `File size exceeds ${MAX_VIDEO_SIZE_BYTES / 1024 / 1024}MB. Please choose a smaller file.`
            );
            return;
        }

        setIsUploading(true);
        setProgress(0);

        try {
            setError(null);
            setSuccess(null);

            // 1. Get a signature from our server.
            const { data: sign } = await axios.post(
                '/api/video-upload-signature'
            );

            // 2. Upload straight to Cloudinary (bypasses the server's body limit).
            const cloudForm = new FormData();
            cloudForm.append('file', file);
            cloudForm.append('api_key', sign.apiKey);
            cloudForm.append('timestamp', String(sign.timestamp));
            cloudForm.append('signature', sign.signature);
            cloudForm.append('folder', sign.folder);
            cloudForm.append('transformation', sign.transformation);

            const { data: uploaded } = await axios.post(
                `https://api.cloudinary.com/v1_1/${sign.cloudName}/video/upload`,
                cloudForm,
                {
                    onUploadProgress: (e) => {
                        if (e.total) {
                            setProgress(Math.round((e.loaded / e.total) * 100));
                        }
                    },
                }
            );

            // 3. Save the record in our database.
            const response = await axios.post('/api/video-upload', {
                publicId: uploaded.public_id,
                title,
                description,
                originalSize: file.size.toString(),
                duration: uploaded.duration,
            });
            console.log('Video uploaded successfully:', response.data);
            setSuccess('Video uploaded successfully! Redirecting...');
            setTimeout(() => {
                router.push('/videos');
            }, 1500);
        } catch (error: unknown) {
            console.error('Error uploading video:', error);
            const data = (error as { response?: { data?: unknown } }).response
                ?.data;
            const cloudinaryMessage = (
                data as { error?: { message?: string } } | undefined
            )?.error?.message;
            setError(
                cloudinaryMessage ||
                    (typeof data === 'string' && data) ||
                    (error as { message?: string }).message ||
                    'Failed to upload video'
            );
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Upload Video</h1>

            {error && (
                <div className="alert alert-error mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div>
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="textarea textarea-bordered w-full"
                    />
                </div>
                <div>
                    <label className="label">
                        <span className="label-text">Video File</span>
                    </label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="file-input file-input-bordered w-full"
                        required
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isUploading}
                    >
                        {isUploading
                            ? `Uploading... ${progress}%`
                            : 'Upload Video'}
                    </button>
                    <a href="/videos" className="btn btn-outline">
                        View All Videos
                    </a>
                </div>
            </form>
        </div>
    );
}
