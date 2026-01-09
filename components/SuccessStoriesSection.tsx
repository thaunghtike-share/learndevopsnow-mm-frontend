"use client";
import { useEffect, useState, useRef } from "react";
import { Star, Quote, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
      className="relative bg-white dark:bg-[#000000] overflow-hidden py-16 md:py-24"
    >
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="px-4 md:px-11 font-open-sans">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 md:gap-12 mb-8 md:mb-16">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  Success Stories
                </span>
              </div>

              <h2 className="text-2xl md:text-6xl text-black dark:text-white mb-4 md:mb-4 tracking-tight">
                Feedback from Our Students
              </h2>

              <p className="text-black dark:text-gray-300 text-base md:text-lg max-w-2xl">
                See how students and junior engineers from Myanmar are growing
                their careers and mastering DevOps skills
              </p>
            </div>

            {/* Navigation Controls - Beside stories */}
            {testimonials.length > 3 && (
              <div className="flex items-center gap-3 mt-4 lg:mt-0">
                <button
                  onClick={prevSlide}
                  disabled={activeIndex === 0}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center shadow-lg transition-all duration-200 ${
                    activeIndex === 0
                      ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-xl"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={activeIndex === totalPages - 1}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center shadow-lg transition-all duration-200 ${
                    activeIndex === totalPages - 1
                      ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-xl"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Testimonials Grid - KodeKloud Style */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {currentTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Card Container */}
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 h-[500px]">
                    
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
                          {/* Photo Container - Full Height */}
                          <div className="relative h-full">
                            {testimonial.image ? (
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                            )}
                            
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/40"></div>
                            
                            {/* Text Overlay at Bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                              <h3 className="text-xl md:text-2xl font-bold mb-2">
                                {testimonial.name}
                              </h3>
                              <p className="text-blue-200 font-medium">
                                {testimonial.role}
                              </p>
                              
                              {/* Rating */}
                              <div className="flex gap-1 mt-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < testimonial.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-400"
                                    }`}
                                  />
                                ))}
                              </div>
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
                          className="absolute inset-0 bg-white dark:bg-gray-800 p-6 overflow-y-auto"
                        >
                          {/* Story Content */}
                          <div className="h-full flex flex-col">
                            {/* Quote Icon */}
                            <div className="mb-4">
                              <Quote className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                            </div>

                            {/* Story Text */}
                            <div className="flex-grow">
                              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                                "{testimonial.feedback}"
                              </p>
                            </div>

                            {/* Author Info at Bottom */}
                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <h4 className="font-bold text-gray-900 dark:text-white">
                                {testimonial.name}
                              </h4>
                              <p className="text-sm text-blue-600 dark:text-blue-400">
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

            {/* Mobile Navigation */}
            <div className="sm:hidden flex justify-center mt-8 gap-4">
              <button
                onClick={prevSlide}
                disabled={activeIndex === 0}
                className={`w-12 h-12 rounded-full border flex items-center justify-center ${
                  activeIndex === 0
                    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                disabled={activeIndex === totalPages - 1}
                className={`w-12 h-12 rounded-full border flex items-center justify-center ${
                  activeIndex === totalPages - 1
                    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Page Indicators */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-blue-600 dark:bg-blue-400 w-6"
                      : "bg-gray-300 dark:bg-gray-700"
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