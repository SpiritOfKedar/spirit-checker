import type { Metadata } from "next";
import { JetBrains_Mono, Quintessential } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer } from "@/components/Footer";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const quintessential = Quintessential({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: "400",
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
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${quintessential.variable}`} suppressHydrationWarning>
      <body className="font-mono antialiased min-h-screen">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

