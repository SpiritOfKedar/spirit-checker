"use client";

interface SectionFeedback {
    score: number;
    feedback: string;
}

interface SectionCardProps {
    title: string;
    section: SectionFeedback;
}

export default function SectionCard({ title, section }: SectionCardProps) {
    const getScoreColor = (score: number): string => {
        if (score >= 80) return "#22c55e";
        if (score >= 60) return "#f59e0b";
        if (score >= 40) return "#f97316";
        return "#ef4444";
    };

    const color = getScoreColor(section.score);

    return (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-200 capitalize">{title}</h4>
                <div
                    className="px-3 py-1 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: `${color}20`, color }}
                >
                    {section.score}/100
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-[var(--card-border)] rounded-full mb-3 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${section.score}%`,
                        backgroundColor: color,
                    }}
                />
            </div>

            <p className="text-sm text-gray-400">{section.feedback}</p>
        </div>
    );
}
