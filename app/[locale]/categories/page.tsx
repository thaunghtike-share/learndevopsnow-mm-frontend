"use client";
import { useEffect, useState, useRef } from "react";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Server,
  Brain,
  Cloud,
  Cog,
  BarChart3,
  Sparkles,
  Shield,
  Code,
  Database,
  Globe,
  Zap,
  Folder,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Vault,
  Key,
  Container,
  GitBranch,
  GitCommit,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Types for your API data
interface Category {
  id: number;
  slug: string;
  name: string;
  post_count: number;
}

// Icon mapping for different categories
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("devops")) return Server;
  if (name.includes("python")) return Code;
  if (name.includes("ai") || name.includes("ml")) return Brain;
  if (name.includes("cloud")) return Cloud;
  if (name.includes("automation")) return Cog;
  if (name.includes("monitoring")) return BarChart3;
  if (name.includes("security")) return Shield;
  if (name.includes("database")) return Database;
  if (name.includes("web")) return Globe;
  if (name.includes("devsecops")) return Key;
  if (name.includes("kubernetes")) return Container;
  if (name.includes("terraform")) return GitBranch;
  if (name.includes("cicd")) return GitCommit;
  return Zap;
};

// Color mapping for different categories
const getCategoryColors = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("devops")) return "from-orange-500 to-red-500";
  if (name.includes("python")) return "from-green-500 to-emerald-500";
  if (name.includes("ai") || name.includes("ml"))
    return "from-purple-500 to-pink-500";
  if (name.includes("cloud")) return "from-sky-500 to-blue-500";
  if (name.includes("automation")) return "from-indigo-500 to-blue-500";
  if (name.includes("monitoring")) return "from-amber-500 to-yellow-500";
  if (name.includes("security")) return "from-rose-500 to-pink-500";
  if (name.includes("database")) return "from-teal-500 to-cyan-500";
  if (name.includes("web")) return "from-violet-500 to-purple-500";
  return "from-slate-500 to-gray-500";
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/categories/?count_posts=true`
        );
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load categories"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const displayedCategories = showAll ? categories : categories.slice(0, 6);

  const toggleShowAll = () => {
    if (showAll && categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setShowAll(!showAll);
  };

   if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300 relative">
        <MinimalHeader />
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
        <MinimalFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white/95 dark:bg-[#000000] transition-colors duration-300">
        <MinimalHeader />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="text-gray-900 dark:text-white text-lg font-medium mb-2">
              Error loading categories
            </p>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white/95 dark:bg-[#000000] relative transition-colors duration-300">
      <MinimalHeader />
      <main className="px-6 md:px-11 md:py-8">
        {/* Header Section */}
        <motion.div
          className="mb-16 flex justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-3xl">
            <motion.div
              className="h-1 w-24 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mb-6"
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center p-2">
                <Folder className="w-8 h-8 text-sky-600 dark:text-sky-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Explore by
                <span className="block bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Categories
                </span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-black dark:text-gray-300 leading-relaxed"
            >
              Browse our comprehensive collection of DevOps articles organized
              by technology stacks, tools, and specialized topics to find
              exactly what you're looking for.
            </motion.p>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <div
          ref={categoriesRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {displayedCategories.map((category, index) => {
            const Icon = getCategoryIcon(category.name);
            const colors = getCategoryColors(category.name);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <Card className="group h-full border border-gray-200 dark:border-gray-700 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 overflow-hidden">
                    <CardContent className="p-6 h-full flex flex-col">
                      {/* Icon and Count */}
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${colors} rounded-2xl flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-gray-900 dark:text-white text-lg">
                              {category.post_count}
                            </span>
                            <span>articles</span>
                          </div>
                        </div>
                      </div>

                      {/* Category Name */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300 line-clamp-2">
                        {category.name}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 flex-grow text-sm">
                        Explore {category.post_count} article
                        {category.post_count !== 1 ? "s" : ""} covering{" "}
                        {category.name.toLowerCase()} concepts, best practices,
                        and tutorials.
                      </p>

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-sky-600 dark:text-sky-400 font-semibold text-sm group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
                          Browse Articles
                        </span>
                        <ChevronRight className="w-4 h-4 text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
        {/* See More/Less Button */}
        {categories.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <button
              onClick={toggleShowAll}
              className="group inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 font-bold hover:scale-105"
            >
              {showAll ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </button>
          </motion.div>
        )}
      </main>
      <MinimalFooter />
    </div>
  );
}
