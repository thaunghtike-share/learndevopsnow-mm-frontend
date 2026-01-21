// app/terms/page.tsx
"use client";

import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import {
  BookOpen,
  Code,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Copyright,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsOfService() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const keySections = [
    {
      icon: BookOpen,
      title: "Educational Purpose",
      description:
        "Content is for learning and should be tested in development environments first",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: Code,
      title: "Code Usage",
      description:
        "Code snippets are open for learning but respect copyright and licenses",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: Users,
      title: "Community Guidelines",
      description: "Be respectful, constructive, and help others learn",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: Shield,
      title: "Content Responsibility",
      description: "Authors are responsible for their published content",
      gradient: "from-orange-500 to-amber-600",
    },
  ];

  const prohibitedContent = [
    "Malicious code or security vulnerabilities",
    "Plagiarized or copyrighted material",
    "Misleading or false technical information",
    "Commercial promotions or advertisements",
    "Harassment or inappropriate content",
  ];

  const userRights = [
    "Access and read all published content",
    "Create an author account to share knowledge",
    "Use code snippets for learning purposes",
    "Provide constructive feedback on articles",
    "Request account deletion at any time",
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white/95 dark:bg-[#000000] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white/95 dark:bg-[#000000] relative transition-colors duration-300">
      {/* Messenger Button */}
      <a
        href="https://m.me/learndevopsnowbytho"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Messenger Support"
        className="hidden md:flex fixed top-[70%] right-4 z-50 group"
      >
        <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg rounded-full px-4 py-3 cursor-pointer transition-all duration-400 hover:scale-105 hover:shadow-xl">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="text-sm font-medium text-black dark:text-white">
            Chat Now
          </span>
        </div>
      </a>

      <MinimalHeader />

      <main className="px-4 md:px-11 md:py-8">
        {/* Hero Section - Matching About Page */}
        <section className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Blue/Purple gradient line with "Our Mission" style */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Terms of Service
              </span>
            </div>

            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Terms of Service
            </h1>

            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-3xl text-left">
              Simple guidelines to ensure our DevOps community remains
              productive, respectful, and focused on learning and sharing
              knowledge.
            </p>
          </motion.div>
        </section>

        {/* Key Points - Matching Services Page Grid */}
        <section className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mb-8"
          >
            {/* Blue/Purple gradient line */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Core Guidelines
              </span>
            </div>

            <h2 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Key Guidelines
            </h2>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              Simple rules that keep our community productive and respectful
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keySections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${section.gradient} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <section.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-black dark:text-white mb-2 text-lg">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Content Guidelines - Matching About Page Layout */}
        <section className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mb-8"
          >
            {/* Blue/Purple gradient line */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Community Rules
              </span>
            </div>

            <h2 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Community Guidelines
            </h2>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              Clear boundaries to maintain a productive and respectful learning
              environment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Rights Card */}
            <div>
              <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black dark:text-white text-xl">
                        Your Rights
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        What you can do on our platform
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {userRights.map((right, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-black dark:text-gray-300 font-medium text-sm">
                          {right}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Prohibited Content Card */}
            <div>
              <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black dark:text-white text-xl">
                        Prohibited Content
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        What we don't allow on our platform
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {prohibitedContent.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700"
                      >
                        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                        <span className="text-black dark:text-gray-300 font-medium text-sm">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Detailed Terms - Matching Services Page Layout */}
        <section className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mb-8"
          >
            {/* Blue/Purple gradient line */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Detailed Terms
              </span>
            </div>

            <h2 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Detailed Terms & Conditions
            </h2>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              Complete terms governing your use of our DevOps learning platform
            </p>
          </motion.div>

          <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-12">
                {/* Account Terms */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-black dark:text-white text-xl">
                      1. Account Terms
                    </h3>
                  </div>

                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">A</span>
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white mb-1">
                          Author Accounts:
                        </p>
                        <p className="text-sm">
                          You must be at least 18 years old to create an author
                          account. You're responsible for maintaining the
                          security of your account and for all activities that
                          occur under your account.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">B</span>
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white mb-1">
                          Accuracy:
                        </p>
                        <p className="text-sm">
                          Provide accurate information when creating your
                          account. Impersonation of others is strictly
                          prohibited.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">C</span>
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white mb-1">
                          Termination:
                        </p>
                        <p className="text-sm">
                          We reserve the right to suspend or terminate accounts
                          that violate these terms or engage in harmful
                          activities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Guidelines */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-black dark:text-white text-xl">
                      2. Content Guidelines
                    </h3>
                  </div>

                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">A</span>
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white mb-1">
                          Original Content:
                        </p>
                        <p className="text-sm">
                          You must own or have permission to publish all content
                          you submit. Plagiarism will result in immediate
                          content removal.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">B</span>
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white mb-1">
                          Technical Accuracy:
                        </p>
                        <p className="text-sm">
                          While we encourage sharing knowledge, ensure your
                          technical content is accurate and tested. Include
                          appropriate warnings for production use.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">C</span>
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white mb-1">
                          Code Licensing:
                        </p>
                        <p className="text-sm">
                          Clearly state the license for any code you publish.
                          Default to open-source licenses when sharing
                          educational content.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Intellectual Property */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Copyright className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-black dark:text-white text-xl">
                      3. Intellectual Property
                    </h3>
                  </div>

                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">A</span>
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white mb-1">
                          Your Content:
                        </p>
                        <p className="text-sm">
                          You retain ownership of the content you publish. By
                          publishing, you grant LearnDevOpsNow a license to
                          display and distribute that content on our platform.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">B</span>
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white mb-1">
                          Platform Content:
                        </p>
                        <p className="text-sm">
                          The LearnDevOpsNow platform, including its design,
                          code, and branding, is protected by copyright and
                          other intellectual property laws.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">C</span>
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white mb-1">
                          Attribution:
                        </p>
                        <p className="text-sm">
                          When using code snippets or concepts from other
                          authors, provide proper attribution and respect their
                          chosen licenses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <MinimalFooter />
    </div>
  );
}
