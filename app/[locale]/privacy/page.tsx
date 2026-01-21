// app/privacy/page.tsx
"use client";

import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import {
  Shield,
  Lock,
  User,
  Database,
  Mail,
  CheckCircle,
  Server,
  Key,
  Users,
  BookOpen,
  ShieldCheck,
  Globe,
  MessageSquare,
  Cloud,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPolicy() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const privacyPrinciples = [
    {
      icon: Shield,
      title: "Zero Tracking",
      description: "No analytics, no cookies, no surveillance",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: Lock,
      title: "Data Minimalism",
      description: "Only collect what's absolutely necessary",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Built for DevOps professionals, by DevOps professionals",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Azure AKS with enterprise-grade security",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const dataCollection = [
    {
      icon: Mail,
      title: "Authentication Only",
      items: ["Email address for login", "No marketing communications"],
    },
    {
      icon: User,
      title: "Public Profile",
      items: ["Optional display name", "Professional bio", "Avatar image"],
    },
    {
      icon: BookOpen,
      title: "Community Content",
      items: ["Published articles", "Technical tutorials", "Code examples"],
    },
  ];

  const securityFeatures = [
    {
      icon: Database,
      title: "Azure AKS",
      description: "Enterprise-grade Kubernetes infrastructure",
    },
    {
      icon: Key,
      title: "Encrypted Auth",
      description: "Passwords hashed with bcrypt",
    },
    {
      icon: ShieldCheck,
      title: "No Third Parties",
      description: "Your data stays with us",
    },
    {
      icon: Globe,
      title: "Regular Updates",
      description: "Security patches applied automatically",
    },
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
                Our Privacy Commitment
              </span>
            </div>

            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Privacy & Data Protection
            </h1>

            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-3xl text-left">
              We believe in keeping things simple. No tracking, no cookies, no
              newsletters — just a clean DevOps learning community built on
              trust and transparency.
            </p>
          </motion.div>
        </section>

        {/* Privacy Principles - Matching Services Page Grid */}
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
                Core Principles
              </span>
            </div>

            <h2 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Our Privacy Principles
            </h2>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              Four simple principles that guide how we handle your data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {privacyPrinciples.map((principle, index) => (
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
                      className={`w-12 h-12 bg-gradient-to-r ${principle.gradient} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <principle.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-black dark:text-white mb-2 text-lg">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Data Collection - Matching About Page Layout */}
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
                Data Collection
              </span>
            </div>

            <h2 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              What We Collect
            </h2>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              Only the bare minimum needed for author accounts. Regular readers
              can access all content completely anonymously.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dataCollection.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-4">
                      <section.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-black dark:text-white mb-3 text-lg">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security & Infrastructure - Improved Design */}
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
                Enterprise Security
              </span>
            </div>

            <h2 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Security & Infrastructure
            </h2>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              We use the same infrastructure trusted by Fortune 500 companies,
              ensuring your data is protected with industry-leading security
              practices.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Features */}
            <div>
              <div className="space-y-6">
                {securityFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                            <feature.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-black dark:text-white mb-2 text-lg">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column - Improved Infrastructure Card */}
            <div>
              <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 h-full">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mx-auto mb-6">
                      <Server className="h-8 w-8" />
                    </div>

                    <h3 className="font-bold text-black dark:text-white text-xl mb-4">
                      Azure AKS Infrastructure
                    </h3>

                    <div className="space-y-4 mb-6 text-left">
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        Built on Microsoft Azure Kubernetes Service with
                        automated security updates, zero-trust architecture, and
                        enterprise-grade reliability. Our infrastructure
                        includes:
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            Auto Security Updates
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            Zero Trust Network
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            99.9% Uptime SLA
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            Daily Backups
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Badge className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-0 px-4 py-2 text-sm">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        SOC 2 Compliant
                      </Badge>
                      <Badge className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-0 px-4 py-2 text-sm">
                        <Cloud className="w-4 h-4 mr-2" />
                        Azure Certified
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <MinimalFooter />
    </div>
  );
}
