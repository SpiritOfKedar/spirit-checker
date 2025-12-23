"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";

export default function Home() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Convert file to base64
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

      // Store result in sessionStorage and navigate to results
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
        // Remove the data URL prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          ATS Resume Checker
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Upload your resume and paste the job description to get an instant ATS
          compatibility score with detailed feedback.
        </p>
      </div>

      {/* Form Card */}
      <div
        className="w-full max-w-3xl bg-[var(--card-bg)] border border-[var(--card-border)] 
                      rounded-2xl p-8 shadow-2xl animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Upload Resume (PDF or DOCX)
            </label>
            <FileUpload
              onFileSelect={setResumeFile}
              selectedFile={resumeFile}
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-48 px-4 py-3 bg-[var(--background)] border border-[var(--card-border)] 
                       rounded-xl text-gray-200 placeholder-gray-500 resize-none
                       focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                       transition-all duration-200"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-cyan-600 
                     hover:from-teal-500 hover:to-cyan-500 rounded-xl font-semibold text-lg
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-3 shadow-lg hover:shadow-teal-500/25"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                Analyze Resume
              </>
            )}
          </button>
        </form>
      </div>

      {/* Features */}
      <div
        className="w-full max-w-3xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        {[
          {
            icon: "📊",
            title: "ATS Score",
            desc: "Get a 0-100 score based on job match",
          },
          {
            icon: "🎯",
            title: "Skill Matching",
            desc: "See matched & missing skills",
          },
          {
            icon: "📝",
            title: "Section Feedback",
            desc: "Detailed tips per section",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center p-6 bg-[var(--card-bg)]/50 
                       border border-[var(--card-border)] rounded-xl"
          >
            <span className="text-3xl mb-3">{feature.icon}</span>
            <h3 className="font-semibold text-gray-200 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
