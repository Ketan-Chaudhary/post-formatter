import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default:
      "LinkedIn Post Formatter - Free Unicode Text Styling Tool | CodeWithKetan",
    template: "%s | CodeWithKetan - LinkedIn Post Formatter",
  },
  description:
    "Transform your LinkedIn posts with beautiful Unicode styling. Free online tool to add bold, italic, and combined formatting that works perfectly across all platforms. No signup required.",
  keywords: [
    "LinkedIn post formatter",
    "Unicode text styling",
    "LinkedIn bold text",
    "LinkedIn italic text",
    "social media formatting",
    "LinkedIn post generator",
    "text formatter online",
    "Unicode characters",
    "LinkedIn marketing tools",
    "social media tools",
    "LinkedIn content creator",
    "post styling tool",
    "LinkedIn engagement",
    "professional networking",
    "LinkedIn optimization",
    "social media content",
    "LinkedIn posts",
    "text formatting",
    "Unicode converter",
    "LinkedIn typography",
    "CodeWithKetan",
    "Ketan Chaudhary",
    "free LinkedIn tools",
    "LinkedIn post design",
    "social media formatting tool",
  ],
  authors: [{ name: "Ketan Chaudhary", url: "https://www.codewithketan.me" }],
  creator: "Ketan Chaudhary",
  publisher: "CodeWithKetan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.codewithketan.me"),
  alternates: {
    canonical: "https://www.codewithketan.me",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.codewithketan.me",
    title: "LinkedIn Post Formatter - Free Unicode Text Styling Tool",
    description:
      "Transform your LinkedIn posts with beautiful Unicode styling. Free online tool to add bold, italic, and combined formatting that works perfectly across all platforms.",
    siteName: "CodeWithKetan - LinkedIn Post Formatter",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LinkedIn Post Formatter - Transform your posts with Unicode styling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Post Formatter - Free Unicode Text Styling Tool",
    description:
      "Transform your LinkedIn posts with beautiful Unicode styling. Free online tool that works perfectly across all platforms.",
    creator: "@KETAN_POONIA_",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "4eQrzYpjYsTXeV85JBE9SJtZHMauOCU4dYDL8_",
    yandex: "1a7cb840c769a471",
    yahoo: "100949D3C191960B4F8A1EB96FFD0AB3",
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "CodeWithKetan",
              url: "https://www.codewithketan.me",
              logo: "https://www.codewithketan.me/logo.png",
              founder: {
                "@type": "Person",
                name: "Ketan Chaudhary",
                url: "https://www.linkedin.com/in/ketan-chaudhary-poonia/",
                sameAs: [
                  "https://github.com/Ketan-Chaudhary",
                  "https://x.com/KETAN_POONIA_",
                  "https://www.ketanchaudhary.ninja/",
                ],
              },
              sameAs: [
                "https://github.com/Ketan-Chaudhary",
                "https://x.com/KETAN_POONIA_",
                "https://www.linkedin.com/in/ketan-chaudhary-poonia/",
              ],
            }),
          }}
        />

        {/* Structured Data - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "LinkedIn Post Formatter",
              url: "https://www.codewithketan.me",
              description:
                "Free online tool to format LinkedIn posts with Unicode styling. Add bold, italic, and combined formatting to make your posts stand out.",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Person",
                name: "Ketan Chaudhary",
              },
              featureList: [
                "Unicode text formatting",
                "Bold text conversion",
                "Italic text conversion",
                "Combined bold-italic styling",
                "Real-time preview",
                "Emoji picker",
                "Bullet point styles",
                "Character counter",
                "Copy to clipboard",
                "Dark mode support",
              ],
            }),
          }}
        />

        {/* Structured Data - SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "LinkedIn Post Formatter",
              operatingSystem: "Web Browser",
              applicationCategory: "UtilitiesApplication",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "150",
              },
              offers: {
                "@type": "Offer",
                price: "0.00",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
