"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import FileUpload from "@/components/FileUpload";
import FloatingParticles from "@/components/FloatingParticles";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect typing activity
  useEffect(() => {
    if (jobDescription.length > 0) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [jobDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resumeFile) {
      setError("Please upload your resume");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter the job description");
      return;
    }

    setIsLoading(true);

    try {
      const base64 = await fileToBase64(resumeFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume: base64,
            resumeFileName: resumeFile.name,
            jobDescription: jobDescription,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const result = await response.json();
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  return (
    <TooltipProvider>
      {/* Theme Toggle - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-card border border-border rounded-full shadow-lg p-1">
          <ThemeToggle />
        </div>
      </div>

      {/* Background layers */}
      <div className="fixed inset-0 bg-gradient-subtle pointer-events-none" />
      <FloatingParticles isActive={isTyping} particleCount={50} />
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-40" />

      <main className="relative flex-1 pt-20 pb-12 md:pt-24 md:pb-20">
        <div className="container-wide">
          {/* Header */}
          <header className={`text-center mb-12 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="secondary" className="text-xs font-medium px-3 py-1 animate-fade-in">
                <span className="relative flex h-1.5 w-1.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground/50"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-foreground"></span>
                </span>
                NLP-Powered Analysis
              </Badge>
            </div>

            <h1 className={`text-4xl md:text-5xl font-semibold tracking-tight mb-4 ${mounted ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
              <span className="font-serif italic">Spirit</span> Checker
            </h1>

            <p className={`text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed ${mounted ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
              Analyze your resume against job descriptions. Get actionable insights
              to improve your ATS compatibility score.
            </p>
          </header>

          {/* Main Form Card */}
          <Card className={`max-w-2xl mx-auto shadow-sm hover-lift transition-all duration-300 ${mounted ? 'animate-scale-in delay-300' : 'opacity-0'}`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Resume Analysis</CardTitle>
              <CardDescription>
                Upload your resume and paste the job description to begin analysis.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Resume Upload */}
                <div className="space-y-2 focus-glow rounded-lg transition-all">
                  <label className="text-sm font-medium text-foreground">
                    Resume
                  </label>
                  <FileUpload
                    onFileSelect={setResumeFile}
                    selectedFile={resumeFile}
                  />
                </div>

                <Separator />

                {/* Job Description */}
                <div className="space-y-2 focus-glow rounded-lg transition-all">
                  <label className="text-sm font-medium text-foreground">
                    Job Description
                  </label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="min-h-[180px] resize-none text-sm transition-all duration-200"
                  />
                  <p className="text-xs text-muted-foreground">
                    Include the full job posting for best results.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive animate-fade-in">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-2 animate-spin"
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
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Resume"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Features */}
          <section className={`mt-16 max-w-2xl mx-auto ${mounted ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: "ATS Score",
                  description: "Weighted compatibility score based on skill match",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: "Skill Matching",
                  description: "Identify matched and missing skills",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                  title: "Section Feedback",
                  description: "Improve each resume section",
                },
              ].map((feature, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div
                      className="p-4 rounded-lg border border-border bg-card/80 backdrop-blur-sm hover-lift cursor-default group"
                      style={{ animationDelay: `${400 + i * 100}ms` }}
                    >
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center mb-3 text-muted-foreground group-hover:text-foreground transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{feature.title}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className={`mt-16 text-center ${mounted ? 'animate-fade-in delay-500' : 'opacity-0'}`}>
            <p className="text-xs text-muted-foreground">
              Built by Spirit
            </p>
          </footer>
        </div>
      </main>
    </TooltipProvider>
  );
}
