"use client";
import { useEffect, useState, useRef } from "react";
import { Star, Quote, ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

type Testimonial = {
  name: string;
  role: string;
  feedback: string;
  rating: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function SuccessStoriesSection() {
  const [feedbacks, setFeedbacks] = useState<Testimonial[]>([]);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/testimonials/`)
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType?.includes("application/json")) {
          throw new Error("Invalid JSON response");
        }
        const data = await res.json();
        setFeedbacks(data);
      })
      .catch((err) => console.error("Failed to fetch testimonials:", err));
  }, []);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!showAll && sectionRef.current) {
      const timeout = setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [showAll]);

  const displayed = showAll ? feedbacks.slice(0, 12) : feedbacks.slice(0, 6);

  const mockTestimonials: Testimonial[] = [
    {
      name: "Aung Ko",
      role: "Junior DevOps Engineer",
      feedback:
        "The mentorship program completely transformed my career path. From zero knowledge to landing my first DevOps role in just 6 months!",
      rating: 5,
    },
    {
      name: "Hla Hla",
      role: "Cloud Engineer",
      feedback:
        "The hands-on projects and real-world scenarios prepared me for actual workplace challenges. Highly recommended!",
      rating: 5,
    },
    {
      name: "Min Thu",
      role: "Site Reliability Engineer",
      feedback:
        "The community support and detailed curriculum helped me transition from network engineering to SRE successfully.",
      rating: 5,
    },
    {
      name: "Su Su",
      role: "DevOps Specialist",
      feedback:
        "Learning modern tools like Kubernetes and Terraform through practical projects made all the difference in my job interviews.",
      rating: 4,
    },
    {
      name: "Kyaw Zin",
      role: "Infrastructure Engineer",
      feedback:
        "The career guidance and interview preparation sessions were invaluable. Got 3 job offers within 2 months of completing the program.",
      rating: 5,
    },
    {
      name: "Nilar",
      role: "Platform Engineer",
      feedback:
        "As someone with non-CS background, the structured learning path and mentor support made complex concepts easy to understand.",
      rating: 5,
    },
  ];

  const testimonials = feedbacks.length > 0 ? feedbacks : mockTestimonials;

  return (
    <section
      ref={sectionRef}
      className="relative bg-white dark:bg-[#000000] overflow-hidden"
    >
      <div className="relative w-full">
        <div className="px-4 md:px-11 font-open-sans">
          {/* Header */}
          <motion.div
            className="flex flex-col lg:flex-row items-start justify-between gap-8 md:gap-12 mb-8 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex-1">
              <motion.div
                className="h-1 w-24 md:w-32 mb-4 md:mb-6 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "6rem" }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 leading-tight"
              >
                Real Stories from
                <span className="block bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mt-1 md:mt-2">
                  Our Community
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl"
              >
                See how students and junior engineers from Myanmar are growing
                their careers and mastering DevOps skills
              </motion.p>
            </div>
          </motion.div>

          {/* Testimonials Container */}
          <div className="relative">
            {/* Desktop Navigation Arrows - Above testimonials (unchanged) */}
            <div className="hidden sm:flex justify-end mb-6 gap-3">
              <motion.button
                onClick={scrollLeft}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-sky-600 dark:text-sky-400" />
              </motion.button>
              <motion.button
                onClick={scrollRight}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-sky-600 dark:text-sky-400" />
              </motion.button>
            </div>

            {/* Testimonials Grid/Scroll */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-4"
            >
              {displayed.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-[85vw] sm:min-w-0 snap-start flex-shrink-0"
                >
                  {/* Enhanced Card Design - Better for mobile */}
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl md:rounded-2xl p-5 md:p-6 h-full flex flex-col border border-gray-300 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 min-h-[220px]">
                    {/* Top Section with Quote and Rating */}
                    <div className="flex items-start justify-between mb-3 md:mb-4">
                      <div className="p-2 md:p-3 bg-white dark:bg-gray-700 rounded-lg border border-sky-300 dark:border-sky-600">
                        <Quote className="w-4 h-4 md:w-5 md:h-5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div className="flex gap-0.5 md:gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 md:w-4 md:h-4 ${
                              i < testimonial.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Feedback Text - Better mobile display */}
                    <div className="flex-grow mb-4 md:mb-6 overflow-hidden">
                      <p className="text-gray-500 dark:text-gray-300 text-sm md:text-base leading-relaxed line-clamp-4 md:line-clamp-none">
                        "{testimonial.feedback}"
                      </p>
                    </div>

                    {/* User Info */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 md:pt-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {testimonial.name}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Navigation - Moved UNDER testimonials */}
            <div className="sm:hidden flex justify-center mt-6 gap-4">
              <motion.button
                onClick={scrollLeft}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <ChevronLeft className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </motion.button>
              <motion.button
                onClick={scrollRight}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <ChevronRight className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </motion.button>
            </div>
          </div>

          {/* See More Button */}
          {testimonials.length > 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 md:mt-12 text-center"
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-2.5 md:px-8 md:py-3 rounded-lg text-sm font-medium bg-sky-800 dark:bg-sky-700 text-white border border-sky-800 dark:border-sky-700 flex items-center gap-2 mx-auto transition-colors duration-200 hover:bg-sky-900 dark:hover:bg-sky-800 hover:shadow-lg"
              >
                {showAll ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                    Show Less
                  </>
                ) : (
                  <>
                    Show More Stories
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
