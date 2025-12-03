"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface RoadmapItem {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  officialLink?: string;
}

interface RoadmapStage {
  key: string;
  label: string;
  description: string[];
  items: RoadmapItem[];
}

interface ProgrammingLanguage {
  name: string;
  icon: string;
  description: string;
  fullDescription: string;
  officialLink: string;
  frameworks: string[];
}

const programmingLanguages: Record<string, ProgrammingLanguage[]> = {
  beginner: [
    {
      name: "Python",
      icon: "python.png",
      description: "Scripting & Automation",
      fullDescription:
        "Python is a high-level, interpreted programming language known for its simplicity and readability. In DevOps, Python is extensively used for automation scripts, infrastructure management, and building CI/CD tools. Its rich ecosystem of libraries makes it perfect for system administration tasks.",
      officialLink: "https://www.python.org",
      frameworks: ["Django", "Flask", "Ansible", "Fabric"],
    },
    {
      name: "JavaScript",
      icon: "javascript.png",
      description: "Web & Node.js",
      fullDescription:
        "JavaScript is a versatile programming language that powers both frontend and backend development. In DevOps, JavaScript (via Node.js) is used for building automation tools, serverless functions, and real-time monitoring dashboards. Its event-driven architecture makes it ideal for handling asynchronous operations.",
      officialLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      frameworks: ["Node.js", "Express.js", "React", "Next.js"],
    },
    {
      name: "Go",
      icon: "go.png",
      description: "Cloud Native Tools",
      fullDescription:
        "Go (Golang) is a statically typed, compiled language designed by Google for building efficient and reliable software. In DevOps, Go is the language of choice for cloud-native tools like Docker, Kubernetes, and Terraform. Its fast compilation, built-in concurrency, and small binary sizes make it perfect for microservices and CLI tools.",
      officialLink: "https://go.dev",
      frameworks: ["Gin", "Echo", "Cobra", "Viper"],
    },
  ],
  intermediate: [
    {
      name: "Python",
      icon: "python.png",
      description: "Advanced Automation",
      fullDescription:
        "At the intermediate level, Python is used for complex automation workflows, infrastructure orchestration, and building custom DevOps tools. You'll leverage advanced libraries for API integrations, data processing, and creating sophisticated deployment pipelines.",
      officialLink: "https://www.python.org",
      frameworks: ["Ansible", "SaltStack", "Fabric", "Boto3"],
    },
    {
      name: "Node.js",
      icon: "nodejs.png",
      description: "Backend Services",
      fullDescription:
        "Node.js is a JavaScript runtime built on Chrome's V8 engine that enables server-side JavaScript execution. In DevOps, Node.js powers backend services, API gateways, and real-time monitoring systems. Its non-blocking I/O model makes it excellent for building scalable network applications.",
      officialLink: "https://nodejs.org",
      frameworks: ["Express.js", "NestJS", "Fastify", "Koa"],
    },
    {
      name: "Go",
      icon: "go.png",
      description: "Microservices",
      fullDescription:
        "Go excels at building microservices due to its lightweight nature and excellent concurrency support. At this level, you'll use Go to create scalable, distributed systems with efficient resource utilization and fast response times.",
      officialLink: "https://go.dev",
      frameworks: ["Gin", "Echo", "gRPC", "Fiber"],
    },
    {
      name: "Java",
      icon: "java.png",
      description: "Enterprise Apps",
      fullDescription:
        "Java is a robust, object-oriented programming language widely used in enterprise environments. In DevOps, Java is essential for managing and deploying large-scale enterprise applications. Its platform independence and mature ecosystem make it ideal for building reliable, high-performance systems.",
      officialLink: "https://www.java.com",
      frameworks: ["Spring Boot", "Maven", "Gradle", "Jenkins"],
    },
  ],
  advanced: [
    {
      name: "Go",
      icon: "go.png",
      description: "K8s Operators",
      fullDescription:
        "At the advanced level, Go is used to build Kubernetes operators and custom controllers. These extend Kubernetes functionality to automate complex application management tasks. Go's performance and the official Kubernetes client libraries make it the standard for cloud-native infrastructure development.",
      officialLink: "https://go.dev",
      frameworks: ["Operator SDK", "Kubebuilder", "client-go", "Helm"],
    },
    {
      name: "Python",
      icon: "python.png",
      description: "ML Ops & Automation",
      fullDescription:
        "Python dominates the MLOps space, bridging machine learning and DevOps practices. You'll use Python to build ML pipelines, automate model deployment, and create sophisticated monitoring systems for AI applications.",
      officialLink: "https://www.python.org",
      frameworks: ["Kubeflow", "MLflow", "Airflow", "TensorFlow"],
    },
    {
      name: "Java",
      icon: "java.png",
      description: "Distributed Systems",
      fullDescription:
        "Java's maturity and robustness make it ideal for building distributed systems at scale. In advanced DevOps, Java is used for creating resilient microservices architectures, message queuing systems, and high-throughput data processing pipelines.",
      officialLink: "https://www.java.com",
      frameworks: ["Spring Cloud", "Apache Kafka", "Apache Camel", "Quarkus"],
    },
    {
      name: "Node.js",
      icon: "nodejs.png",
      description: "Real-time Services",
      fullDescription:
        "Node.js excels at building real-time services like monitoring dashboards, log streaming, and event-driven architectures. Its event loop and WebSocket support make it perfect for applications requiring instant data updates and high concurrency.",
      officialLink: "https://nodejs.org",
      frameworks: ["Socket.io", "NestJS", "Express.js", "PM2"],
    },
    {
      name: "Laravel",
      icon: "laravel.png",
      description: "PHP Deployments",
      fullDescription:
        "Laravel is a modern PHP framework that simplifies web application development. In DevOps, understanding Laravel is crucial for deploying and managing PHP applications at scale. It includes built-in tools for queue management, caching, and database migrations.",
      officialLink: "https://laravel.com",
      frameworks: ["Laravel", "Symfony", "Composer", "PHPUnit"],
    },
  ],
};

const roadmap: RoadmapStage[] = [
  {
    key: "beginner",
    label: "Beginner",
    description: [
      "Start your DevOps journey with foundational tools and concepts",
      "Best for absolute beginners and career switchers",
    ],
    items: [
      {
        title: "Linux Fundamentals",
        description:
          "Master command line, file systems, and shell scripting fundamentals",
        tags: [
          "command-line",
          "file-system",
          "permissions",
          "processes",
          "networking",
        ],
        image: "linux.webp",
        officialLink: "https://www.linux.org",
      },
      {
        title: "Bash Scripting",
        description:
          "Automate tasks with Bash scripting and command-line tools",
        tags: ["variables", "loops", "functions", "automation", "debugging"],
        image: "bash.png",
        officialLink: "https://www.w3schools.com/bash/",
      },
      {
        title: "CCNA",
        description:
          "Understand networking basics, protocols, and infrastructure",
        tags: ["tcp-ip", "subnetting", "routing", "switching", "vlans"],
        image: "ccna.png",
        officialLink: "https://learningnetwork.cisco.com/s/ccna",
      },
      {
        title: "AWS Fundamentals",
        description:
          "AWS cloud fundamentals, services overview, and basic architecture",
        tags: [
          "cloud-concepts",
          "pricing",
          "support",
          "architecture",
          "security",
        ],
        image: "aws.png",
        officialLink:
          "https://aws.amazon.com/training/learn-about/cloud-practitioner/",
      },
      {
        title: "Virtualization",
        description:
          "Introduction to virtualization concepts using VMware or VirtualBox",
        tags: ["virtualbox", "vmware", "vsphere", "hypervisor"],
        image: "vmware.png",
        officialLink: "https://www.vmware.com",
      },
    ],
  },
  {
    key: "intermediate",
    label: "Intermediate",
    description: [
      "Build real DevOps workflows and automation",
      "Infrastructure as code and CI/CD pipelines",
    ],
    items: [
      {
        title: "Docker Essentials",
        description:
          "Containerize applications and manage container lifecycles",
        tags: ["containers", "images", "dockerfile", "volumes", "networking"],
        image: "docker.png",
        officialLink: "https://www.docker.com",
      },
      {
        title: "Git & GitHub",
        description:
          "Version control, branching strategies, and collaborative workflows",
        tags: ["branches", "merge", "rebase", "pull-requests", "workflows"],
        image: "git.png",
        officialLink: "https://github.com",
      },
      {
        title: "CI/CD Pipelines",
        description:
          "Build automated testing and deployment pipelines with Jenkins or GitLab",
        tags: ["jenkins", "gitlab-ci", "stages", "artifacts", "testing"],
        image: "cicd.png",
        officialLink: "https://www.jenkins.io",
      },
      {
        title: "Ansible Automation",
        description:
          "Automate configuration management and application deployment",
        tags: ["playbooks", "inventory", "roles", "variables", "modules"],
        image: "ansible.png",
        officialLink: "https://www.ansible.com",
      },
      {
        title: "Packer",
        description:
          "Create machine images for multiple platforms from a single source configuration",
        tags: [
          "images",
          "automation",
          "multi-platform",
          "provisioners",
          "builders",
        ],
        image: "packer.png",
        officialLink: "https://www.packer.io",
      },
    ],
  },
  {
    key: "advanced",
    label: "Advanced",
    description: [
      "Master production-grade DevOps and GitOps",
      "Kubernetes, infrastructure as code, and security",
    ],
    items: [
      {
        title: "Kubernetes",
        description:
          "Orchestrate containers at scale with K8s clusters and deployments",
        tags: ["pods", "services", "deployments", "configmaps", "helm", "rbac"],
        image: "kubernetes.png",
        officialLink: "https://kubernetes.io",
      },
      {
        title: "Terraform",
        description:
          "Infrastructure as Code for multi-cloud provisioning and management",
        tags: ["modules", "state", "providers", "workspaces", "cdktf"],
        image: "terraform.png",
        officialLink: "https://www.terraform.io",
      },
      {
        title: "Monitoring & Observability",
        description:
          "Implement Prometheus, Grafana, and ELK stack for system insights",
        tags: ["metrics", "logs", "alerts", "dashboards", "tracing"],
        image: "monitoring.png",
        officialLink: "https://prometheus.io",
      },
      {
        title: "GitOps",
        description:
          "Declarative infrastructure with ArgoCD and Flux for automated deployments",
        tags: ["argocd", "flux", "sync", "rollback", "automation"],
        image: "gitops.png",
        officialLink: "https://argo-cd.readthedocs.io",
      },
      {
        title: "Hashicorp Vault",
        description:
          "Secure sensitive data with Vault, secrets management, and encryption",
        tags: ["vault", "secrets", "encryption", "pki", "authentication"],
        image: "vault.png",
        officialLink: "https://www.vaultproject.io",
      },
    ],
  },
];

const stageConfig = {
  beginner: {
    gradient: "from-sky-600 to-blue-600",
    color: "sky",
    bgGradient: "from-sky-600 to-blue-600",
    lightBg: "bg-sky-50",
    border: "border-sky-200",
    textColor: "text-sky-700",
    tagBg: "bg-white",
    tagBorder: "border-orange-300",
    tagText: "text-gray-700",
    tagHover: "hover:bg-gray-200",
    buttonBg: "bg-sky-600 hover:bg-sky-700",
  },
  intermediate: {
    gradient: "from-blue-500 to-purple-600",
    color: "blue",
    bgGradient: "from-blue-500 to-purple-600",
    lightBg: "bg-blue-50",
    border: "border-blue-200",
    textColor: "text-blue-700",
    tagBg: "bg-white",
    tagBorder: "border-orange-300",
    tagText: "text-gray-700",
    tagHover: "hover:bg-gray-200",
    buttonBg: "bg-blue-600 hover:bg-blue-700",
  },
  advanced: {
    gradient: "from-green-500 to-emerald-600",
    color: "green",
    bgGradient: "from-green-500 to-emerald-600",
    lightBg: "bg-green-50",
    border: "border-green-200",
    textColor: "text-green-700",
    tagBg: "bg-white",
    tagBorder: "border-orange-300",
    tagText: "text-gray-700",
    tagHover: "hover:bg-gray-200",
    buttonBg: "bg-green-600 hover:bg-green-700",
  },
};

export function MinimalDevopsRoadmap() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const nextStage = () => {
    setCurrentStageIndex((prev) => (prev + 1) % roadmap.length);
  };

  const prevStage = () => {
    setCurrentStageIndex(
      (prev) => (prev - 1 + roadmap.length) % roadmap.length
    );
  };

  const currentStage = roadmap[currentStageIndex];
  const currentConfig =
    stageConfig[currentStage.key as keyof typeof stageConfig];
  const visibleItems = currentStage.items;

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.currentTarget;
    target.src = "/new.png";
  };

  return (
    <section className="relative bg-white/95 dark:bg-[#000000] overflow-hidden">
      <div className="relative z-10">
        <div className="px-4 md:px-11">
          {/* Header Section */}
          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="max-w-3xl">
              <motion.div
                className="h-1 w-20 md:w-24 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mb-4 md:mb-6"
                initial={{ width: 0 }}
                animate={{ width: "5rem" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 leading-tight"
              >
                DevOps Roadmap with
                <span className="block bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Structured Learning Path
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed"
              >
                Follow our comprehensive DevOps roadmap designed to take you
                from complete beginner to advanced practitioner with hands-on
                projects and real-world scenarios
              </motion.p>
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:ml-6">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 md:gap-16 lg:gap-20">
            {/* Left Side - Stage Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full lg:w-2/5"
            >
              <div className="space-y-6 md:space-y-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStage.key}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 md:space-y-6"
                  >
                    <div>
                      <span className="text-xs font-mono text-black-500 dark:text-gray-400 tracking-wider uppercase hidden md:block">
                        Stage {currentStageIndex + 1} of {roadmap.length}
                      </span>
                      <h3
                        className={`text-2xl md:text-4xl font-bold mt-1 md:mt-2 tracking-tight bg-gradient-to-r ${currentConfig.gradient} bg-clip-text text-transparent`}
                      >
                        {currentStage.label}
                      </h3>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      {currentStage.description.map((desc, index) => (
                        <p
                          key={index}
                          className="text-base text-black dark:text-gray-300 leading-relaxed"
                        >
                          {desc}
                        </p>
                      ))}
                    </div>

                    {/* Technology Logos with Links */}
                    <div className="flex flex-wrap gap-3 md:gap-4 pt-3 md:pt-4">
                      {currentStage.items.map((item, index) => (
                        <motion.div
                          key={`logo-${index}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className="group flex flex-col items-center gap-1 md:gap-2"
                        >
                          <a
                            href={item.officialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-white dark:bg-white border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden group-hover:border-gray-400 dark:group-hover:border-gray-500 group-hover:shadow-md transition-all duration-300 group-hover:scale-105 cursor-pointer"
                          >
                            <img
                              src={`/${item.image}`}
                              alt={item.title}
                              className="w-8 h-8 md:w-12 md:h-12 object-contain"
                              onError={handleImageError}
                            />
                          </a>
                          <a
                            href={item.officialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-700 dark:text-gray-300 text-center font-medium max-w-[60px] md:max-w-[70px] leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                          >
                            {item.title}
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
                {/* Navigation - Better mobile design */}
                <div className="flex items-center justify-between md:justify-start md:gap-4 pt-2 md:pt-4">
                  <button
                    onClick={prevStage}
                    className="p-2 md:p-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md"
                    aria-label="Previous stage"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>

                  <div className="flex gap-1 md:gap-2">
                    {roadmap.map((stage, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentStageIndex(index);
                        }}
                        className="group"
                        aria-label={`Go to stage ${index + 1}`}
                      >
                        <div
                          className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                            index === currentStageIndex
                              ? `w-5 md:w-10 bg-gradient-to-r ${
                                  stageConfig[
                                    stage.key as keyof typeof stageConfig
                                  ].gradient
                                }`
                              : "w-1.5 md:w-2 bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={nextStage}
                    className="p-2 md:p-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md"
                    aria-label="Next stage"
                  >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

                {/* Removed the programming language section as per updates */}
              </div>
            </motion.div>

            {/* Right Side - Course Items - Compact Design */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-full lg:w-3/5 mt-6 md:mt-0 md:ml-10"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage.key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="relative">
                    {/* Compact Timeline line */}
                    <div className="absolute left-4 md:left-6 top-0 bottom-0 flex flex-col items-center">
                      <div
                        className={`w-0.5 h-full bg-gradient-to-b ${currentConfig.gradient} rounded-full`}
                      />
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      {visibleItems.map((item, index) => (
                        <motion.div
                          key={`item-${item.title}`}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="flex items-start gap-3 md:gap-4 group relative"
                        >
                          {/* Compact Number Bubble */}
                          <div className="flex-shrink-0 relative z-20">
                            <div
                              className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r ${currentConfig.gradient} flex items-center justify-center text-white font-semibold text-xs md:text-sm shadow-md border border-white dark:border-gray-900 group-hover:scale-105 transition-all duration-300`}
                            >
                              {index + 1}
                            </div>
                          </div>

                          {/* Compact Content Card */}
                          <div className="flex-1 min-w-0">
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300 group-hover:-translate-y-0.5 shadow-sm">
                              <a
                                href={item.officialLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-base font-semibold text-sky-700 dark:text-sky-400 leading-tight mb-1 md:mb-2 hover:text-sky-700 dark:hover:text-sky-300 transition-colors duration-200 cursor-pointer block"
                              >
                                {item.title}
                              </a>

                              <p className="text-sm text-black-700 dark:text-gray-300 leading-relaxed mb-2 md:mb-3">
                                {item.description}
                              </p>

                              {/* Compact Tags */}
                              <div className="flex flex-wrap gap-1 md:gap-1.5">
                                {item.tags.map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className={`inline-flex items-center px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium ${currentConfig.tagBg} dark:bg-gray-700 border ${currentConfig.tagBorder} dark:border-gray-600 text-orange-600 dark:text-orange-400 transition-all duration-200 hover:scale-105 ${currentConfig.tagHover} dark:hover:bg-gray-600`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
