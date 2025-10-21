# Cloud SaaS Media Platform

A comprehensive Next.js-based SaaS platform that provides advanced media processing, AI-powered image analysis, and document conversion capabilities. Built with modern web technologies and integrated with Cloudinary's powerful media management services.

## Overview

This platform combines video processing, AI-powered image analysis, document conversion, and social media content creation into a unified SaaS solution. It leverages Cloudinary's extensive API ecosystem to provide enterprise-grade media processing capabilities.

## Features

### Core Media Management
- **Video Upload and Processing**: Upload, compress, and manage video files with automatic optimization
- **Video Library**: Browse and download processed videos with compression analytics
- **Social Media Content Creator**: Transform images to popular social media formats
- **Responsive Media Delivery**: Optimized content delivery via Cloudinary CDN

### AI-Powered Image Processing
- **Background Removal**: AI-powered background removal with standard and fine-edge options
- **OCR Text Extraction**: Extract text from images, documents, and screenshots
- **Smart Auto Tagging**: Automatic image categorization and tagging
- **Image Enhancement**: Quality improvement using VIESUS technology
- **Quality Analysis**: AI-based image quality scoring and assessment
- **Watermark Detection**: Identify watermarks, banners, and clean images
- **AI Image Captioning**: Generate descriptive captions for accessibility
- **Object Detection**: Advanced object recognition with bounding boxes

### Advanced Facial Analysis
- **Face Detection**: Detect and analyze up to 64 faces per image using Azure AI Services
- **Smart Face Cropping**: Automatic cropping focused on detected faces
- **Facial Attribute Analysis**: Glasses detection, blur assessment, head pose analysis
- **Face and Eye Overlays**: Precise overlay positioning on faces and eyes
- **Advanced Red-Eye Removal**: Eye-detection based red-eye correction

### Document Processing
- **Office Document Conversion**: Convert Word, Excel, PowerPoint files to PDF using Aspose
- **Automatic Thumbnail Generation**: Generate preview thumbnails from documents
- **Conversion Status Tracking**: Real-time conversion progress monitoring
- **Multi-format Support**: Support for 12+ Office document formats

### AI Vision Analysis
- **Custom Tagging**: LLM-powered custom image tagging
- **Content Moderation**: AI-based content safety analysis
- **General Visual Analysis**: Flexible AI-powered image understanding

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Component library for rapid UI development
- **Lucide React**: Modern icon library

### Backend & Database
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Robust relational database (Neon DB)
- **Next.js API Routes**: Serverless API endpoints

### Authentication & Security
- **Clerk**: Complete authentication solution
- **Signed URLs**: Secure media delivery
- **Environment-based Configuration**: Secure credential management

### Media Processing Services
- **Cloudinary**: Primary media processing and storage
- **Azure AI Services**: Advanced facial attribute detection
- **Aspose**: Office document conversion
- **VIESUS**: Image enhancement technology

## Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- PostgreSQL database (Neon DB recommended)
- Cloudinary account
- Clerk account

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saas-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your_postgresql_connection_string"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
   CLOUDINARY_API_KEY="your_cloudinary_api_key"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
saas-pro/
├── app/
│   ├── (app)/                 # Protected app routes
│   │   ├── home/             # Dashboard
│   │   ├── videos/           # Video library
│   │   ├── video-upload/     # Video upload interface
│   │   ├── social/           # Social media creator
│   │   ├── ai-studio/        # AI image processing
│   │   ├── ai-gallery/       # Processed images gallery
│   │   ├── ai-vision/        # AI vision analysis
│   │   ├── face-studio/      # Facial analysis tools
│   │   └── document-studio/  # Document conversion
│   ├── (auth)/               # Authentication routes
│   ├── api/                  # API endpoints
│   │   ├── video-upload/     # Video processing API
│   │   ├── ai-image-process/ # AI image processing
│   │   ├── face-detection/   # Facial analysis API
│   │   ├── document-upload/  # Document conversion API
│   │   ├── ai-vision/        # AI vision API
│   │   └── generate-signed-urls/ # URL signing service
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── VideoCard.tsx         # Video display component
│   └── AIFeatureCard.tsx     # AI features showcase
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── types/
│   └── index.ts              # TypeScript type definitions
├── generated/
│   └── prisma/               # Generated Prisma client
└── public/                   # Static assets
```

## API Endpoints

### Media Processing
- `POST /api/video-upload` - Upload and process videos
- `POST /api/image-upload` - Basic image upload
- `GET /api/videos` - Retrieve video library
- `GET /api/ai-images` - Retrieve processed images

### AI Processing
- `POST /api/ai-image-process` - Process images with AI features
- `POST /api/face-detection` - Advanced facial analysis
- `POST /api/ai-vision` - AI vision analysis
- `POST /api/generate-signed-urls` - Generate authenticated URLs

### Document Processing
- `POST /api/document-upload` - Upload and convert documents
- `POST /api/document-webhook` - Handle conversion notifications
- `GET /api/documents` - Retrieve document library

## Database Schema

### Core Models

#### Video
- Stores video metadata, compression data, and processing information
- Tracks original and compressed file sizes with compression ratios

#### Image
- Comprehensive image metadata storage
- AI processing results including tags, extracted text, and analysis data
- Facial attribute detection results
- Quality scores and enhancement flags

#### Document
- Office document metadata and conversion tracking
- PDF conversion status and file references
- Thumbnail generation support

## Configuration

### Cloudinary Add-ons Required
- **AI Content Analysis**: Object detection, auto-tagging, quality analysis
- **Advanced Facial Attributes Detection**: Face detection and analysis
- **Background Removal**: AI-powered background removal
- **Aspose Document Conversion**: Office to PDF conversion

### Environment Variables

#### Required
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key

#### Optional
- `NEXT_PUBLIC_BASE_URL`: Base URL for webhooks (production)

## Usage Limits and Pricing

### Cloudinary Free Tier
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **AI Features**: 1,000 requests/month per feature
- **Face Detection**: 1,000 detections/month
- **Background Removal**: 1,000 transformations/month

### Paid Tiers
- **Storage**: $0.044 per GB/month
- **Bandwidth**: $0.045 per GB
- **AI Transformations**: $0.002 per request
- **Advanced Features**: Variable pricing based on usage

## Development

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Operations
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio for database management

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Setup for Production
- Configure webhook URLs for document conversion
- Set up proper CORS policies for media delivery
- Configure Cloudinary security settings
- Set up monitoring and logging

## Security Considerations

### Authentication
- All API routes protected with Clerk authentication
- User session validation on all requests
- Secure token handling

### Media Security
- Signed URLs for AI transformations
- Secure credential storage
- Environment-based configuration
- CORS protection for media assets

## Monitoring and Analytics

### Built-in Analytics
- Video upload and compression statistics
- AI processing usage tracking
- Document conversion success rates
- User engagement metrics

### External Monitoring
- Cloudinary usage dashboard
- Database performance monitoring
- Error tracking and logging

## Support and Documentation

### Cloudinary Documentation
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [AI Content Analysis](https://cloudinary.com/documentation/cloudinary_ai_content_analysis_addon)
- [Advanced Facial Attributes](https://cloudinary.com/documentation/advanced_facial_attributes_detection_addon)
- [Background Removal](https://cloudinary.com/documentation/background_removal)

### Framework Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)

## Contributing

### Development Guidelines
- Follow TypeScript best practices
- Use Prisma for all database operations
- Implement proper error handling
- Add appropriate loading states
- Test all AI features thoroughly

### Code Style
- ESLint configuration included
- Prettier formatting recommended
- Component-based architecture
- API route organization by feature

## License

This project is private and proprietary. All rights reserved.

## Version History

### Current Version
- Advanced AI image processing capabilities
- Facial attribute detection and analysis
- Document conversion with Aspose
- AI vision analysis integration
- Comprehensive media management system

---

For technical support or feature requests, please contact the development team.