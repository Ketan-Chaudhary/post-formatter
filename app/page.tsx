"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  ArrowRight,
  Sparkles,
  Type,
  Zap,
  Shield,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Moon,
  Sun,
  Star,
  Search,
  Users,
  TrendingUp,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("linkedin-post-dark-mode")
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === "true")
    }
  }, [])

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("linkedin-post-dark-mode", darkMode.toString())
  }, [darkMode])

  const features = [
    {
      icon: Type,
      title: "Unicode Styling",
      description:
        "Transform your text with mathematical Unicode characters for bold, italic, and combined styles that work everywhere.",
      keywords: "Unicode formatting, text styling, LinkedIn bold text",
    },
    {
      icon: Zap,
      title: "Instant Preview",
      description:
        "See exactly how your post will look on LinkedIn with our real-time preview feature before publishing.",
      keywords: "LinkedIn preview, real-time formatting, post preview",
    },
    {
      icon: Sparkles,
      title: "Smart Formatting",
      description:
        "Toggle styles on/off, combine bold and italic, or reset to normal with intelligent style detection.",
      keywords: "smart formatting, style toggle, text converter",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "All formatting happens locally in your browser. Your content never leaves your device for maximum security.",
      keywords: "privacy, secure formatting, local processing",
    },
  ]

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/Ketan-Chaudhary",
      color: "hover:text-gray-900 dark:hover:text-white",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://x.com/KETAN_POONIA_",
      color: "hover:text-blue-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/ketan-chaudhary-poonia/",
      color: "hover:text-blue-600",
    },
    {
      name: "Website",
      icon: Globe,
      url: "https://www.ketanchaudhary.ninja/",
      color: "hover:text-green-500",
    },
  ]

  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Posts Formatted",
      description: "LinkedIn posts enhanced with our tool",
    },
    {
      icon: TrendingUp,
      number: "95%",
      label: "Engagement Boost",
      description: "Average increase in post engagement",
    },
    {
      icon: Search,
      number: "100%",
      label: "Free Forever",
      description: "No hidden costs or premium features",
    },
  ]

  return (
    <div
      className={`min-h-screen transition-colors duration-300  ${
        darkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* SEO-optimized structured content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "LinkedIn Post Formatter - Free Unicode Text Styling Tool",
            description:
              "Transform your LinkedIn posts with beautiful Unicode styling. Free online tool to add bold, italic, and combined formatting.",
            url: "https://www.codewithketan.me",
            mainEntity: {
              "@type": "SoftwareApplication",
              name: "LinkedIn Post Formatter",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web Browser",
            },
          }),
        }}
      />

      {/* Mobile-Optimized Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Type className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">PostFormatter</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>

            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 dark:text-gray-400 transition-colors ${social.color}`}
                  title={`Follow Ketan Chaudhary on ${social.name}`}
                  aria-label={`Follow Ketan Chaudhary on ${social.name}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex items-center justify-center space-x-2">
                <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>

              <div className="flex items-center justify-center space-x-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-600 dark:text-gray-400 transition-colors ${social.color}`}
                    title={`Follow Ketan Chaudhary on ${social.name}`}
                    aria-label={`Follow Ketan Chaudhary on ${social.name}`}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile-Optimized Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            ✨ Free LinkedIn Post Formatter Tool
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            Make Your LinkedIn Posts
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Stand Out
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Transform your LinkedIn posts with beautiful Unicode styling. Add
            <strong> bold</strong>, <em>italic</em>, and combined formatting that works perfectly across all platforms.{" "}
            <strong>100% free</strong> and <strong>privacy-focused</strong>.
          </p>

          {/* Mobile-Optimized Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-3xl mx-auto px-4 sm:px-0">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>

          {/* Mobile-Optimized CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0">
            <Link href="/formatter" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
              >
                Start Formatting Now
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm touch-manipulation"
            >
              <Star className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              View Demo
            </Button>
          </div>

          {/* Mobile-Optimized Demo Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto border border-gray-200 dark:border-gray-700 mx-4 sm:mx-auto">
            <div className="text-left">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                  You
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Ketan Chaudhary</div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">PostFormatter• Now</div>
                </div>
              </div>

              <div className="text-gray-900 dark:text-white leading-relaxed text-sm sm:text-base">
                <p className="mb-2">🚀 Just launched my new project!</p>
                <p className="mb-2">
                  <span className="font-bold">𝐊𝐞𝐲 𝐟𝐞𝐚𝐭𝐮𝐫𝐞𝐬:</span>
                </p>
                <p className="mb-1">• 𝑰𝒏𝒔𝒕𝒂𝒏𝒕 𝒇𝒐𝒓𝒎𝒂𝒕𝒕𝒊𝒏𝒈</p>
                <p className="mb-1">• 𝑹𝒆𝒂𝒍-𝒕𝒊𝒎𝒆 𝒑𝒓𝒆𝒗𝒊𝒆𝒘</p>
                <p className="mb-4">• 𝑷𝒓𝒊𝒗𝒂𝒄𝒚 𝒇𝒊𝒓𝒔𝒕</p>
                <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                  #LinkedIn #Productivity #Tools #PostFormatter
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16" id="features">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Powerful Features for LinkedIn Success
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
            Everything you need to create engaging LinkedIn posts that capture attention and drive engagement
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg touch-manipulation"
            >
              <CardHeader className="text-center pb-3 sm:pb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mobile-Optimized How It Works */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16" id="how-it-works">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">
            Simple, fast, and effective LinkedIn post formatting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {[
            {
              step: "1",
              title: "Write Your Post",
              description: "Type or paste your LinkedIn post content into our intuitive editor",
            },
            {
              step: "2",
              title: "Apply Styling",
              description: "Select text and choose from bold, italic, or combined Unicode formatting",
            },
            {
              step: "3",
              title: "Copy & Share",
              description: "Copy your formatted post and paste it directly to LinkedIn for maximum impact",
            },
          ].map((step, index) => (
            <div key={index} className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-lg sm:text-xl lg:text-2xl font-bold">
                {step.step}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile-Optimized SEO Content Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mx-2 sm:mx-4 lg:mx-0 mb-8 sm:mb-12 lg:mb-16 shadow-xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
              Why Choose Our LinkedIn Post Formatter?
            </h2>

            <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                Our <strong>LinkedIn Post Formatter</strong> is the ultimate tool for professionals looking to enhance
                their social media presence. With support for <strong>Unicode text styling</strong>, you can create
                posts that stand out in the LinkedIn feed and drive higher engagement rates.
              </p>

              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Key Benefits for LinkedIn Marketing:
              </h3>

              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-sm sm:text-base">
                <li>
                  <strong>Increased Visibility:</strong> Styled text catches the eye and increases post engagement
                </li>
                <li>
                  <strong>Professional Branding:</strong> Consistent formatting builds your personal brand
                </li>
                <li>
                  <strong>Better Readability:</strong> Bold and italic text improves content structure
                </li>
                <li>
                  <strong>Cross-Platform Compatibility:</strong> Unicode formatting works everywhere
                </li>
                <li>
                  <strong>Time-Saving:</strong> Format posts quickly with our intuitive interface
                </li>
              </ul>

              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Whether you're a <strong>content creator</strong>, <strong>marketing professional</strong>, or{" "}
                <strong>business owner</strong>, our tool helps you create compelling LinkedIn posts that drive results.
                Start formatting your posts today and see the difference!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-white mx-2 sm:mx-4 lg:mx-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Transform Your LinkedIn Posts?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90">
            Join thousands of professionals creating standout LinkedIn content with our free formatter
          </p>
          <Link href="/formatter">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl touch-manipulation w-full sm:w-auto"
            >
              Start Formatting Free
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Mobile-Optimized Footer */}
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Type className="w-5 h-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">PostFormatter</span>
          </div>

          <div className="flex flex-col items-center space-y-3 sm:space-y-0 sm:flex-row sm:space-x-6">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
              Made with ❤️ by Ketan Chaudhary for LinkedIn creators
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 dark:text-gray-400 transition-colors ${social.color} touch-manipulation`}
                  title={`Follow Ketan Chaudhary on ${social.name}`}
                  aria-label={`Follow Ketan Chaudhary on ${social.name}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
