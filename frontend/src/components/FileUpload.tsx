"use client";

import { useCallback, useState } from "react";

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

export default function FileUpload({
    onFileSelect,
    selectedFile,
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = e.dataTransfer.files;
            if (files && files[0]) {
                const file = files[0];
                if (isValidFile(file)) {
                    onFileSelect(file);
                }
            }
        },
        [onFileSelect]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            onFileSelect(files[0]);
        }
    };

    const isValidFile = (file: File): boolean => {
        const validTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        return validTypes.includes(file.type);
    };

    const removeFile = () => {
        onFileSelect(null);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
        relative border-2 border-dashed rounded-xl p-8 text-center
        transition-all duration-200 cursor-pointer
        ${isDragging
                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                    : "border-[var(--card-border)] hover:border-[var(--primary)]/50"
                }
        ${selectedFile ? "bg-[var(--primary)]/5" : ""}
      `}
        >
            <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {selectedFile ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-xl flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-[var(--primary)]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-200 truncate max-w-[200px]">
                                {selectedFile.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                        }}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                        <svg
                            className="w-5 h-5 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-[var(--card-border)] rounded-2xl flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-300">
                            Drop your resume here, or{" "}
                            <span className="text-[var(--primary)]">browse</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Supports PDF and DOCX (max 10MB)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
