"use client";
import { useEffect, useState, useRef } from "react";
import { Star, Quote, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  feedback: string;
  rating: number;
  image?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function SuccessStoriesSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/testimonials/`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTestimonials(data);
      })
      .catch((err) => console.error("Failed to fetch testimonials:", err));
  }, []);

  // Always show 3 at a time
  const totalPages = Math.ceil(testimonials.length / 3);
  const currentTestimonials = testimonials.slice(activeIndex * 3, (activeIndex + 1) * 3);

  const nextSlide = () => {
    if (activeIndex < totalPages - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white dark:bg-[#000000] overflow-hidden py-14 md:py-20"
    >
      <div className="relative">
        <div className="px-4 sm:px-6 md:px-11 font-open-sans">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 md:gap-16 mb-12 md:mb-20">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  Success Stories
                </span>
              </div>

              <h2 className="text-2xl md:text-6xl text-black dark:text-white mb-4 md:mb-6 tracking-tight">
                Real Stories, Real Success
              </h2>

              <p className="text-black dark:text-gray-300 text-base md:text-lg max-w-2xl">
                See how we helped students and junior engineers from Myanmar Achieve Their Goals. Hear from our visitors who have transformed their careers by breaking into DevOps, advancing their careers, and achieving their professional goals.
              </p>
            </div>
          </div>

          {/* Testimonials Grid - KodeKloud Style */}
          <div className="relative">
            {/* Desktop Navigation Buttons */}
            {testimonials.length > 3 && (
              <>
                {/* Left Chevron - Desktop */}
                <button
                  onClick={prevSlide}
                  disabled={activeIndex === 0}
                  className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full border items-center justify-center shadow-lg transition-all duration-200 z-20 ${
                    activeIndex === 0
                      ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-blue-500 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-blue-500 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-xl"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {/* Right Chevron - Desktop */}
                <button
                  onClick={nextSlide}
                  disabled={activeIndex === totalPages - 1}
                  className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full border items-center justify-center shadow-lg transition-all duration-200 z-20 ${
                    activeIndex === totalPages - 1
                      ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-blue-500 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-blue-500 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-xl"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {currentTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Card Container */}
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 h-[480px] sm:h-[520px]">
                    
                    <AnimatePresence>
                      {hoveredIndex !== index ? (
                        /* DEFAULT STATE: Full Photo with Overlay Text */
                        <motion.div
                          key="photo"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0"
                        >
                          {/* Photo Container with White Background for Transparent Images */}
                          <div className="relative h-full bg-white">
                            {testimonial.image ? (
                              <div className="relative w-full h-full">
                                {/* White background behind the image */}
                                <div className="absolute inset-0 bg-white"></div>
                                {/* Full size image */}
                                <img
                                  src={testimonial.image}
                                  alt={testimonial.name}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                            )}
                            
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/40"></div>
                            
                            {/* Text Overlay at Bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
                                {testimonial.name}
                              </h3>
                              <p className="text-blue-200 font-medium mb-3 sm:mb-4 text-sm sm:text-base">
                                {testimonial.role}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        /* HOVER STATE: Only Story Text with White Background */
                        <motion.div
                          key="story"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-white dark:bg-gray-800 p-6 sm:p-8 overflow-y-auto"
                        >
                          {/* Story Content */}
                          <div className="h-full flex flex-col">
                            {/* Quote Icon with more spacing */}
                            <div className="mb-6 sm:mb-8">
                              <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 dark:text-blue-400" />
                            </div>

                            {/* Story Text - Centered with more breathing room */}
                            <div className="flex-grow flex flex-col justify-center">
                              <p className="text-black dark:text-gray-300 text-base sm:text-base md:text-lg leading-relaxed text-center px-2 sm:px-4">
                                "{testimonial.feedback}"
                              </p>
                            </div>

                            {/* Author Info at Bottom */}
                            <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                              <h4 className="font-bold text-gray-900 dark:text-white text-center text-lg sm:text-xl">
                                {testimonial.name}
                              </h4>
                              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 text-center mt-1 sm:mt-2">
                                {testimonial.role}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Navigation - Smaller buttons */}
            <div className="md:hidden flex justify-center mt-6 sm:mt-8 gap-3">
              <button
                onClick={prevSlide}
                disabled={activeIndex === 0}
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm ${
                  activeIndex === 0
                    ? "bg-gray-100 border-gray-300 text-blue-500 cursor-not-allowed"
                    : "bg-white border-gray-300 text-blue-500 shadow-sm"
                }`}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                disabled={activeIndex === totalPages - 1}
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm ${
                  activeIndex === totalPages - 1
                    ? "bg-gray-100 border-gray-300 text-blue-500 cursor-not-allowed"
                    : "bg-white border-gray-300 text-blue-500 shadow-sm"
                }`}
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Page Indicators - Smaller for mobile */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-10 hidden md:flex">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-blue-600 dark:bg-blue-400 h-1.5 sm:h-2 w-6 sm:w-8"
                      : "bg-gray-300 dark:bg-gray-700 h-1.5 sm:h-2 w-1.5 sm:w-2"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}