"use client";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface ProgrammingLanguage {
  name: string;
  icon: string;
  description: string;
  descriptionMy: string;
  fullDescription: string;
  fullDescriptionMy: string;
  officialLink: string;
  frameworks: string[];
  frameworksMy: string[];
  level: string;
  levelMy: string;
  youtubeVideoId: string;
  color: string;
  tagColor: string;
}

const programmingLanguages: ProgrammingLanguage[] = [
  {
    name: "Python",
    icon: "python.png",
    description: "Scripting & Automation",
    descriptionMy: "Scripting & Automation",
    fullDescription:
      "Python is a high-level, interpreted programming language known for its simplicity and readability. In DevOps, Python is extensively used for automation scripts, infrastructure management, and building CI/CD tools. Its rich ecosystem of libraries makes it perfect for system administration tasks, configuration management, and creating custom DevOps utilities.",
    fullDescriptionMy:
      "Python ဆိုတာ အဆင့်မြင့် ပရိုဂရမ်မင်း ဘာသာစကားတစ်ခုဖြစ်သည်။ Python ကို Automation Scripts များ၊ Infrastructure Management နှင့် CICD Tools များတည်ဆောက်ရာတွင် ကျယ်ပြန့်စွာအသုံးပြုပါသည်။ သူ့မှာ Administration Tasks၊ Configuration Management နှင့် Custom DevOps Utilities တွေ ရေးရန်အတွက် libraries တွေလည်း အများကြီးရှိပါသည်။",
    officialLink: "https://www.python.org",
    frameworks: ["Django", "Flask", "FastAPI"],
    frameworksMy: ["Django", "Flask", "FastAPI"],
    level: "Beginner to Advanced",
    levelMy: "အစပြုသူမှ အဆင့်မြင့်",
    youtubeVideoId: "QXeEoD0pB3E",
    color: "from-sky-600 to-blue-600",
    tagColor: "bg-gray-300 md:bg-white/70 text-gray-800 border-gray-400",
  },
  {
    name: "JavaScript",
    icon: "javascript.webp",
    description: "Web & Node.js Development",
    descriptionMy: "Web & Node.js Development",
    fullDescription:
      "JavaScript is a versatile programming language that powers both frontend and backend development. In DevOps, JavaScript (via Node.js) is used for building automation tools, serverless functions, and real-time monitoring dashboards. Its event-driven architecture makes it ideal for handling asynchronous operations, API integrations, and creating interactive DevOps tools.",
    fullDescriptionMy:
      "တကယ်တော့ JavaScript က Frontend ရော Backend ပါ အကုန်လုပ်လို့ရတဲ့ All-rounder တစ်ခုပါ။ အခုနောက်ပိုင်း DevOps လောကမှာလည်း Node.js နဲ့တွဲပြီး နေရာတော်တော်ယူလာတယ်။ Automation tool တွေ၊ Serverless function တွေနဲ့ Monitoring dashboard တွေဆောက်တဲ့နေရာမှာ JS က တော်တော်လေး အဆင်ပြေတယ်။ သူ့ရဲ့ Event-driven ဖြစ်တဲ့ သဘာဝကြောင့် Asynchronous လုပ်ငန်းစဉ်တွေနဲ့ API ချိတ်ဆက်တဲ့နေရာမှာ တခြားဘာသာစကားတွေထက် ပိုသွက်လက်ပြီး Interactive ဖြစ်တဲ့ tool တွေ ဖန်တီးဖို့ အကောင်းဆုံးပဲလို့ ပြောလို့ရပါတယ်။",
    officialLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    frameworks: ["Node.js", "React", "Next.js", "Express.js", "NestJS"],
    frameworksMy: ["Node.js", "React", "Next.js", "Express.js", "NestJS"],
    level: "Beginner to Advanced",
    levelMy: "အစပြုသူမှ အဆင့်မြင့်",
    youtubeVideoId: "EerdGm-ehJQ",
    color: "from-sky-600 to-blue-600",
    tagColor: "bg-gray-300 md:bg-white/70 text-gray-800 border-gray-400",
  },
  {
    name: "Go",
    icon: "go.png",
    description: "Cloud Native & Microservices",
    descriptionMy: "Cloud Native & Microservices",
    fullDescription:
      "Go (Golang) is a statically typed, compiled language designed by Google for building efficient and reliable software. In DevOps, Go is the language of choice for cloud-native tools like Docker, Kubernetes, and Terraform. Its fast compilation, built-in concurrency support, and small binary sizes make it perfect for microservices, CLI tools, and high-performance system utilities.",
    fullDescriptionMy:
      "Go (Golang) က Google ကိုယ်တိုင် Performance ကောင်းဖို့နဲ့ Reliable ဖြစ်ဖို့ သေချာတွက်ချက်ပြီး ထုတ်ထားတဲ့ Language တစ်ခုပါ။ အခုခေတ် DevOps လောကမှာဆိုရင် Go က King ပဲလို့ ပြောလို့ရတယ်။ ကျွန်တော်တို့ သုံးနေတဲ့ Docker, Kubernetes နဲ့ Terraform တွေကလည်း Go နဲ့ပဲ ရေးထားတာလေ။ သူက Compile လုပ်တာ တအားမြန်တဲ့အပြင် Concurrency ကိုလည်း Built-in ပံ့ပိုးပေးထားတော့ Microservices တွေ၊ CLI tool တွေနဲ့ Performance ကောင်းဖို့လိုတဲ့ System utilities တွေအတွက်တော့ အကြိုက်ဆုံးပဲ",
    officialLink: "https://go.dev",
    frameworks: ["Gin", "Echo", "Cobra"],
    frameworksMy: ["Gin", "Echo", "Cobra"],
    level: "Intermediate to Advanced",
    levelMy: "အလယ်အလတ်မှ အဆင့်မြင့်",
    youtubeVideoId: "un6ZyFkqFKo",
    color: "from-sky-600 to-blue-600",
    tagColor: "bg-gray-300 md:bg-white/70 text-gray-800 border-gray-400",
  },
  {
    name: "Java",
    icon: "java.png",
    description: "Enterprise Applications",
    descriptionMy: "Enterprise Applications",
    fullDescription:
      "Java is a robust, object-oriented programming language widely used in enterprise environments. In DevOps, Java is essential for managing and deploying large-scale enterprise applications, building CI/CD tools like Jenkins, and creating distributed systems. Its platform independence, mature ecosystem, and strong typing make it ideal for building reliable, high-performance systems.",
    fullDescriptionMy:
      "Java ဆိုတာ Enterprise နယ်ပယ်မှာ အခိုင်အမာ နေရာယူထားတဲ့ Robust ဖြစ်တဲ့ ဘာသာစကားတစ်ခုပါ။ DevOps လောကမှာဆိုရင်လည်း Jenkins လို CI/CD tool တွေအပြင် အကြီးစား Distributed System တွေ တည်ဆောက်တဲ့နေရာမှာ Java က အဓိကပဲ။ သူ့ရဲ့ Platform Independence ဖြစ်မှု (ဘယ်နေရာမှာမဆို run လို့ရတာ) နဲ့ ရင့်ကျက်ပြီးသား Ecosystem ရှိနေတာကြောင့် စွမ်းဆောင်ရည်မြင့်ပြီး စိတ်ချရတဲ့ System တွေအတွက် Java က အမြဲတမ်း ထိပ်တန်းက ရှိနေပါတယ်။",
    officialLink: "https://www.java.com",
    frameworks: ["Spring Boot", "Maven", "Gradle", "JUnit"],
    frameworksMy: ["Spring Boot", "Maven", "Gradle", "JUnit"],
    level: "Intermediate to Advanced",
    levelMy: "အလယ်အလတ်မှ အဆင့်မြင့်",
    youtubeVideoId: "xTtL8E4LzTQ",
    color: "from-sky-600 to-blue-600",
    tagColor: "bg-gray-300 md:bg-white/70 text-gray-800 border-gray-400",
  },
  {
    name: "PHP",
    icon: "php.png",
    description: "PHP Web Applications",
    descriptionMy: "PHP Web Applications",
    fullDescription:
      "PHP is a popular server-side scripting language primarily used for web development. In DevOps, PHP is crucial for deploying and managing web applications, automating server configurations, and integrating with various web services. Its ease of use, extensive documentation, and large community support make it a go-to choice for building dynamic websites and web-based DevOps tools.",
    fullDescriptionMy:
      "PHP ဆိုတာ Web Development လောကမှာတော့ ဝါရင့် လူကြိုက်များတဲ့ Server-side ဘာသာစကားတစ်ခုပါ။ အခုခေတ် DevOps ပိုင်းမှာဆိုရင်လည်း Web app တွေကို Deploy လုပ်ဖို့၊ Server configuration တွေနဲ့ Web service တွေကို တစ်ခုနဲ့တစ်ခု ချိတ်ဆက်ဖို့အတွက် PHP ကို တော်တော်လေး သုံးဖြစ်ကြတယ်။ သူက လေ့လာရတာ လွယ်ကူတဲ့အပြင် Community ကလည်း တအားကြီးတော့ တစ်ခုခုဆို အဖြေရှာရတာ အရမ်းအဆင်ပြေတယ်။ Dynamic ဖြစ်တဲ့ Website တွေနဲ့ Web-based DevOps tool တွေ တည်ဆောက်မယ်ဆိုရင် PHP က အခုထိ အားကိုးရတဲ့ ရွေးချယ်မှုပါပဲ။",
    officialLink: "https://laravel.com",
    frameworks: ["Laravel", "Symfony", "Composer"],
    frameworksMy: ["Laravel", "Symfony", "Composer"],
    level: "Intermediate",
    levelMy: "အလယ်အလတ်",
    youtubeVideoId: "l4_Vn-sTBL8",
    color: "from-sky-600 to-blue-600",
    tagColor: "bg-gray-300 md:bg-white/70 text-gray-800 border-gray-400",
  },
];

interface ProgrammingLanguagesRoadmapProps {
  locale?: string;
}

export function ProgrammingLanguagesRoadmap({
  locale = "en",
}: ProgrammingLanguagesRoadmapProps) {
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
        {/* Header Section - English titles kept as requested */}
        <div className="mb-12 md:mb-16">
          <div className="max-w-3xl">
            {/* Blue/Purple gradient line with "Author Dashboard" style */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Learn Coding
              </span>
            </div>

            {/* Main title with your font style */}
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 md:mb-6 tracking-tight">
              Learn Coding Before DevOps
            </h1>
            <p className="text-base md:text-lg text-black-400 dark:text-gray-300 leading-relaxed">
              {locale === "en"
                ? "Before diving into DevOps tools and automation, it's important to have a solid understanding of programming. Coding skills help you write scripts, automate tasks, and understand how software is built and deployed."
                : "DevOps ကိုမလေ့လာခင်မှာ programming ကို သေချာ နားလည်ထားရန် လိုအပ်ပါသည်။ Coding ကျွမ်းကျင်မှုက bash script or IAC တွေရေးဖို့၊ tasks တွေ automate လုပ်ဖို့နဲ့ application တွေ deploy လုပ်ဖို့ အများကြီး အထောက်ကူပြုပေးပါသည်။"}
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
                    {locale === "en"
                      ? currentLanguage.description
                      : currentLanguage.descriptionMy}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 md:space-y-4">
                <p className="text-black-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                  {locale === "en"
                    ? currentLanguage.fullDescription
                    : currentLanguage.fullDescriptionMy}
                </p>
              </div>

              {/* Frameworks */}
              <div className="space-y-3 md:space-y-4">
                <h4 className="text-lg md:text-xl font-bold text-black-500 dark:text-gray-300">
                  {locale === "en"
                    ? "Popular Frameworks & Tools"
                    : "အသုံးများသော Frameworks များ"}
                </h4>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {(locale === "en"
                    ? currentLanguage.frameworks
                    : currentLanguage.frameworksMy
                  ).map((framework, idx) => (
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
                {locale === "en" ? "Read Official Docs" : "Read Official Docs"}
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
                💡{" "}
                {locale === "en"
                  ? "Click to watch full tutorial on YouTube"
                  : "YouTube တွင် tutorial ကြည့်ရန် နှိပ်ပါ"}
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
              <span className="hidden sm:inline">
                {locale === "en" ? "Previous" : "Previous"}
              </span>
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
              <span className="hidden sm:inline">
                {locale === "en" ? "Next" : "Next"}
              </span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
