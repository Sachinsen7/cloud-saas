# Cloud SaaS Media Platform - Data Flow Diagrams (DFD)

## Table of Contents
1. [Context Diagram (Level 0)](#1-context-diagram-level-0)
2. [System Overview (Level 1)](#2-system-overview-level-1)
3. [Detailed Process Flows (Level 2)](#3-detailed-process-flows-level-2)
4. [Data Dictionary](#4-data-dictionary)
5. [Sequence Diagrams](#5-sequence-diagrams)

---

## 1. CONTEXT DIAGRAM (Level 0)

### System Boundary and External Entities

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    │    EXTERNAL ENTITIES                │
                    │                                     │
                    └─────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
   ┌──────────┐              ┌──────────────────────┐           ┌──────────────┐
   │   End    │              │                      │           │   External   │
   │  Users   │◄────────────►│  CLOUD SAAS MEDIA   │◄─────────►│   Services   │
   │          │              │      PLATFORM        │           │              │
   └──────────┘              │                      │           └──────────────┘
        │                    │   (Next.js App)      │                  │
        │                    │                      │                  │
        │                    └──────────────────────┘                  │
        │                              │                               │
        │                              │                               │
        ▼                              ▼                               ▼
   ┌──────────┐              ┌──────────────────┐           ┌──────────────────┐
   │  Clerk   │              │   PostgreSQL     │           │   Cloudinary     │
   │  Auth    │              │   Database       │           │   Azure AI       │
   │ Service  │              │   (Neon DB)      │           │   Aspose API     │
   └──────────┘              └──────────────────┘           └──────────────────┘


### Data Flows (Level 0)

**Inputs from End Users:**
- Media files (videos, images, documents)
- User credentials (email, password)
- Processing parameters and configurations
- Search and filter queries

**Outputs to End Users:**
- Processed media files
- AI analysis results
- Download links and URLs
- Status notifications
- User interface responses

**External Service Interactions:**
- **Clerk**: Authentication tokens, user profiles
- **Cloudinary**: Media uploads, transformations, AI processing
- **Azure AI**: Facial analysis data
- **Aspose**: Document conversion results
- **PostgreSQL**: Data persistence and retrieval

---

## 2. SYSTEM OVERVIEW (Level 1)

### Main System Processes

```
### Main System Processes

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CLOUD SAAS MEDIA PLATFORM                         │
│                                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐           │
│  │   P1: User     │  │   P2: Media    │  │   P3: AI       │           │
│  │ Authentication │  │   Processing   │  │  Processing    │           │
│  │   & Session    │  │   & Storage    │  │   & Analysis   │           │
│  └────────────────┘  └────────────────┘  └────────────────┘           │
│         │                    │                    │                     │
│         │                    │                    │                     │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐           │
│  │   P4: Facial   │  │  P5: Document  │  │   P6: Data     │           │
│  │   Analysis &   │  │   Conversion   │  │  Management    │           │
│  │   Detection    │  │   & Storage    │  │   & Retrieval  │           │
│  └────────────────┘  └────────────────┘  └────────────────┘           │
│         │                    │                    │                     │
│         └────────────────────┴────────────────────┘                     │
│                              │                                          │
│                    ┌─────────▼─────────┐                               │
│                    │   D1: Database    │                               │
│                    │   (PostgreSQL)    │                               │
│                    └───────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────┘
```

```


### Process Descriptions (Level 1)

**P1: User Authentication & Session Management**
- Input: User credentials, session tokens
- Process: Validate user identity, manage sessions
- Output: Authentication status, user profile
- Data Store: Clerk authentication service
- Technology: Clerk SDK, JWT tokens

**P2: Media Processing & Storage**
- Input: Video/image files, processing parameters
- Process: Upload, compress, optimize, transform media
- Output: Processed media URLs, metadata
- Data Store: Cloudinary CDN, PostgreSQL
- Technology: Cloudinary API, Next.js API routes

**P3: AI Processing & Analysis**
- Input: Images, processing type selection
- Process: Background removal, OCR, tagging, enhancement
- Output: Processed images, extracted data, tags
- Data Store: PostgreSQL (results), Cloudinary (images)
- Technology: Cloudinary AI APIs, custom processing logic

**P4: Facial Analysis & Detection**
- Input: Images with faces
- Process: Detect faces, analyze attributes, extract landmarks
- Output: Face count, bounding boxes, facial attributes
- Data Store: PostgreSQL (analysis results)
- Technology: Azure AI Services, Cloudinary transformations

**P5: Document Conversion & Storage**
- Input: Office documents (Word, Excel, PowerPoint)
- Process: Upload, convert to PDF, generate thumbnails
- Output: PDF files, conversion status, thumbnails
- Data Store: Cloudinary (files), PostgreSQL (metadata)
- Technology: Aspose conversion API, webhooks

**P6: Data Management & Retrieval**
- Input: Query parameters, filters
- Process: Database queries, data aggregation
- Output: Structured data responses
- Data Store: PostgreSQL database
- Technology: Prisma ORM, SQL queries

---

## 3. DETAILED PROCESS FLOWS (Level 2)

### 3.1 Video Upload and Processing Flow

```
```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Select video file
     ▼
┌─────────────────────┐
│  P2.1: Validate     │
│  File (client-side) │
│  - Check file type  │
│  - Check file size  │
└─────────┬───────────┘
          │ 2. Valid file
          ▼
┌─────────────────────┐
│  P2.2: Upload to    │
│  API Endpoint       │
│  POST /api/video-   │
│  upload             │
└─────────┬───────────┘
          │ 3. FormData with file
          ▼
┌─────────────────────┐
│  P2.3: Authenticate │
│  Request (Clerk)    │
│  - Verify userId    │
└─────────┬───────────┘
          │ 4. Authenticated
          ▼
┌─────────────────────┐
│  P2.4: Convert to   │
│  Buffer & Upload    │
│  to Cloudinary      │
└─────────┬───────────┘
          │ 5. Video buffer
          ▼
┌─────────────────────┐
│  Cloudinary API     │
│  - Store video      │
│  - Compress (q_auto)│
│  - Generate URL     │
└─────────┬───────────┘
          │ 6. Upload result
          ▼
┌─────────────────────┐
│  P2.5: Save to      │
│  Database (Prisma)  │
│  - Video metadata   │
│  - Sizes, duration  │
└─────────┬───────────┘
          │ 7. Database record
          ▼
┌─────────────────────┐
│  P2.6: Return       │
│  Response to Client │
│  - Video ID         │
│  - URLs             │
│  - Metadata         │
└─────────┬───────────┘
          │ 8. JSON response
          ▼
┌──────────┐
│   User   │
│ (Success)│
└──────────┘
```


### 3.2 AI Image Processing Flow (Background Removal Example)

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Select image + choose "Background Removal"
     ▼
┌─────────────────────────────┐
│  P3.1: Client Validation    │
│  - File type check          │
│  - Preview generation       │
└─────────────┬───────────────┘
              │ 2. Valid image
              ▼
┌─────────────────────────────┐
│  P3.2: Upload to API        │
│  POST /api/ai-image-process │
│  - FormData with file       │
│  - processType parameter    │
└─────────────┬───────────────┘
              │ 3. Request data
              ▼
┌─────────────────────────────┐
│  P3.3: Authenticate & Parse │
│  - Verify Clerk userId      │
│  - Extract form data        │
└─────────────┬───────────────┘
              │ 4. Authenticated
              ▼
┌─────────────────────────────┐
│  P3.4: Upload to Cloudinary │
│  - Convert to buffer        │
│  - Upload to folder         │
└─────────────┬───────────────┘
              │ 5. Upload result (publicId)
              ▼
┌─────────────────────────────┐
│  P3.5: Process Background   │
│  Removal                    │
│  - Standard removal URL     │
│  - Fine edges URL           │
│  - Generate signed URLs     │
└─────────────┬───────────────┘
              │ 6. Processed URLs
              ▼
┌─────────────────────────────┐
│  P3.6: Save to Database     │
│  - Image metadata           │
│  - Processing results       │
│  - URLs and tags            │
└─────────────┬───────────────┘
              │ 7. Database record
              ▼
┌─────────────────────────────┐
│  P3.7: Return Response      │
│  - Image ID                 │
│  - Original URL             │
│  - Processed URLs           │
│  - Metadata                 │
└─────────────┬───────────────┘
              │ 8. JSON response
              ▼
┌──────────┐
│   User   │
│ (Display │
│ Results) │
└──────────┘
```


### 3.3 Facial Analysis Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Upload image + select face detection mode
     ▼
┌────────────────────────────┐
│  P4.1: Client Preparation  │
│  - File validation         │
│  - Mode selection          │
└────────────┬───────────────┘
             │ 2. Prepared request
             ▼
┌────────────────────────────┐
│  P4.2: API Request         │
│  POST /api/face-detection  │
│  - Image file              │
│  - Process type            │
└────────────┬───────────────┘
             │ 3. FormData
             ▼
┌────────────────────────────┐
│  P4.3: Upload with         │
│  Face Detection            │
│  - Cloudinary upload       │
│  - detection: 'adv_face'   │
└────────────┬───────────────┘
             │ 4. Upload result + face data
             ▼
┌────────────────────────────┐
│  P4.4: Extract Face Data   │
│  - Face count              │
│  - Bounding boxes          │
│  - Facial attributes       │
│  - Landmarks               │
└────────────┬───────────────┘
             │ 5. Structured face data
             ▼
┌────────────────────────────┐
│  P4.5: Generate            │
│  Transformations           │
│  - Face crop URLs          │
│  - Overlay URLs            │
│  - Red-eye removal         │
└────────────┬───────────────┘
             │ 6. Transformation URLs
             ▼
┌────────────────────────────┐
│  P4.6: Save to Database    │
│  - Facial attributes JSON  │
│  - Face count              │
│  - Bounding boxes          │
│  - Landmarks               │
└────────────┬───────────────┘
             │ 7. Database record
             ▼
┌────────────────────────────┐
│  P4.7: Return Results      │
│  - Face analysis data      │
│  - Processed image URLs    │
│  - Attribute details       │
└────────────┬───────────────┘
             │ 8. JSON response
             ▼
┌──────────┐
│   User   │
│ (View    │
│ Results) │
└──────────┘
```


### 3.4 Document Conversion Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Upload Office document
     ▼
┌──────────────────────────────┐
│  P5.1: Validate Document     │
│  - File type check           │
│  - Size limit (10MB)         │
│  - Format verification       │
└────────────┬─────────────────┘
             │ 2. Valid document
             ▼
┌──────────────────────────────┐
│  P5.2: Upload to API         │
│  POST /api/document-upload   │
│  - Document file             │
│  - Title, description        │
└────────────┬─────────────────┘
             │ 3. FormData
             ▼
┌──────────────────────────────┐
│  P5.3: Upload to Cloudinary  │
│  - resource_type: 'raw'      │
│  - raw_convert: 'aspose'     │
│  - notification_url set      │
└────────────┬─────────────────┘
             │ 4. Upload result
             ▼
┌──────────────────────────────┐
│  P5.4: Save to Database      │
│  - Original publicId         │
│  - Status: 'pending'         │
│  - File metadata             │
└────────────┬─────────────────┘
             │ 5. Database record
             ▼
┌──────────────────────────────┐
│  P5.5: Return Response       │
│  - Document ID               │
│  - Status: pending           │
│  - Message                   │
└────────────┬─────────────────┘
             │ 6. Initial response
             ▼
┌──────────┐
│   User   │
│ (Waiting)│
└──────────┘
             
             [Aspose processes in background]
             
┌──────────────────────────────┐
│  Aspose Conversion Service   │
│  - Convert to PDF            │
│  - Generate thumbnail        │
└────────────┬─────────────────┘
             │ 7. Conversion complete
             ▼
┌──────────────────────────────┐
│  P5.6: Webhook Handler       │
│  POST /api/document-webhook  │
│  - Conversion status         │
│  - PDF publicId              │
└────────────┬─────────────────┘
             │ 8. Update data
             ▼
┌──────────────────────────────┐
│  P5.7: Update Database       │
│  - Status: 'complete'        │
│  - PDF publicId              │
│  - Thumbnail publicId        │
└────────────┬─────────────────┘
             │ 9. Updated record
             ▼
┌──────────┐
│   User   │
│ (Refresh │
│  to see) │
└──────────┘
```


### 3.5 AI Vision Analysis Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Select mode (tagging/moderation/general)
     │    + Upload image + Define parameters
     ▼
┌────────────────────────────────┐
│  P3.1: Prepare Request         │
│  - Mode selection              │
│  - Tag definitions OR          │
│  - Moderation questions OR     │
│  - General prompts             │
└────────────┬───────────────────┘
             │ 2. Structured request
             ▼
┌────────────────────────────────┐
│  P3.2: Send to API             │
│  POST /api/ai-vision           │
│  - Mode                        │
│  - Image URL                   │
│  - Parameters (max 10)         │
└────────────┬───────────────────┘
             │ 3. JSON request
             ▼
┌────────────────────────────────┐
│  P3.3: Authenticate & Validate │
│  - Verify Clerk userId         │
│  - Validate parameters         │
└────────────┬───────────────────┘
             │ 4. Validated request
             ▼
┌────────────────────────────────┐
│  P3.4: Call Cloudinary         │
│  AI Vision API                 │
│  - Endpoint based on mode      │
│  - Basic auth with API keys    │
│  - Send image + parameters     │
└────────────┬───────────────────┘
             │ 5. API request
             ▼
┌────────────────────────────────┐
│  Cloudinary AI Vision          │
│  (LLM-powered analysis)        │
│  - Process image               │
│  - Generate responses          │
│  - Count tokens                │
└────────────┬───────────────────┘
             │ 6. Analysis results
             ▼
┌────────────────────────────────┐
│  P3.5: Process Results         │
│  - Extract analysis data       │
│  - Format responses            │
│  - Track token usage           │
└────────────┬───────────────────┘
             │ 7. Formatted results
             ▼
┌────────────────────────────────┐
│  P3.6: Update Database         │
│  (if publicId provided)        │
│  - Save AI Vision results      │
│  - Update token usage          │
└────────────┬───────────────────┘
             │ 8. Database updated
             ▼
┌────────────────────────────────┐
│  P3.7: Return Response         │
│  - Analysis results            │
│  - Confidence scores           │
│  - Token usage                 │
└────────────┬───────────────────┘
             │ 9. JSON response
             ▼
┌──────────┐
│   User   │
│ (Display │
│ Results) │
└──────────┘
```


### 3.6 Authentication Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Access protected route
     ▼
┌────────────────────────────┐
│  Middleware                │
│  (middleware.ts)           │
│  - Check route type        │
└────────────┬───────────────┘
             │ 2. Route check
             ▼
        ┌────┴────┐
        │ Public? │
        └────┬────┘
             │
      ┌──────┴──────┐
      │             │
     Yes           No
      │             │
      ▼             ▼
┌──────────┐  ┌────────────────────┐
│  Allow   │  │  P1.1: Check Clerk │
│  Access  │  │  Session           │
└──────────┘  │  - Verify JWT      │
              │  - Get userId      │
              └────────┬───────────┘
                       │ 3. Session check
                       ▼
                  ┌────┴────┐
                  │ Valid?  │
                  └────┬────┘
                       │
                ┌──────┴──────┐
                │             │
               Yes           No
                │             │
                ▼             ▼
         ┌──────────┐  ┌────────────┐
         │  Allow   │  │  Redirect  │
         │  Access  │  │  to        │
         │          │  │  /sign-in  │
         └──────────┘  └────────────┘
```


---

## 4. DATA DICTIONARY

### 4.1 Data Stores

#### D1: Video Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | String | Unique identifier | Primary Key, CUID |
| title | String | Video title | Required |
| description | String | Video description | Optional |
| publicId | String | Cloudinary public ID | Required, Unique |
| originalSize | String | Original file size (bytes) | Required |
| compressedSize | String | Compressed file size (bytes) | Required |
| duration | Float | Video duration (seconds) | Required |
| createdAt | DateTime | Creation timestamp | Auto-generated |
| updatedAt | DateTime | Last update timestamp | Auto-updated |

#### D2: Image Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | String | Unique identifier | Primary Key, CUID |
| title | String | Image title | Required |
| description | String | Image description | Optional |
| publicId | String | Cloudinary public ID | Required |
| originalSize | String | File size (bytes) | Required |
| fileType | String | File format (jpg, png, etc.) | Required |
| tags | String[] | AI-generated tags | Array |
| extractedText | String | OCR extracted text | Optional |
| hasBackgroundRemoved | Boolean | Background removal flag | Default: false |
| isEnhanced | Boolean | Enhancement flag | Default: false |
| aiCaption | String | AI-generated caption | Optional |
| objectDetection | JSON | Object detection data | Optional |
| qualityLevel | String | Quality assessment | Optional |
| qualityScore | Float | Quality score (0-1) | Optional |
| watermarkDetected | String | Watermark status | Optional |
| aiVisionGeneral | JSON | AI Vision general results | Optional |
| aiVisionModeration | JSON | Moderation results | Optional |
| aiVisionTags | JSON | Custom AI tags | Optional |
| tokensUsed | Integer | AI tokens consumed | Optional |
| faceCount | Integer | Number of faces | Optional |
| facesBoundingBoxes | JSON | Face locations | Optional |
| facialAttributes | JSON | Facial analysis data | Optional |
| facialLandmarks | JSON | Facial landmarks | Optional |
| hasFaces | Boolean | Face detection flag | Default: false |
| createdAt | DateTime | Creation timestamp | Auto-generated |
| updatedAt | DateTime | Last update timestamp | Auto-updated |

#### D3: Document Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | String | Unique identifier | Primary Key, CUID |
| title | String | Document title | Required |
| description | String | Document description | Optional |
| originalPublicId | String | Original file Cloudinary ID | Required |
| pdfPublicId | String | Converted PDF Cloudinary ID | Optional |
| thumbnailPublicId | String | Thumbnail Cloudinary ID | Optional |
| originalSize | String | File size (bytes) | Required |
| fileType | String | File extension | Required |
| conversionStatus | String | Conversion status | Default: 'pending' |
| pageCount | Integer | Number of pages | Optional |
| createdAt | DateTime | Creation timestamp | Auto-generated |
| updatedAt | DateTime | Last update timestamp | Auto-updated |

### 4.2 Data Flows

#### DF1: User Authentication Data
- **Source**: User (browser)
- **Destination**: Clerk Authentication Service
- **Content**: Email, password, session tokens
- **Format**: HTTPS POST request
- **Security**: TLS encryption, JWT tokens

#### DF2: Media Upload Data
- **Source**: User (browser)
- **Destination**: Next.js API Routes
- **Content**: File binary data, metadata
- **Format**: multipart/form-data
- **Size Limits**: Videos (configurable), Images (standard), Documents (10MB)

#### DF3: Cloudinary Processing Data
- **Source**: Next.js API Routes
- **Destination**: Cloudinary API
- **Content**: Media files, transformation parameters
- **Format**: Cloudinary SDK calls
- **Response**: Public IDs, URLs, metadata

#### DF4: AI Analysis Results
- **Source**: Cloudinary AI APIs / Azure AI
- **Destination**: PostgreSQL Database
- **Content**: Tags, scores, bounding boxes, attributes
- **Format**: JSON objects
- **Storage**: Structured in database tables

#### DF5: Database Query Results
- **Source**: PostgreSQL Database
- **Destination**: Next.js API Routes → User
- **Content**: Structured data records
- **Format**: JSON responses
- **Protocol**: HTTPS

---

## 5. SEQUENCE DIAGRAMS

### 5.1 Complete Image Processing Sequence

```
User          Client UI       API Route       Cloudinary      Database
 │                │               │               │               │
 │ Select Image   │               │               │               │
 │───────────────>│               │               │               │
 │                │               │               │               │
 │                │ Validate File │               │               │
 │                │──────────────>│               │               │
 │                │               │               │               │
 │                │ POST /api/    │               │               │
 │                │ ai-image-     │               │               │
 │                │ process       │               │               │
 │                │──────────────>│               │               │
 │                │               │               │               │
 │                │               │ Verify Auth   │               │
 │                │               │ (Clerk)       │               │
 │                │               │               │               │
 │                │               │ Upload Image  │               │
 │                │               │──────────────>│               │
 │                │               │               │               │
 │                │               │ Upload Result │               │
 │                │               │<──────────────│               │
 │                │               │               │               │
 │                │               │ Apply AI      │               │
 │                │               │ Processing    │               │
 │                │               │──────────────>│               │
 │                │               │               │               │
 │                │               │ Processed URLs│               │
 │                │               │<──────────────│               │
 │                │               │               │               │
 │                │               │ Save Metadata │               │
 │                │               │──────────────────────────────>│
 │                │               │               │               │
 │                │               │               │ Record Saved  │
 │                │               │<──────────────────────────────│
 │                │               │               │               │
 │                │ JSON Response │               │               │
 │                │<──────────────│               │               │
 │                │               │               │               │
 │ Display Results│               │               │               │
 │<───────────────│               │               │               │
```


### 5.2 Document Conversion with Webhook Sequence

```
User      Client UI    API Route    Cloudinary    Aspose    Webhook    Database
 │            │            │            │            │          │          │
 │ Upload Doc │            │            │            │          │          │
 │───────────>│            │            │            │          │          │
 │            │            │            │            │          │          │
 │            │ POST /api/ │            │            │          │          │
 │            │ document-  │            │            │          │          │
 │            │ upload     │            │            │          │          │
 │            │───────────>│            │            │          │          │
 │            │            │            │            │          │          │
 │            │            │ Upload Doc │            │          │          │
 │            │            │───────────>│            │          │          │
 │            │            │            │            │          │          │
 │            │            │            │ Trigger    │          │          │
 │            │            │            │ Aspose     │          │          │
 │            │            │            │───────────>│          │          │
 │            │            │            │            │          │          │
 │            │            │ Save Record│            │          │          │
 │            │            │ (pending)  │            │          │          │
 │            │            │───────────────────────────────────────────────>│
 │            │            │            │            │          │          │
 │            │ Response   │            │            │          │          │
 │            │ (pending)  │            │            │          │          │
 │            │<───────────│            │            │          │          │
 │            │            │            │            │          │          │
 │ Show Status│            │            │            │          │          │
 │<───────────│            │            │            │          │          │
 │            │            │            │            │          │          │
 │            │            │            │            │ Convert  │          │
 │            │            │            │            │ to PDF   │          │
 │            │            │            │            │          │          │
 │            │            │            │            │ Webhook  │          │
 │            │            │            │            │ Callback │          │
 │            │            │            │<──────────────────────│          │
 │            │            │            │            │          │          │
 │            │            │ POST /api/ │            │          │          │
 │            │            │ document-  │            │          │          │
 │            │            │ webhook    │            │          │          │
 │            │            │<───────────│            │          │          │
 │            │            │            │            │          │          │
 │            │            │ Update     │            │          │          │
 │            │            │ Status     │            │          │          │
 │            │            │ (complete) │            │          │          │
 │            │            │───────────────────────────────────────────────>│
 │            │            │            │            │          │          │
 │ Refresh    │            │            │            │          │          │
 │───────────>│            │            │            │          │          │
 │            │            │            │            │          │          │
 │            │ GET /api/  │            │            │          │          │
 │            │ documents  │            │            │          │          │
 │            │───────────>│            │            │          │          │
 │            │            │            │            │          │          │
 │            │            │ Query DB   │            │          │          │
 │            │            │───────────────────────────────────────────────>│
 │            │            │            │            │          │          │
 │            │            │ Results    │            │          │          │
 │            │            │<───────────────────────────────────────────────│
 │            │            │            │            │          │          │
 │            │ JSON       │            │            │          │          │
 │            │<───────────│            │            │          │          │
 │            │            │            │            │          │          │
 │ Show PDF   │            │            │            │          │          │
 │<───────────│            │            │            │          │          │
```


### 5.3 Authentication and Authorization Sequence

```
User        Browser      Middleware    Clerk API    API Route    Database
 │              │             │             │            │            │
 │ Access /home │             │             │            │            │
 │─────────────>│             │             │            │            │
 │              │             │             │            │            │
 │              │ Check Route │             │            │            │
 │              │────────────>│             │            │            │
 │              │             │             │            │            │
 │              │             │ Verify JWT  │            │            │
 │              │             │────────────>│            │            │
 │              │             │             │            │            │
 │              │             │ Token Valid │            │            │
 │              │             │<────────────│            │            │
 │              │             │             │            │            │
 │              │ Allow Access│             │            │            │
 │              │<────────────│             │            │            │
 │              │             │             │            │            │
 │ Page Loaded  │             │             │            │            │
 │<─────────────│             │             │            │            │
 │              │             │             │            │            │
 │ API Request  │             │             │            │            │
 │─────────────>│             │             │            │            │
 │              │             │             │            │            │
 │              │ POST /api/  │             │            │            │
 │              │ videos      │             │            │            │
 │              │────────────────────────────────────────>│            │
 │              │             │             │            │            │
 │              │             │             │            │ Verify User│
 │              │             │             │            │ (Clerk)    │
 │              │             │             │<───────────│            │
 │              │             │             │            │            │
 │              │             │             │ User Valid │            │
 │              │             │             │───────────>│            │
 │              │             │             │            │            │
 │              │             │             │            │ Query Data │
 │              │             │             │            │───────────>│
 │              │             │             │            │            │
 │              │             │             │            │ Results    │
 │              │             │             │            │<───────────│
 │              │             │             │            │            │
 │              │ JSON        │             │            │            │
 │              │ Response    │             │            │            │
 │<────────────────────────────────────────────────────│            │
 │              │             │             │            │            │
 │ Display Data │             │             │            │            │
 │<─────────────│             │             │            │            │
```


---

## 6. SYSTEM INTEGRATION DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL INTEGRATIONS                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐          ┌────────────────┐         ┌────────────────┐
│   Clerk Auth  │          │   Cloudinary   │         │   Azure AI     │
│               │          │                │         │   Services     │
│ • JWT Tokens  │          │ • Media Upload │         │                │
│ • User Mgmt   │          │ • Transform    │         │ • Face Detect  │
│ • Sessions    │          │ • AI Vision    │         │ • Attributes   │
└───────┬───────┘          │ • CDN Delivery │         │ • Landmarks    │
        │                  └────────┬───────┘         └────────┬───────┘
        │                           │                          │
        │                           │                          │
        └───────────────────────────┼──────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APPLICATION LAYER                       │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    MIDDLEWARE LAYER                         │    │
│  │  • Route Protection                                         │    │
│  │  • Authentication Check                                     │    │
│  │  • Request Validation                                       │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    API ROUTES LAYER                         │    │
│  │                                                             │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │    │
│  │  │   Video API  │  │  Image API   │  │  Document    │    │    │
│  │  │              │  │              │  │  API         │    │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │    │
│  │                                                             │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │    │
│  │  │  Face API    │  │ AI Vision    │  │  Auth API    │    │    │
│  │  │              │  │  API         │  │              │    │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    PRISMA ORM LAYER                         │    │
│  │  • Type-safe queries                                        │    │
│  │  • Connection pooling                                       │    │
│  │  • Migration management                                     │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE (Neon DB)                     │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Video Table  │  │ Image Table  │  │ Document     │             │
│  │              │  │              │  │ Table        │             │
│  │ • Metadata   │  │ • AI Results │  │ • Conversion │             │
│  │ • URLs       │  │ • Face Data  │  │ • Status     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```


---

## 7. ERROR HANDLING FLOW

```
┌──────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING STRATEGY                    │
└──────────────────────────────────────────────────────────────┘

User Request
     │
     ▼
┌─────────────────┐
│ Try Block       │
│ - Process       │
│ - Validate      │
│ - Execute       │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Error?  │
    └────┬────┘
         │
    ┌────┴────┐
    │   Yes   │   No
    │         │   │
    ▼         │   ▼
┌─────────────────┐  ┌─────────────────┐
│ Catch Block     │  │ Success         │
│                 │  │ Response        │
│ • Log error     │  │ - Status 200    │
│ • Classify type │  │ - JSON data     │
│ • Format msg    │  └─────────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Error Type Classification           │
│                                     │
│ • 400: Bad Request (validation)     │
│ • 401: Unauthorized (auth)          │
│ • 404: Not Found (resource)         │
│ • 500: Server Error (processing)    │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ Finally Block   │
│ - Close DB      │
│ - Cleanup       │
│ - Release       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return Error    │
│ Response        │
│ - Status code   │
│ - Error message │
│ - Details       │
└─────────────────┘
```


---

## 8. DATA TRANSFORMATION PIPELINE

### 8.1 Image Processing Pipeline

```
┌─────────────┐
│ Raw Image   │
│ Upload      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ Stage 1: Validation         │
│ • File type check           │
│ • Size validation           │
│ • Format verification       │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Stage 2: Buffer Conversion  │
│ • ArrayBuffer → Buffer      │
│ • Memory allocation         │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Stage 3: Cloudinary Upload  │
│ • Stream upload             │
│ • Folder organization       │
│ • Public ID generation      │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Stage 4: AI Processing      │
│ • Apply transformations     │
│ • Run AI analysis           │
│ • Generate URLs             │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Stage 5: Data Extraction    │
│ • Parse AI results          │
│ • Extract metadata          │
│ • Format responses          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Stage 6: Database Storage   │
│ • Create record             │
│ • Store JSON data           │
│ • Index for search          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────┐
│ Processed   │
│ Image Data  │
└─────────────┘
```


### 8.2 Facial Analysis Pipeline

```
┌─────────────┐
│ Image with  │
│ Faces       │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ Stage 1: Upload with        │
│ Face Detection              │
│ • detection: 'adv_face'     │
│ • Azure AI integration      │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Stage 2: Face Detection     │
│ • Locate faces (up to 64)   │
│ • Bounding box calculation  │
│ • Face count                │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Stage 3: Attribute Analysis │
│ • Glasses detection         │
│ • Blur assessment           │
│ • Exposure analysis         │
│ • Noise detection           │
│ • Head pose calculation     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Stage 4: Landmark Detection │
│ • Eye positions             │
│ • Nose location             │
│ • Mouth coordinates         │
│ • Facial outline            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Stage 5: Transformation     │
│ Generation                  │
│ • Face crop URLs            │
│ • Overlay URLs              │
│ • Red-eye removal           │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Stage 6: Data Structuring   │
│ • JSON formatting           │
│ • Metadata organization     │
│ • Database preparation      │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────┐
│ Complete    │
│ Facial Data │
└─────────────┘
```


---

## 9. SECURITY DATA FLOW

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│ User Request │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────┐
│ Layer 1: HTTPS/TLS          │
│ • Encrypted transmission    │
│ • Certificate validation    │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Layer 2: CORS               │
│ • Origin validation         │
│ • Method checking           │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Layer 3: Middleware         │
│ • Route protection          │
│ • Session validation        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Layer 4: Authentication     │
│ • JWT verification (Clerk)  │
│ • User ID extraction        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Layer 5: Input Validation   │
│ • File type whitelist       │
│ • Size limits               │
│ • Format verification       │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Layer 6: API Key Security   │
│ • Server-side only          │
│ • Environment variables     │
│ • Never exposed to client   │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Layer 7: Database Security  │
│ • SSL connections           │
│ • Parameterized queries     │
│ • Connection pooling        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Layer 8: Response Sanitize  │
│ • Remove sensitive data     │
│ • Format errors safely      │
└──────┬──────────────────────┘
       │
       ▼
┌──────────────┐
│ Secure       │
│ Response     │
└──────────────┘
```


---

## 10. PERFORMANCE OPTIMIZATION FLOW

```
┌─────────────────────────────────────────────────────────────┐
│              PERFORMANCE OPTIMIZATION STRATEGY               │
└─────────────────────────────────────────────────────────────┘

User Request
     │
     ▼
┌─────────────────────────────┐
│ Client-Side Optimization    │
│ • Code splitting            │
│ • Lazy loading              │
│ • Image optimization        │
│ • Browser caching           │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Network Optimization        │
│ • CDN delivery (Cloudinary) │
│ • Gzip/Brotli compression   │
│ • HTTP/2 multiplexing       │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Server-Side Optimization    │
│ • Serverless auto-scaling   │
│ • Edge functions            │
│ • Response caching          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Database Optimization       │
│ • Indexed queries           │
│ • Connection pooling        │
│ • Query optimization        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Media Optimization          │
│ • Automatic format (WebP)   │
│ • Quality optimization      │
│ • Responsive images         │
│ • Lazy loading              │
└──────┬──────────────────────┘
       │
       ▼
┌──────────────┐
│ Optimized    │
│ Response     │
└──────────────┘
```

---

## 11. SUMMARY

This comprehensive Data Flow Diagram documentation provides:

1. **Context Diagram**: High-level system overview with external entities
2. **Level 1 DFD**: Main system processes and data stores
3. **Level 2 DFDs**: Detailed process flows for each major feature
4. **Data Dictionary**: Complete data structure definitions
5. **Sequence Diagrams**: Time-based interaction flows
6. **Integration Diagram**: External service connections
7. **Error Handling**: Error management strategy
8. **Data Pipelines**: Transformation workflows
9. **Security Flow**: Multi-layer security implementation
10. **Performance Flow**: Optimization strategies

### Key Insights

**Data Flow Characteristics:**
- **Unidirectional**: Clear request-response patterns
- **Layered**: Separation of concerns (UI → API → Services → Database)
- **Asynchronous**: Webhook-based document conversion
- **Secure**: Multi-layer authentication and validation
- **Scalable**: Serverless architecture with auto-scaling

**Critical Data Paths:**
1. User → Middleware → API → Cloudinary → Database → User
2. User → API → Azure AI → Database → User
3. User → API → Cloudinary → Aspose → Webhook → Database → User

**Data Storage Strategy:**
- **Media Files**: Cloudinary CDN (distributed storage)
- **Metadata**: PostgreSQL (structured relational data)
- **AI Results**: JSON in PostgreSQL (flexible schema)
- **Session Data**: Clerk (external authentication service)

---

