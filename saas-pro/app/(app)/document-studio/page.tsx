'use client';

import React, { useState, useEffect } from 'react';
import {
    FileText,
    Upload,
    Download,
    Eye,
    Trash2,
    Clock,
    CheckCircle,
    XCircle,
    FileImage,
    FileText as FilePdf,
} from 'lucide-react';

interface Document {
    id: string;
    title: string;
    description?: string;
    originalPublicId: string;
    pdfPublicId?: string;
    thumbnailPublicId?: string;
    originalSize: string;
    fileType: string;
    conversionStatus: string;
    pageCount?: number;
    createdAt: string;
}

const SUPPORTED_FORMATS = [
    'doc',
    'docx',
    'docm',
    'dotx',
    'rtf',
    'txt',
    'xls',
    'xlsx',
    'xlsm',
    'pot',
    'potm',
    'potx',
    'pps',
    'ppsm',
    'pptx',
    'ppt',
    'pptm',
];

export default function DocumentStudio() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(
        null
    );
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await fetch('/api/documents');
            if (response.ok) {
                const data = await response.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setTitle(selectedFile.name.split('.')[0]);

            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !SUPPORTED_FORMATS.includes(fileExtension)) {
            alert(
                `Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`
            );
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10MB limit');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);

        try {
            const response = await fetch('/api/document-upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload document');
            }

            const result = await response.json();
            alert(
                'Document uploaded successfully! PDF conversion in progress...'
            );

            // Reset form
            setFile(null);
            setTitle('');
            setDescription('');
            setPreviewUrl(null);

            fetchDocuments();
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Failed to upload document. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'complete':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'failed':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'complete':
                return 'Converted';
            case 'failed':
                return 'Failed';
            default:
                return 'Converting...';
        }
    };

    const downloadPDF = (doc: Document) => {
        if (doc.pdfPublicId) {
            const pdfUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${doc.pdfPublicId}.pdf`;
            const link = window.document.createElement('a');
            link.href = pdfUrl;
            link.download = `${doc.title}.pdf`;
            link.click();
        }
    };

    const downloadOriginal = (doc: Document) => {
        const originalUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${doc.originalPublicId}`;
        const link = window.document.createElement('a');
        link.href = originalUrl;
        link.download = `${doc.title}.${doc.fileType}`;
        link.click();
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-[#5754e8] bg-clip-text text-transparent">
                    Document Studio
                </h1>
                <p className="text-lg text-gray-600">
                    Convert Office documents to PDF with Aspose AI
                </p>
            </div>

            {/* Upload Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Upload Document
                        </h2>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Select Document
                                </span>
                            </label>
                            <input
                                type="file"
                                accept=".doc,.docx,.docm,.dotx,.rtf,.txt,.xls,.xlsx,.xlsm,.pot,.potm,.potx,.pps,.ppsm,.pptx,.ppt,.pptm"
                                onChange={handleFileSelect}
                                className="file-input file-input-bordered file-input-primary w-full"
                            />
                            <label className="label">
                                <span className="label-text-alt">
                                    Supported: Word, Excel, PowerPoint files
                                    (max 10MB)
                                </span>
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input input-bordered w-full"
                                placeholder="Enter document title"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Description (Optional)
                                </span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="textarea textarea-bordered w-full"
                                placeholder="Enter description"
                                rows={3}
                            />
                        </div>

                        <div className="alert alert-info">
                            <FileText className="w-5 h-5" />
                            <div>
                                <h4 className="font-semibold">
                                    Aspose Document Conversion
                                </h4>
                                <p className="text-sm">
                                    Your document will be converted to PDF
                                    automatically using Aspose AI technology.
                                </p>
                            </div>
                        </div>

                        <div className="card-actions justify-end">
                            <button
                                className="btn btn-primary"
                                onClick={handleUpload}
                                disabled={!file || isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload Document
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            File Preview
                        </h2>

                        {file ? (
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8 text-blue-500" />
                                        <div>
                                            <h3 className="font-semibold">
                                                {file.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {(
                                                    file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{' '}
                                                MB •{' '}
                                                {file.type || 'Unknown type'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="alert alert-success">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>
                                        File ready for upload and conversion
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p>Select a document to see preview</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Documents List */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-4">Your Documents</h2>

                    {documents.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">
                                No documents uploaded yet
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Document</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Size</th>
                                        <th>Uploaded</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc) => (
                                        <tr key={doc.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-6 h-6 text-blue-500" />
                                                    <div>
                                                        <div className="font-bold">
                                                            {doc.title}
                                                        </div>
                                                        {doc.description && (
                                                            <div className="text-sm opacity-50">
                                                                {
                                                                    doc.description
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge badge-outline">
                                                    {doc.fileType.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(
                                                        doc.conversionStatus
                                                    )}
                                                    <span className="text-sm">
                                                        {getStatusText(
                                                            doc.conversionStatus
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                {(
                                                    parseInt(doc.originalSize) /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{' '}
                                                MB
                                            </td>
                                            <td>
                                                {new Date(
                                                    doc.createdAt
                                                ).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    {doc.conversionStatus ===
                                                        'complete' && (
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() =>
                                                                downloadPDF(doc)
                                                            }
                                                            title="Download PDF"
                                                        >
                                                            <FilePdf className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={() =>
                                                            downloadOriginal(
                                                                doc
                                                            )
                                                        }
                                                        title="Download Original"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-ghost"
                                                        onClick={() =>
                                                            setSelectedDocument(
                                                                doc
                                                            )
                                                        }
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {selectedDocument && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">
                            {selectedDocument.title}
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold">
                                        File Type:
                                    </h4>
                                    <p>
                                        {selectedDocument.fileType.toUpperCase()}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Status:</h4>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(
                                            selectedDocument.conversionStatus
                                        )}
                                        <span>
                                            {getStatusText(
                                                selectedDocument.conversionStatus
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold">
                                        File Size:
                                    </h4>
                                    <p>
                                        {(
                                            parseInt(
                                                selectedDocument.originalSize
                                            ) /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{' '}
                                        MB
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Uploaded:</h4>
                                    <p>
                                        {new Date(
                                            selectedDocument.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {selectedDocument.description && (
                                <div>
                                    <h4 className="font-semibold">
                                        Description:
                                    </h4>
                                    <p>{selectedDocument.description}</p>
                                </div>
                            )}

                            {selectedDocument.conversionStatus === 'complete' &&
                                selectedDocument.pdfPublicId && (
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            PDF Preview:
                                        </h4>
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <img
                                                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_400,h_300,c_fit/${selectedDocument.pdfPublicId}.jpg`}
                                                alt="Document preview"
                                                className="w-full rounded"
                                            />
                                        </div>
                                    </div>
                                )}
                        </div>

                        <div className="modal-action">
                            {selectedDocument.conversionStatus ===
                                'complete' && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        downloadPDF(selectedDocument)
                                    }
                                >
                                    <FilePdf className="w-4 h-4" />
                                    Download PDF
                                </button>
                            )}
                            <button
                                className="btn btn-outline"
                                onClick={() =>
                                    downloadOriginal(selectedDocument)
                                }
                            >
                                <Download className="w-4 h-4" />
                                Download Original
                            </button>
                            <button
                                className="btn"
                                onClick={() => setSelectedDocument(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
