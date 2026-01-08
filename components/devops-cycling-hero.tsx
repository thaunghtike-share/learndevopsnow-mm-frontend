"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen } from "lucide-react";

const DevOpsCyclingHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("hero");
  const locale = useLocale();

  // Define slides with English content
  const slides = [
    {
      id: "devops",
      title: "What is DevOps?",
      titleMy: "What is DevOps?",
      description:
        "DevOps is a set of practices that combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle and provide continuous delivery with high software quality.",
      descriptionMy:
        "DevOps ဆိုသည်မှာ Software Development နှင့် IT Operations တို့ကို ပေါင်းစည်းထားခြင်းဖြစ်ပြီး၊ Software Development Lifecycle တစ်ခုလုံး ပိုမိုမြန်ဆန်၊ ထိရောက်စေရန် Automation နှင့် Security တို့ကို အဓိကထား လုပ်ဆောင်ပေးသည့် နည်းပညာဖြစ်ပါသည်။",
      tags: [
        "Automation",
        "Collaboration",
        "Monitoring",
        "Continuous Delivery",
      ],
      tagsMy: [
        "Automation",
        "Collaboration",
        "Monitoring",
        "Continuous Delivery",
      ],
    },
    {
      id: "linux",
      title: "Master Linux",
      titleMy: "Master Linux",
      description:
        "Build your foundation with Linux - the operating system that powers most servers, containers, and cloud infrastructure in modern DevOps environments.",
      descriptionMy:
        "Linux ကို ကျွမ်းကျင်စွာ သုံးတတ်ဖို့ လိုအပ်ပါတယ်။ devops နဲ့ဆိုင်တဲ့ အလုပ်တွေမှာ အများဆုံး အသုံးပြုသော Operating System ဖြစ်ပြီး Servers, Containers, Cloud Infrastructure များအတွက် အရေးကြီးဆုံး အခြေခံဖြစ်ပါတယ်။",
      tags: ["Command Line", "File System", "Permissions", "Shell Scripting"],
      tagsMy: ["Command Line", "File System", "Permissions", "Shell Scripting"],
    },
    {
      id: "network",
      title: "Learn Network Basics",
      titleMy: "Learn Network Basics",
      description:
        "Understand networking basics - the protocols, architectures, and tools that enable communication between computers, servers, and cloud services in DevOps.",
      descriptionMy:
        "CCNA level လောက်အထိ networking သဘောတရားတွေကို နားလည်ဖို့ လိုအပ်ပါတယ်။ ဒါမှလည်း နောက်တစ်ဆင့်ဖြစ်တဲ့ AWS VPC, Azure Vnet, DNS, Kubernetes တို့ကိုလေ့လာတဲ့အခါ အထောက်အကူပြုမှာ ဖြစ်မယ်။",
      tags: ["TCP/IP", "DNS", "Subnet", "Routing", "Switching"],
      tagsMy: ["TCP/IP", "DNS", "Subnet", "Routing", "Switching"],
    },
    {
      id: "cloud",
      title: "Explore Cloud Basic",
      titleMy: "Explore Cloud Basic",
      description:
        "Dive into cloud computing - learn how to leverage scalable, on-demand resources like servers, storage, and applications without managing physical infrastructure.",
      descriptionMy:
        "AWS, Azure, GCP စသည့် Cloud Provider များကို သုံးတတ်ဖို့ လိုအပ်ပါတယ်။ Cloud ရဲ့ အခြေခံသဘောတရားတွေကိုလည်း နားလည်ဖို့ လိုအပ်ပါတယ်။",
      tags: ["AWS", "Azure", "GCP"],
      tagsMy: ["AWS", "Azure", "GCP"],
    },
    {
      id: "git",
      title: "Master Version Control",
      titleMy: "Master Version Control",
      description:
        "Learn Git - the distributed version control system that enables collaboration, branching, and code management in modern software development and DevOps workflows.",
      descriptionMy:
        "git ကိုလည်း မဖြစ်မနေ သုံးတတ်ဖို့လိုအပ်ပါတယ်။ နောက်ပိုင်းလေ့လာရမယ့် CICD Pipeline တွေမှာ Git Repository တွေနဲ့ ပတ်သက်တဲ့ အလုပ်တွေ တွေ့လာပါလိမ့်မယ်။",
      tags: ["Branches", "Merge", "Pull Requests", "GitHub"],
      tagsMy: ["Branches", "Merge", "Pull Requests", "GitHub"],
    },
    {
      id: "containerization",
      title: "Learn Containerization",
      titleMy: "Learn Containerization",
      description:
        "Understand containerization - how to package applications and dependencies into lightweight, portable containers that run consistently across different environments.",
      descriptionMy:
        "Containerization ကို သေချာနားလည်ဖို့လိုအပ်ပါတယ်။ Docker , Kubernetes စသည့် နည်းပညာများကို သုံးပြီး Application တွေကို Lightweight, Portable Containers အဖြစ် Package လုပ်နိုင်ဖို့ ဖြစ်ပါတယ်။",
      tags: ["Docker", "Images", "Containers", "Podman"],
      tagsMy: ["Docker", "Images", "Containers", "Podman"],
    },
    {
      id: "cicd",
      title: "Understand CI/CD",
      titleMy: "Understand CI/CD",
      description:
        "Explore Continuous Integration and Continuous Deployment - the practices that enable teams to deliver code changes more frequently and reliably through automated pipelines.",
      descriptionMy:
        "Continuous Integration (CI) နှင့် Continuous Deployment (CD) ကို နားလည်ဖို့ လိုအပ်ပါတယ်။ Automated Pipelines တွေကနေတစ်ဆင့် Code Changes တွေကို user တွေဆီ လျှင်မြန် ထိရောက်စွာ deliver လုပ်နိုင်ဖို့ ဖြစ်ပါတယ်။",
      tags: ["Jenkins", "GitLab CI", "Github Actions", "CircleCI"],
      tagsMy: ["Jenkins", "GitLab CI", "Github Actions", "CircleCI"],
    },
    {
      id: "kubernetes",
      title: "Master Kubernetes",
      titleMy: "Master Kubernetes",
      description:
        "Learn container orchestration with Kubernetes - the industry standard for automating deployment, scaling, and management of containerized applications.",
      descriptionMy:
        "DevOps လုပ်မယ်ဆို kubernetes ကိုမဖြစ်မနေ သုံးတတ်ဖို့လိုအပ်ပါတယ်။ ယနေ့ခတ် လုပ်ငန်းအများစုဟာ kubernetes cluster တွေပေါ်မှာ run ထားကြတာဖြစ်ပါတယ်။",
      tags: ["Pods", "Rancher", "Microk8s", "Helm", "Kubeadm"],
      tagsMy: ["Pods", "Rancher", "Microk8s", "Helm", "Kubeadm"],
    },
    {
      id: "monitoring",
      title: "Explore Observability",
      titleMy: "Explore Observability",
      description:
        "Understand the importance of monitoring and logging in DevOps - how to track application performance, detect issues, and gain insights through tools like Prometheus, Grafana, and ELK Stack.",
      descriptionMy:
        "promethues, grafa , ELK stack တို့လို tools တွေသုံးပြီး ကျွန်တော်တို့ application တွေရဲ့ performance ကို စောင့်ကြည့်နိုင်ပါတယ်။ issue တစ်ခုခုဖြစ်ရင်လည်း alerting system တွေကနေ သိရှိနိုင်ပါတယ်။",
      tags: ["Prometheus", "Loki", "Kibana", "Logs", "Alerts", "Grafana"],
      tagsMy: ["Prometheus", "Loki", "Kibana", "Logs", "Alerts", "Grafana"],
    },
    {
      id: "iac",
      title: "Discover IAC",
      titleMy: "Discover IAC",
      description:
        "Master Infrastructure as Code (IaC) - learn to manage and provision computing infrastructure through code for version control and automated deployment.",
      descriptionMy:
        "Terraform, CloudFormation, Pulumi စသည့် IaC tools တွေကို သုံးပြီး  ကျွန်တော်တို့ရဲ့ Infrastructure တွေကို Code အဖြစ်ရေးသားနိုင်ဖို့ ဖြစ်ပါတယ်။ ဒါမှတစ်ဆင့် Version Control နဲ့ Automated Deployment တွေကို လုပ်ဆောင်နိုင်ပါတယ်။",
      tags: ["Terraform", "CloudFormation", "Pulumi", "Boto3", "Packer"],
      tagsMy: ["Terraform", "CloudFormation", "Pulumi", "Boto3", "Packer"],
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentSlideData = slides[currentSlide];

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.currentTarget;
    target.src = "/devops.png";
  };

  // Add manual navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="relative bg-white overflow-hidden dark:bg-[#000000]/95">
      <div className="relative px-4 md:px-11">
        <div className="flex flex-col lg:flex-row items-center justify-between md:py-10 gap-4 md:gap-8">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 space-y-4"
          >
            <div className="space-y-3">
              {/* Blue/Purple gradient line with "Our Mission" style */}
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  Our Mission
                </span>
              </div>

              {/* Main title with featured authors style */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-6xl text-black dark:text-white mb-4 md:mb-6 tracking-tight"
              >
                DevOps Learning Platform
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-base md:text-lg text-black dark:text-gray-300 leading-relaxed max-w-xl"
              >
                {t("description")}
              </motion.p>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex"
            >
              <motion.div
                className="relative w-full max-w-xs sm:max-w-md"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <img
                  src="/new.png"
                  alt="DevOps Learning Platform"
                  className="w-full h-auto object-contain drop-shadow-lg lg:drop-shadow-2xl"
                  onError={handleImageError}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block w-full lg:w-1/2 mt-1 md:mt-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-3 md:space-y-6"
              >
                <div className="space-y-2 md:space-y-4">
                  {/* Topic indicator - Sky Blue */}
                  <div className="inline-block mb-1 md:mb-4">
                    <span className="text-xs font-mono text-sky-600 dark:text-sky-400 tracking-wider uppercase">
                      {locale === "en" ? "Topic" : "အကြောင်းအရာ"}{" "}
                      {currentSlide + 1} of {slides.length}
                    </span>
                  </div>

                  {/* Consistent Question Color - Dark Blue for better readability */}
                  <h1 className="md:mb-4 text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight text-gray-900 dark:text-white">
                    {locale === "en"
                      ? currentSlideData.title
                      : currentSlideData.titleMy}
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-black dark:text-gray-300 leading-relaxed">
                    {locale === "en"
                      ? currentSlideData.description
                      : currentSlideData.descriptionMy}
                  </p>

                  {/* Two Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 md:pt-6">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="/articles"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-sky-600 text-white font-medium hover:from-blue-700 hover:to-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {locale === "en" ? "Read Articles" : "ဆောင်းပါး ဖတ်ရန်"}
                    </motion.a>
                    
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="/services/cloud-migration"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {locale === "en" ? "View Services" : "ဝန်ဆောင်မှုများ"}
                      <ArrowRight className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>

                {/* Progress Indicators WITH CHEVRON CONTROLS */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2 md:pt-4">
                  {/* Left Chevron */}
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Previous topic"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>

                  {/* Dotted Line Indicators */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="group relative"
                        aria-label={`Go to slide ${index + 1}`}
                      >
                        <div
                          className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300 ${
                            index === currentSlide
                              ? "scale-150 bg-gradient-to-r from-blue-600 to-sky-600"
                              : "bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Right Chevron */}
                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Next topic"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DevOpsCyclingHero;