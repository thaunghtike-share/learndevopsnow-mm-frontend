// app/docs/page.tsx
"use client";

import { useState } from "react";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import {
  BookOpen,
  User,
  LogIn,
  FileText,
  LayoutDashboard,
  Edit3,
  ChevronRight,
  Plus,
  ArrowRight,
  GraduationCap,
  Code,
  Video,
  School,
  Map,
  Crown,
  Users,
  Settings,
  Trash2,
  Rocket,
  Award,
  Container,
  Ship,
  Zap,
  Layout,
  GitBranch,
  RefreshCcw,
  TrendingUp,
  Star,
  Menu,
  X,
} from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    {
      id: "overview",
      title: "Platform Overview",
      icon: BookOpen,
      content: <OverviewSection />,
    },
    {
      id: "getting-started",
      title: "Getting Started",
      icon: LogIn,
      content: <GettingStartedSection />,
    },
    {
      id: "learning",
      title: "Learning Resources",
      icon: GraduationCap,
      content: <LearningSection />,
    },
    {
      id: "writing",
      title: "Writing Articles",
      icon: Edit3,
      content: <WritingSection />,
    },
    {
      id: "dashboard",
      title: "Admin Dashboard",
      icon: LayoutDashboard,
      content: <DashboardSection />,
    },
    {
      id: "account",
      title: "Account & Profile",
      icon: User,
      content: <AccountSection />,
    },
  ];

  const activeContent = sections.find(
    (section) => section.id === activeSection
  )?.content;

  return (
    <div className="min-h-screen bg-white/95 dark:bg-[#000000] relative overflow-x-hidden transition-colors duration-300">
      <MinimalHeader />

      <main className="px-4 md:px-11 md:py-8">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              User Guide
            </span>
          </div>
          <h1 className="text-3xl md:text-7xl font-light text-black dark:text-white mb-4 md:mb-6 tracking-tight">
            Learn DevOps Now - Myanmar
          </h1>
          <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed max-w-3xl">
            Complete guide to using our DevOps learning platform. Master tools,
            share knowledge, and grow your career.
          </p>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <Menu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-black dark:text-white">
                {sections.find((s) => s.id === activeSection)?.title}
              </span>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform ${
                mobileMenuOpen ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
          {/* Sidebar Navigation */}
          <div
            className={`lg:w-80 flex-shrink-0 ${
              mobileMenuOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="sticky top-24">
              <nav className="space-y-2 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 lg:hidden">
                  <h3 className="font-semibold text-black dark:text-white">
                    Navigation
                  </h3>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5 text-black dark:text-white" />
                  </button>
                </div>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-4 rounded-lg md:rounded-xl text-left transition-all ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                        : "text-black dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <section.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">
                      {section.title}
                    </span>
                    {activeSection === section.id && (
                      <ChevronRight className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="p-4 md:p-8">{activeContent}</div>
            </div>
          </div>
        </div>
      </main>

      <MinimalFooter />
    </div>
  );
}

// Section Components - Updated for mobile
function OverviewSection() {
  return (
    <div className="space-y-8 md:space-y-12">
      <div>
        <h2 className="text-2xl md:text-4xl font-light text-black dark:text-white mb-4 md:mb-6 tracking-tight">
          Platform Overview
        </h2>
        <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed max-w-3xl">
          Learn DevOps Now - Burmese is a comprehensive learning platform
          designed specifically for developers and students in Myanmar. We
          provide structured learning paths, hands-on practice environments, and
          a supportive community to help you master DevOps technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
        <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
            <Rocket className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-xl md:text-2xl font-light text-black dark:text-white mb-3 md:mb-4">
            Learn DevOps
          </h3>
          <p className="text-black dark:text-gray-300 leading-relaxed text-sm md:text-base">
            Follow our structured learning path from basic Linux commands to
            advanced cloud technologies. All resources are curated for Burmese
            learners.
          </p>
        </div>

        <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
            <Edit3 className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-xl md:text-2xl font-light text-black dark:text-white mb-3 md:mb-4">
            Share Knowledge
          </h3>
          <p className="text-black dark:text-gray-300 leading-relaxed text-sm md:text-base">
            Write articles and tutorials to help other learners. Build your
            reputation as a DevOps expert while reinforcing your own learning.
          </p>
        </div>

        <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-xl md:text-2xl font-light text-black dark:text-white mb-3 md:mb-4">
            Join Community
          </h3>
          <p className="text-black dark:text-gray-300 leading-relaxed text-sm md:text-base">
            Connect with other DevOps learners, ask questions, and learn from
            industry experts. Build your professional network.
          </p>
        </div>

        <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
            <Code className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-xl md:text-2xl font-light text-black dark:text-white mb-3 md:mb-4">
            Practice Skills
          </h3>
          <p className="text-black dark:text-gray-300 leading-relaxed text-sm md:text-base">
            Use our free DevOps playgrounds to practice tools like Docker and
            Kubernetes in safe, browser-based environments.
          </p>
        </div>
      </div>
    </div>
  );
}

function GettingStartedSection() {
  return (
    <div className="space-y-8 md:space-y-12">
      <div>
        <h2 className="text-2xl md:text-4xl font-light text-black dark:text-white mb-4 md:mb-6 tracking-tight">
          Getting Started
        </h2>
        <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed max-w-3xl">
          Begin your DevOps journey with these simple steps. Explore resources
          immediately or create an account to unlock all features.
        </p>
      </div>

      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-base md:text-lg font-bold">1</span>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-light text-black dark:text-white mb-3 md:mb-4">
              Explore Learning Resources
            </h3>
            <p className="text-black dark:text-gray-300 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
              Start learning immediately without creating an account. Access all
              our curated resources:
            </p>
            <ul className="text-black dark:text-gray-300 space-y-2 md:space-y-3 text-sm md:text-base">
              {[
                "Follow the DevOps roadmap",
                "Watch YouTube course videos",
                "Learn DevOps free courses",
                "Use free DevOps playgrounds",
                "Read articles and tutorials",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-base md:text-lg font-bold">2</span>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-light text-black dark:text-white mb-3 md:mb-4">
              Create Your Account
            </h3>
            <p className="text-black dark:text-gray-300 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
              Click the <span className="font-semibold">"Write Article"</span>{" "}
              button in the header to sign up with Google or email.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-white font-bold text-sm md:text-base">
                    G
                  </span>
                </div>
                <p className="font-semibold text-black dark:text-white text-sm md:text-base">
                  Google Sign Up
                </p>
                <p className="text-black dark:text-gray-300 text-xs md:text-sm mt-1 md:mt-2">
                  Quick one-click registration
                </p>
              </div>
              <div className="text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-white font-bold text-sm md:text-base">
                    @
                  </span>
                </div>
                <p className="font-semibold text-black dark:text-white text-sm md:text-base">
                  Sign Up
                </p>
                <p className="text-black dark:text-gray-300 text-xs md:text-sm mt-1 md:mt-2">
                  Traditional registration
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-base md:text-lg font-bold">3</span>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-light text-black dark:text-white mb-3 md:mb-4">
              Complete Your Profile
            </h3>
            <p className="text-black dark:text-gray-300 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
              Build your author identity by completing your profile information:
            </p>
            <ul className="text-black dark:text-gray-300 space-y-2 md:space-y-3 text-sm md:text-base">
              {[
                "Display name and professional bio",
                "Job title and company information",
                "LinkedIn profile URL",
                "Profile picture",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function LearningSection() {
  return (
    <div className="space-y-8 md:space-y-12">
      <div>
        <h2 className="text-2xl md:text-4xl font-light text-black dark:text-white mb-4 md:mb-6 tracking-tight">
          Learning Resources
        </h2>
        <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed max-w-3xl">
          Access multiple learning formats designed for different learning
          styles. All resources are carefully curated and organized in logical
          progression.
        </p>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* DevOps Roadmap */}
        <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center">
              <Map className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-light text-black dark:text-white">
                DevOps Roadmap
              </h3>
              <p className="text-black dark:text-gray-300 text-sm md:text-base">
                Structured learning path from beginner to advanced
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-3 md:mb-4 text-sm md:text-base">
                Foundation Topics
              </h4>
              <div className="space-y-2 md:space-y-3">
                {[
                  "Linux Fundamentals",
                  "Networking Basics",
                  "Git & Version Control",
                  "Docker Essentials",
                ].map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 md:p-4 bg-white dark:bg-gray-700 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs md:text-sm font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-black dark:text-white font-medium text-sm md:text-base">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-3 md:mb-4 text-sm md:text-base">
                Advanced Topics
              </h4>
              <div className="space-y-2 md:space-y-3">
                {[
                  "Cloud Platforms",
                  "CI/CD Pipelines",
                  "Kubernetes",
                  "GitOps",
                ].map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 md:p-4 bg-white dark:bg-gray-700 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs md:text-sm font-bold">
                        {index + 5}
                      </span>
                    </div>
                    <span className="text-black dark:text-white font-medium text-sm md:text-base">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* YouTube Courses */}
        <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl md:rounded-2xl flex items-center justify-center">
              <Video className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-light text-black dark:text-white">
                YouTube Courses
              </h3>
              <p className="text-black dark:text-gray-300 text-sm md:text-base">
                Learn from top creators with comprehensive playlists
              </p>
            </div>
          </div>
          <div className="mb-6 md:mb-8">
            <p className="text-black dark:text-gray-300 leading-relaxed text-sm md:text-base">
              Learn DevOps systematically starting with Linux and networking
              fundamentals, then progress to Docker, Git, and CI/CD pipelines,
              and finally master advanced topics like Kubernetes, Terraform, and
              production-grade DevOps practices.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-3 md:mb-4 text-sm md:text-base">
                Featured Creators
              </h4>
              <ul className="text-black dark:text-gray-300 space-y-2 md:space-y-3 text-sm md:text-base">
                {[
                  "TechWorld with Nana - Clear DevOps explanations",
                  "freeCodeCamp - Comprehensive project-based courses",
                  "KodeKloud - Hands-on labs and tutorials",
                  "Simplilearn - Professional certification prep",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 md:gap-3">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-3 md:mb-4 text-sm md:text-base">
                Learning Benefits
              </h4>
              <ul className="text-black dark:text-gray-300 space-y-2 md:space-y-3 text-sm md:text-base">
                {[
                  "Free access to expert content",
                  "Practical, real-world examples",
                  "Regular content updates",
                  "Community support and discussions",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 md:gap-3">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Free Courses Section */}
        <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl md:rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-light text-black dark:text-white">
                Free Courses
              </h3>
              <p className="text-black dark:text-gray-300 text-sm md:text-base">
                Get started with free DevOps courses
              </p>
            </div>
          </div>
          <div className="text-black dark:text-gray-300 leading-relaxed text-sm md:text-base">
            <p>
              Access free hands-on labs from KodeKloud for Docker and
              Kubernetes, practical DevOps courses on Udemy covering Git and
              Linux, and certificate courses from Great Learning on AWS and
              cloud technologies.
            </p>
          </div>
        </div>

        {/* DevOps Playgrounds */}
        <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center">
              <Container className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-light text-black dark:text-white">
                DevOps Playgrounds
              </h3>
              <p className="text-black dark:text-gray-300 text-sm md:text-base">
                Interactive environments to practice DevOps tools
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-3 md:mb-4 text-sm md:text-base">
                Browser-Based Labs
              </h4>
              <div className="space-y-3 md:space-y-4">
                {[
                  {
                    name: "Killer Coda",
                    desc: "Interactive labs for Kubernetes, Docker, Linux",
                  },
                  {
                    name: "Play with Kubernetes",
                    desc: "Fully functional Kubernetes playground",
                  },
                  {
                    name: "Play with Docker",
                    desc: "Master containerization with Docker",
                  },
                ].map((lab, index) => (
                  <div
                    key={index}
                    className="p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                      <span className="font-semibold text-black dark:text-white text-sm md:text-base">
                        {lab.name}
                      </span>
                    </div>
                    <p className="text-black dark:text-gray-300 text-xs md:text-sm">
                      {lab.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-3 md:mb-4 text-sm md:text-base">
                Specialized Labs
              </h4>
              <div className="space-y-3 md:space-y-4">
                {[
                  {
                    name: "Terraform Labs",
                    desc: "Learn Infrastructure as Code",
                  },
                  {
                    name: "GitHub Learning Lab",
                    desc: "Interactive Git tutorials",
                  },
                  { name: "Jenkins Labs", desc: "Build CI/CD pipelines" },
                ].map((lab, index) => (
                  <div
                    key={index}
                    className="p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Layout className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                      <span className="font-semibold text-black dark:text-white text-sm md:text-base">
                        {lab.name}
                      </span>
                    </div>
                    <p className="text-black dark:text-gray-300 text-xs md:text-sm">
                      {lab.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WritingSection() {
  return (
    <div className="space-y-8 md:space-y-12">
      <div>
        <h2 className="text-2xl md:text-4xl font-light text-black dark:text-white mb-4 md:mb-6 tracking-tight">
          Writing Articles
        </h2>
        <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed max-w-3xl">
          Share your DevOps knowledge and experiences with the community.
          Writing helps reinforce your learning and builds your professional
          reputation.
        </p>
      </div>

      <div className="space-y-6 md:space-y-8">
        <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl md:text-2xl font-light text-black dark:text-white mb-4 md:mb-6">
            How to Write Articles
          </h3>
          <div className="space-y-4 md:space-y-6">
            {[
              {
                step: "1",
                title: "Go to Your Dashboard",
                desc: "Click your profile picture → Dashboard to access your author workspace",
              },
              {
                step: "2",
                title: "Click Write New Article",
                desc: "Use the prominent button to start creating your content",
              },
              {
                step: "3",
                title: "Use Markdown Editor",
                desc: "Write with live preview, syntax highlighting, and easy formatting",
              },
              {
                step: "4",
                title: "Add Article Details",
                desc: "Set title, category, tags, cover image, and publication date",
              },
              {
                step: "5",
                title: "Publish Your Article",
                desc: "Save as draft or publish immediately to share with the community",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-600"
              >
                <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm md:text-lg font-bold">
                    {item.step}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-black dark:text-white text-base md:text-lg mb-1 md:mb-2">
                    {item.title}
                  </p>
                  <p className="text-black dark:text-gray-300 text-sm md:text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
          <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-black dark:text-white mb-3 md:mb-4 text-sm md:text-base">
              Writing Best Practices
            </h4>
            <ul className="text-black dark:text-gray-300 space-y-2 md:space-y-3 text-sm md:text-base">
              {[
                "Share personal learning experiences",
                "Include practical code examples",
                "Use clear, beginner-friendly language",
                "Create step-by-step tutorials",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-black dark:text-white mb-3 md:mb-4 text-sm md:text-base">
              What to Avoid
            </h4>
            <ul className="text-black dark:text-gray-300 space-y-2 md:space-y-3 text-sm md:text-base">
              {[
                "Copying content from other sites",
                "Overly technical without explanations",
                "Inappropriate language or content",
                "Unrelated topics",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSection() {
  return (
    <div className="space-y-8 md:space-y-12">
      <div>
        <h2 className="text-2xl md:text-4xl font-light text-black dark:text-white mb-4 md:mb-6 tracking-tight">
          Admin Dashboard
        </h2>
        <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed max-w-3xl">
          Your personal control center for managing articles, tracking
          performance, and growing your audience as an author.
        </p>
      </div>

      <div className="space-y-6 md:space-y-8">
        <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl md:text-2xl font-light text-black dark:text-white mb-4 md:mb-6">
            Dashboard Features
          </h3>
          <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-3 md:mb-4 text-sm md:text-base">
                Content Management
              </h4>
              <ul className="text-black dark:text-gray-300 space-y-2 md:space-y-3 text-sm md:text-base">
                {[
                  "Create new articles",
                  "Edit existing articles",
                  "View all published content",
                  "Quick access to writing tools",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 md:gap-3">
                    <Plus className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-3 md:mb-4 text-sm md:text-base">
                Performance Analytics
              </h4>
              <ul className="text-black dark:text-gray-300 space-y-2 md:space-y-3 text-sm md:text-base">
                {[
                  "Track article views and reads",
                  "Monitor reader engagement",
                  "View author ranking",
                  "Analyze content performance",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 md:gap-3">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountSection() {
  return (
    <div className="space-y-8 md:space-y-12">
      <div>
        <h2 className="text-2xl md:text-4xl font-light text-black dark:text-white mb-4 md:mb-6 tracking-tight">
          Account & Profile
        </h2>
        <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed max-w-3xl">
          Manage your account settings, author profile, and access different
          platform features through the user dropdown menu.
        </p>
      </div>

      <div className="space-y-6 md:space-y-8">
        <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl md:text-2xl font-light text-black dark:text-white mb-4 md:mb-6">
            User Dropdown Menu
          </h3>
          <p className="text-black dark:text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
            Click your profile picture in the top right corner to access these
            important options:
          </p>

          <div className="space-y-3 md:space-y-4">
            {[
              {
                icon: Crown,
                title: "Public Profile View",
                desc: "See how other users view your profile and published articles",
              },
              {
                icon: LayoutDashboard,
                title: "Admin Dashboard",
                desc: "Access your personal dashboard to manage articles and analytics",
              },
              {
                icon: Settings,
                title: "Edit Your Profile",
                desc: "Update your author information, bio, and profile picture",
              },
              {
                icon: Trash2,
                title: "Delete Account",
                desc: "Permanently delete your account and all associated data",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-600"
              >
                <item.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-black dark:text-white text-base md:text-lg mb-1">
                    {item.title}
                  </h4>
                  <p className="text-black dark:text-gray-300 text-sm md:text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl md:text-2xl font-light text-black dark:text-white mb-4 md:mb-6">
            Account Management
          </h3>
          <div className="space-y-4 md:space-y-6">
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-3 md:mb-4 text-sm md:text-base">
                Profile Information
              </h4>
              <ul className="text-black dark:text-gray-300 space-y-2 md:space-y-3 text-sm md:text-base">
                {[
                  "Display Name - How you appear to other users",
                  "Professional Bio - Your background and expertise",
                  "Job Title & Company - Your current role",
                  "LinkedIn Profile - Connect your professional profile",
                  "Profile Picture - Add a professional photo",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 md:gap-3">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-600">
                <p className="text-black dark:text-gray-300 mb-2 md:mb-3 text-sm md:text-base">
                  <strong>Warning:</strong> Deleting your account is permanent
                  and cannot be undone.
                </p>
                <ul className="text-black dark:text-gray-300 space-y-1 md:space-y-2 text-xs md:text-sm">
                  <li>• All your published articles will be removed</li>
                  <li>• Your author profile will be deleted</li>
                  <li>• All comments and interactions will be removed</li>
                  <li>• This action cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
