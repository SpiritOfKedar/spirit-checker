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
                <div className="w-8 h-8 border-2 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Analysis Results
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Here&apos;s how your resume matches the job description
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="px-5 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] 
                     rounded-xl text-gray-300 hover:border-[var(--primary)] 
                     transition-colors flex items-center gap-2"
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        New Analysis
                    </Link>
                </div>

                {/* Score Card */}
                <div
                    className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 mb-8 
                       flex flex-col md:flex-row items-center gap-8 animate-fade-in"
                    style={{ animationDelay: "0.1s" }}
                >
                    <ScoreGauge score={result.score} />
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-semibold text-gray-200 mb-3">
                            ATS Compatibility Score
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            {result.overallFeedback}
                        </p>
                    </div>
                </div>

                {/* Skills Comparison */}
                <div
                    className="mb-8 animate-fade-in"
                    style={{ animationDelay: "0.2s" }}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">
                        Skills Analysis
                    </h2>
                    <SkillsComparison
                        matchedSkills={result.matchedSkills}
                        missingSkills={result.missingSkills}
                    />
                </div>

                {/* Section Feedback */}
                <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">
                        Section-wise Feedback
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(result.sections).map(([name, section]) => (
                            <SectionCard key={name} title={name} section={section} />
                        ))}
                    </div>
                </div>

                {/* Tips Section */}
                <div
                    className="mt-8 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 
                        border border-teal-500/30 rounded-2xl p-6 animate-fade-in"
                    style={{ animationDelay: "0.4s" }}
                >
                    <h3 className="font-semibold text-teal-400 mb-3 flex items-center gap-2">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                        </svg>
                        Pro Tips
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-teal-400">•</span>
                            Use exact keywords from the job description in your resume
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-teal-400">•</span>
                            Quantify achievements with numbers and percentages
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-teal-400">•</span>
                            Use simple formatting - avoid tables, headers, and graphics
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-teal-400">•</span>
                            Include a skills section with relevant technologies
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
