"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

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

    const getFileIcon = () => (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
        </svg>
    );

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
        relative border border-dashed rounded-lg p-6 text-center
        transition-colors duration-200
        ${isDragging
                    ? "border-foreground bg-muted"
                    : "border-border hover:border-muted-foreground hover:bg-muted/50"
                }
        ${selectedFile ? "bg-muted/30 border-muted-foreground" : ""}
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
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                            {getFileIcon()}
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                        }}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <svg
                            className="w-4 h-4"
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
                    </Button>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="w-10 h-10 mx-auto bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-foreground">
                            Drop your resume here, or{" "}
                            <span className="font-medium underline underline-offset-2">browse</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PDF or DOCX, up to 10MB
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
