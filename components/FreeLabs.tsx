"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Play,
  ChevronRight,
  ChevronLeft,
  Star,
} from "lucide-react";

interface DevOpsLab {
  id: number;
  title: string;
  platform: string;
  description: string;
  url: string;
  difficulty?: string;
  color: string;
  gradient: string;
  iconColor: string;
}

const staticLabs: DevOpsLab[] = [
  {
    id: 1,
    title: "Killer Coda",
    platform: "killercoda",
    url: "https://killercoda.com/",
    description:
      "Interactive browser-based labs that require no installation. Practice Kubernetes, Docker, Linux, and cloud technologies directly in your web browser with step-by-step tutorials.",
    difficulty: "Beginner → Intermediate",
    color: "from-sky-500 to-blue-600",
    gradient: "bg-gradient-to-r from-sky-500 to-blue-600",
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    title: "KodeKloud",
    platform: "KodeKloud",
    url: "https://studio.kodekloud.com/labs",
    description:
      "Hands-on labs with real-world scenarios covering Docker, Kubernetes, Terraform, and more. Perfect for beginners to advanced learners with guided exercises and instant feedback.",
    difficulty: "Beginner → Advanced",
    color: "from-blue-500 to-purple-600",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-600",
    iconColor: "text-purple-500",
  },
  {
    id: 3,
    title: "Kubernetes Lab",
    platform: "lets play with k8s",
    url: "https://labs.play-with-k8s.com/",
    description:
      "A fully functional Kubernetes playground where you can deploy pods, services, and explore cluster operations. Perfect for learning Kubernetes concepts hands-on.",
    difficulty: "Intermediate",
    color: "from-green-500 to-emerald-600",
    gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
    iconColor: "text-emerald-500",
  },
  {
    id: 4,
    title: "Docker Lab",
    platform: "lets play with docker",
    url: "https://labs.play-with-docker.com",
    description:
      "Master containerization with this interactive Docker playground. Build, run, and manage containers while learning Docker commands and best practices.",
    difficulty: "Intermediate",
    color: "from-sky-500 to-blue-600",
    gradient: "bg-gradient-to-r from-sky-500 to-blue-600",
    iconColor: "text-blue-500",
  },
  {
    id: 6,
    title: "Terraform Lab",
    platform: "kodekloud",
    url: "https://kodekloud.com/pages/free-labs/terraform",
    description:
      "Learn Infrastructure as Code with Terraform through practical labs. Create, manage, and deploy cloud resources using declarative configuration files.",
    difficulty: "Beginner",
    color: "from-blue-500 to-purple-600",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-600",
    iconColor: "text-purple-500",
  },
  {
    id: 7,
    title: "Linux Lab",
    platform: "kodekloud",
    url: "https://kodekloud.com/free-labs/linux",
    description:
      "Essential Linux commands and administration tasks. Perfect for beginners to learn file systems, permissions, process management, and shell scripting.",
    difficulty: "Beginner",
    color: "from-sky-500 to-blue-600",
    gradient: "bg-gradient-to-r from-sky-500 to-blue-600",
    iconColor: "text-blue-500",
  },
  {
    id: 8,
    title: "Cloud Computing Lab",
    platform: "KodeKloud",
    url: "https://kodekloud.com/cloud-playgrounds/aws",
    description:
      "Explore cloud services with hands-on labs in AWS, Azure, and GCP. Learn to deploy and manage cloud resources with practical exercises.",
    difficulty: "Beginner → Advanced",
    color: "from-sky-500 to-blue-600",
    gradient: "bg-gradient-to-r from-sky-500 to-blue-600",
    iconColor: "text-blue-500",
  },
  {
    id: 9,
    title: "Git & GitHub Lab",
    platform: "GitHub Learning Lab",
    url: "https://lab.github.com/",
    description:
      "Master version control with interactive Git and GitHub tutorials. Learn branching, merging, pull requests, and collaborative workflows.",
    difficulty: "Beginner → Intermediate",
    color: "from-sky-500 to-blue-600",
    gradient: "bg-gradient-to-r from-sky-500 to-blue-600",
    iconColor: "text-blue-500",
  },
  {
    id: 10,
    title: "Jenkins CI/CD",
    platform: "Jenkins Tutorials",
    url: "https://www.jenkins.io/doc/tutorials/",
    description:
      "Build continuous integration and deployment pipelines with Jenkins. Automate testing, building, and deployment processes with practical examples.",
    difficulty: "Intermediate",
    color: "from-blue-500 to-purple-600",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-600",
    iconColor: "text-purple-500",
  },
];

export function FreeLabs() {
  const [labs] = useState<DevOpsLab[]>(staticLabs);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % labs.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + labs.length) % labs.length);
  };

  const currentLab = labs[currentSlide];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-white/95 dark:bg-[#000000] overflow-hidden"
    >
      <div className="relative w-full max-w-4xl mx-auto px-4 py-11 md:py-8 font-open-sans">
        {/* Centered Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-6xl text-black dark:text-gray-100 mb-5 tracking-tight"
          >
            Free DevOps Playgrounds
          </motion.h2>

          <motion.div
            className="h-1 w-32 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-black dark:text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Hands-on learning through free interactive playgrounds and real
            environments
          </motion.p>
        </motion.div>

        {/* Single Lab Display */}
        <div className="relative max-w-2xl mx-auto">
          {/* Navigation Buttons with Dynamic Colors */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
            className={`absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-2xl border border-gray-300 dark:border-gray-600 flex items-center justify-center transition-all duration-300`}
          >
            <ChevronLeft
              className={`w-5 h-5 md:w-6 md:h-6 ${currentLab.iconColor}`}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            className={`absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-2xl border border-gray-300 dark:border-gray-600 flex items-center justify-center transition-all duration-300`}
          >
            <ChevronRight
              className={`w-5 h-5 md:w-6 md:h-6 ${currentLab.iconColor}`}
            />
          </motion.button>

          {/* Lab Card */}
          <div className="relative h-64 md:h-96">
            <div className="absolute inset-0">
              <div className="group relative h-full">
                {/* Static background glow */}
                <div
                  className={`absolute -inset-2 md:-inset-4 ${currentLab.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500`}
                />

                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700 rounded-3xl p-4 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 h-full flex flex-col">
                  {/* Platform Badge */}
                  <div className="flex justify-center mb-4 md:mb-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full ${currentLab.gradient} text-white font-semibold text-xs md:text-sm shadow-lg`}
                    >
                      <Star className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 fill-current" />
                      {currentLab.platform}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="text-center mb-4 md:mb-6">
                    <h3 className="text-xl md:text-3xl font-bold text-black dark:text-gray-100">
                      {currentLab.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-black dark:text-gray-300 text-sm md:text-lg leading-relaxed mb-4 md:mb-8 flex-grow text-center px-2 md:px-4 line-clamp-3 md:line-clamp-none">
                    {currentLab.description}
                  </p>

                  {/* Difficulty and Launch Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
                    {/* Difficulty Badge */}
                    <div className="flex items-center gap-2 text-black dark:text-gray-300">
                      <div
                        className={`w-2 h-2 rounded-full ${currentLab.iconColor.replace(
                          "text",
                          "bg"
                        )}`}
                      />
                      <span className="text-xs md:text-sm font-medium">
                        {currentLab.difficulty}
                      </span>
                    </div>

                    {/* Launch Button */}
                    <motion.a
                      href={currentLab.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center px-4 py-2 md:px-8 md:py-3 ${currentLab.gradient} text-white font-semibold rounded-xl transition-all duration-300 shadow-lg border border-white/20 group/btn text-sm md:text-base`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Launch
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <ExternalLink className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
                      </motion.div>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Dots - Simplified for mobile */}
          <div className="flex justify-center mt-6 md:mt-8 gap-2 md:gap-3">
            {labs.map((lab, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentSlide(index)}
                className={`w-1.5 h-1.5 md:w-3 md:h-3 hidden md:block rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? `${lab.gradient} shadow-lg scale-125`
                    : "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-3 md:mt-4  hidden md:block text-black dark:text-gray-300 text-xs md:text-sm">
            <span className="font-semibold text-black dark:text-gray-100">
              {currentSlide + 1}
            </span>{" "}
            / {labs.length}
          </div>
        </div>
      </div>
    </section>
  );
}
