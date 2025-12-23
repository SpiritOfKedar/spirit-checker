"use client";

import { Progress } from "@/components/ui/progress";

interface ScoreDisplayProps {
    score: number;
    size?: "sm" | "md" | "lg";
}

export default function ScoreDisplay({ score, size = "lg" }: ScoreDisplayProps) {
    const getScoreStatus = (score: number): { label: string; variant: "default" | "secondary" } => {
        if (score >= 80) return { label: "Excellent", variant: "default" };
        if (score >= 60) return { label: "Good", variant: "default" };
        if (score >= 40) return { label: "Fair", variant: "secondary" };
        return { label: "Needs Improvement", variant: "secondary" };
    };

    const status = getScoreStatus(score);

    const sizes = {
        sm: { container: "w-20 h-20", fontSize: "text-xl", labelSize: "text-[10px]" },
        md: { container: "w-28 h-28", fontSize: "text-2xl", labelSize: "text-xs" },
        lg: { container: "w-36 h-36", fontSize: "text-4xl", labelSize: "text-xs" },
    };

    const { container, fontSize, labelSize } = sizes[size];

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Circular Score Display */}
            <div className={`${container} relative`}>
                {/* Background circle */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(score / 100) * 264} 264`}
                        className="text-foreground transition-all duration-700 ease-out"
                    />
                </svg>

                {/* Score text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`${fontSize} font-semibold text-foreground tabular-nums`}>
                        {score}
                    </span>
                    <span className={`${labelSize} text-muted-foreground`}>
                        out of 100
                    </span>
                </div>
            </div>

            {/* Status label */}
            <div className={`
        px-3 py-1 rounded-md text-xs font-medium
        ${status.variant === "default"
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                }
      `}>
                {status.label}
            </div>
        </div>
    );
}
