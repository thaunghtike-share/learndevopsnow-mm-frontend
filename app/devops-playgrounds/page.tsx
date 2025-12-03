"use client";

import { motion } from "framer-motion";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import {
  ExternalLink,
  Play,
  Star,
  Clock,
  Container,
  Terminal,
  Server,
  GitBranch,
  Cloud,
  Workflow,
  Crown,
} from "lucide-react";

interface DevOpsLab {
  id: number;
  title: string;
  platform: string;
  description: string;
  url: string;
  difficulty: string;
  category: string;
  duration: string;
  color: string;
  gradient: string;
  iconColor: string;
  icon: any;
  playgrounds: string[];
  platformExplanation: string;
}

const staticLabs: DevOpsLab[] = [
  {
    id: 1,
    title: "KodeKloud Playgrounds",
    platform: "KodeKloud",
    url: "https://kodekloud.com/playgrounds/",
    description:
      "The most comprehensive collection of DevOps playgrounds with guided learning paths, real-world scenarios, and instant feedback.",
    difficulty: "Beginner - Advanced",
    category: "Multi-Platform",
    duration: "Self-paced",
    color: "from-sky-500 to-blue-600",
    gradient: "bg-gradient-to-r from-sky-500 to-blue-600",
    iconColor: "text-sky-500",
    icon: Crown,
    playgrounds: [
      "Linux Fundamentals Lab",
      "Docker & Containers Practice",
      "Kubernetes Cluster Management",
      "Terraform Cloud Deployments",
      "Ansible Automation Playground",
      "AWS Cloud Services Lab",
      "Azure Services Practice",
      "GCP Platform Playground",
      "Jenkins CI/CD Pipelines",
      "Prometheus & Grafana Monitoring",
    ],
    platformExplanation:
      "KodeKloud offers dedicated playgrounds for each major DevOps technology. You get isolated environments for Linux commands, Docker container management, full Kubernetes clusters, Terraform cloud deployments, Ansible automation, and all major cloud platforms. Each playground includes guided exercises and real-world scenarios with instant feedback.",
  },
  {
    id: 2,
    title: "Killer Coda",
    platform: "KillerCoda",
    url: "https://killercoda.com/",
    description:
      "Interactive browser-based labs for Kubernetes, Docker, Linux, and cloud technologies. No installation required with step-by-step tutorials.",
    difficulty: "Beginner - Intermediate",
    category: "Multi-Platform",
    duration: "Self-paced",
    color: "from-green-500 to-emerald-600",
    gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
    iconColor: "text-green-500",
    icon: Terminal,
    playgrounds: [
      "Kubernetes Application Deployment",
      "Docker Container Scenarios",
      "Linux Administration Tasks",
      "Cloud Technology Practice",
      "Networking Configuration",
      "Security Hardening Labs",
    ],
    platformExplanation:
      "Killer Coda provides interactive scenarios where you follow step-by-step instructions in a real terminal environment. Each lab focuses on specific tasks like deploying Kubernetes applications, configuring Docker containers, or practicing Linux administration. The platform is community-driven with extensive user-created content covering various DevOps technologies.",
  },
  {
    id: 3,
    title: "Play with Kubernetes",
    platform: "Labs.play-with-k8s",
    url: "https://labs.play-with-k8s.com/",
    description:
      "A fully functional Kubernetes playground where you can deploy pods, services, and explore cluster operations in a real multi-node cluster.",
    difficulty: "Intermediate",
    category: "Kubernetes",
    duration: "4 hours per session",
    color: "from-blue-500 to-indigo-600",
    gradient: "bg-gradient-to-r from-blue-500 to-indigo-600",
    iconColor: "text-blue-500",
    icon: Container,
    playgrounds: [
      "Multi-node Cluster Setup",
      "Pod Deployment Practice",
      "Service Configuration",
      "Namespace Management",
      "Cluster Networking",
      "YAML Manifest Testing",
    ],
    platformExplanation:
      "This is a real multi-node Kubernetes cluster that you can access for free. You get full control to create namespaces, deploy applications using YAML manifests, configure services, and experiment with cluster operations. Perfect for testing deployment configurations and understanding Kubernetes networking in a production-like environment.",
  },
  {
    id: 4,
    title: "Play with Docker",
    platform: "Labs.play-with-docker",
    url: "https://labs.play-with-docker.com/",
    description:
      "Interactive Docker playground to build, run, and manage containers. Learn Docker commands and container management in a sandboxed environment.",
    difficulty: "Beginner - Intermediate",
    category: "Containers",
    duration: "3 hours per session",
    color: "from-cyan-500 to-teal-600",
    gradient: "bg-gradient-to-r from-cyan-500 to-teal-600",
    iconColor: "text-cyan-500",
    icon: Container,
    playgrounds: [
      "Docker Image Building",
      "Container Lifecycle Management",
      "Dockerfile Practice",
      "Docker Compose Setup",
      "Container Networking",
      "Docker Swarm Practice",
    ],
    platformExplanation:
      "A full Docker environment where you can pull images, build containers from Dockerfiles, run multi-container applications with Docker Compose, and experiment with Docker Swarm. Great for practicing daily Docker commands, understanding container lifecycle management, and testing container networking configurations.",
  },
  {
    id: 5,
    title: "Linux Lab",
    platform: "iximiuz Labs",
    url: "https://labs.iximiuz.com/playgrounds/ubuntu-24-04",
    description:
      "Ubuntu 24.04 playground for practicing Linux commands, system administration, and shell scripting with full root access.",
    difficulty: "Beginner",
    category: "Linux",
    duration: "Unlimited",
    color: "from-orange-500 to-red-600",
    gradient: "bg-gradient-to-r from-orange-500 to-red-600",
    iconColor: "text-orange-500",
    icon: Terminal,
    playgrounds: [
      "Linux Command Practice",
      "User & Permission Management",
      "File System Operations",
      "Process Management",
      "Networking Configuration",
      "Shell Scripting Exercises",
    ],
    platformExplanation:
      "A full Ubuntu Linux system with root access where you can practice all essential Linux commands, manage users and permissions, configure networking, write shell scripts, and install packages. This is a persistent environment where you can save your work and continue later, making it ideal for ongoing Linux administration practice.",
  },
  {
    id: 6,
    title: "GitHub Learning Lab",
    platform: "GitHub",
    url: "https://lab.github.com/",
    description:
      "Master version control with interactive Git and GitHub tutorials. Learn branching, merging, and collaborative workflows.",
    difficulty: "Beginner - Intermediate",
    category: "Version Control",
    duration: "Self-paced",
    color: "from-purple-500 to-pink-600",
    gradient: "bg-gradient-to-r from-purple-500 to-pink-600",
    iconColor: "text-purple-500",
    icon: GitBranch,
    playgrounds: [
      "Git Fundamentals Course",
      "Branching Strategies",
      "Pull Request Workflows",
      "Code Review Practice",
      "GitHub Actions CI/CD",
      "Collaboration Patterns",
    ],
    platformExplanation:
      "GitHub's official learning platform that provides interactive courses using real repositories. You'll learn through hands-on exercises that teach branching strategies, pull request workflows, code review processes, and GitHub Actions for CI/CD. All exercises use actual GitHub features in a safe learning environment that mirrors real-world development workflows.",
  },
];

export default function DevOpsPlaygroundsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] overflow-x-hidden transition-colors duration-300">
      <MinimalHeader />

      <main className="py-1 md:py-8">
        {/* Hero Section */}
        <section className="mb-8 md:mb-12">
          <div className="px-6 md:px-11">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-4xl">
                <div className="h-1 w-24 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mb-4"></div>
                <h1 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-4 leading-tight">
                  DevOps Playgrounds
                  <span className="block bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
                    Practice in Real Environments
                  </span>
                </h1>
                <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed max-w-3xl">
                  Free interactive playgrounds to practice DevOps skills. No
                  setup required - learn by doing in professional environments
                  with guided exercises.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Playgrounds Section */}
        <section className="pb-8">
          <div className="px-6 md:px-11">
            <div className="space-y-6 md:space-y-8">
              {staticLabs.map((lab, index) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                      {/* Left Content */}
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={`p-3 rounded-2xl ${lab.gradient} text-white`}
                          >
                            <lab.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-2">
                              {lab.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${lab.gradient} text-white`}
                              >
                                <Star className="w-3 h-3 mr-1" />
                                {lab.platform}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-black dark:text-gray-300">
                                {lab.category}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-black dark:text-gray-300">
                                <Clock className="w-3 h-3 mr-1" />
                                {lab.duration}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-black dark:text-gray-300 text-base leading-relaxed mb-4">
                          {lab.description}
                        </p>

                        {/* Platform Explanation */}
                        <div className="mb-4">
                          <h3 className="text-xs font-semibold text-black dark:text-gray-400 mb-2 uppercase tracking-wide">
                            What you get:
                          </h3>
                          <p className="text-black dark:text-gray-300 leading-relaxed text-sm">
                            {lab.platformExplanation}
                          </p>
                        </div>

                        {/* Available Playgrounds */}
                        <div className="mb-4">
                          <h3 className="text-xs font-semibold text-black dark:text-gray-400 mb-2 uppercase tracking-wide">
                            Available Labs:
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                            {lab.playgrounds.map((playground, pIndex) => (
                              <div
                                key={pIndex}
                                className="flex items-center gap-2 text-black dark:text-gray-300"
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${lab.iconColor.replace(
                                    "text",
                                    "bg"
                                  )}`}
                                ></div>
                                <span className="text-xs md:text-sm">
                                  {playground}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Action */}
                      <div className="lg:w-56 flex-shrink-0">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                          <motion.a
                            href={lab.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full inline-flex items-center justify-center px-4 py-2 ${lab.gradient} text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg mb-3 text-sm`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Launch
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </motion.a>
                          <div className="text-center text-xs text-black dark:text-gray-400">
                            Free access • No registration required
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MinimalFooter />
    </div>
  );
}
