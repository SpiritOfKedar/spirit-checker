"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { CloudUpload, FileText, X } from "lucide-react";

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
        transition-all duration-300 ease-in-out
        group cursor-pointer
        ${isDragging
                    ? "border-primary bg-primary/5 shadow-md scale-[1.01]"
                    : "border-border hover:border-primary/50 hover:bg-muted/30 hover:shadow-sm"
                }
        ${selectedFile ? "bg-muted/40 border-primary/20" : ""}
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
                            <FileText className="w-5 h-5" />
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
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                        <CloudUpload className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Drop your resume here
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            or <span className="underline underline-offset-2 decoration-primary/50 group-hover:decoration-primary transition-colors">browse</span> to upload
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mt-2">
                            PDF or DOCX • Up to 10MB
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
