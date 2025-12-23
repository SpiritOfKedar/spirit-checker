"use client";

interface ScoreGaugeProps {
    score: number;
    size?: "sm" | "md" | "lg";
}

export default function ScoreGauge({ score, size = "lg" }: ScoreGaugeProps) {
    const getScoreColor = (score: number): string => {
        if (score >= 80) return "#22c55e"; // Green
        if (score >= 60) return "#f59e0b"; // Yellow/Orange
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

    // SVG dimensions
    const sizes = {
        sm: { width: 120, stroke: 8, fontSize: 24 },
        md: { width: 180, stroke: 12, fontSize: 36 },
        lg: { width: 240, stroke: 16, fontSize: 48 },
    };

    const { width, stroke, fontSize } = sizes[size];
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
                        stroke="var(--card-border)"
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
                            transition: "stroke-dashoffset 1s ease-out",
                            filter: `drop-shadow(0 0 10px ${color}40)`,
                        }}
                    />
                </svg>
                {/* Score text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className="font-bold"
                        style={{ fontSize, color, lineHeight: 1 }}
                    >
                        {score}
                    </span>
                    <span className="text-gray-400 text-sm mt-1">out of 100</span>
                </div>
            </div>
            <div
                className="mt-4 px-4 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: `${color}20`, color }}
            >
                {label}
            </div>
        </div>
    );
}
