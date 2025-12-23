import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ATS Resume Checker | Optimize Your Resume",
  description: "AI-powered ATS Resume Checker. Analyze your resume against job descriptions and get instant feedback on ATS compatibility, skills matching, and optimization tips.",
  keywords: ["ATS", "resume", "job search", "resume checker", "ATS score", "resume optimization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
