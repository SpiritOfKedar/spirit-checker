"use client";

interface SkillsComparisonProps {
    matchedSkills: string[];
    missingSkills: string[];
}

export default function SkillsComparison({
    matchedSkills,
    missingSkills,
}: SkillsComparisonProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-200">
                        Matched Skills ({matchedSkills.length})
                    </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {matchedSkills.length > 0 ? (
                        matchedSkills.map((skill, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 
                         text-green-400 rounded-lg text-sm"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500 text-sm">No skills matched</span>
                    )}
                </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-200">
                        Missing Skills ({missingSkills.length})
                    </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {missingSkills.length > 0 ? (
                        missingSkills.map((skill, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 
                         text-red-400 rounded-lg text-sm"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500 text-sm">
                            Great! No missing skills
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
