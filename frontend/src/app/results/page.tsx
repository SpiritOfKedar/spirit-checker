"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ScoreGauge from "@/components/ScoreGauge";
import SkillsComparison from "@/components/SkillsComparison";
import SectionCard from "@/components/SectionCard";

interface SectionScore {
    score: number;
    feedback: string;
}

interface AnalysisResult {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    sections: Record<string, SectionScore>;
    overallFeedback: string;
}

export default function ResultsPage() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem("analysisResult");
        if (stored) {
            setResult(JSON.parse(stored));
        } else {
            router.push("/");
        }
    }, [router]);

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
                    <p className="text-[var(--foreground-muted)]">Loading results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 animate-fade-in">
                    <div>
                        <h1 className="text-3xl md:text-4xl tracking-tight">
                            <span className="font-[var(--font-brand)] italic gradient-text">Analysis</span>{" "}
                            <span className="font-bold text-[var(--foreground)]">Results</span>
                        </h1>
                        <p className="text-[var(--foreground-muted)] mt-2">
                            ✅ Here&apos;s how your resume matches the job description
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-3 glass-card
                                 text-[var(--foreground)] hover:text-[var(--primary)]
                                 hover:border-[var(--primary)]/50 transition-all duration-300"
                    >
                        <span>🔄</span>
                        New Analysis
                    </Link>
                </div>

                {/* Score Card */}
                <div
                    className="glass-card p-8 mb-8 flex flex-col md:flex-row items-center gap-8 animate-slide-up"
                    style={{ animationDelay: "0.1s" }}
                >
                    <ScoreGauge score={result.score} />
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                            ATS Compatibility Score
                        </h2>
                        <p className="text-[var(--foreground-muted)] leading-relaxed">
                            {result.overallFeedback}
                        </p>
                    </div>
                </div>

                {/* Skills Comparison */}
                <div
                    className="mb-8 animate-fade-in"
                    style={{ animationDelay: "0.2s" }}
                >
                    <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        Skills Analysis
                    </h2>
                    <SkillsComparison
                        matchedSkills={result.matchedSkills}
                        missingSkills={result.missingSkills}
                    />
                </div>

                {/* Section Feedback */}
                <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        Section Feedback
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(result.sections).map(([name, section]) => (
                            <SectionCard key={name} title={name} section={section} />
                        ))}
                    </div>
                </div>

                {/* Tips Section */}
                <div
                    className="mt-8 glass-card p-6 border-[var(--primary)]/20 animate-fade-in"
                    style={{ animationDelay: "0.4s" }}
                >
                    <h3 className="font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Quick Tips
                    </h3>
                    <ul className="space-y-3 text-[var(--foreground-muted)] text-sm">
                        <li className="flex items-start gap-3">
                            <span className="text-[var(--primary)] mt-1">→</span>
                            Use exact keywords from the job description in your resume
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[var(--primary)] mt-1">→</span>
                            Quantify achievements with numbers and percentages where possible
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[var(--primary)] mt-1">→</span>
                            Keep formatting simple - avoid tables, headers, and complex graphics
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[var(--primary)] mt-1">→</span>
                            Include a dedicated skills section with relevant technologies
                        </li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-sm text-[var(--foreground-muted)]/60">
                    Built by Spirit
                </div>
            </div>
        </div>
    );
}
