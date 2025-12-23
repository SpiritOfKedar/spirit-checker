"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";

// Floating particles component
function FloatingParticles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[var(--primary)] rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

// Animated counter
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
}

// Typing effect
function TypeWriter({ words, className }: { words: string[]; className?: string }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function Home() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="min-h-screen flex flex-col relative">
      <FloatingParticles />

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--primary)] rounded-full 
                      mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--accent)] rounded-full 
                      mix-blend-multiply filter blur-[128px] opacity-15 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 
                      bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 
                      animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative z-10">

        {/* Badge with entrance animation */}
        <div
          className={`mb-8 transform transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                         bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20
                         hover:bg-[var(--primary)]/20 hover:scale-105 transition-all duration-300 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
            </span>
            NLP-Powered Resume Analysis
          </span>
        </div>

        {/* Title with staggered animation */}
        <div
          className={`text-center mb-6 transform transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <h1 className="text-5xl md:text-7xl mb-4 tracking-tight">
            <span className="font-[var(--font-brand)] italic gradient-text animate-gradient bg-[length:200%_200%]">Spirit</span>{" "}
            <span className="font-bold text-[var(--foreground)]">Checker</span>
          </h1>
        </div>

        {/* Subtitle with typing effect */}
        <div
          className={`text-center mb-4 transform transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <p className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-2xl">
            Analyze your resume for{" "}
            <TypeWriter
              words={["ATS compatibility", "skill matching", "section optimization", "keyword analysis"]}
              className="text-[var(--primary)] font-semibold"
            />
          </p>
        </div>

        <p
          className={`text-base text-[var(--foreground-muted)]/70 text-center max-w-xl mb-12 
                     transform transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          Upload your resume and paste a job description to get instant feedback.
        </p>

        {/* Stats row */}
        <div
          className={`flex items-center gap-8 mb-12 transform transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          {[
            { value: 80, label: "Skills tracked", suffix: "+", emoji: "🎯" },
            { value: 4, label: "Analysis engines", suffix: "", emoji: "⚡️" },
            { value: 100, label: "Score precision", suffix: "%", emoji: "✨" },
          ].map((stat, i) => (
            <div key={i} className="text-center group cursor-default">
              <div className="text-lg mb-1">{stat.emoji}</div>
              <div className="text-2xl md:text-3xl font-bold text-[var(--foreground)] 
                            group-hover:text-[var(--primary)] transition-colors">
                {mounted && <AnimatedCounter value={stat.value} duration={1500 + i * 500} />}
                {stat.suffix}
              </div>
              <div className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div
          className={`w-full max-w-3xl glass-card p-8 transform transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload */}
            <div className="group">
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-3 uppercase tracking-wider
                              group-focus-within:text-[var(--primary)] transition-colors">
                📄 Resume
              </label>
              <FileUpload
                onFileSelect={setResumeFile}
                selectedFile={resumeFile}
              />
            </div>

            {/* Job Description */}
            <div className="group">
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-3 uppercase tracking-wider
                              group-focus-within:text-[var(--primary)] transition-colors">
                💼 Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-48 px-5 py-4 bg-[var(--background)] border border-[var(--card-border)] 
                         rounded-xl text-[var(--foreground)] placeholder-[var(--foreground-muted)]/50 resize-none
                         focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 
                         transition-all duration-300
                         hover:border-[var(--primary)]/50 hover:bg-[var(--background-secondary)]"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 
                            rounded-xl text-[var(--error)] animate-shake">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-4 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)]
                       rounded-xl font-semibold text-lg text-[var(--background)]
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-3 overflow-hidden
                       hover:scale-[1.02] hover:shadow-[0_0_30px_var(--primary-glow)] 
                       active:scale-[0.98] group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                            transition-transform duration-1000 bg-gradient-to-r from-transparent 
                            via-white/20 to-transparent" />

              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[var(--background)]/30 border-t-[var(--background)] rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Analyze Resume
                </>
              )}
            </button>
          </form>
        </div>

        {/* Features with staggered entrance */}
        <div className="w-full max-w-3xl mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: "📊",
              title: "ATS Score",
              desc: "Weighted 0-100 score based on skill match and text similarity",
            },
            {
              emoji: "🎯",
              title: "Skill Matching",
              desc: "See which required skills you have and which ones are missing",
            },
            {
              emoji: "📝",
              title: "Section Feedback",
              desc: "Get tips to improve each section of your resume",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`group flex flex-col items-center text-center p-6 glass-card
                         hover:border-[var(--primary)]/30 transition-all duration-500
                         hover:-translate-y-2 hover:shadow-lg hover:shadow-[var(--primary)]/10
                         transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${600 + i * 100}ms` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                {feature.emoji}
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className={`mt-16 text-sm text-[var(--foreground-muted)]/60 transform transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ transitionDelay: '900ms' }}
        >
          Built by Spirit
        </div>
      </div>
    </div>
  );
}
