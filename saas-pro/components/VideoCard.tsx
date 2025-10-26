import React, { useState, useEffect, useCallback } from 'react';
import { Download, Clock, FileDown, FileUp } from 'lucide-react';
import { getCldOgImageUrl, getCldVideoUrl } from 'next-cloudinary';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { filesize } from 'filesize';


dayjs.extend(relativeTime);

interface VideoCardProps {
    video: {
        id: string;
        title: string;
        description: string | null;
        publicId: string;
        originalSize: string;
        compressedSize: string;
        duration: number;
        createdAt: Date | string;
        updatedAt: Date | string;
    };
    onDownload?: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [previewError, setPreviewError] = useState(false);

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldOgImageUrl({
            src: publicId,
            width: 300,
            height: 300,
            crop: 'scale',
            gravity: 'auto',
            format: 'jpg',
            quality: 'auto',
            assetType: 'video',
        });
    }, []);

    const getVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080,
        });
    }, []);

    const getPreviewVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 400,
            height: 225,
            quality: 'auto',
        });
    }, []);

    const formatSize = useCallback((size: number) => {
        return filesize(size);
    }, []);

    const formatDuration = useCallback((seconds: number) => {
        const minuits = Math.floor(seconds / 60);
        const secondsLeft = Math.floor(seconds % 60);
        return `${minuits}" ${secondsLeft.toString().padStart(2, '0')}"`;
    }, []);

    const compressionPercentage = Math.round(
        (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
    );

    useEffect(() => {
        setPreviewError(false);
    }, [isHovered]);

    const handlePreviewError = () => {
        setPreviewError(true);
    };
    return (
        <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <figure className="aspect-video relative">
                {isHovered ? (
                    previewError ? (
                        <div className="w-full h-full flex items-center justify-center bg-base-200">
                            <p className="text-error">
                                Preview not available
                            </p>
                        </div>
                    ) : (
                        <video
                            src={getPreviewVideoUrl(video.publicId)}
                            autoPlay
                            muted
                            loop
                            className="w-full h-full object-cover"
                            onError={handlePreviewError}
                        />
                    )
                ) : (
                    <img
                        src={getThumbnailUrl(video.publicId)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute bottom-2 right-2 bg-base-100 bg-opacity-70 px-2 py-1 rounded-lg text-sm flex items-center">
                    <Clock size={16} className="mr-1" />
                    {formatDuration(video.duration)}
                </div>
            </figure>
            <div className="card-body p-4">
                <h2 className="card-title text-lg font-bold">{video.title}</h2>
                <p className="text-sm text-base-content opacity-70 mb-4">
                    {video.description}
                </p>
                <p className="text-sm text-base-content opacity-70 mb-4">
                    Uploaded {dayjs(video.createdAt as string).fromNow()}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                        <FileUp size={18} className="mr-2 text-primary" />
                        <div>
                            <div className="font-semibold">Original</div>
                            <div>{formatSize(Number(video.originalSize))}</div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <FileDown size={18} className="mr-2 text-secondary" />
                        <div>
                            <div className="font-semibold">Compressed</div>
                            <div>
                                {formatSize(Number(video.compressedSize))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm font-semibold">
                        Compression:{' '}
                        <span className="text-accent">
                            {compressionPercentage}%
                        </span>
                    </div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                            if (onDownload) {
                                onDownload(
                                    getVideoUrl(video.publicId),
                                    video.title
                                );
                            } else {
                                const link = document.createElement('a');
                                link.href = getVideoUrl(video.publicId);
                                link.download = `${video.title}.mp4`;
                                link.click();
                            }
                        }}
                    >
                        <Download size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
