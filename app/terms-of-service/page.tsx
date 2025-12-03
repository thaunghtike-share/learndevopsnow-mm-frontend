// app/terms/page.tsx
"use client";

import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import {
  FileText,
  Scale,
  BookOpen,
  Code,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Copyright,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";

export default function TermsOfService() {
  const keySections = [
    {
      icon: BookOpen,
      title: "Educational Purpose",
      description:
        "Content is for learning and should be tested in development environments first",
    },
    {
      icon: Code,
      title: "Code Usage",
      description:
        "Code snippets are open for learning but respect copyright and licenses",
    },
    {
      icon: Users,
      title: "Community Guidelines",
      description: "Be respectful, constructive, and help others learn",
    },
    {
      icon: Shield,
      title: "Content Responsibility",
      description: "Authors are responsible for their published content",
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

  return (
    <div className="min-h-screen bg-white/95 dark:bg-[#000000] relative overflow-hidden transition-colors duration-300">
      <MinimalHeader />

      <main className="px-4 md:px-11 md:py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-16 md:mb-20"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-sky-100 dark:bg-sky-900/20 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20"></div>
          </div>

          <div className="max-w-4xl">
            {/* Header */}
            <div className="max-w-3xl mb-12 md:mb-16">
              <div className="h-1 w-20 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mb-4 md:mb-6"></div>
              <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-4 md:mb-6 leading-tight">
                Terms of Service
                <span className="block bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Clear & Fair
                </span>
              </h2>
              <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed">
                Simple guidelines to ensure our DevOps community remains
                productive, respectful, and focused on learning and sharing
                knowledge.
              </p>
            </div>

            {/* Last Updated */}
            <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 border border-sky-200 dark:border-gray-700 rounded-xl md:rounded-2xl px-4 md:px-6 py-2 md:py-3 shadow-sm">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
              <span className="text-black dark:text-gray-300 font-medium text-sm md:text-base">
                Effective:{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </motion.section>

        {/* Key Points */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 md:mb-20"
        >
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-3 md:mb-4">
              Key Guidelines
            </h2>
            <p className="text-base md:text-lg text-black dark:text-gray-400 max-w-2xl mx-auto">
              Simple rules that keep our community productive and respectful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {keySections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl border border-sky-200 dark:border-gray-700 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 h-full">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300">
                    <section.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-black dark:text-white mb-2 md:mb-3">
                    {section.title}
                  </h3>
                  <p className="text-black dark:text-gray-400 leading-relaxed text-sm md:text-base">
                    {section.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Content Guidelines */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 md:mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* User Rights */}
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                    Your Rights
                  </h2>
                  <p className="text-black dark:text-gray-400 text-sm md:text-base">
                    What you can do on our platform
                  </p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                {userRights.map((right, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700"
                  >
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-sky-600 dark:text-sky-400 mt-0.5 flex-shrink-0" />
                    <span className="text-black dark:text-gray-300 font-medium text-sm md:text-base">
                      {right}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prohibited Content */}
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                    Prohibited Content
                  </h2>
                  <p className="text-black dark:text-gray-400 text-sm md:text-base">
                    What we don't allow on our platform
                  </p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                {prohibitedContent.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700"
                  >
                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <span className="text-black dark:text-gray-300 font-medium text-sm md:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Detailed Terms */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16 md:mb-20"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-12 border border-sky-200 dark:border-gray-700 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-8 md:mb-12 text-center">
                Detailed Terms
              </h2>

              <div className="space-y-8 md:space-y-12">
                {/* Account Terms */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-sky-600 dark:text-sky-400" />
                    1. Account Terms
                  </h3>
                  <div className="space-y-3 md:space-y-4 text-black dark:text-gray-300 text-sm md:text-base">
                    <p>
                      <strong>Author Accounts:</strong> You must be at least 18
                      years old to create an author account. You're responsible
                      for maintaining the security of your account and for all
                      activities that occur under your account.
                    </p>
                    <p>
                      <strong>Accuracy:</strong> Provide accurate information
                      when creating your account. Impersonation of others is
                      strictly prohibited.
                    </p>
                    <p>
                      <strong>Termination:</strong> We reserve the right to
                      suspend or terminate accounts that violate these terms or
                      engage in harmful activities.
                    </p>
                  </div>
                </div>

                {/* Content Guidelines */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-sky-600 dark:text-sky-400" />
                    2. Content Guidelines
                  </h3>
                  <div className="space-y-3 md:space-y-4 text-black dark:text-gray-300 text-sm md:text-base">
                    <p>
                      <strong>Original Content:</strong> You must own or have
                      permission to publish all content you submit. Plagiarism
                      will result in immediate content removal.
                    </p>
                    <p>
                      <strong>Technical Accuracy:</strong> While we encourage
                      sharing knowledge, ensure your technical content is
                      accurate and tested. Include appropriate warnings for
                      production use.
                    </p>
                    <p>
                      <strong>Code Licensing:</strong> Clearly state the license
                      for any code you publish. Default to open-source licenses
                      when sharing educational content.
                    </p>
                  </div>
                </div>

                {/* Intellectual Property */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <Copyright className="w-5 h-5 md:w-6 md:h-6 text-sky-600 dark:text-sky-400" />
                    3. Intellectual Property
                  </h3>
                  <div className="space-y-3 md:space-y-4 text-black dark:text-gray-300 text-sm md:text-base">
                    <p>
                      <strong>Your Content:</strong> You retain ownership of the
                      content you publish. By publishing, you grant
                      LearnDevOpsNow a license to display and distribute that
                      content on our platform.
                    </p>
                    <p>
                      <strong>Platform Content:</strong> The LearnDevOpsNow
                      platform, including its design, code, and branding, is
                      protected by copyright and other intellectual property
                      laws.
                    </p>
                    <p>
                      <strong>Attribution:</strong> When using code snippets or
                      concepts from other authors, provide proper attribution
                      and respect their chosen licenses.
                    </p>
                  </div>
                </div>

                {/* Disclaimer */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-sky-600 dark:text-sky-400" />
                    4. Disclaimer & Liability
                  </h3>
                  <div className="space-y-3 md:space-y-4 text-black dark:text-gray-300 text-sm md:text-base">
                    <p>
                      <strong>Educational Purpose:</strong> All content is
                      provided for educational purposes. Always test code and
                      configurations in development environments before
                      production use.
                    </p>
                    <p>
                      <strong>No Warranty:</strong> Content is provided "as is"
                      without any warranties. Authors are responsible for their
                      published content.
                    </p>
                    <p>
                      <strong>Cloud Costs:</strong> Be aware that following
                      cloud tutorials may incur real costs. Always monitor your
                      cloud spending.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Final Note */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-700 dark:to-blue-700 rounded-2xl md:rounded-3xl p-6 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
                Questions About Our Terms?
              </h2>
              <p className="text-blue-100 dark:text-blue-200 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                We're committed to maintaining a productive learning environment
                for the DevOps community. If you have questions about these
                terms, please reach out.
              </p>
              <a
                href="mailto:thaunghtikeoo.tho1234@gmail.com"
                className="inline-flex items-center gap-2 md:gap-3 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl px-4 md:px-6 py-2 md:py-3 border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-semibold text-sm md:text-base">
                  Contact Us
                </span>
              </a>
            </div>
          </div>
        </motion.section>
      </main>

      <MinimalFooter />
    </div>
  );
}
