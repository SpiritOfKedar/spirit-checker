import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
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
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
