import type { Metadata } from "next";
import { Inter, Space_Grotesk, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Spirit Checker | ATS Resume Analyzer",
  description: "Analyze your resume against job descriptions. Get instant ATS compatibility scores, skill gap analysis, and actionable optimization tips.",
  keywords: ["ATS", "resume", "job search", "resume checker", "ATS score", "resume optimization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Twemoji for iOS-style emojis */}
        <Script
          src="https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.min.js"
          strategy="afterInteractive"
        />
        <Script id="twemoji-init" strategy="afterInteractive">
          {`
            if (typeof twemoji !== 'undefined') {
              twemoji.parse(document.body, {
                folder: 'svg',
                ext: '.svg',
                base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/'
              });
              
              // Re-parse on DOM changes
              const observer = new MutationObserver(() => {
                twemoji.parse(document.body, {
                  folder: 'svg',
                  ext: '.svg',
                  base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/'
                });
              });
              observer.observe(document.body, { childList: true, subtree: true });
            }
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable} antialiased`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
