"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface RoadmapItem {
  title: string;
  titleMy: string;
  description: string;
  descriptionMy: string;
  tags: string[];
  tagsMy: string[];
  image?: string;
  officialLink?: string;
}

interface RoadmapStage {
  key: string;
  label: string;
  labelMy: string;
  description: string[];
  descriptionMy: string[];
  items: RoadmapItem[];
}

const roadmap: RoadmapStage[] = [
  {
    key: "beginner",
    label: "Beginner",
    labelMy: "Beginner",
    description: [
      "Start your DevOps journey with foundational tools and concepts",
      "Best for absolute beginners and career switchers",
    ],
    descriptionMy: [
      "ဒီအဆင့်မှာတော့ devops အတွက် မဖြစ်နေလိုအပ်တဲ့ အခြေခံ knowledge တွေကို လေ့လာရပါမယ်။",
      "devops career ကို စတင် ပြောင်းလဲလိုသူများအတွက် အရေးကြီးဆုံးအဆင့် ဖြစ်ပါသည်",
    ],
    items: [
      {
        title: "Linux Fundamentals",
        titleMy: "Linux အခြေခံများ",
        description:
          "Master command line, file systems, and shell scripting fundamentals",
        descriptionMy:
          "Linux OS အကြောင်း နဲ့ command line အခြေခံများကို ကျွမ်းကျင်စွာလေ့လာပါ",
        tags: [
          "command-line",
          "file-system",
          "permissions",
          "processes",
          "networking",
        ],
        tagsMy: [
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
        titleMy: "Bash Scripting",
        description:
          "Automate tasks with Bash scripting and command-line tools",
        descriptionMy:
          "Bash Scripting ကိုအသုံးပြုပြီး အလုပ်များကို automate လုပ်ဆောင်ပါ",
        tags: ["variables", "loops", "functions", "automation", "debugging"],
        tagsMy: ["variables", "loops", "functions", "automation", "debugging"],
        image: "bash.png",
        officialLink: "https://www.w3schools.com/bash/",
      },
      {
        title: "CCNA",
        titleMy: "CCNA",
        description:
          "Understand networking basics, protocols, and infrastructure",
        descriptionMy:
          "Networking အခြေခံများ protocols များနဲ့ infrastructure design ကို နားလည်အောင်လေ့လာပါ",
        tags: ["tcp-ip", "subnetting", "routing", "switching", "vlans"],
        tagsMy: ["tcp-ip", "subnetting", "routing", "switching", "vlans"],
        image: "ccna.png",
        officialLink: "https://learningnetwork.cisco.com/s/ccna",
      },
      {
        title: "AWS Fundamentals",
        titleMy: "AWS အခြေခံများ",
        description:
          "AWS cloud fundamentals, services overview, and basic architecture",
        descriptionMy:
          "cloud အခြေခံများ အသုံးများတဲ့ services များနဲ့ architecture ကို လေ့လာပါ",
        tags: [
          "cloud-concepts",
          "pricing",
          "support",
          "architecture",
          "security",
        ],
        tagsMy: [
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
        titleMy: "Virtualization",
        description:
          "Introduction to virtualization concepts using VMware or VirtualBox",
        descriptionMy:
          "VMware သို့မဟုတ် VirtualBox အသုံးပြု၍ Virtualization အခြေခံများကို လေ့လာပါ",
        tags: ["virtualbox", "vmware", "vsphere", "hypervisor"],
        tagsMy: ["virtualbox", "vmware", "vsphere", "hypervisor"],
        image: "vmware.png",
        officialLink: "https://www.vmware.com",
      },
    ],
  },
  {
    key: "intermediate",
    label: "Intermediate",
    labelMy: "Intermediate",
    description: [
      "Build real DevOps workflows and automation",
      "Fundamentals of Infrastructure as code and CICD pipelines",
    ],
    descriptionMy: [
      "လက်တွေ့မှာ သုံးကြတဲ့ cicd pipleline တွေနဲ့ automation အကြောင်းတွေကိုလေ့လာရပါမယ်။",
      "Infrastructure as Code ရဲ့ အခြေခံဖြစ်တဲ့ Ansible, Packer နဲ့ CICD Pipelines တွေအကြောင်းကို နားလည်အောင် လေ့လာပါ။",
    ],
    items: [
      {
        title: "Docker Essentials",
        titleMy: "Docker Essentials",
        description:
          "Containerize applications and manage container lifecycles",
        descriptionMy:
          "Containerize applications and manage container lifecycles",
        tags: ["containers", "images", "dockerfile", "volumes", "networking"],
        tagsMy: ["containers", "images", "dockerfile", "volumes", "networking"],
        image: "docker.png",
        officialLink: "https://www.docker.com",
      },
      {
        title: "Git & GitHub",
        titleMy: "Git & GitHub",
        description:
          "Version control, branching strategies, and collaborative workflows",
        descriptionMy:
          "Version control, branching strategies, and collaborative workflows",
        tags: ["branches", "merge", "rebase", "pull-requests", "workflows"],
        tagsMy: ["branches", "merge", "rebase", "pull-requests", "workflows"],
        image: "git.png",
        officialLink: "https://github.com",
      },
      {
        title: "CI/CD Pipelines",
        titleMy: "CI/CD Pipelines",
        description:
          "Build automated testing and deployment pipelines with Jenkins or GitLab",
        descriptionMy:
          "Github Action or GitLab CI ဖြင့် automated deployment pipelines များတည်ဆောက်ပါ",
        tags: ["jenkins", "gitlab-ci", "stages", "artifacts", "testing"],
        tagsMy: ["jenkins", "gitlab-ci", "stages", "artifacts", "testing"],
        image: "cicd.png",
        officialLink: "https://www.jenkins.io",
      },
      {
        title: "Ansible Automation",
        titleMy: "Ansible Automation",
        description:
          "Automate configuration management and application deployment",
        descriptionMy:
          "Ansible ကိုအသုံးပြုပြီး Configuration Management အကြောင်းကို လေ့လာပါ။",
        tags: ["playbooks", "inventory", "roles", "variables", "modules"],
        tagsMy: ["playbooks", "inventory", "roles", "variables", "modules"],
        image: "ansible.png",
        officialLink: "https://www.ansible.com",
      },
      {
        title: "Packer",
        titleMy: "Packer",
        description:
          "Create machine images for multiple platforms from a single source configuration",
        descriptionMy:
          "Packer ကိုအသုံးပြုပြီး Multiple Platforms များအတွက် Machine Images များဖန်တီးပါ",
        tags: [
          "images",
          "automation",
          "multi-platform",
          "provisioners",
          "builders",
        ],
        tagsMy: [
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
    labelMy: "Advanced",
    description: [
      "Master production-grade DevOps and GitOps",
      "Kubernetes, infrastructure as code, and security",
    ],
    descriptionMy: [
      "Production အဆင့် သုံးကြတဲ့ Kubernetes, Terraform တို့လို tools တွေနဲ့ GitOps အကြောင်းကို ကျွမ်းကျင်စွာလေ့လာရပါမယ်",
      "Kubernetes, Infrastructure as Code နဲ့ Security အကြောင်းတွေ ပါဝင်ပါတယ်။ Montioring & Logging အကြောင်းတွေကိုလည်း လေ့လာရပါမယ်။",
    ],
    items: [
      {
        title: "Kubernetes",
        titleMy: "Kubernetes",
        description:
          "Orchestrate containers at scale with K8s clusters and deployments",
        descriptionMy:
          "Orchestrate containers at scale with K8s clusters and deployments",
        tags: ["pods", "services", "deployments", "configmaps", "helm", "rbac"],
        tagsMy: [
          "pods",
          "services",
          "deployments",
          "configmaps",
          "helm",
          "rbac",
        ],
        image: "kubernetes.png",
        officialLink: "https://kubernetes.io",
      },
      {
        title: "Terraform",
        titleMy: "Terraform",
        description:
          "Infrastructure as Code for multi-cloud provisioning and management",
        descriptionMy:
          "Infrastructure as Code for multi-cloud provisioning and management",
        tags: ["modules", "state", "providers", "workspaces", "cdktf"],
        tagsMy: ["modules", "state", "providers", "workspaces", "cdktf"],
        image: "terraform.png",
        officialLink: "https://www.terraform.io",
      },
      {
        title: "Monitoring & Observability",
        titleMy: "Monitoring & Observability",
        description:
          "Implement Prometheus, Grafana, and ELK stack for system insights",
        descriptionMy:
          "Implement Prometheus, Grafana, and ELK stack for system insights",
        tags: ["metrics", "logs", "alerts", "dashboards", "tracing"],
        tagsMy: ["metrics", "logs", "alerts", "dashboards", "tracing"],
        image: "monitoring.png",
        officialLink: "https://prometheus.io",
      },
      {
        title: "GitOps",
        titleMy: "GitOps",
        description:
          "Declarative infrastructure with ArgoCD and Flux for automated deployments",
        descriptionMy:
          "Declarative infrastructure with ArgoCD and Flux for automated deployments",
        tags: ["argocd", "flux", "sync", "rollback", "automation"],
        tagsMy: ["argocd", "flux", "sync", "rollback", "automation"],
        image: "gitops.png",
        officialLink: "https://argo-cd.readthedocs.io",
      },
      {
        title: "Hashicorp Vault",
        titleMy: "Hashicorp Vault",
        description:
          "Secure sensitive data with Vault, secrets management, and encryption",
        descriptionMy:
          "Secure sensitive data with Vault, secrets management, and encryption",
        tags: ["vault", "secrets", "encryption", "pki", "authentication"],
        tagsMy: ["vault", "secrets", "encryption", "pki", "authentication"],
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

interface MinimalDevopsRoadmapProps {
  locale?: string;
}

export function MinimalDevopsRoadmap({
  locale = "en",
}: MinimalDevopsRoadmapProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const nextStage = () => {
    setCurrentStageIndex((prev) => (prev + 1) % roadmap.length);
  };

  const prevStage = () => {
    setCurrentStageIndex((prev) => (prev - 1 + roadmap.length) % roadmap.length);
  };

  const currentStage = roadmap[currentStageIndex];
  const currentConfig = stageConfig[currentStage.key as keyof typeof stageConfig];
  const visibleItems = currentStage.items;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
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
              {/* Blue/Purple gradient line with "Our Mission" style */}
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  DevOps Roadmap
                </span>
              </div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-6xl text-black dark:text-white mb-4 md:mb-6 tracking-tight"
              >
                {locale === "en"
                  ? "Complete DevOps Roadmap"
                  : "​​Complete DevOps Roadmap"}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed"
              >
                {locale === "en"
                  ? "Follow our comprehensive DevOps roadmap designed to take you from complete beginner to advanced practitioner with hands-on projects and real-world scenarios"
                  : "beginner level မှ စတင်ပြီး advanced အထိ level တစ်ခုချင်းစီအလိုက် လေ့လာရမည့် topics များကို စုစည်းထားသော DevOps Roadmap တစ်ခုဖြစ်ပါသည်။"}
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
                        {locale === "en" ? "Stage" : "အဆင့်"} {currentStageIndex + 1} {locale === "en" ? "of" : "/"} {roadmap.length}
                      </span>
                      <h3
                        className={`text-2xl md:text-4xl font-bold mt-1 md:mt-2 tracking-tight bg-gradient-to-r ${currentConfig.gradient} bg-clip-text text-transparent`}
                      >
                        {locale === "en" ? currentStage.label : currentStage.labelMy}
                      </h3>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      {(locale === "en" ? currentStage.description : currentStage.descriptionMy).map((desc, index) => (
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
                      {visibleItems.map((item, index) => (
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
                              alt={locale === "en" ? item.title : item.titleMy}
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
                            {locale === "en" ? item.title : item.titleMy}
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
                    aria-label={locale === "en" ? "Previous stage" : "ယခင်အဆင့်"}
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
                        aria-label={locale === "en" ? `Go to stage ${index + 1}` : `အဆင့် ${index + 1} သို့သွားရန်`}
                      >
                        <div
                          className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                            index === currentStageIndex
                              ? `w-5 md:w-10 bg-gradient-to-r ${stageConfig[stage.key as keyof typeof stageConfig].gradient}`
                              : "w-1.5 md:w-2 bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={nextStage}
                    className="p-2 md:p-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md"
                    aria-label={locale === "en" ? "Next stage" : "နောက်အဆင့်"}
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
                                {locale === "en" ? item.title : item.titleMy}
                              </a>

                              <p className="text-sm text-black-700 dark:text-gray-300 leading-relaxed mb-2 md:mb-3">
                                {locale === "en" ? item.description : item.descriptionMy}
                              </p>

                              {/* Compact Tags */}
                              <div className="flex flex-wrap gap-1 md:gap-1.5">
                                {(locale === "en" ? item.tags : item.tagsMy).map((tag, tagIndex) => (
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