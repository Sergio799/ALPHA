import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Lora } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from '@clerk/nextjs'

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const fontLora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "ALPHA 2.0 - AI-Powered Investment Platform | Smart Portfolio Management",
  description: "ALPHA combines institutional-grade quantitative analysis, predictive forecasting, and personalized AI advice to help you navigate the markets with confidence. Intelligent investing powered by AI.",
  keywords: ["AI investing", "portfolio management", "stock analysis", "investment advisor", "market predictions", "financial planning"],
  authors: [{ name: "ALPHA" }],
  creator: "ALPHA",
  publisher: "ALPHA",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alpha.com",
    siteName: "ALPHA",
    title: "ALPHA 2.0 - AI-Powered Investment Platform",
    description: "Intelligent investing powered by AI. Get personalized investment advice, market predictions, and portfolio analysis.",
    images: [
      {
        url: "https://alpha.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "ALPHA - AI Investment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALPHA 2.0 - AI-Powered Investment Platform",
    description: "Intelligent investing powered by AI",
    creator: "@alpha",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const isValidClerkKey = publishableKey && !publishableKey.includes('placeholder');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Only use ClerkProvider if we have a valid publishable key
  if (!isValidClerkKey) {
    return (
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={cn("antialiased", fontSpaceGrotesk.variable, fontLora.variable)}>
          {children}
          <Toaster />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={cn("antialiased", fontSpaceGrotesk.variable, fontLora.variable)}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
