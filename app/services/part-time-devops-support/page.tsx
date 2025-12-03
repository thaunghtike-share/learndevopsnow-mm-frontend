"use client";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import {
  Users,
  Lightbulb,
  Scale,
  Zap,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Target,
  BellRing,
  Workflow,
  Code,
  Activity,
  Dock,
  Database,
  RefreshCw,
  Handshake,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Play,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PartTimeDevOpsSupportPage() {
  const features = [
    {
      icon: Scale,
      title: "Flexible Engagement",
      description: "Custom support hours tailored to your needs",
    },
    {
      icon: Zap,
      title: "Cost-Effective",
      description: "No full-time salary expenses",
    },
    {
      icon: ShieldCheck,
      title: "Expert Support",
      description: "Senior DevOps professionals on demand",
    },
    {
      icon: RefreshCw,
      title: "Continuous Improvement",
      description: "Ongoing optimization and maintenance",
    },
  ];

  const stats = [
    { value: "50%", label: "Cost Savings", icon: ArrowRight },
    { value: "24/7", label: "Support Available", icon: Activity },
    { value: "10x", label: "Faster Resolution", icon: Zap },
    { value: "99.9%", label: "Uptime Guarantee", icon: CheckCircle2 },
  ];

  const handleEmailClick = () => {
    window.location.href =
      "mailto:thaunghtikeoo.tho1234@gmail.com?subject=Part-Time DevOps Support Consultation&body=Hi, I'm interested in learning more about your part-time DevOps support services.";
  };

  const handleCaseStudiesClick = () => {
    window.open(
      "https://github.com/thaunghtike-share/DevOps-Projects",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-white/95 dark:bg-[#000000] relative overflow-x-hidden transition-colors duration-300">
      {/* Messenger Button - Hidden on mobile */}
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

      <main className="px-6 md:px-11 md:py-8">
        {/* Hero Section - Left Aligned */}
        <section className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Underline */}
            <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-4 md:mb-6"></div>

            {/* Main Title - Left Aligned */}
            <h1 className="text-3xl md:text-6xl font-bold text-black dark:text-white mb-4 md:mb-6 leading-tight text-left">
              Part-Time
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                DevOps Support
              </span>
            </h1>

            {/* Description - Left Aligned */}
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-3xl text-left">
              Get expert DevOps assistance when you need it without the expense
              of full-time hires. Flexible, cost-effective support tailored to
              your specific requirements.
            </p>

            {/* Feature Grid - Stack on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-left group p-4 md:p-0"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-3 md:mb-4 group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-black dark:text-white mb-1 md:mb-2 text-base md:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-black dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-start items-start">
              <Button
                onClick={handleEmailClick}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 md:px-8 md:py-3 rounded-xl text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Start Free Consultation
              </Button>
              <Button
                variant="outline"
                onClick={handleCaseStudiesClick}
                className="px-6 py-3 md:px-8 md:py-3 rounded-xl text-base md:text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 text-black dark:text-white w-full sm:w-auto"
              >
                View Case Studies
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="mb-16 md:mb-20">
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <stat.icon className="w-5 h-5 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-xl md:text-3xl font-bold text-black dark:text-white mb-1 md:mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-black dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What is Part-Time DevOps Support */}
        <section className="mb-16 md:mb-20">
          <div className="text-left mb-8 md:mb-12">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                ?
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
                  What is Part-Time DevOps Support?
                </h2>
                <p className="text-lg md:text-xl text-black dark:text-gray-300 mt-1 md:mt-2">
                  Expert DevOps assistance whenever you need it
                </p>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl dark:bg-gray-800">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                Flexible DevOps Expertise
              </CardTitle>
              <CardDescription className="text-black dark:text-gray-300 text-base md:text-lg">
                Access senior DevOps professionals on your terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <p className="text-black dark:text-gray-300 leading-relaxed text-base md:text-lg">
                Part-time DevOps support connects your organization with skilled
                DevOps engineers on a flexible, as-needed basis. Perfect for
                projects requiring specialized expertise, temporary resource
                gaps, or ongoing maintenance without the cost of full-time
                staff.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  {
                    icon: Users,
                    title: "On-Demand Expertise",
                    desc: "Access experienced DevOps professionals exactly when you need them.",
                    color: "blue",
                  },
                  {
                    icon: Scale,
                    title: "Cost-Effective",
                    desc: "Only pay for the support you need, avoiding full-time salary expenses.",
                    color: "green",
                  },
                  {
                    icon: RefreshCw,
                    title: "Flexible Engagement",
                    desc: "Customize support hours and project scopes to your specific needs.",
                    color: "orange",
                  },
                  {
                    icon: BookOpen,
                    title: "Strategic Guidance",
                    desc: "Receive expert advice to improve your DevOps maturity and cloud strategy.",
                    color: "purple",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white dark:bg-gray-700 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300 group"
                  >
                    <div
                      className={`p-2 md:p-3 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg md:rounded-xl flex-shrink-0 group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon
                        className={`w-5 h-5 md:w-6 md:h-6 text-${item.color}-600 dark:text-${item.color}-400`}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-black dark:text-white mb-1 md:mb-2 text-base md:text-lg">
                        {item.title}
                      </h4>
                      <p className="text-black dark:text-gray-300 leading-relaxed text-sm md:text-base">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Benefits Section */}
        <section className="mb-16 md:mb-20">
          <div className="text-left mb-8 md:mb-12">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                !
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
                  Why Choose Part-Time DevOps Support?
                </h2>
                <p className="text-lg md:text-xl text-black dark:text-gray-300 mt-1 md:mt-2">
                  Save costs and boost efficiency with expert, flexible support
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl dark:bg-gray-800">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                  <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg md:rounded-xl">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  Business Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {[
                    {
                      icon: Scale,
                      title: "Cost Savings",
                      desc: "Lower operational expenses compared to hiring full-time DevOps staff.",
                      color: "green",
                    },
                    {
                      icon: Target,
                      title: "Focus on Core Business",
                      desc: "Let your internal teams focus on product development while we handle DevOps.",
                      color: "blue",
                    },
                    {
                      icon: Zap,
                      title: "Increased Agility",
                      desc: "Adapt quickly to changing project demands with on-demand support.",
                      color: "orange",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Reduced Overhead",
                      desc: "Avoid recruitment, onboarding, and benefits costs of permanent hires.",
                      color: "purple",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 md:gap-3"
                    >
                      <div
                        className={`p-1 md:p-2 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded md:rounded-lg flex-shrink-0 mt-1`}
                      >
                        <item.icon
                          className={`w-3 h-3 md:w-4 md:h-4 text-${item.color}-600 dark:text-${item.color}-400`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black dark:text-white mb-1 text-sm md:text-base">
                          {item.title}
                        </h4>
                        <p className="text-black dark:text-gray-300 text-xs md:text-sm">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl dark:bg-gray-800">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                  <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  Technical Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {[
                    {
                      icon: Lightbulb,
                      title: "Access to Top Talent",
                      desc: "Work with highly skilled professionals who stay current on industry trends.",
                      color: "blue",
                    },
                    {
                      icon: BellRing,
                      title: "Proactive Problem Solving",
                      desc: "Prevent costly outages with proactive monitoring and issue resolution.",
                      color: "teal",
                    },
                    {
                      icon: Workflow,
                      title: "Best Practices",
                      desc: "Implement industry-standard DevOps practices and tools.",
                      color: "green",
                    },
                    {
                      icon: RefreshCw,
                      title: "Continuous Improvement",
                      desc: "Ongoing optimization of your infrastructure and processes.",
                      color: "orange",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 md:gap-3"
                    >
                      <div
                        className={`p-1 md:p-2 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded md:rounded-lg flex-shrink-0 mt-1`}
                      >
                        <item.icon
                          className={`w-3 h-3 md:w-4 md:h-4 text-${item.color}-600 dark:text-${item.color}-400`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black dark:text-white mb-1 text-sm md:text-base">
                          {item.title}
                        </h4>
                        <p className="text-black dark:text-gray-300 text-xs md:text-sm">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16 md:mb-20">
          <div className="text-left mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-3 md:mb-4">
              Comprehensive DevOps Services
            </h2>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 max-w-2xl">
              End-to-end support across your entire DevOps lifecycle
            </p>
          </div>

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl dark:bg-gray-800">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg md:rounded-xl">
                  <Workflow className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                Key Services Offered
              </CardTitle>
              <CardDescription className="text-black dark:text-gray-300 text-base md:text-lg">
                Everything you need to optimize your DevOps operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[
                  {
                    icon: Zap,
                    title: "CI/CD Pipeline Optimization",
                    desc: "Streamline and automate build, test, and deployment workflows for faster releases.",
                    color: "blue",
                  },
                  {
                    icon: Code,
                    title: "Infrastructure Automation",
                    desc: "Implement Infrastructure as Code using tools like Terraform, Ansible, or Pulumi.",
                    color: "green",
                  },
                  {
                    icon: Scale,
                    title: "Cloud Cost Optimization",
                    desc: "Analyze and reduce your AWS, Azure, or GCP cloud spending to save money.",
                    color: "purple",
                  },
                  {
                    icon: Activity,
                    title: "Monitoring & Alerting",
                    desc: "Deploy monitoring solutions and configure alerts for proactive management.",
                    color: "orange",
                  },
                  {
                    icon: Dock,
                    title: "Kubernetes Management",
                    desc: "Assist with deployment, scaling, and troubleshooting of Kubernetes clusters.",
                    color: "teal",
                  },
                  {
                    icon: Database,
                    title: "Database & Storage Support",
                    desc: "Manage cloud databases, backups, and storage for performance and reliability.",
                    color: "red",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-4 md:p-6 bg-white dark:bg-gray-700 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
                  >
                    <div
                      className={`p-2 md:p-3 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg md:rounded-xl mb-3 md:mb-4 mx-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center`}
                    >
                      <item.icon
                        className={`w-4 h-4 md:w-6 md:h-6 text-${item.color}-600 dark:text-${item.color}-400`}
                      />
                    </div>
                    <h4 className="font-bold text-black dark:text-white mb-1 md:mb-2 text-base md:text-lg">
                      {item.title}
                    </h4>
                    <p className="text-black dark:text-gray-300 text-xs md:text-sm">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section className="mb-16 md:mb-20">
          <div className="text-left mb-8 md:mb-12">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                1
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
                  How It Works
                </h2>
                <p className="text-lg md:text-xl text-black dark:text-gray-300 mt-1 md:mt-2">
                  Simple 4-step process to get expert DevOps support
                </p>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl dark:bg-gray-800">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                  <Handshake className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                Simple Engagement Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  {
                    step: "1",
                    title: "Initial Consultation",
                    desc: "Discuss your current challenges, project goals, and desired outcomes.",
                    icon: Users,
                    color: "blue",
                  },
                  {
                    step: "2",
                    title: "Scope Definition",
                    desc: "Work together to define the project scope, deliverables, and timeline.",
                    icon: BookOpen,
                    color: "green",
                  },
                  {
                    step: "3",
                    title: "Execution & Reporting",
                    desc: "Our experts perform the work, providing regular progress updates and detailed reports.",
                    icon: Code,
                    color: "purple",
                  },
                  {
                    step: "4",
                    title: "Ongoing Support",
                    desc: "Continuous assistance, maintenance, and optimization as your needs evolve.",
                    icon: RefreshCw,
                    color: "orange",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-4 md:p-6 bg-white dark:bg-gray-700 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
                  >
                    <div
                      className={`p-2 md:p-3 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg md:rounded-xl mb-3 md:mb-4 mx-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center`}
                    >
                      <item.icon
                        className={`w-4 h-4 md:w-6 md:h-6 text-${item.color}-600 dark:text-${item.color}-400`}
                      />
                    </div>
                    <h4 className="font-bold text-black dark:text-white mb-1 md:mb-2 text-base md:text-lg">
                      {item.title}
                    </h4>
                    <p className="text-black dark:text-gray-300 text-xs md:text-sm">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="mb-12 md:mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 border-0 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden">
            <CardContent className="p-6 md:p-12 text-center text-white">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                  Ready to Enhance Your DevOps Capability?
                </h2>
                <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-6 md:mb-8 leading-relaxed">
                  Contact us today for a personalized consultation and a
                  flexible support plan tailored to your business needs.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    onClick={handleEmailClick}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 md:px-8 md:py-3 rounded-xl text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                  >
                    <Rocket className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Start Free Consultation
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCaseStudiesClick}
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 md:px-8 md:py-3 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 w-full sm:w-auto"
                  >
                    View Case Studies
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-blue-500">
                  {[
                    {
                      icon: CheckCircle2,
                      label: "Flexible Plans",
                      desc: "Tailored to your needs",
                    },
                    {
                      icon: ShieldCheck,
                      label: "Expert Team",
                      desc: "Senior DevOps professionals",
                    },
                    {
                      icon: Zap,
                      label: "Rapid Start",
                      desc: "Get started in days",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <item.icon className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 text-white" />
                      <h4 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">
                        {item.label}
                      </h4>
                      <p className="text-blue-200 dark:text-blue-300 text-xs md:text-sm">
                        {item.desc}
                      </p>
                    </div>
                  ))}
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
