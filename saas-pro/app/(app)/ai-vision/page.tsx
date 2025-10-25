'use client';

import React, { useState } from 'react';

import {
    Brain,
    Tags,
    Shield,
    MessageSquare,
    Eye,
    Plus,
    Minus,
    Loader2,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from 'lucide-react';

interface TagDefinition {
    name: string;
    description: string;
}

interface AIVisionResult {
    mode: string;
    data: {
        tags?: Array<{ name: string; confidence: number }>;
        responses?: Array<{
            text: string;
            value: string;
            prompt?: string;
        }>;
        [key: string]: unknown;
    };
    tokensUsed: number;
}

const AI_VISION_MODES = [
    {
        id: 'tagging',
        name: 'Smart Tagging',
        description: 'Tag images based on custom definitions',
        icon: Tags,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        example: 'Define custom tags like "luxury", "outdoor", "professional"',
    },
    {
        id: 'moderation',
        name: 'Content Moderation',
        description: 'Evaluate images against specific criteria',
        icon: Shield,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        example: 'Ask yes/no questions about content policy compliance',
    },
    {
        id: 'general',
        name: 'General Analysis',
        description: 'Ask open-ended questions about images',
        icon: MessageSquare,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        example: 'Get detailed descriptions and insights about any image',
    },
];

export default function AIVision() {
    const [selectedMode, setSelectedMode] = useState<string>('tagging');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<AIVisionResult | null>(null);

    const [tagDefinitions, setTagDefinitions] = useState<TagDefinition[]>([
        { name: '', description: '' },
    ]);

    const [rejectionQuestions, setRejectionQuestions] = useState<string[]>([
        '',
    ]);

    const [prompts, setPrompts] = useState<string[]>(['']);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            setResults(null);
        }
    };

    const addTagDefinition = () => {
        if (tagDefinitions.length < 10) {
            setTagDefinitions([
                ...tagDefinitions,
                { name: '', description: '' },
            ]);
        }
    };

    const removeTagDefinition = (index: number) => {
        if (tagDefinitions.length > 1) {
            setTagDefinitions(tagDefinitions.filter((_, i) => i !== index));
        }
    };

    const updateTagDefinition = (
        index: number,
        field: 'name' | 'description',
        value: string
    ) => {
        const updated = [...tagDefinitions];
        updated[index][field] = value;
        setTagDefinitions(updated);
    };

    const addQuestion = () => {
        if (rejectionQuestions.length < 10) {
            setRejectionQuestions([...rejectionQuestions, '']);
        }
    };

    const removeQuestion = (index: number) => {
        if (rejectionQuestions.length > 1) {
            setRejectionQuestions(
                rejectionQuestions.filter((_, i) => i !== index)
            );
        }
    };

    const updateQuestion = (index: number, value: string) => {
        const updated = [...rejectionQuestions];
        updated[index] = value;
        setRejectionQuestions(updated);
    };

    const addPrompt = () => {
        if (prompts.length < 10) {
            setPrompts([...prompts, '']);
        }
    };

    const removePrompt = (index: number) => {
        if (prompts.length > 1) {
            setPrompts(prompts.filter((_, i) => i !== index));
        }
    };

    const updatePrompt = (index: number, value: string) => {
        const updated = [...prompts];
        updated[index] = value;
        setPrompts(updated);
    };

    const handleAnalyze = async () => {
        if (!file || !previewUrl) {
            alert('Please select an image first');
            return;
        }

        setIsProcessing(true);

        try {
            const requestData: {
                mode: string;
                imageUrl: string;
                tagDefinitions?: TagDefinition[];
                rejectionQuestions?: string[];
                prompts?: string[];
            } = {
                mode: selectedMode,
                imageUrl: previewUrl,
            };

            switch (selectedMode) {
                case 'tagging':
                    const validTags = tagDefinitions.filter(
                        (tag) => tag.name.trim() && tag.description.trim()
                    );
                    if (validTags.length === 0) {
                        alert('Please add at least one valid tag definition');
                        return;
                    }
                    requestData.tagDefinitions = validTags;
                    break;

                case 'moderation':
                    const validQuestions = rejectionQuestions.filter((q) =>
                        q.trim()
                    );
                    if (validQuestions.length === 0) {
                        alert('Please add at least one moderation question');
                        return;
                    }
                    requestData.rejectionQuestions = validQuestions;
                    break;

                case 'general':
                    const validPrompts = prompts.filter((p) => p.trim());
                    if (validPrompts.length === 0) {
                        alert('Please add at least one prompt');
                        return;
                    }
                    requestData.prompts = validPrompts;
                    break;
            }

            const response = await fetch('/api/ai-vision', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('AI Vision analysis failed');
            }

            const result = await response.json();
            setResults({
                mode: selectedMode,
                data: result.data.analysis,
                tokensUsed: result.limits?.usage?.count || 0,
            });
        } catch (error) {
            console.error('AI Vision error:', error);
            alert('AI Vision analysis failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const selectedModeData = AI_VISION_MODES.find((m) => m.id === selectedMode);

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-[#5754e8] bg-clip-text text-transparent">
                    AI Vision Studio
                </h1>
                <p className="text-lg text-gray-600">
                    Advanced LLM-powered visual content analysis
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {AI_VISION_MODES.map((mode) => {
                    const Icon = mode.icon;
                    return (
                        <div
                            key={mode.id}
                            className={`card cursor-pointer transition-all duration-200 ${
                                selectedMode === mode.id
                                    ? 'ring-2 ring-primary shadow-lg'
                                    : 'hover:shadow-md'
                            }`}
                            onClick={() => setSelectedMode(mode.id)}
                        >
                            <div className="card-body p-6 text-center">
                                <div
                                    className={`mx-auto w-12 h-12 rounded-full ${mode.bgColor} flex items-center justify-center mb-4`}
                                >
                                    <Icon className={`w-6 h-6 ${mode.color}`} />
                                </div>
                                <h3 className="font-bold text-lg mb-2">
                                    {mode.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    {mode.description}
                                </p>
                                <p className="text-xs text-gray-500 italic">
                                    {mode.example}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            Configure Analysis
                        </h2>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text">Select Image</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="file-input file-input-bordered file-input-primary w-full"
                            />
                        </div>

                        {selectedModeData && (
                            <div className="alert alert-info mb-6">
                                <div className="flex items-center gap-2">
                                    <selectedModeData.icon className="w-5 h-5" />
                                    <div>
                                        <h4 className="font-semibold">
                                            {selectedModeData.name}
                                        </h4>
                                        <p className="text-sm">
                                            {selectedModeData.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedMode === 'tagging' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">
                                        Tag Definitions
                                    </h3>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={addTagDefinition}
                                        disabled={tagDefinitions.length >= 10}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Tag
                                    </button>
                                </div>
                                {tagDefinitions.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-4 space-y-2"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">
                                                Tag {index + 1}
                                            </span>
                                            {tagDefinitions.length > 1 && (
                                                <button
                                                    className="btn btn-xs btn-ghost text-red-500"
                                                    onClick={() =>
                                                        removeTagDefinition(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Tag name (e.g., 'luxury')"
                                            value={tag.name}
                                            onChange={(e) =>
                                                updateTagDefinition(
                                                    index,
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                            className="input input-bordered input-sm w-full"
                                        />
                                        <textarea
                                            placeholder="Tag description (e.g., 'Does the image show luxury items or settings?')"
                                            value={tag.description}
                                            onChange={(e) =>
                                                updateTagDefinition(
                                                    index,
                                                    'description',
                                                    e.target.value
                                                )
                                            }
                                            className="textarea textarea-bordered textarea-sm w-full"
                                            rows={2}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedMode === 'moderation' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">
                                        Moderation Questions
                                    </h3>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={addQuestion}
                                        disabled={
                                            rejectionQuestions.length >= 10
                                        }
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Question
                                    </button>
                                </div>
                                {rejectionQuestions.map((question, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Yes/no question (e.g., 'Does the image contain inappropriate content?')"
                                            value={question}
                                            onChange={(e) =>
                                                updateQuestion(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            className="input input-bordered input-sm flex-1"
                                        />
                                        {rejectionQuestions.length > 1 && (
                                            <button
                                                className="btn btn-sm btn-ghost text-red-500"
                                                onClick={() =>
                                                    removeQuestion(index)
                                                }
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedMode === 'general' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">
                                        Analysis Prompts
                                    </h3>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={addPrompt}
                                        disabled={prompts.length >= 10}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Prompt
                                    </button>
                                </div>
                                {prompts.map((prompt, index) => (
                                    <div key={index} className="flex gap-2">
                                        <textarea
                                            placeholder="Question or request (e.g., 'Describe this image in detail')"
                                            value={prompt}
                                            onChange={(e) =>
                                                updatePrompt(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            className="textarea textarea-bordered textarea-sm flex-1"
                                            rows={2}
                                        />
                                        {prompts.length > 1 && (
                                            <button
                                                className="btn btn-sm btn-ghost text-red-500"
                                                onClick={() =>
                                                    removePrompt(index)
                                                }
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="card-actions justify-end mt-6">
                            <button
                                className="btn btn-primary"
                                onClick={handleAnalyze}
                                disabled={!file || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Brain className="w-4 h-4" />
                                        Analyze Image
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            Analysis Results
                        </h2>

                        {/* Image Preview */}
                        {previewUrl && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Image:</h3>
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Results Display */}
                        {results ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">
                                        AI Vision Results
                                    </h3>
                                    <div className="badge badge-info">
                                        {results.tokensUsed} tokens used
                                    </div>
                                </div>

                                {/* Tagging Results */}
                                {results.mode === 'tagging' &&
                                    results.data.tags && (
                                        <div>
                                            <h4 className="font-medium mb-2">
                                                Detected Tags:
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {results.data.tags.map(
                                                    (
                                                        tag: {
                                                            name: string;
                                                            confidence: number;
                                                        },
                                                        index: number
                                                    ) => (
                                                        <span
                                                            key={index}
                                                            className="badge badge-primary"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                            {results.data.tags.length === 0 && (
                                                <p className="text-gray-500 italic">
                                                    No tags matched the criteria
                                                </p>
                                            )}
                                        </div>
                                    )}

                                {/* Moderation Results */}
                                {results.mode === 'moderation' &&
                                    results.data.responses && (
                                        <div>
                                            <h4 className="font-medium mb-2">
                                                Moderation Responses:
                                            </h4>
                                            <div className="space-y-2">
                                                {results.data.responses.map(
                                                    (
                                                        response: {
                                                            text: string;
                                                            value: string;
                                                            prompt?: string;
                                                        },
                                                        index: number
                                                    ) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                        >
                                                            <span className="text-sm">
                                                                {
                                                                    response.prompt
                                                                }
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                {response.value ===
                                                                    'yes' && (
                                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                                )}
                                                                {response.value ===
                                                                    'no' && (
                                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                                )}
                                                                {response.value ===
                                                                    'unknown' && (
                                                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                                                )}
                                                                <span
                                                                    className={`text-sm font-medium ${
                                                                        response.value ===
                                                                        'yes'
                                                                            ? 'text-red-500'
                                                                            : response.value ===
                                                                                'no'
                                                                              ? 'text-green-500'
                                                                              : 'text-yellow-500'
                                                                    }`}
                                                                >
                                                                    {
                                                                        response.value
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* General Results */}
                                {results.mode === 'general' &&
                                    results.data.responses && (
                                        <div>
                                            <h4 className="font-medium mb-2">
                                                AI Responses:
                                            </h4>
                                            <div className="space-y-4">
                                                {results.data.responses.map(
                                                    (
                                                        response: {
                                                            value: string;
                                                        },
                                                        index: number
                                                    ) => (
                                                        <div
                                                            key={index}
                                                            className="bg-gray-50 p-4 rounded-lg"
                                                        >
                                                            <p className="text-sm whitespace-pre-wrap">
                                                                {response.value}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                <div className="alert alert-success">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>
                                        AI Vision analysis completed
                                        successfully!
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p>
                                    Select an image and configure analysis to
                                    see results
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
