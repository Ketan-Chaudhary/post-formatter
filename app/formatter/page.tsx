import type { Metadata } from "next"
import FormatterPageClient from "./formatter-page-client"

// SEO metadata for formatter page
export const metadata: Metadata = {
  title: "LinkedIn Post Formatter Tool - Format Text with Unicode Styling",
  description:
    "Free online LinkedIn post formatter. Add bold, italic, and combined Unicode styling to your LinkedIn posts. Real-time preview, emoji picker, and more features.",
  keywords: [
    "LinkedIn post formatter tool",
    "Unicode text editor",
    "LinkedIn bold text generator",
    "social media formatting",
    "LinkedIn post styling",
    "text formatter online",
    "LinkedIn content creator tools",
  ],
  openGraph: {
    title: "LinkedIn Post Formatter Tool - Format Text with Unicode Styling",
    description:
      "Free online LinkedIn post formatter. Add bold, italic, and combined Unicode styling to your LinkedIn posts.",
    url: "https://www.codewithketan.me/formatter",
  },
}

export default function FormatterPage() {
  return <FormatterPageClient />
}
