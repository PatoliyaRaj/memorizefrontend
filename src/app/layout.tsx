import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { LenisProvider } from "../components/providers/LenisProvider";
import { QueryProvider } from "../components/providers/QueryProvider";
import { Toaster } from "sonner";

// ── Display Font (Headings, titles) ──
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

// ── Body Font (UI, text content) ──
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

// ── Monospace Font (Code, data, tables) ──
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NeuroLearn | Memorize",
  description: "Science-backed spaced repetition platform for deep learning",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        {/* Apply stored theme before paint — prevents flash of wrong theme */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('memorize-theme');
                  var theme = (stored === 'light' || stored === 'dark') ? stored : 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface-void text-text-primary transition-colors duration-200">
        <LenisProvider>
          <QueryProvider>
            <ThemeProvider>
              {children}
              <Toaster
                theme="system"
                position="top-right"
                richColors
                closeButton
                visibleToasts={5}
              />
            </ThemeProvider>
          </QueryProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
