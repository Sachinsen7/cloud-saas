# Cloud SaaS Media Platform - Entity Relationship Diagram

## Visual ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          CLOUD SAAS MEDIA PLATFORM                                  │
│                              DATABASE SCHEMA                                         │
└─────────────────────────────────────────────────────────────────────────────────────┘

                                ┌─────────────────┐
                                │      USER       │
                                │   (External)    │
                                │                 │
                                │ • userId (PK)   │
                                │ • email         │
                                │ • profile       │
                                │                 │
                                │ Managed by      │
                                │ Clerk Auth      │
                                └─────────┬───────┘
                                          │
                                          │ Creates/Owns
                                          │ (1:N)
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
        ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
        │       VIDEO         │ │       IMAGE         │ │     DOCUMENT        │
        │                     │ │                     │ │                     │
        │ ┌─────────────────┐ │ │ ┌─────────────────┐ │ │ ┌─────────────────┐ │
        │ │ id (PK)         │ │ │ │ id (PK)         │ │ │ │ id (PK)         │ │
        │ │ String/CUID     │ │ │ │ String/CUID     │ │ │ │ String/CUID     │ │
        │ └─────────────────┘ │ │ └─────────────────┘ │ │ └─────────────────┘ │
        │                     │ │                     │ │                     │
        │ • title             │ │ • title             │ │ • title             │
        │ • description?      │ │ • description?      │ │ • description?      │
        │ • publicId          │ │ • publicId          │ │ • originalPublicId  │
        │ • originalSize      │ │ • originalSize      │ │ • pdfPublicId?      │
        │ • compressedSize    │ │ • fileType          │ │ • thumbnailPublicId?│
        │ • duration          │ │ • tags[]            │ │ • originalSize      │
        │ • createdAt         │ │ • extractedText?    │ │ • fileType          │
        │ • updatedAt         │ │ • hasBackgroundRem  │ │ • conversionStatus  │
        │                     │ │ • isEnhanced        │ │ • pageCount?        │
        │                     │ │ • aiCaption?        │ │ • createdAt         │
        │                     │ │ • objectDetection   │ │ • updatedAt         │
        │                     │ │ • qualityLevel?     │ │                     │
        │                     │ │ • qualityScore?     │ │                     │
        │                     │ │ • watermarkDetected?│ │                     │
        │                     │ │ • aiVisionGeneral   │ │                     │
        │                     │ │ • aiVisionModeration│ │                     │
        │                     │ │ • aiVisionTags      │ │                     │
        │                     │ │ • tokensUsed?       │ │                     │
        │                     │ │ • faceCount?        │ │                     │
        │                     │ │ • facesBoundingBoxes│ │                     │
        │                     │ │ • facialAttributes  │ │                     │
        │                     │ │ • facialLandmarks   │ │                     │
        │                     │ │ • hasFaces          │ │                     │
        │                     │ │ • createdAt         │ │                     │
        │                     │ │ • updatedAt         │ │                     │
        └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
                │                           │                           │
                │                           │                           │
                ▼                           ▼                           ▼
    ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
    │   CLOUDINARY CDN    │     │   CLOUDINARY CDN    │     │   CLOUDINARY CDN    │
    │                     │     │                     │     │                     │
    │ • Video Storage     │     │ • Image Storage     │     │ • Document Storage  │
    │ • Compression       │     │ • AI Processing     │     │ • PDF Conversion    │
    │ • Streaming URLs    │     │ • Transformations   │     │ • Thumbnails        │
    │ • CDN Delivery      │     │ • CDN Delivery      │     │ • CDN Delivery      │
    └─────────────────────┘     └─────────────────────┘     └─────────────────────┘
                                            │
                                            │ AI Processing
                                            ▼
                                ┌─────────────────────┐
                                │  EXTERNAL AI APIs   │
                                │                     │
                                │ • Cloudinary AI     │
                                │   - Background Rem  │
                                │   - OCR             │
                                │   - Auto Tagging    │
                                │   - Enhancement     │
                                │   - Quality Analysis│
                                │   - Watermark Det   │
                                │   - AI Captioning   │
                                │   - Object Detection│
                                │   - AI Vision       │
                                │                     │
                                │ • Azure AI Services │
                                │   - Face Detection  │
                                │   - Facial Attrs    │
                                │   - Landmarks       │
                                │                     │
                                │ • Aspose API        │
                                │   - Doc Conversion  │
                                │   - PDF Generation  │
                                └─────────────────────┘
```

## Detailed Entity Specifications

### 1. VIDEO Entity

```
┌─────────────────────────────────────────────────────────────┐
│                        VIDEO TABLE                          │
├─────────────────────────────────────────────────────────────┤
│ Field Name       │ Data Type │ Constraints    │ Description │
├─────────────────────────────────────────────────────────────┤
│ id              │ String    │ PK, CUID       │ Unique ID   │
│ title           │ String    │ NOT NULL       │ Video title │
│ description     │ String?   │ NULLABLE       │ Description │
│ publicId        │ String    │ NOT NULL, UQ   │ Cloudinary  │
│ originalSize    │ String    │ NOT NULL       │ Bytes       │
│ compressedSize  │ String    │ NOT NULL       │ Bytes       │
│ duration        │ Float     │ NOT NULL       │ Seconds     │
│ createdAt       │ DateTime  │ DEFAULT NOW    │ Created     │
│ updatedAt       │ DateTime  │ AUTO UPDATE    │ Modified    │
└─────────────────────────────────────────────────────────────┘

Indexes:
• PRIMARY KEY (id)
• UNIQUE INDEX (publicId)
• INDEX (createdAt DESC) - for recent videos
```

### 2. IMAGE Entity (Comprehensive AI Storage)

```
┌─────────────────────────────────────────────────────────────┐
│                        IMAGE TABLE                          │
├─────────────────────────────────────────────────────────────┤
│ Field Name           │ Data Type │ Constraints │ Description │
├─────────────────────────────────────────────────────────────┤
│ id                  │ String    │ PK, CUID    │ Unique ID   │
│ title               │ String    │ NOT NULL    │ Image title │
│ description         │ String?   │ NULLABLE    │ Description │
│ publicId            │ String    │ NOT NULL,UQ │ Cloudinary  │
│ originalSize        │ String    │ NOT NULL    │ File size   │
│ fileType            │ String    │ NOT NULL    │ jpg,png,etc │
│ tags                │ String[]  │ ARRAY       │ AI tags     │
│ extractedText       │ String?   │ NULLABLE    │ OCR result  │
│ hasBackgroundRemoved│ Boolean   │ DEFAULT F   │ BG removed  │
│ isEnhanced          │ Boolean   │ DEFAULT F   │ Enhanced    │
│ aiCaption           │ String?   │ NULLABLE    │ AI caption  │
│ objectDetection     │ Json?     │ NULLABLE    │ Objects     │
│ qualityLevel        │ String?   │ NULLABLE    │ Quality lvl │
│ qualityScore        │ Float?    │ NULLABLE    │ 0-1 score   │
│ watermarkDetected   │ String?   │ NULLABLE    │ Watermark   │
│ aiVisionGeneral     │ Json?     │ NULLABLE    │ AI Vision   │
│ aiVisionModeration  │ Json?     │ NULLABLE    │ Moderation  │
│ aiVisionTags        │ Json?     │ NULLABLE    │ Custom tags │
│ tokensUsed          │ Int?      │ NULLABLE    │ AI tokens   │
│ faceCount           │ Int?      │ NULLABLE    │ Face count  │
│ facesBoundingBoxes  │ Json?     │ NULLABLE    │ Face coords │
│ facialAttributes    │ Json?     │ NULLABLE    │ Face attrs  │
│ facialLandmarks     │ Json?     │ NULLABLE    │ Landmarks   │
│ hasFaces            │ Boolean   │ DEFAULT F   │ Has faces   │
│ createdAt           │ DateTime  │ DEFAULT NOW │ Created     │
│ updatedAt           │ DateTime  │ AUTO UPDATE │ Modified    │
└─────────────────────────────────────────────────────────────┘

Indexes:
• PRIMARY KEY (id)
• UNIQUE INDEX (publicId)
• INDEX (hasFaces) - for face filtering
• INDEX (createdAt DESC) - for recent images
• INDEX (tags) - for tag searches (GIN index for arrays)
```

### 3. DOCUMENT Entity

```
┌─────────────────────────────────────────────────────────────┐
│                      DOCUMENT TABLE                         │
├─────────────────────────────────────────────────────────────┤
│ Field Name        │ Data Type │ Constraints    │ Description │
├─────────────────────────────────────────────────────────────┤
│ id               │ String    │ PK, CUID       │ Unique ID   │
│ title            │ String    │ NOT NULL       │ Doc title   │
│ description      │ String?   │ NULLABLE       │ Description │
│ originalPublicId │ String    │ NOT NULL       │ Original    │
│ pdfPublicId      │ String?   │ NULLABLE       │ PDF version │
│ thumbnailPublicId│ String?   │ NULLABLE       │ Thumbnail   │
│ originalSize     │ String    │ NOT NULL       │ File size   │
│ fileType         │ String    │ NOT NULL       │ doc,xlsx,etc│
│ conversionStatus │ String    │ DEFAULT pending│ Status      │
│ pageCount        │ Int?      │ NULLABLE       │ Page count  │
│ createdAt        │ DateTime  │ DEFAULT NOW    │ Created     │
│ updatedAt        │ DateTime  │ AUTO UPDATE    │ Modified    │
└─────────────────────────────────────────────────────────────┘

Indexes:
• PRIMARY KEY (id)
• INDEX (conversionStatus) - for status filtering
• INDEX (createdAt DESC) - for recent documents
• INDEX (fileType) - for type filtering
```

## Relationship Diagram

```
                    ┌─────────────────┐
                    │      USER       │
                    │   (Clerk Auth)  │
                    └─────────┬───────┘
                              │
                              │ userId (implicit)
                              │ 1:N relationship
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    VIDEO    │       │    IMAGE    │       │  DOCUMENT   │
│             │       │             │       │             │
│ Independent │       │ Independent │       │ Independent │
│ entities    │       │ entities    │       │ entities    │
│             │       │             │       │             │
│ No direct   │       │ No direct   │       │ No direct   │
│ foreign     │       │ foreign     │       │ foreign     │
│ keys        │       │ keys        │       │ keys        │
└─────────────┘       └─────────────┘       └─────────────┘
        │                     │                     │
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ Cloudinary  │       │ Cloudinary  │       │ Cloudinary  │
│ Video CDN   │       │ Image CDN   │       │ Document    │
│             │       │ + AI APIs   │       │ Storage +   │
│             │       │             │       │ Aspose API  │
└─────────────┘       └─────────────┘       └─────────────┘
```

## Data Flow Relationships

### User → Media Entities
```
User (Clerk)
    │
    ├── Creates Videos (1:N)
    │   └── Stores in VIDEO table
    │
    ├── Uploads Images (1:N)
    │   └── Stores in IMAGE table
    │   └── Processes with AI
    │
    └── Uploads Documents (1:N)
        └── Stores in DOCUMENT table
        └── Converts with Aspose
```

### Entity → External Service Relationships
```
VIDEO Entity
    │
    └── publicId → Cloudinary Video Storage
        ├── Original video file
        ├── Compressed version
        └── Streaming URLs

IMAGE Entity
    │
    └── publicId → Cloudinary Image Storage
        ├── Original image file
        ├── AI processed versions
        ├── Transformation URLs
        └── AI analysis results stored in JSON fields

DOCUMENT Entity
    │
    ├── originalPublicId → Cloudinary Raw Storage
    ├── pdfPublicId → Cloudinary PDF Storage (after conversion)
    └── thumbnailPublicId → Cloudinary Thumbnail
```

## JSON Field Structures

### IMAGE.objectDetection JSON Structure
```json
{
  "processType": "object-detection",
  "processedUrls": {
    "processedUrl": "https://...",
    "fineEdgesUrl": "https://..."
  },
  "processedAt": "2025-01-15T10:30:00Z",
  "originalData": [
    {
      "object": "person",
      "confidence": 0.95,
      "boundingBox": {
        "x": 100,
        "y": 150,
        "width": 200,
        "height": 300
      }
    }
  ]
}
```

### IMAGE.facialAttributes JSON Structure
```json
[
  {
    "bounding_box": {
      "top": 100,
      "left": 150,
      "width": 200,
      "height": 250
    },
    "attributes": {
      "glasses": "ReadingGlasses",
      "blur": {
        "blurLevel": "low",
        "value": 0.1
      },
      "exposure": {
        "exposureLevel": "goodExposure",
        "value": 0.7
      },
      "head_pose": {
        "pitch": 5.2,
        "roll": -1.8,
        "yaw": 12.3
      }
    }
  }
]
```

### IMAGE.aiVisionTags JSON Structure
```json
{
  "mode": "tagging",
  "analysis": {
    "tags": [
      {
        "name": "luxury",
        "confidence": 0.87
      },
      {
        "name": "outdoor",
        "confidence": 0.92
      }
    ]
  },
  "tokensUsed": 15,
  "processedAt": "2025-01-15T10:30:00Z"
}
```

## Database Constraints and Rules

### Primary Keys
- All entities use CUID (Collision-resistant Unique Identifier)
- Generated by Prisma: `@id @default(cuid())`

### Unique Constraints
- `VIDEO.publicId` - Unique Cloudinary identifier
- `IMAGE.publicId` - Unique Cloudinary identifier
- `DOCUMENT.originalPublicId` - Unique Cloudinary identifier

### Default Values
- `IMAGE.hasBackgroundRemoved` - false
- `IMAGE.isEnhanced` - false
- `IMAGE.hasFaces` - false
- `DOCUMENT.conversionStatus` - "pending"
- All `createdAt` fields - current timestamp
- All `updatedAt` fields - auto-update on modification

### Nullable Fields
- Optional descriptions across all entities
- AI processing results (only populated after processing)
- Document conversion results (only after successful conversion)

## Scalability Considerations

### Horizontal Scaling
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Read Replica  │    │  Primary DB     │    │   Read Replica  │
│   (Queries)     │    │ (Writes/Reads)  │    │   (Queries)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Connection Pool │
                    │   (Prisma)      │
                    └─────────────────┘
```

### Partitioning Strategy
```
Images Table Partitioning (Future):
├── images_2025_01 (January 2025)
├── images_2025_02 (February 2025)
└── images_2025_03 (March 2025)

Partition by: createdAt (monthly)
Benefits: Faster queries, easier archival
```

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Database Engine**: PostgreSQL 15+  
**ORM**: Prisma 6.15.0  
**Prepared By**: AI Technical Documentation System