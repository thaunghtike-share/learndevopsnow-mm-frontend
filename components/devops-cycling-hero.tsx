"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight } from "lucide-react";

const DevOpsCyclingHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('hero');
  const locale = useLocale();

  // Define slides with English content
  const slides = [
    {
      id: "devops",
      title: "What is DevOps?",
      titleMy: "What is DevOps?",
      description: "DevOps is a set of practices that combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle and provide continuous delivery with high software quality.",
      descriptionMy: "DevOps ဆိုတာ ထပ်တလဲလဲလုပ်နေရတဲ့ အလုပ်တွေကို Automation စနစ်နဲ့ လျှော့ချပစ်ပြီး Software တစ်ခု စရေးတာကနေ အဆုံးထိ Development Cycle တစ်ခုလုံးကို အမြန်ဆုံးဖြစ်အောင် လုပ်ပေးတဲ့ နည်းပညာ ဖြစ်ပါတယ်။",
      iconGradient: "from-orange-600 to-yellow-600",
      tags: ["Automation", "Collaboration", "Monitoring", "Continuous Delivery"],
      tagsMy: ["Automation", "Collaboration", "Monitoring", "Continuous Delivery"],
    },
    {
      id: "linux",
      title: "Master Linux",
      titleMy: "Master Linux",
      description: "Build your foundation with Linux - the operating system that powers most servers, containers, and cloud infrastructure in modern DevOps environments.",
      descriptionMy: "Linux OS ကိုသေချာသုံးတတ်ရပါမယ်။ Linux Command Line တွေကိုလည်း ကျွမ်းကျင်ဖို့ လိုအပ်ပါတယ်။",
      iconGradient: "from-orange-600 to-yellow-600",
      tags: ["Command Line", "File System", "Permissions", "Shell Scripting"],
      tagsMy: ["Command Line", "File System", "Permissions", "Shell Scripting"]
    },
    {
      id: "network",
      title: "Learn Network Basics",
      titleMy: "Learn Network Basics",
      description: "Understand networking basics - the protocols, architectures, and tools that enable communication between computers, servers, and cloud services in DevOps.",
      descriptionMy: "CCNA level လောက်အထိ networking သဘောတရားတွေကို နားလည်ဖို့ လိုအပ်ပါတယ်။ ဒါမှလည်း cloud ကိုလေ့လာတဲ့အခါ အထောက်အကူဖြစ်မယ်။",
      iconGradient: "from-sky-600 to-blue-600",
      tags: ["TCP/IP", "DNS", "Subnet", "Routing", "Switching"],
      tagsMy: ["TCP/IP", "DNS", "Subnet", "Routing", "Switching"]
    },
    {
      id: "cloud",
      title: "Explore Cloud Basic",
      titleMy: "Explore Cloud Basic",      
      description: "Dive into cloud computing - learn how to leverage scalable, on-demand resources like servers, storage, and applications without managing physical infrastructure.",
      descriptionMy: "AWS, Azure, GCP စသည့် Cloud Provider များကို သုံးတတ်ဖို့ လိုအပ်ပါတယ်။ Cloud ရဲ့ အခြေခံသဘောတရားတွေကိုလည်း နားလည်ဖို့ လိုအပ်ပါတယ်။",
      iconGradient: "from-sky-600 to-blue-600",
      tags: ["AWS", "Azure", "GCP"],
      tagsMy: ["AWS", "Azure", "GCP"]
    },
    {
      id: "git",
      title: "Master Version Control",
      titleMy: "Master Version Control",      
      description: "Learn Git - the distributed version control system that enables collaboration, branching, and code management in modern software development and DevOps workflows.",
      descriptionMy: "Git ကို ကျွမ်းကျင်စွာ သုံးတတ်ဖို့ လိုအပ်ပါတယ်။ GitHub, GitLab, Bitbucket စသည့် Git Repository Hosting Service များကိုလည်း သုံးတတ်ဖို့ လိုအပ်ပါတယ်။",
      iconGradient: "from-blue-600 to-cyan-600",
      tags: ["Branches", "Merge", "Pull Requests", "GitHub"],
      tagsMy: ["Branches", "Merge", "Pull Requests", "GitHub"]
    },
    {
      id: "containerization",
      title: "Learn Containerization",
      titleMy: "Learn Containerization",
      description: "Understand containerization - how to package applications and dependencies into lightweight, portable containers that run consistently across different environments.",
      descriptionMy: "Containerization ကို နားလည်ဖို့ လိုအပ်ပါတယ်။ Applications တွေကို Containers အဖြစ် package လုပ်ပြီး Environment မျိုးစုံမှာ တူညီစွာ run နိုင်ဖို့ ဖြစ်ပါတယ်။",
      iconGradient: "from-pink-600 to-purple-600",
      tags: ["Docker", "Images", "Containers", "Podman"],
      tagsMy: ["Docker", "Images", "Containers", "Podman"]
    },
    {
      id: "cicd",
      title: "Understand CI/CD",
      titleMy: "Understand CI/CD",
      description: "Explore Continuous Integration and Continuous Deployment - the practices that enable teams to deliver code changes more frequently and reliably through automated pipelines.",
      descriptionMy: "Continuous Integration (CI) နှင့် Continuous Deployment (CD) ကို နားလည်ဖို့ လိုအပ်ပါတယ်။ Automated Pipelines တွေကနေတစ်ဆင့် Code Changes တွေကို လျှင်မြန် ထိရောက်စွာ deliver လုပ်နိုင်ဖို့ ဖြစ်ပါတယ်။",
      iconGradient: "from-orange-600 to-yellow-600",
      tags: ["Jenkins", "GitLab CI", "Github Actions", "CircleCI"],
      tagsMy: ["Jenkins", "GitLab CI", "Github Actions", "CircleCI"]
    },
    {
      id: "kubernetes",
      title: "Master Kubernetes",
      titleMy: "Master Kubernetes",
      description: "Learn container orchestration with Kubernetes - the industry standard for automating deployment, scaling, and management of containerized applications.",
      descriptionMy: "Kubernetes ကို ကျွမ်းကျင်စွာ သုံးတတ်ဖို့ လိုအပ်ပါတယ်။ Containerized Applications တွေကို Deployment, Scaling, Management စသည့် အလုပ်တွေကို Automation လုပ်ပေးနိုင်ပါတယ်။",
      iconGradient: "from-blue-600 to-cyan-600",
      tags: ["Pods", "Rancher", "Microk8s", "Helm", "Kubeadm"],
      tagsMy: ["Pods", "Rancher", "Microk8s", "Helm", "Kubeadm"]
    },
    {
      id: "monitoring",
      title: "Explore Observability",
      titleMy: "Explore Observability",
      description: "Understand the importance of monitoring and logging in DevOps - how to track application performance, detect issues, and gain insights through tools like Prometheus, Grafana, and ELK Stack.",
      descriptionMy: "DevOps မှာ Monitoring နှင့် Logging ရဲ့ အရေးပါမှုကို နားလည်ဖို့ လိုအပ်ပါတယ်။ Application Performance ကို ချက်ချင်းသိရှိနိုင်ဖို့  issue ပြဿနာများကို ရှာဖွေနိုင်ဖို့ ဖြစ်ပါတယ်။ Prometheus, Grafana, ELK Stack စသည့် Tools များကို သုံးနိုင်ဖို့ လိုအပ်ပါတယ်။",
      iconGradient: "from-pink-600 to-purple-600",
      tags: ["Prometheus", "Loki", "Kibana", "Logs", "Alerts", "Grafana"],
      tagsMy: ["Prometheus", "Loki", "Kibana", "Logs", "Alerts", "Grafana"]
    },
    {
      id: "iac",
      title: "Discover IAC",
      titleMy: "Discover IAC",
      description: "Master Infrastructure as Code (IaC) - learn to manage and provision computing infrastructure through code for version control and automated deployment.",
      descriptionMy: "Infrastructure as Code (IaC) ကို ကျွမ်းကျင်စွာ ရေးနိုင်ဖို့ လိုအပ်ပါတယ်။ Infrastructure ကို Code မှတစ်ဆင့် စီမံခန့်ခွဲပြီး Automated Deployment အတွက် ဖြစ်ပါတယ်။",
      iconGradient: "from-sky-600 to-purple-600",
      tags: ["Terraform", "CloudFormation", "Pulumi", "Boto3", "Packer"],
      tagsMy: ["Terraform", "CloudFormation", "Pulumi", "Boto3", "Packer"]
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
              <motion.div
                className="h-1 w-20 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "5rem" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight"
              >
                {t('mission')}
                <span className="block bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  {t('studentsDevelopers')}
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-base md:text-lg text-black dark:text-gray-300 leading-relaxed max-w-xl"
              >
                {t('description')}
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
                  {/* Topic indicator */}
                  <div className="inline-block mb-1 md:mb-4">
                    <span className="text-xs font-mono text-black-500 dark:text-gray-400 tracking-wider uppercase">
                      {locale === 'en' ? 'Topic' : 'အကြောင်းအရာ'} {currentSlide + 1} of {slides.length}
                    </span>
                  </div>

                  <h1
                    className={`text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r ${currentSlideData.iconGradient} bg-clip-text text-transparent`}
                  >
                    {locale === 'en' ? currentSlideData.title : currentSlideData.titleMy}
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-black dark:text-gray-300 leading-relaxed">
                    {locale === 'en' ? currentSlideData.description : currentSlideData.descriptionMy}
                  </p>

                  <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1 md:pt-3">
                    {(locale === 'en' ? currentSlideData.tags : currentSlideData.tagsMy).map((tag: string, index: number) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="inline-flex items-center px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-xs font-medium bg-white dark:bg-gray-100 border border-black-200 dark:border-orange-700 text-orange-500 dark:text-orange-400 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                      >
                        {tag}
                      </motion.span>
                    ))}
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
                    {slides.map((slide, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="group relative"
                        aria-label={`Go to slide ${index + 1}`}
                      >
                        <div
                          className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300 ${
                            index === currentSlide
                              ? `scale-150 bg-gradient-to-r ${slide.iconGradient}`
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