"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SectionFeedback {
    score: number;
    feedback: string;
}

interface SectionCardProps {
    title: string;
    section: SectionFeedback;
}

export default function SectionCard({ title, section }: SectionCardProps) {
    const getScoreLabel = (score: number): string => {
        if (score >= 80) return "Strong";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        return "Needs work";
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium capitalize">
                        {title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {getScoreLabel(section.score)}
                        </span>
                        <span className="text-sm font-semibold tabular-nums">
                            {section.score}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
                {/* Progress bar */}
                <Progress value={section.score} className="h-1.5" />

                {/* Feedback text */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.feedback}
                </p>
            </CardContent>
        </Card>
    );
}
