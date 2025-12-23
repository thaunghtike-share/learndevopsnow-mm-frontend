"use client";
import { useState, useEffect, useRef } from "react";
import {
  Star,
  GraduationCap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  User,
  AlertTriangle,
  RefreshCw,
  Trophy,
  Award,
  Users,
  Gift,
  CheckCircle,
  Ship,
  Container,
  Layout,
  Cloud,
  ExternalLink,
  PlayCircle,
  Target,
  Zap,
  Clock,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface Review {
  username: string;
  comment: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  url: string;
  author: string;
  cover_image?: string | null;
  price?: string;
  students?: string;
  rating?: number;
  reviews?: Review[];
}

const fallbackCourses: Course[] = [
  {
    id: 1,
    title: "1. Git, GitHub, and GitHub Action",
    description: "Learn Git, GitHub & GitHub Actions basics.",
    url: "https://www.udemy.com/course/git-github-and-github-actions-an-introduction/",
    author: "Emil Terhoven",
    cover_image: "/git.png",
    price: "Free",
    students: "500+",
    rating: 4.7,
    reviews: [
      { username: "John D.", comment: "Great introduction to GitHub Actions!" },
      { username: "Sarah M.", comment: "Well explained concepts." },
    ],
  },
  {
    id: 2,
    title: "2. Intro to Linux Shell Scripting",
    description: "Shell scripting essentials for Linux administrators.",
    url: "https://www.udemy.com/course/linux-shell-scripting-free/",
    author: "Jason Cannon",
    cover_image: "/linux.webp",
    price: "Free",
    students: "1.2K+",
    rating: 4.7,
    reviews: [
      { username: "Mike T.", comment: "Perfect for beginners" },
      { username: "Lisa K.", comment: "Clear and concise" },
    ],
  },
  {
    id: 3,
    title: "3. Ansible Basics",
    description: "Learn the basics of Ansible automation by Red Hat.",
    url: "https://www.udemy.com/course/ansible-basics-an-automation-technical-overview/",
    author: "Red Hat, Inc.",
    cover_image: "/ansible.png",
    price: "Free",
    students: "800+",
    rating: 4.4,
    reviews: [
      { username: "David L.", comment: "Official Red Hat course - excellent!" },
    ],
  },
  {
    id: 4,
    title: "4. Docker Essentials",
    description: "Learn Docker and Docker Compose efficiently.",
    url: "https://www.udemy.com/course/docker-essentials",
    author: "Cerulean Canvas",
    cover_image: "/docker.png",
    price: "$10",
    students: "2.5K+",
    rating: 4.6,
    reviews: [
      { username: "Alex P.", comment: "Great hands-on exercises" },
      { username: "Maria S.", comment: "Well structured content" },
    ],
  },
  {
    id: 5,
    title: "5. Introduction to DevOps",
    description: "Introduction to DevOps concepts and tools.",
    url: "https://www.udemy.com/course/introduction-to-devops-f",
    author: "Dicecamp Academy",
    cover_image: "/devops.png",
    price: "Free",
    students: "900+",
    rating: 4.3,
    reviews: [{ username: "Tom B.", comment: "Good overview of DevOps" }],
  },
  {
    id: 6,
    title: "6. AWS From Scratch",
    description: "Get started with AWS and DevOps cloud basics.",
    url: "https://www.udemy.com/course/aws-from-scratch",
    author: "Sundus Hussain",
    cover_image: "/aws.png",
    price: "$15",
    students: "3.2K+",
    rating: 4.5,
    reviews: [
      { username: "Chris R.", comment: "Excellent AWS foundation" },
      { username: "Emma W.", comment: "Practical examples" },
    ],
  },
];

const greatLearningCourses: Course[] = [
  {
    id: 1,
    title: "1. Linux Tutorial",
    description:
      "Comprehensive Linux tutorial covering essential commands, file systems, and system administration basics.",
    url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/linux-tutorial",
    author: "Mr. Ramendra Tripathi",
    cover_image: "/linux.webp",
    price: "Free",
    students: "40K+",
    rating: 4.6,
  },
  {
    id: 2,
    title: "2. AWS for Beginners",
    description:
      "Learn AWS fundamentals, services, and cloud computing concepts from scratch with hands-on examples.",
    url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/aws-for-beginners1",
    author: "Mr. Vishal Padghan",
    cover_image: "/aws.png",
    price: "Free",
    students: "15K+",
    rating: 4.7,
  },
  {
    id: 3,
    title: "3. Git Tutorial",
    description:
      "Master version control with Git - from basic commands to branching strategies and collaboration workflows.",
    url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/git-tutorial",
    author: "Mr. Ramendra Tripathi",
    cover_image: "/git.png",
    price: "Free",
    students: "12K+",
    rating: 4.8,
  },
  {
    id: 4,
    title: "4. GitHub Tutorial for Beginners",
    description:
      "Learn GitHub essentials including repositories, pull requests, issues, and collaborative development.",
    url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/github-tutorial-for-beginners",
    author: "Pragya P",
    cover_image: "/github.png",
    price: "Free",
    students: "9K+",
    rating: 4.6,
  },
  {
    id: 5,
    title: "5. Docker for Intermediate Level",
    description:
      "Advanced Docker concepts including container orchestration, Docker Compose, and best practices.",
    url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/docker-for-intermediate-level",
    author: "Mr. Ramendra Tripathi",
    cover_image: "/docker.png",
    price: "Free",
    students: "8K+",
    rating: 4.5,
  },
  {
    id: 6,
    title: "6. Kubernetes Tutorial",
    description: "Build container orchestration solutions with Kubernetes.",
    url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/introduction-to-kubernetes1",
    author: "Mr. Ramendra Tripathi",
    cover_image: "/kubernetes.png",
    price: "Free",
    students: "33K+",
    rating: 4.7,
  },
];

const kodekloudCourses: Course[] = [
  {
    id: 1,
    title: "Linux for Beginners",
    description:
      "Comprehensive Linux course covering commands, file systems, and administration basics with hands-on labs.",
    url: "https://kodekloud.com/courses/linux-for-beginners/",
    author: "KodeKloud Team",
    cover_image: "/linux.webp",
    price: "Free",
    students: "50K+",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Docker for Beginners",
    description:
      "Learn Docker fundamentals with interactive labs and real-world containerization scenarios.",
    url: "https://kodekloud.com/courses/docker-for-beginners/",
    author: "KodeKloud Team",
    cover_image: "/docker.png",
    price: "Free",
    students: "45K+",
    rating: 4.9,
  },
  {
    id: 3,
    title: "Kubernetes for Beginners",
    description:
      "Master Kubernetes basics with hands-on labs and practical deployment exercises.",
    url: "https://kodekloud.com/courses/kubernetes-for-beginners/",
    author: "KodeKloud Team",
    cover_image: "/kubernetes.png",
    price: "Free",
    students: "38K+",
    rating: 4.8,
  },
  {
    id: 4,
    title: "DevOps Pre-requisites",
    description:
      "Essential foundation course covering Git, Linux, and basic DevOps concepts with interactive labs.",
    url: "https://kodekloud.com/courses/devops-pre-requisites/",
    author: "KodeKloud Team",
    cover_image: "/devops.png",
    price: "Free",
    students: "42K+",
    rating: 4.7,
  },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Function to extract number from title for sorting
const extractNumberFromTitle = (title: string): number => {
  const match = title.match(/^(\d+)\./);
  return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
};

export function TopUdemyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [currentPageUdemy, setCurrentPageUdemy] = useState(0);
  const [currentPageGL, setCurrentPageGL] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRefUdemy = useRef<HTMLDivElement>(null);
  const scrollContainerRefGL = useRef<HTMLDivElement>(null);

  // Courses per page - 3 per row, 2 rows = 6 courses per page for desktop
  const COURSES_PER_PAGE = 6;

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setError(null);
        setUsingFallback(false);

        if (!API_BASE_URL) {
          throw new Error("API URL not configured");
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(`${API_BASE_URL}/udemy-courses/`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        let rawCourses = data;

        if (data && typeof data === "object") {
          if (Array.isArray(data)) {
            rawCourses = data;
          } else if (Array.isArray(data.results)) {
            rawCourses = data.results;
          } else if (Array.isArray(data.courses)) {
            rawCourses = data.courses;
          }
        }

        if (!Array.isArray(rawCourses)) {
          throw new Error("Invalid data format received");
        }

        const mapped: Course[] = rawCourses.map(
          (course: any, index: number) => ({
            id: course.id || index + 1,
            title: course.title || "Untitled Course",
            description: course.description || "No description available.",
            url: course.url || "#",
            author: course.author || "Unknown Author",
            cover_image: course.cover_image || course.image || null,
            price: course.price || "Free",
            students:
              course.students || `${Math.floor(Math.random() * 900) + 100}+`,
            rating:
              course.rating || Math.round((Math.random() * 1 + 3.5) * 10) / 10,
            reviews: course.reviews || [],
          })
        );

        // Sort courses by number in title
        const sortedCourses = mapped.sort((a, b) => {
          const numA = extractNumberFromTitle(a.title);
          const numB = extractNumberFromTitle(b.title);
          return numA - numB;
        });

        setCourses(sortedCourses.length > 0 ? sortedCourses : fallbackCourses);
      } catch (err) {
        console.error("Fetch error:", err);
        setUsingFallback(true);
        // Also sort fallback courses
        const sortedFallback = fallbackCourses.sort((a, b) => {
          const numA = extractNumberFromTitle(a.title);
          const numB = extractNumberFromTitle(b.title);
          return numA - numB;
        });
        setCourses(sortedFallback);
        setError(err instanceof Error ? err.message : "Failed to load courses");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  // Calculate pagination for Udemy courses
  const totalPagesUdemy = Math.ceil(courses.length / COURSES_PER_PAGE);
  const startIndexUdemy = currentPageUdemy * COURSES_PER_PAGE;
  const currentCoursesUdemy = courses.slice(
    startIndexUdemy,
    startIndexUdemy + COURSES_PER_PAGE
  );

  // Calculate pagination for Great Learning courses
  const totalPagesGL = Math.ceil(
    greatLearningCourses.length / COURSES_PER_PAGE
  );
  const startIndexGL = currentPageGL * COURSES_PER_PAGE;
  const currentCoursesGL = greatLearningCourses.slice(
    startIndexGL,
    startIndexGL + COURSES_PER_PAGE
  );

  const nextPageUdemy = () => {
    setCurrentPageUdemy((prev) => (prev + 1) % totalPagesUdemy);
  };

  const prevPageUdemy = () => {
    setCurrentPageUdemy(
      (prev) => (prev - 1 + totalPagesUdemy) % totalPagesUdemy
    );
  };

  const nextPageGL = () => {
    setCurrentPageGL((prev) => (prev + 1) % totalPagesGL);
  };

  const prevPageGL = () => {
    setCurrentPageGL((prev) => (prev - 1 + totalPagesGL) % totalPagesGL);
  };

  // Mobile scroll handlers
  const handleScrollUdemy = () => {
    if (scrollContainerRefUdemy.current && window.innerWidth < 768) {
      const container = scrollContainerRefUdemy.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const cardWidth = containerWidth * 0.85; // Card width is 85% of viewport
      const scrollPosition = scrollLeft + containerWidth / 2;
      const newPage = Math.floor(scrollPosition / cardWidth);
      setCurrentPageUdemy(Math.min(newPage, courses.length - 1));
    }
  };

  const handleScrollGL = () => {
    if (scrollContainerRefGL.current && window.innerWidth < 768) {
      const container = scrollContainerRefGL.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const cardWidth = containerWidth * 0.85;
      const scrollPosition = scrollLeft + containerWidth / 2;
      const newPage = Math.floor(scrollPosition / cardWidth);
      setCurrentPageGL(Math.min(newPage, greatLearningCourses.length - 1));
    }
  };

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const sortedFallback = fallbackCourses.sort((a, b) => {
        const numA = extractNumberFromTitle(a.title);
        const numB = extractNumberFromTitle(b.title);
        return numA - numB;
      });
      setCourses(sortedFallback);
      setLoading(false);
      setUsingFallback(true);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300 relative">
        <main className="max-w-7xl mx-auto px-4 py-20">
          {/* Simple Elegant Loading */}
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            {/* Animated Logo Container */}
            <div className="relative">
              {/* Outer Ring Animation */}
              <div className="w-32 h-32 rounded-full border-4 border-blue-200/50 dark:border-blue-800/30 animate-spin">
                {/* Logo Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center p-2">
                    <img
                      src="/kodekloud.webp"
                      alt="KodeKloud"
                      className="w-16 h-16 object-contain animate-pulse"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      {/* KodeKloud Section - Mobile Optimized */}
      <section className="w-full bg-white/95 dark:bg-[#000000] py-13 md:py-16 transition-colors duration-300">
        <div className="px-6 md:px-11">
          {/* Header - Mobile Optimized */}
          <div className="max-w-3xl mb-16">
            <div className="h-1 w-24 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mb-6"></div>
            <h2 className="text-2xl md:text-5xl font-bold text-slate-900 dark:text-gray-100 mb-6 leading-tight">
              Start Your Journey with
              <span className="block bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent mt-2">
                KodeKloud
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-700 dark:text-gray-300 leading-relaxed">
              The leading platform for DevOps, Cloud, and Infrastructure
              learning.
            </p>
          </div>

          {/* Feature Points - Mobile Horizontal Scroll */}
          <div className="flex overflow-x-auto pb-6 space-x-4 md:hidden -mx-6 px-6 scrollbar-hide">
            <div className="flex-shrink-0 w-[280px] bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-3">
                Industry Courses
              </h3>
              <p className="text-slate-700 dark:text-gray-300 text-sm">
                Docker, Kubernetes, AWS with real-world projects and hands-on
                labs.
              </p>
            </div>

            <div className="flex-shrink-0 w-[280px] bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-3">
                Expert Instructors
              </h3>
              <p className="text-slate-700 dark:text-gray-300 text-sm">
                Learn from industry leaders like Mumshad Mannambeth and
                certified experts.
              </p>
            </div>

            <div className="flex-shrink-0 w-[280px] bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4">
                <Gift className="w-7 h-7 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-3">
                Free Access
              </h3>
              <p className="text-slate-700 dark:text-gray-300 text-sm">
                Start with free courses, hands-on labs, and interactive learning
                paths.
              </p>
            </div>
          </div>

          {/* Desktop Feature Points */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100 mb-4">
                Industry Courses
              </h3>
              <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                Docker, Kubernetes, AWS, Terraform with real-world projects.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100 mb-4">
                Expert Instructors
              </h3>
              <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                Learn from industry leaders like Mumshad Mannambeth.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100 mb-4">
                Free Access
              </h3>
              <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                Start with free courses and hands-on labs.
              </p>
            </div>
          </div>

          {/* CTA Section - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-500 dark:to-blue-500 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-6">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                Ready to Start Your DevOps Journey?
              </h3>
              <p className="text-sky-100 dark:text-sky-200 text-sm md:text-lg mb-4 md:mb-6 max-w-2xl mx-auto">
                Join thousands of successful engineers who transformed their
                careers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <a
                  href="https://kodekloud.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-sky-600 rounded-xl hover:shadow-2xl transition-all duration-300 font-bold text-sm md:text-lg hover:scale-105 active:scale-95"
                >
                  <span>Explore All Courses</span>
                  <ExternalLink className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
                <a
                  href="https://learn.kodekloud.com/user/learning-paths/devops"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-sky-600 transition-all duration-300 font-bold text-sm md:text-lg active:scale-95"
                >
                  <PlayCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span>View DevOps Path</span>
                </a>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
              Trusted by engineers at Google, Amazon, Microsoft, and thousands
              of companies worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Udemy Section - Mobile Optimized */}
      <section
        ref={sectionRef}
        className="relative w-full bg-white/95 dark:bg-[#000000] md:py-10 overflow-hidden transition-colors duration-300"
      >
        <div className="relative px-6 md:px-11">
          {/* Header Section - Mobile Optimized */}
          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-3xl">
              <motion.div
                className="h-1 w-16 md:w-24 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mb-4 md:mb-6"
                initial={{ width: 0 }}
                animate={{ width: "4rem" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 leading-tight"
              >
                Master DevOps with
                <span className="block bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent mt-1 md:mt-0">
                  Udemy Courses
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed"
              >
                Curated collection of online courses designed to help you master
                essential DevOps tools, practices, and methodologies
                {usingFallback && (
                  <span className="block text-xs md:text-sm mt-2 text-yellow-600 dark:text-yellow-400">
                    • Showing demo data (API unavailable)
                  </span>
                )}
              </motion.p>
            </div>
          </motion.div>

          {/* Error Banner - Mobile Optimized */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 md:mb-12"
            >
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-gray-100 mb-1 font-medium text-sm md:text-base">
                      Unable to load live data
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                      {error.length > 60
                        ? `${error.substring(0, 60)}...`
                        : error}{" "}
                      - Showing demo courses.
                    </p>
                  </div>
                  <button
                    onClick={retryFetch}
                    className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded-lg md:rounded-xl transition-all hover:bg-yellow-600 dark:hover:bg-yellow-700 text-xs md:text-sm font-medium shadow-sm active:scale-95"
                  >
                    <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden md:inline">Retry</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Courses Grid with Pagination - Mobile Optimized */}
          {courses.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <div className="inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full p-6 md:p-8 mb-4 md:mb-6 border border-gray-200 dark:border-gray-700">
                <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4">
                No courses available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg">
                Check back later for featured courses
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Desktop: 2x3 Grid Layout */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {currentCoursesUdemy.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="block group h-full"
                  >
                    <div className="relative">
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {/* Logo Container */}
                        <div className="relative aspect-video bg-white dark:bg-gray-700 overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-600 group-hover:shadow-xl transition-all duration-300 flex items-center justify-center p-8">
                          {course.cover_image ? (
                            <img
                              src={course.cover_image || "/placeholder.svg"}
                              alt={course.title}
                              className="w-32 h-32 object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                            </div>
                          )}
                        </div>
                      </a>
                    </div>

                    <div className="mt-4 space-y-3">
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h3 className="font-bold text-sky-600 dark:text-sky-400 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors duration-200 text-base leading-snug">
                          {course.title}
                        </h3>
                      </a>

                      <div className="flex items-center justify-between py-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="font-medium truncate">
                            {course.author}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span>{course.students}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {course.rating && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                {course.rating.toFixed(1)}
                              </span>
                            </div>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              rating
                            </span>
                          </div>
                        )}
                        {course.price && (
                          <span className="font-bold text-sky-600 dark:text-sky-400">
                            {course.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile: Horizontal Scroll Layout - Optimized */}
              <div className="md:hidden">
                <div
                  ref={scrollContainerRefUdemy}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-2 -mx-6 px-6"
                  onScroll={handleScrollUdemy}
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {courses.map((course, index) => (
                    <div
                      key={course.id}
                      className="flex-shrink-0 w-[calc(100vw-3rem)] snap-start"
                    >
                      <div className="block group h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98]">
                        <div className="relative mb-4">
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <div className="relative aspect-[16/9] bg-white dark:bg-gray-700 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 group-hover:border-sky-300 dark:group-hover:border-sky-500 transition-all duration-300 flex items-center justify-center p-4">
                              {course.cover_image ? (
                                <img
                                  src={course.cover_image || "/placeholder.svg"}
                                  alt={course.title}
                                  className="w-20 h-20 object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-500" />
                              )}
                            </div>
                          </a>
                        </div>

                        <div className="space-y-3">
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <h3 className="font-bold text-sky-600 dark:text-sky-400 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors duration-200 text-sm leading-snug mb-2">
                              {course.title}
                            </h3>
                          </a>

                          <div className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                              <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                              <span className="font-medium truncate text-xs">
                                {course.author}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <Users className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                              <span className="text-xs">{course.students}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                            {course.rating && (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                                    {course.rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            )}
                            {course.price && (
                              <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">
                                {course.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Indicator - Enhanced */}
                <div className="flex justify-center items-center gap-4 mt-6 px-6">
                  <div className="flex space-x-1.5">
                    {courses.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (scrollContainerRefUdemy.current) {
                            const container = scrollContainerRefUdemy.current;
                            const cardWidth = container.clientWidth * 0.85;
                            container.scrollTo({
                              left: i * cardWidth,
                              behavior: "smooth",
                            });
                          }
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i === currentPageUdemy
                            ? "bg-sky-600 dark:bg-sky-400"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        aria-label={`Go to course ${i + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {currentPageUdemy + 1} of {courses.length}
                  </span>
                </div>
              </div>

              {/* Desktop Pagination Controls */}
              {totalPagesUdemy > 1 && (
                <div className="hidden md:flex items-center justify-center gap-4 mb-5 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevPageUdemy}
                    className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-md"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </motion.button>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Page {currentPageUdemy + 1} of {totalPagesUdemy}
                    </span>
                    <div className="flex space-x-2">
                      {Array.from({ length: totalPagesUdemy }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPageUdemy(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === currentPageUdemy
                              ? "bg-sky-600 dark:bg-sky-400 scale-125"
                              : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                          }`}
                          aria-label={`Go to page ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextPageUdemy}
                    className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-md"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Great Learning Section - Mobile Optimized */}
      <section className="relative w-full bg-white dark:bg-[#000000] py-17 overflow-hidden transition-colors duration-300">
        <div className="relative px-6 md:px-11">
          {/* Header Section - Mobile Optimized */}
          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-3xl">
              <motion.div
                className="h-1 w-16 md:w-24 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mb-4 md:mb-6"
                initial={{ width: 0 }}
                animate={{ width: "4rem" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 leading-tight"
              >
                Free DevOps Courses by
                <span className="block bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent mt-1 md:mt-0">
                  Great Learning
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed"
              >
                Comprehensive free courses covering Linux, AWS, Docker, Git, and
                CI/CD pipelines to boost your DevOps skills
              </motion.p>
            </div>
          </motion.div>

          {/* Great Learning Courses Grid - Mobile Optimized */}
          <div className="relative">
            {/* Desktop: 2x3 Grid Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {currentCoursesGL.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="block group h-full"
                >
                  <div className="relative">
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {/* Logo Container */}
                      <div className="relative aspect-video bg-white dark:bg-gray-700 overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-600 group-hover:shadow-xl transition-all duration-300 flex items-center justify-center p-8">
                        {course.cover_image ? (
                          <img
                            src={course.cover_image || "/placeholder.svg"}
                            alt={course.title}
                            className="w-32 h-32 object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                          </div>
                        )}
                      </div>
                    </a>
                  </div>

                  <div className="mt-4 space-y-3">
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h3 className="font-bold text-sky-600 dark:text-sky-400 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors duration-200 text-base leading-snug">
                        {course.title}
                      </h3>
                    </a>

                    <div className="flex items-center justify-between py-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="font-medium truncate">
                          {course.author}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span>{course.students}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {course.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                              {course.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            rating
                          </span>
                        </div>
                      )}
                      {course.price && (
                        <span className="font-bold text-sky-600 dark:text-sky-400">
                          {course.price}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile: Horizontal Scroll Layout - Optimized */}
            <div className="md:hidden">
              <div
                ref={scrollContainerRefGL}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-2 -mx-6 px-6"
                onScroll={handleScrollGL}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {greatLearningCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="flex-shrink-0 w-[calc(100vw-3rem)] snap-start"
                  >
                    <div className="block group h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98]">
                      <div className="relative mb-4">
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <div className="relative aspect-[16/9] bg-white dark:bg-gray-700 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 group-hover:border-sky-300 dark:group-hover:border-sky-500 transition-all duration-300 flex items-center justify-center p-4">
                            {course.cover_image ? (
                              <img
                                src={course.cover_image || "/placeholder.svg"}
                                alt={course.title}
                                className="w-20 h-20 object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-500" />
                            )}
                          </div>
                        </a>
                      </div>

                      <div className="space-y-3">
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <h3 className="font-bold text-sky-600 dark:text-sky-400 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors duration-200 text-sm leading-snug mb-2">
                            {course.title}
                          </h3>
                        </a>

                        <div className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                            <span className="font-medium truncate text-xs">
                              {course.author}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Users className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                            <span className="text-xs">{course.students}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                          {course.rating && (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                                  {course.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          )}
                          {course.price && (
                            <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">
                              {course.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Indicator - Enhanced */}
              <div className="flex justify-center items-center gap-4 mt-6 px-6">
                <div className="flex space-x-1.5">
                  {greatLearningCourses.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (scrollContainerRefGL.current) {
                          const container = scrollContainerRefGL.current;
                          const cardWidth = container.clientWidth * 0.85;
                          container.scrollTo({
                            left: i * cardWidth,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === currentPageGL
                          ? "bg-sky-600 dark:bg-sky-400"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      aria-label={`Go to course ${i + 1}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {currentPageGL + 1} of {greatLearningCourses.length}
                </span>
              </div>
            </div>

            {/* Desktop Pagination Controls */}
            {totalPagesGL > 1 && (
              <div className="hidden md:flex items-center justify-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevPageGL}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-md"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </motion.button>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Page {currentPageGL + 1} of {totalPagesGL}
                  </span>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPagesGL }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPageGL(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentPageGL
                            ? "bg-sky-600 dark:bg-sky-400 scale-125"
                            : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                        }`}
                        aria-label={`Go to page ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextPageGL}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-md"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
