import type { Metadata } from "next";
import { JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Spirit Checker | ATS Resume Analyzer",
  description:
    "Analyze your resume against job descriptions. Get ATS compatibility scores, skill gap analysis, and actionable optimization recommendations.",
  keywords: [
    "ATS",
    "resume",
    "job search",
    "resume checker",
    "ATS score",
    "resume optimization",
    "applicant tracking system",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <body className="font-mono antialiased min-h-screen">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

