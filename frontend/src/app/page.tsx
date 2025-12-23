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
import { BarChart3, CheckCircle2, FileText, Loader2, AlertCircle } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect typing activity and increment keystroke count
  useEffect(() => {
    if (jobDescription.length > 0) {
      setIsTyping(true);
      setKeystrokeCount(prev => prev + 1);
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
      <FloatingParticles isActive={isTyping} particleCount={50} keystrokeCount={keystrokeCount} />
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-40" />

      <main className="relative flex-1 pt-16 pb-10 md:pt-20 md:pb-16">
        <div className="container-wide">
          {/* Header */}
          <header className={`text-center mb-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-xs font-medium px-3 py-1 animate-fade-in">
                <span className="relative flex h-1.5 w-1.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground/50"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-foreground"></span>
                </span>
                NLP-Powered Analysis
              </Badge>
            </div>

            <h1 className={`text-5xl md:text-7xl font-display font-medium tracking-tight mb-4 text-foreground/90 ${mounted ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
              Spirit Checker
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Resume Upload */}
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
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
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
          <section className={`mt-10 max-w-2xl mx-auto ${mounted ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <BarChart3 className="w-5 h-5" />,
                  title: "ATS Score",
                  description: "Weighted compatibility score based on skill match",
                },
                {
                  icon: <CheckCircle2 className="w-5 h-5" />,
                  title: "Skill Matching",
                  description: "Identify matched and missing skills",
                },
                {
                  icon: <FileText className="w-5 h-5" />,
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
          <footer className={`mt-10 text-center ${mounted ? 'animate-fade-in delay-500' : 'opacity-0'}`}>
            <p className="text-xs text-muted-foreground">
              Built by Spirit
            </p>
          </footer>
        </div>
      </main>
    </TooltipProvider>
  );
}
