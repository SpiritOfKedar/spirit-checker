"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import ScoreDisplay from "@/components/ScoreDisplay";
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
                <div className="flex flex-col items-center gap-3">
                    <svg
                        className="w-6 h-6 animate-spin text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <p className="text-sm text-muted-foreground">Loading results...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="flex-1 py-12 md:py-16">
            <div className="container-wide">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                            Analysis Results
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Resume compatibility assessment complete
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/" className="gap-2">
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            New Analysis
                        </Link>
                    </Button>
                </header>

                {/* Score Card */}
                <Card className="mb-8 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <ScoreDisplay score={result.score} />
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-xl font-semibold mb-3">
                                    ATS Compatibility Score
                                </h2>
                                <p className="text-muted-foreground leading-relaxed max-w-lg">
                                    {result.overallFeedback}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skills Comparison */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-semibold">Skills Analysis</h2>
                        <Badge variant="secondary" className="text-xs">
                            {result.matchedSkills.length + result.missingSkills.length} total
                        </Badge>
                    </div>
                    <SkillsComparison
                        matchedSkills={result.matchedSkills}
                        missingSkills={result.missingSkills}
                    />
                </section>

                {/* Section Feedback */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Section Feedback</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(result.sections).map(([name, section]) => (
                            <SectionCard key={name} title={name} section={section} />
                        ))}
                    </div>
                </section>

                {/* Tips Section */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <svg
                                className="w-4 h-4 text-muted-foreground"
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
                            Optimization Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <span className="text-foreground mt-0.5">1.</span>
                                <span>Use exact keywords from the job description in your resume</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-foreground mt-0.5">2.</span>
                                <span>Quantify achievements with numbers and percentages where possible</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-foreground mt-0.5">3.</span>
                                <span>Keep formatting simple — avoid tables, headers, and complex graphics</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-foreground mt-0.5">4.</span>
                                <span>Include a dedicated skills section with relevant technologies</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Footer */}
                <footer className="mt-12 text-center">
                    <p className="text-xs text-muted-foreground">
                        Built by Spirit
                    </p>
                </footer>
            </div>
        </main>
    );
}
