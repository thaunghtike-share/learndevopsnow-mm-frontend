"use client";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import {
  Code,
  Cloud,
  ShieldCheck,
  Zap,
  GitBranch,
  RefreshCw,
  CheckCircle2,
  Rocket,
  Scale,
  Users,
  FileText,
  BookOpen,
  Lightbulb,
  Workflow,
  Terminal,
  Server,
  Database,
  Layers,
  Cpu,
  MemoryStick,
  Scan,
  Sparkles,
  ExternalLink,
  Play,
  ArrowRight,
  Activity,
  Star,
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

export default function InfraAsCodePage() {
  const features = [
    {
      icon: Workflow,
      title: "End-to-End Automation",
      description: "Complete infrastructure automation from code to production",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security",
      description: "Built-in security and compliance at every layer",
    },
    {
      icon: Scale,
      title: "Auto Scaling",
      description: "Intelligent resource optimization",
    },
    {
      icon: Zap,
      title: "High Performance",
      description: "10x faster infrastructure deployment",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime SLA", icon: CheckCircle2 },
    { value: "60%", label: "Cost Reduction", icon: ArrowRight },
    { value: "10x", label: "Faster Deployments", icon: Zap },
    { value: "24/7", label: "Monitoring", icon: Activity },
  ];

  const handleEmailClick = () => {
    window.location.href =
      "mailto:thaunghtikeoo.tho1234@gmail.com?subject=Free Consultation - Infrastructure as Code&body=Hi, I'm interested in learning more about your Infrastructure as Code services.";
  };

  const handleCaseStudiesClick = () => {
    window.open(
      "https://github.com/thaunghtike-share/DevOps-Projects",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-white/95 dark:bg-[#000000] relative transition-colors duration-300">
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
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.844.523 3.566 1.426 5.035L2 22l5.035-1.426A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
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
            {/* Underline - Left Aligned */}
            <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 rounded-full mb-4 md:mb-6"></div>

            {/* Main Title - Left Aligned */}
            <h1 className="text-3xl md:text-6xl font-bold text-black dark:text-white mb-4 md:mb-6 leading-tight text-left">
              From Manual to
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Automated Infrastructure
              </span>
            </h1>

            {/* Description - Left Aligned */}
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-3xl text-left">
              Transform your infrastructure management from manual processes to
              automated, version-controlled deployments with our complete
              Infrastructure as Code platform.
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

        {/* What is IaC Section */}
        <section className="mb-16 md:mb-20">
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                ?
              </div>
              <div className="text-left">
                <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
                  What is Infrastructure as Code (IaC)?
                </h2>
                <p className="text-lg md:text-xl text-black dark:text-gray-300 mt-1 md:mt-2">
                  Defining and managing infrastructure resources using
                  configuration files
                </p>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                Modern Infrastructure Management
              </CardTitle>
              <CardDescription className="text-black dark:text-gray-300 text-base md:text-lg">
                The industry standard for automated infrastructure provisioning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <p className="text-black dark:text-gray-300 leading-relaxed text-base md:text-lg">
                Infrastructure as Code (IaC) is the management of infrastructure
                (networks, virtual machines, load balancers, and connection
                topology) in a descriptive model, using the same versioning as
                DevOps team uses for source code.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  {
                    icon: Code,
                    title: "Declarative Configuration",
                    desc: "Define your infrastructure in human-readable files using YAML, JSON, or HCL.",
                    color: "blue",
                  },
                  {
                    icon: GitBranch,
                    title: "Version Control",
                    desc: "Store infrastructure configurations in Git for tracking, collaboration, and rollbacks.",
                    color: "green",
                  },
                  {
                    icon: Zap,
                    title: "Automated Provisioning",
                    desc: "Automatically provision and manage infrastructure with consistent, repeatable processes.",
                    color: "orange",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Security & Compliance",
                    desc: "Enforce security policies and compliance standards through code-based definitions.",
                    color: "purple",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 group"
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

        {/* Importance of IaC */}
        <section className="mb-16 md:mb-20">
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                !
              </div>
              <div className="text-left">
                <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
                  Why is IaC Important?
                </h2>
                <p className="text-lg md:text-xl text-black dark:text-gray-300 mt-1 md:mt-2">
                  Key benefits for modern cloud environments
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl">
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
                      icon: Zap,
                      title: "Speed & Efficiency",
                      desc: "Automates provisioning, reducing manual effort and accelerating deployment cycles.",
                      color: "blue",
                    },
                    {
                      icon: Rocket,
                      title: "Cost Optimization",
                      desc: "Prevents over-provisioning and allows for dynamic scaling, leading to better resource utilization.",
                      color: "orange",
                    },
                    {
                      icon: Users,
                      title: "Collaboration & Visibility",
                      desc: "Infrastructure definitions are shared and version-controlled, fostering team collaboration.",
                      color: "purple",
                    },
                    {
                      icon: RefreshCw,
                      title: "Disaster Recovery",
                      desc: "Enables rapid rebuilding of infrastructure in case of failures, improving recovery time.",
                      color: "teal",
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

            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                  <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                    <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  Technical Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {[
                    {
                      icon: CheckCircle2,
                      title: "Consistency & Reproducibility",
                      desc: "Eliminates configuration drift and ensures identical environments across stages.",
                      color: "green",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Reduced Risk & Errors",
                      desc: "Minimizes human error through automation and allows testing before deployment.",
                      color: "red",
                    },
                    {
                      icon: Scale,
                      title: "Scalability & Elasticity",
                      desc: "Automatically scaling infrastructure up or down based on demand.",
                      color: "teal",
                    },
                    {
                      icon: Workflow,
                      title: "CI/CD Integration",
                      desc: "Integrating infrastructure changes directly into continuous delivery pipelines.",
                      color: "green",
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

        {/* IaC Tools Section */}
        <section className="mb-16 md:mb-20">
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-3 md:mb-4 text-left">
              Complete IaC Toolchain
            </h2>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 max-w-2xl text-left">
              Our comprehensive suite of Infrastructure as Code tools
            </p>
          </div>

          {/* Terraform */}
          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl mb-6 md:mb-8">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg md:rounded-xl">
                  <Cloud className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                Terraform (HashiCorp)
              </CardTitle>
              <CardDescription className="text-black dark:text-gray-300 text-base md:text-lg">
                Declarative infrastructure provisioning across multiple cloud
                providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  {
                    icon: Layers,
                    title: "Multi-Cloud Support",
                    desc: "Manage infrastructure across diverse cloud environments from a single workflow.",
                    color: "blue",
                  },
                  {
                    icon: GitBranch,
                    title: "State Management",
                    desc: "Keeps track of the real-world state of your infrastructure for safe changes.",
                    color: "green",
                  },
                  {
                    icon: Code,
                    title: "Modularity with Terragrunt",
                    desc: "Enhances Terraform with DRY principles and remote state management.",
                    color: "orange",
                  },
                  {
                    icon: RefreshCw,
                    title: "Import Existing Infrastructure",
                    desc: "Generate Terraform configuration from existing infrastructure for legacy systems.",
                    color: "purple",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                  >
                    <div
                      className={`p-2 md:p-3 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg md:rounded-xl flex-shrink-0`}
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

              {/* Terraform Modules */}
              <div className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl md:rounded-2xl border border-blue-200 dark:border-blue-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-blue-500 rounded-lg md:rounded-xl shadow-lg">
                      <Code className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-black dark:text-white text-lg md:text-xl mb-1 md:mb-2">
                        Production Terraform Modules
                      </h4>
                      <p className="text-black dark:text-gray-300 mb-2 md:mb-3 text-sm md:text-base">
                        Complete infrastructure modules for Azure, AWS, and GCP.
                        Production-ready with security best practices.
                      </p>
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0 text-xs">
                          Azure
                        </Badge>
                        <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-0 text-xs">
                          AWS
                        </Badge>
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-0 text-xs">
                          GCP
                        </Badge>
                        <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-0 text-xs">
                          Kubernetes
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 hover:scale-105 mt-3 lg:mt-0 w-full lg:w-auto"
                    onClick={() =>
                      window.open(
                        "https://github.com/thaunghtike-share/terraform-azure",
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    View Modules
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Ansible */}
            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-bold text-black dark:text-white">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg md:rounded-xl">
                    <Terminal className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />
                  </div>
                  Ansible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                  Agentless automation for configuration management and
                  application deployment.
                </p>
                <div className="space-y-2 md:space-y-3">
                  {[
                    "YAML Playbooks",
                    "Agentless Architecture",
                    "Idempotent Operations",
                    "Orchestration",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                      <span className="text-black dark:text-gray-300 text-xs md:text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pulumi */}
            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-bold text-black dark:text-white">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg md:rounded-xl">
                    <Code className="w-4 h-4 md:w-5 md:h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  Pulumi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                  Infrastructure as Code using familiar programming languages.
                </p>
                <div className="space-y-2 md:space-y-3">
                  {[
                    "TypeScript/Python/Go",
                    "Multi-Cloud Support",
                    "Component Reusability",
                    "Policy as Code",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-teal-500" />
                      <span className="text-black dark:text-gray-300 text-xs md:text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Implementation Steps */}
        <section className="mb-16 md:mb-20">
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                1
              </div>
              <div className="text-left">
                <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
                  Step-by-Step IaC Implementation
                </h2>
                <p className="text-lg md:text-xl text-black dark:text-gray-300 mt-1 md:mt-2">
                  A typical workflow for managing infrastructure with code
                </p>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                  <Workflow className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                Complete Implementation Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  {
                    step: "1",
                    title: "Define Infrastructure",
                    desc: "Write declarative configuration files specifying desired infrastructure state.",
                    icon: FileText,
                    color: "blue",
                  },
                  {
                    step: "2",
                    title: "Version Control",
                    desc: "Store IaC files in Git repository for collaboration and history tracking.",
                    icon: GitBranch,
                    color: "green",
                  },
                  {
                    step: "3",
                    title: "Plan & Apply",
                    desc: "Preview changes and provision/update infrastructure automatically.",
                    icon: Rocket,
                    color: "purple",
                  },
                  {
                    step: "4",
                    title: "Monitor & Maintain",
                    desc: "Continuously monitor infrastructure and update IaC as requirements evolve.",
                    icon: RefreshCw,
                    color: "orange",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
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
                  Ready to Automate Your Infrastructure?
                </h2>
                <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-6 md:mb-8 leading-relaxed">
                  Join dozens of successful companies who've transformed their
                  infrastructure management with our IaC platform.
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
                      label: "30-Day Implementation",
                      desc: "Rapid deployment",
                    },
                    {
                      icon: ShieldCheck,
                      label: "Enterprise Grade",
                      desc: "Production ready",
                    },
                    {
                      icon: Zap,
                      label: "Cost Optimized",
                      desc: "60% savings guaranteed",
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
