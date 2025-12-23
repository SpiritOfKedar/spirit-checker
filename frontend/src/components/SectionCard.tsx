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
        if (score >= 80) return "#10b981";
        if (score >= 60) return "#f59e0b";
        if (score >= 40) return "#f97316";
        return "#ef4444";
    };

    const color = getScoreColor(section.score);

    return (
        <div className="glass-card p-5 hover:border-[var(--primary)]/30 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-[var(--foreground)] capitalize text-lg">{title}</h4>
                <div
                    className="px-3 py-1.5 rounded-lg text-sm font-bold"
                    style={{
                        backgroundColor: `${color}15`,
                        color,
                        border: `1px solid ${color}25`
                    }}
                >
                    {section.score}
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-[var(--card-border)]/50 rounded-full mb-4 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                        width: `${section.score}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}50`
                    }}
                />
            </div>

            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{section.feedback}</p>
        </div>
    );
}
