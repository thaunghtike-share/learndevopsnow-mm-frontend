"use client";
import { motion } from "framer-motion";
import type React from "react";

import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface CertificationItem {
  title: string;
  logo: string;
  organization: string;
  examDetails: string;
  preparationTime: string;
  topics: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  recommended?: boolean;
  examLink: string;
}

const certifications: CertificationItem[] = [
  // Beginner
  {
    title: "AWS Cloud Practitioner",
    logo: "aws1.png",
    organization: "Amazon Web Services",
    examDetails: "65 questions | 90 minutes | $100",
    preparationTime: "6 weeks",
    difficulty: "Beginner",
    recommended: true,
    topics: [
      "Cloud concepts",
      "Security and compliance",
      "Billing and pricing",
      "AWS core services",
    ],
    examLink:
      "https://aws.amazon.com/certification/certified-cloud-practitioner/",
  },
  {
    title: "Microsoft Azure Fundamentals",
    logo: "az900.png",
    organization: "Microsoft",
    examDetails: "40-60 questions | 60 minutes | $99",
    preparationTime: "6 weeks",
    difficulty: "Beginner",
    topics: [
      "Cloud concepts",
      "Azure architecture",
      "Governance and compliance",
      "Cost management",
    ],
    examLink:
      "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/",
  },
  {
    title: "AWS Solutions Architect Associate",
    logo: "aws2.webp",
    organization: "Amazon Web Services",
    examDetails: "65 questions | 130 minutes | $150",
    preparationTime: "6-8 weeks",
    difficulty: "Beginner",
    recommended: true,
    topics: [
      "Resilient architectures",
      "Security",
      "Performance",
      "Cost optimization",
    ],
    examLink:
      "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
  },
  {
    title: "GitHub Foundations",
    logo: "git.png",
    organization: "GitHub",
    examDetails: "45 questions | 90 minutes | $99",
    preparationTime: "2-3 weeks",
    difficulty: "Beginner",
    recommended: true,
    topics: [
      "GitHub basics",
      "Pull Requests",
      "GitHub Actions",
      "Collaboration workflows",
    ],
    examLink: "https://github.com/certifications/foundations",
  },
  {
    title: "Docker Certified Associate",
    logo: "docker.png",
    organization: "Docker",
    examDetails: "55 questions | 90 minutes | $195",
    preparationTime: "4-6 weeks",
    difficulty: "Beginner",
    topics: ["Image management", "Orchestration", "Networking", "Security"],
    examLink: "https://success.docker.com/certification",
  },
  {
    title: "GitHub Actions Certification",
    logo: "githubaction.svg",
    organization: "GitHub",
    examDetails: "45 questions | 90 minutes | $99",
    preparationTime: "4-6 weeks",
    difficulty: "Intermediate",
    topics: [
      "CI/CD workflows",
      "Automation pipelines",
      "GitHub Actions syntax",
      "Deployment strategies",
    ],
    examLink: "https://github.com/certifications/actions",
  },
  // Intermediate
  {
    title: "Kubernetes Application Developer",
    logo: "ckad.png",
    organization: "CNCF",
    examDetails: "Performance-based | 2 hours | $395",
    preparationTime: "6-10 weeks",
    difficulty: "Intermediate",
    recommended: true,
    topics: [
      "Application deployment",
      "Configuration",
      "Observability",
      "Pod design",
    ],
    examLink:
      "https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/",
  },
  {
    title: "Certified Kubernetes Administrator",
    logo: "cka.webp",
    organization: "CNCF",
    examDetails: "Performance-based | 2 hours | $395",
    preparationTime: "8-12 weeks",
    difficulty: "Intermediate",
    recommended: true,
    topics: [
      "Cluster architecture",
      "Installation",
      "Networking",
      "Troubleshooting",
    ],
    examLink:
      "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/",
  },
  {
    title: "GitOps with ArgoCD",
    logo: "gitops.png",
    organization: "Codefresh",
    examDetails: "60 questions | 90 minutes | $200",
    preparationTime: "4-6 weeks",
    difficulty: "Intermediate",
    topics: [
      "GitOps principles",
      "Deployment",
      "Sync strategies",
      "Troubleshooting",
    ],
    examLink: "https://codefresh.io/certifications/argocd/",
  },
  {
    title: "Prometheus Certified Associate",
    logo: "PCA.png",
    organization: "Linux Foundation",
    examDetails: "Performance-based | 2 hours | $250",
    preparationTime: "6-8 weeks",
    difficulty: "Intermediate",
    topics: ["Metrics collection", "Alerting", "PromQL", "Service discovery"],
    examLink:
      "https://training.linuxfoundation.org/certification/prometheus-certified-associate/",
  },
  // Advanced
  {
    title: "AWS Solutions Architect Professional",
    logo: "csa.webp",
    organization: "Amazon Web Services",
    examDetails: "75 questions | 180 minutes | $300",
    preparationTime: "12-16 weeks",
    difficulty: "Advanced",
    recommended: true,
    topics: [
      "Enterprise architecture",
      "Migration",
      "Multi-account",
      "Cost management",
    ],
    examLink:
      "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
  },
  {
    title: "AWS DevOps Engineer Professional",
    logo: "aws3.png",
    organization: "Amazon Web Services",
    examDetails: "75 questions | 180 minutes | $300",
    preparationTime: "12-16 weeks",
    difficulty: "Advanced",
    recommended: true,
    topics: [
      "CI/CD pipelines",
      "Monitoring",
      "Infrastructure as Code",
      "Incident response",
    ],
    examLink:
      "https://aws.amazon.com/certification/certified-devops-engineer-professional/",
  },
  {
    title: "Azure DevOps Engineer Expert",
    logo: "azdevops.webp",
    organization: "Microsoft",
    examDetails: "40-60 questions | 150 minutes | $165",
    preparationTime: "12-16 weeks",
    difficulty: "Advanced",
    topics: [
      "Organizational structure",
      "YAML pipelines",
      "Artifact feeds",
      "Azure Policy",
    ],
    examLink:
      "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-400/",
  },
  {
    title: "HashiCorp Terraform Associate",
    logo: "tf.png",
    organization: "HashiCorp",
    examDetails: "57 questions | 60 minutes | $70.50",
    preparationTime: "8 weeks",
    difficulty: "Advanced",
    recommended: true,
    topics: [
      "Terraform CLI",
      "State management",
      "Modules",
      "Cloud provisioning",
    ],
    examLink:
      "https://developer.hashicorp.com/certifications/terraform-associate",
  },
  {
    title: "Certified Kubernetes Security Specialist",
    logo: "cks.png",
    organization: "CNCF",
    examDetails: "Performance-based | 2 hours | $395",
    preparationTime: "8-12 weeks",
    difficulty: "Advanced",
    topics: [
      "Cluster hardening",
      "Security",
      "Vulnerabilities",
      "Supply chain",
    ],
    examLink:
      "https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist-cks/",
  },
  {
    title: "Istio Certified Expert",
    logo: "istio.avif",
    organization: "Istio Community",
    examDetails: "Performance-based | 90 minutes | $200",
    preparationTime: "5-7 weeks",
    difficulty: "Advanced",
    topics: [
      "Traffic management",
      "Security",
      "Observability",
      "Multi-cluster",
    ],
    examLink: "https://academy.tetrate.io/courses/istio-certified-expert",
  },
];

const difficultyConfig = {
  Beginner: {
    labelColor: "bg-gradient-to-r from-sky-500 to-blue-600",
    glowColor: "hover:shadow-blue-500/20",
    borderColor: "border-blue-300",
  },
  Intermediate: {
    labelColor: "bg-gradient-to-r from-yellow-500 to-orange-600",
    glowColor: "hover:shadow-orange-500/20",
    borderColor: "border-orange-300",
  },
  Advanced: {
    labelColor: "bg-gradient-to-r from-green-500 to-emerald-600",
    glowColor: "hover:shadow-emerald-500/20",
    borderColor: "border-emerald-300",
  },
};

// Handle image error - fallback to devops.png
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  target.src = "/devops.png";
};

interface CertificationRoadmapProps {
  locale?: string;
}

export function CertificationRoadmap({ locale = 'en' }: CertificationRoadmapProps) {
  const [hoveredCert, setHoveredCert] = useState<string | null>(null);

  const handleCertClick = (examLink: string) => {
    window.open(examLink, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative min-h-screen bg-white/95 dark:bg-[#000000] overflow-hidden">
      {/* Subtle background pattern */}
      <div className="px-4 md:px-11 font-open-sans">
        {/* Left Aligned Header */}
        <motion.div
          className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex-1">
            <motion.div
              className="h-1 w-32 mb-4 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight"
            >
              Advance Your Career
              <span className="block bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                DevOps Certifications
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-black dark:text-gray-300 mt-4 text-base md:text-lg max-w-2xl"
            >
              {locale === 'en' 
                ? "Validate your skills with industry-recognized certifications that showcase your DevOps expertise and boost your career prospects."
                : "beginner level မှစတင်ပြီး ဖြေဆိုသင့်တဲ့ certificate တွေကို ဖော်ပြ ပေးထားပါတယ်။ ​Certifiacte တွေ ပိုင်ဆိုင်ထားတာကလည်း အလုပ်အကိုင် အခွင့်အလမ်းကောင်းတွေကို ပိုမိုရရှိစေနိုင်ပါတယ်။"
              }
            </motion.p>
          </div>
        </motion.div>

        {/* Certification Logos - Adjusted for mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-6"
        >
          {certifications.map((cert, index) => {
            const config = difficultyConfig[cert.difficulty];
            const isHovered = hoveredCert === cert.title;

            return (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center group"
              >
                {/* Logo Container with Full Rounded Difficulty Badge */}
                <motion.div
                  className="relative cursor-pointer"
                  onHoverStart={() => setHoveredCert(cert.title)}
                  onHoverEnd={() => setHoveredCert(null)}
                  onClick={() => handleCertClick(cert.examLink)}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  {/* Main Card Container */}
                  <motion.div
                    className={`
                    bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-2 md:p-3 border border-gray-300 dark:border-gray-700
                    transition-all duration-300 relative overflow-hidden
                    group-hover:shadow-2xl group-hover:border-blue-400 dark:group-hover:border-blue-500
                    ${config.glowColor}
                  `}
                    whileHover={{
                      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)",
                    }}
                  >
                    {/* Hover Gradient Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />

                    {/* External Link Icon on Hover */}
                    <motion.div
                      className="absolute top-1 left-1 md:top-2 md:left-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={false}
                      animate={{
                        scale: isHovered ? 1 : 0.8,
                      }}
                    >
                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-blue-500 dark:text-blue-400" />
                    </motion.div>

                    {/* Logo - Smaller on mobile */}
                    <motion.div
                      className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center mx-auto"
                      whileHover={{
                        scale: 1.1,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <img
                        src={`/logos/${cert.logo}`}
                        alt={cert.title}
                        className="w-full h-full object-contain"
                        onError={handleImageError}
                      />
                    </motion.div>

                    {/* Pulse Animation on Hover */}
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 border-2 border-blue-400/30 dark:border-blue-500/30 rounded-xl"
                        initial={{ scale: 1, opacity: 0.7 }}
                        animate={{ scale: 1.1, opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Full Rounded Difficulty Badge - Smaller on mobile */}
                  <motion.div
                    className={`absolute -top-1 -right-1 md:-top-2 md:-right-2 px-2 py-0.5 md:px-3 md:py-1 ${config.labelColor} text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm border border-white/20`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="text-[10px] md:text-xs">
                      {cert.difficulty}
                    </span>
                  </motion.div>
                </motion.div>

                {/* Certification Title */}
                <motion.div
                  className="text-center mt-2 md:mt-3"
                  animate={{ y: isHovered ? 2 : 0 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <h3 className="text-xs font-semibold text-black dark:text-gray-100 line-clamp-2 leading-tight min-h-[2rem] md:min-h-[2.5rem] flex items-center justify-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {cert.title}
                  </h3>

                  {/* Organization on Hover */}
                  <motion.p
                    className="text-[10px] md:text-xs text-black dark:text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  >
                    {cert.organization}
                  </motion.p>

                  {/* Exam Details on Hover */}
                  <motion.p
                    className="text-[10px] md:text-xs text-blue-600 dark:text-blue-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  >
                    {cert.examDetails.split("|")[0].trim()}
                  </motion.p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Instruction Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 md:block hidden md:mt-8"
        >
          <p className="text-black dark:text-gray-300 text-sm md:text-base">
            {locale === 'en' 
              ? "💡 Click on any certification to visit the official exam page"
              : "💡 exam ရဲ့  တရားဝင် စာမျက်နှာကို သွားဖို့ icon ပေါ်ကို နှိပ်ပါ"
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
}