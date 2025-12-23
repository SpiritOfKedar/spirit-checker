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
            <div className="glass-card p-6 hover:border-[#10b981]/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-[#10b981]/15 rounded-xl flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-[#10b981]"
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
                    <div>
                        <h3 className="font-semibold text-[var(--foreground)]">
                            Matched Skills
                        </h3>
                        <p className="text-sm text-[var(--foreground-muted)]">
                            {matchedSkills.length} skills found
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {matchedSkills.length > 0 ? (
                        matchedSkills.map((skill, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 bg-[#10b981]/10 border border-[#10b981]/25 
                                         text-[#10b981] rounded-lg text-sm font-medium
                                         hover:bg-[#10b981]/20 transition-colors"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span className="text-[var(--foreground-muted)] text-sm italic">
                            No matching skills found
                        </span>
                    )}
                </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-card p-6 hover:border-[#ef4444]/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-[#ef4444]/15 rounded-xl flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-[#ef4444]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--foreground)]">
                            Missing Skills
                        </h3>
                        <p className="text-sm text-[var(--foreground-muted)]">
                            {missingSkills.length} skills to add
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {missingSkills.length > 0 ? (
                        missingSkills.map((skill, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 bg-[#ef4444]/10 border border-[#ef4444]/25 
                                         text-[#ef4444] rounded-lg text-sm font-medium
                                         hover:bg-[#ef4444]/20 transition-colors"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span className="text-[#10b981] text-sm font-medium">
                            All required skills matched
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
