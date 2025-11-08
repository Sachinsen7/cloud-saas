import {
    LayoutDashboardIcon,
    Share2Icon,
    UploadIcon,
    ImageIcon,
    Wand2Icon,
    GalleryHorizontalIcon,
    FileTextIcon,
    BrainIcon,
    UsersIcon,
    LockIcon,
} from 'lucide-react';

export interface Feature {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description: string;
    isPremium: boolean;
    category: 'media' | 'ai' | 'utility';
}

export const FREE_FEATURES: Feature[] = [
    {
        href: '/home',
        icon: LayoutDashboardIcon,
        label: 'Home',
        description: 'Dashboard and overview',
        isPremium: false,
        category: 'utility',
    },
    {
        href: '/videos',
        icon: ImageIcon,
        label: 'Video Gallery',
        description: 'View and manage your videos',
        isPremium: false,
        category: 'media',
    },
    {
        href: '/video-upload',
        icon: UploadIcon,
        label: 'Video Upload',
        description: 'Upload and compress videos',
        isPremium: false,
        category: 'media',
    },
    {
        href: '/social',
        icon: Share2Icon,
        label: 'Social Share',
        description: 'Share media on social platforms',
        isPremium: false,
        category: 'utility',
    },
    {
        href: '/ai-studio',
        icon: Wand2Icon,
        label: 'AI Studio',
        description: '8 AI-powered image processing features',
        isPremium: false,
        category: 'ai',
    },
    {
        href: '/ai-gallery',
        icon: GalleryHorizontalIcon,
        label: 'AI Gallery',
        description: 'Browse AI-processed images',
        isPremium: false,
        category: 'ai',
    },
];

export const PREMIUM_FEATURES: Feature[] = [
    {
        href: '/ai-gallery',
        icon: GalleryHorizontalIcon,
        label: 'AI Gallery',
        description: 'Browse AI-processed images',
        isPremium: true,
        category: 'ai',
    },
    {
        href: '/ai-vision',
        icon: BrainIcon,
        label: 'AI Vision',
        description: 'LLM-powered visual content analysis',
        isPremium: true,
        category: 'ai',
    },
    {
        href: '/face-studio',
        icon: UsersIcon,
        label: 'Face Studio',
        description: 'Advanced facial analysis and detection',
        isPremium: true,
        category: 'ai',
    },
    {
        href: '/document-studio',
        icon: FileTextIcon,
        label: 'Document Studio',
        description: 'Convert documents with AI',
        isPremium: true,
        category: 'ai',
    },
];

export const ALL_FEATURES = [...FREE_FEATURES, ...PREMIUM_FEATURES];

export const getFeatureByHref = (href: string): Feature | undefined => {
    return ALL_FEATURES.find((feature) => feature.href === href);
};

export const isPremiumFeature = (href: string): boolean => {
    return PREMIUM_FEATURES.some((feature) => feature.href === href);
};

