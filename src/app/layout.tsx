import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "cn";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Smart City Monitoring`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "smart city",
    "monitoring dashboard",
    "air quality",
    "weather",
    "traffic cameras",
    "open data",
  ],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Smart City Monitoring`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Smart City Monitoring`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#131a24" },
    { media: "(prefers-color-scheme: light)", color: "#fbfbfc" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.locale}
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-dvh">
        {/* Lets keyboard and screen-reader users jump past the navigation. 
            Hidden until focused. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-popover focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-popover-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          </QueryProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
