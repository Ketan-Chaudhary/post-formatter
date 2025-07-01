"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("linkedin-post-dark-mode");
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === "true");
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("linkedin-post-dark-mode", darkMode.toString());
  }, [darkMode]);

  const features = [
    {
      icon: Type,
      title: "Unicode Styling",
      description:
        "Transform your text with mathematical Unicode characters for bold, italic, and combined styles.",
    },
    {
      icon: Zap,
      title: "Instant Preview",
      description:
        "See exactly how your post will look on LinkedIn with our real-time preview feature.",
    },
    {
      icon: Sparkles,
      title: "Smart Formatting",
      description:
        "Toggle styles on/off, combine bold and italic, or reset to normal with intelligent detection.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "All formatting happens locally in your browser. Your content never leaves your device.",
    },
  ];

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
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300  ${
        darkMode
          ? "dark bg-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Type className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              PostFormatter
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 ">
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
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            ✨ Free LinkedIn Post Formatter
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Make Your LinkedIn Posts
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Stand Out
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your LinkedIn posts with beautiful Unicode styling. Add
            bold, italic, and combined formatting that works perfectly across
            all platforms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/formatter">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Formatting
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-white transition-all duration-200 bg-transparent"
            >
              <Star className="mr-2 w-5 h-5" />
              View Demo
            </Button>
          </div>

          {/* Demo Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto border border-gray-200 dark:border-gray-700">
            <div className="text-left">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  You
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Your Name
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Your Title • Now
                  </div>
                </div>
              </div>

              <div className="text-gray-900 dark:text-white leading-relaxed">
                <p className="mb-2">🚀 Just launched my new project!</p>
                <p className="mb-2">
                  <span className="font-bold">𝐊𝐞𝐲 𝐟𝐞𝐚𝐭𝐮𝐫𝐞𝐬:</span>
                </p>
                <p className="mb-1">• 𝑰𝒏𝒔𝒕𝒂𝒏𝒕 𝒇𝒐𝒓𝒎𝒂𝒕𝒕𝒊𝒏𝒈</p>
                <p className="mb-1">• 𝑹𝒆𝒂𝒍-𝒕𝒊𝒎𝒆 𝒑𝒓𝒆𝒗𝒊𝒆𝒘</p>
                <p className="mb-4">• 𝑷𝒓𝒊𝒗𝒂𝒄𝒚 𝒇𝒊𝒓𝒔𝒕</p>
                <p className="text-blue-600 dark:text-blue-400">
                  #LinkedIn #Productivity #Tools
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to create engaging LinkedIn posts that capture
            attention
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg"
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Simple, fast, and effective
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              step: "1",
              title: "Write Your Post",
              description:
                "Type or paste your LinkedIn post content into our editor",
            },
            {
              step: "2",
              title: "Apply Styling",
              description:
                "Select text and choose from bold, italic, or combined formatting",
            },
            {
              step: "3",
              title: "Copy & Share",
              description:
                "Copy your formatted post and paste it directly to LinkedIn",
            },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Posts?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals creating standout LinkedIn content
          </p>
          <Link href="/formatter">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Type className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              PostFormatter
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <p className="text-gray-600 dark:text-gray-400">
              Made with ❤️ for LinkedIn creators
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 dark:text-gray-400 transition-colors ${social.color}`}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
