"use client";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface ProgrammingLanguage {
  name: string;
  icon: string;
  description: string;
  fullDescription: string;
  officialLink: string;
  frameworks: string[];
  level: string;
  youtubeVideoId: string;
  color: string;
  tagColor: string;
}

const programmingLanguages: ProgrammingLanguage[] = [
  {
    name: "Python",
    icon: "python.png",
    description: "Scripting & Automation",
    fullDescription:
      "Python is a high-level, interpreted programming language known for its simplicity and readability. In DevOps, Python is extensively used for automation scripts, infrastructure management, and building CI/CD tools. Its rich ecosystem of libraries makes it perfect for system administration tasks, configuration management, and creating custom DevOps utilities.",
    officialLink: "https://www.python.org",
    frameworks: ["Django", "Flask", "FastAPI"],
    level: "Beginner to Advanced",
    youtubeVideoId: "QXeEoD0pB3E",
    color: "from-sky-600 to-blue-600",
    tagColor: "bg-sky-100 text-sky-800 border-sky-200",
  },
  {
    name: "JavaScript",
    icon: "javascript.webp",
    description: "Web & Node.js Development",
    fullDescription:
      "JavaScript is a versatile programming language that powers both frontend and backend development. In DevOps, JavaScript (via Node.js) is used for building automation tools, serverless functions, and real-time monitoring dashboards. Its event-driven architecture makes it ideal for handling asynchronous operations, API integrations, and creating interactive DevOps tools.",
    officialLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    frameworks: ["Node.js", "React", "Next.js", "Express.js", "NestJS"],
    level: "Beginner to Advanced",
    youtubeVideoId: "EerdGm-ehJQ",
    color: "from-amber-500 to-yellow-500",
    tagColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    name: "Go",
    icon: "go.png",
    description: "Cloud Native & Microservices",
    fullDescription:
      "Go (Golang) is a statically typed, compiled language designed by Google for building efficient and reliable software. In DevOps, Go is the language of choice for cloud-native tools like Docker, Kubernetes, and Terraform. Its fast compilation, built-in concurrency support, and small binary sizes make it perfect for microservices, CLI tools, and high-performance system utilities.",
    officialLink: "https://go.dev",
    frameworks: ["Gin", "Echo", "Cobra"],
    level: "Intermediate to Advanced",
    youtubeVideoId: "un6ZyFkqFKo",
    color: "from-gray-500 to-gray-700",
    tagColor: "bg-gray-400 text-gray-800 border-gray-300",
  },
  {
    name: "Java",
    icon: "java.png",
    description: "Enterprise Applications",
    fullDescription:
      "Java is a robust, object-oriented programming language widely used in enterprise environments. In DevOps, Java is essential for managing and deploying large-scale enterprise applications, building CI/CD tools like Jenkins, and creating distributed systems. Its platform independence, mature ecosystem, and strong typing make it ideal for building reliable, high-performance systems.",
    officialLink: "https://www.java.com",
    frameworks: ["Spring Boot", "Maven", "Gradle", "JUnit"],
    level: "Intermediate to Advanced",
    youtubeVideoId: "xTtL8E4LzTQ",
    color: "from-red-500 to-orange-500",
    tagColor: "bg-red-100 text-red-800 border-red-200",
  },
  {
    name: "PHP",
    icon: "php.png",
    description: "PHP Web Applications",
    fullDescription:
      "PHP is a popular server-side scripting language primarily used for web development. In DevOps, PHP is crucial for deploying and managing web applications, automating server configurations, and integrating with various web services. Its ease of use, extensive documentation, and large community support make it a go-to choice for building dynamic websites and web-based DevOps tools.",
    officialLink: "https://laravel.com",
    frameworks: ["Laravel", "Symfony", "Composer"],
    level: "Intermediate",
    youtubeVideoId: "l4_Vn-sTBL8",
    color: "from-rose-500 to-pink-500",
    tagColor: "bg-rose-100 text-rose-800 border-rose-200",
  },
];

export function ProgrammingLanguagesRoadmap() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(0);

  const nextLanguage = () => {
    const next = (currentIndex + 1) % programmingLanguages.length;
    setCurrentIndex(next);
    setSelectedLanguage(next);
  };

  const prevLanguage = () => {
    const prev =
      (currentIndex - 1 + programmingLanguages.length) %
      programmingLanguages.length;
    setCurrentIndex(prev);
    setSelectedLanguage(prev);
  };

  const currentLanguage = programmingLanguages[currentIndex];

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.currentTarget;
    target.src = "/new.png";
  };

  const handlePlayButtonClick = () => {
    window.open(
      `https://www.youtube.com/watch?v=${currentLanguage.youtubeVideoId}`,
      "_blank"
    );
  };

  const handleLanguageSelect = (index: number) => {
    setCurrentIndex(index);
    setSelectedLanguage(index);
  };

  return (
    <section className="relative bg-white dark:bg-[#000000] py-12 md:py-16">
      <div className="px-4 md:px-11">
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <div className="max-w-3xl">
            <div className="h-1 w-20 md:w-24 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mb-4 md:mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 leading-tight">
              Start with Coding Before
              <span className="block bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Your DevOps Journey
              </span>
            </h2>
            <p className="text-base md:text-lg text-black-400 dark:text-gray-300 leading-relaxed">
              Before diving into DevOps tools and automation, it's important to
              have a solid understanding of programming. Coding skills help you
              write scripts, automate tasks, and understand how software is
              built and deployed.
            </p>
          </div>
        </div>

        {/* Circular Language Selector */}
        <div className="relative mb-12 md:mb-16">
          <div className="flex justify-center items-center gap-4 md:gap-8 flex-wrap">
            {programmingLanguages.map((language, index) => (
              <button
                key={language.name}
                onClick={() => handleLanguageSelect(index)}
                className={`group relative flex flex-col items-center transition-all duration-300 ${
                  selectedLanguage === index
                    ? "scale-110"
                    : "scale-100 hover:scale-105"
                }`}
              >
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full p-3 md:p-4 border-4 transition-all duration-300 ${
                    selectedLanguage === index
                      ? `border-transparent bg-gradient-to-r ${language.color} shadow-lg`
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <img
                    src={`/${language.icon}`}
                    alt={language.name}
                    className="w-full h-full object-contain"
                    onError={handleImageError}
                  />
                </div>
                <span
                  className={`mt-2 md:mt-3 text-sm md:text-base font-semibold transition-all duration-300 ${
                    selectedLanguage === index
                      ? `bg-gradient-to-r ${language.color} bg-clip-text text-transparent`
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {language.name}
                </span>
                {selectedLanguage === index && (
                  <div
                    className={`absolute -bottom-1 md:-bottom-2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r ${language.color}`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - No Container Box */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left Column - Content */}
            <div className="space-y-6 md:space-y-8">
              {/* Language Header */}
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <img
                    src={`/${currentLanguage.icon}`}
                    alt={currentLanguage.name}
                    className="w-6 h-6 md:w-8 md:h-8 object-contain"
                    onError={handleImageError}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                    <h3
                      className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${currentLanguage.color} bg-clip-text text-black-600 dark:text-gray-300`}
                    >
                      {currentLanguage.name}
                    </h3>
                    <a
                      href={currentLanguage.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                  </div>
                  <p className="text-base md:text-lg font-semibold text-black-500 dark:text-gray-400">
                    {currentLanguage.description}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 md:space-y-4">
                <p className="text-black-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                  {currentLanguage.fullDescription}
                </p>
              </div>

              {/* Frameworks */}
              <div className="space-y-3 md:space-y-4">
                <h4 className="text-lg md:text-xl font-bold text-black-500 dark:text-gray-300">
                  Popular Frameworks & Tools
                </h4>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {currentLanguage.frameworks.map((framework, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium ${currentLanguage.tagColor} border-2 transition-all hover:scale-105 hover:shadow-md dark:border-gray-600`}
                    >
                      {framework}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <a
                href={currentLanguage.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r ${currentLanguage.color} text-white font-semibold text-base md:text-lg hover:shadow-xl transition-all hover:scale-105 shadow-lg`}
              >
                Read Official Docs
                <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>

            {/* Right Column - Video */}
            <div className="space-y-4 md:space-y-6">
              <div className="transform transition-all duration-500 relative">
                <div
                  className="cursor-pointer hover:scale-[1.02] transition-all duration-300"
                  onClick={handlePlayButtonClick}
                >
                  <div className="h-48 md:h-75 w-full rounded-lg md:rounded-xl overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 relative bg-gray-200 dark:bg-gray-800">
                    <img
                      src={`https://img.youtube.com/vi/${currentLanguage.youtubeVideoId}/maxresdefault.jpg`}
                      alt={`${currentLanguage.name} Tutorial Preview`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${currentLanguage.youtubeVideoId}/hqdefault.jpg`;
                        e.currentTarget.onerror = null;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-9 md:w-20 md:h-13 bg-red-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-700 transition-all hover:scale-110">
                        <svg
                          className="w-6 h-6 md:w-10 md:h-10 text-white ml-0.5 md:ml-1"
                          viewBox="0 0 27 27"
                          fill="currentColor"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-black-600 dark:text-gray-400 text-center flex items-center justify-center gap-1">
                💡 Click to watch full tutorial on YouTube
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 md:mt-16 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={prevLanguage}
              className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-semibold transition-all hover:gap-3 md:hover:gap-4 group"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex gap-1.5 md:gap-2 hidden md:flex">
                {programmingLanguages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleLanguageSelect(index)}
                    className="group"
                  >
                    <div
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? `bg-gradient-to-r ${currentLanguage.color} scale-125`
                          : "bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {currentIndex + 1} / {programmingLanguages.length}
              </span>
            </div>

            <button
              onClick={nextLanguage}
              className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-semibold transition-all hover:gap-3 md:hover:gap-4 group"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
