"use client";

interface ScoreGaugeProps {
    score: number;
    size?: "sm" | "md" | "lg";
}

export default function ScoreGauge({ score, size = "lg" }: ScoreGaugeProps) {
    const getScoreColor = (score: number): string => {
        if (score >= 80) return "#10b981"; // Emerald
        if (score >= 60) return "#f59e0b"; // Amber
        if (score >= 40) return "#f97316"; // Orange
        return "#ef4444"; // Red
    };

    const getScoreLabel = (score: number): string => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        return "Needs Work";
    };

    const color = getScoreColor(score);
    const label = getScoreLabel(score);

    const sizes = {
        sm: { width: 120, stroke: 8, fontSize: 24, labelSize: 10 },
        md: { width: 180, stroke: 12, fontSize: 36, labelSize: 12 },
        lg: { width: 220, stroke: 14, fontSize: 48, labelSize: 14 },
    };

    const { width, stroke, fontSize, labelSize } = sizes[size];
    const radius = (width - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width, height: width }}>
                <svg
                    width={width}
                    height={width}
                    viewBox={`0 0 ${width} ${width}`}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(71, 85, 105, 0.3)"
                        strokeWidth={stroke}
                    />
                    {/* Progress circle */}
                    <circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                        style={{
                            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                            filter: `drop-shadow(0 0 12px ${color}60)`,
                        }}
                    />
                </svg>
                {/* Score text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className="font-bold tracking-tight"
                        style={{ fontSize, color, lineHeight: 1 }}
                    >
                        {score}
                    </span>
                    <span
                        className="text-[var(--foreground-muted)] mt-1"
                        style={{ fontSize: labelSize }}
                    >
                        out of 100
                    </span>
                </div>
            </div>
            <div
                className="mt-4 px-5 py-2 rounded-full text-sm font-semibold tracking-wide"
                style={{
                    backgroundColor: `${color}15`,
                    color,
                    border: `1px solid ${color}30`
                }}
            >
                {label}
            </div>
        </div>
    );
}
