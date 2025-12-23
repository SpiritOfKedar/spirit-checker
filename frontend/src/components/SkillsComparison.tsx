"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle } from "lucide-react";

interface SkillsComparisonProps {
    matchedSkills: string[];
    missingSkills: string[];
}

export default function SkillsComparison({
    matchedSkills,
    missingSkills,
}: SkillsComparisonProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched Skills */}
            <Card className="shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Check className="w-4 h-4 text-muted-foreground" />
                        Matched Skills
                        <Badge variant="secondary" className="ml-auto text-xs">
                            {matchedSkills.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                        {matchedSkills.length > 0 ? (
                            matchedSkills.map((skill, i) => (
                                <Badge
                                    key={i}
                                    variant="default"
                                    className="text-xs font-normal"
                                >
                                    {skill}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                No matching skills identified
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card className="shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                        Missing Skills
                        <Badge variant="secondary" className="ml-auto text-xs">
                            {missingSkills.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                        {missingSkills.length > 0 ? (
                            missingSkills.map((skill, i) => (
                                <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs font-normal text-muted-foreground"
                                >
                                    {skill}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-foreground font-medium">
                                All required skills matched
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
