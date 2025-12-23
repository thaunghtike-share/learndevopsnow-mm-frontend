"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ArrowRight,
  Eye,
  Star,
  TrendingUp,
  Code,
  Cloud,
  Shield,
  Container,
  Wrench,
  ToolCase,
  Folder,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  BookOpen,
  FileText,
  MessageSquare,
  Heart,
  ThumbsUp,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: number;
  name: string;
  slug: string;
  post_count?: number;
}

interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  published_at: string;
  category: number | null;
  tags: number[];
  author: number;
  read_count?: number;
  cover_image?: string;
  comment_count?: number;
  reactions_summary?: {
    like?: number;
    love?: number;
    celebrate?: number;
    insightful?: number;
  };
}

interface Author {
  id: number;
  slug: string;
  name: string;
  avatar?: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  slug: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const DEFAULT_PAGE_SIZE = 8;

export default function CategoryPageClient({ slug }: Props) {
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const router = useRouter();
  const topRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  // Calculate read time function
  const calculateReadTime = (content?: string) => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // Get category icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();

    if (name.includes("kubernetes")) {
      return Container;
    } else if (name.includes("cicd") || name.includes("ci/cd")) {
      return Container;
    } else if (name.includes("python")) {
      return Code;
    } else if (name.includes("terraform")) {
      return Code;
    } else if (name.includes("cloud")) {
      return Cloud;
    } else if (name.includes("devops")) {
      return ToolCase;
    } else if (name.includes("devsecops")) {
      return Shield;
    } else {
      return Wrench;
    }
  };

  // Get category gradient colors
  const getCategoryGradient = (categoryName: string) => {
    const name = categoryName.toLowerCase();

    if (name.includes("kubernetes")) {
      return "from-blue-500 to-cyan-600";
    } else if (name.includes("cicd") || name.includes("ci/cd")) {
      return "from-green-500 to-emerald-600";
    } else if (name.includes("python")) {
      return "from-yellow-500 to-amber-600";
    } else if (name.includes("terraform")) {
      return "from-purple-500 to-pink-600";
    } else if (name.includes("cloud")) {
      return "from-sky-500 to-blue-600";
    } else if (name.includes("devops")) {
      return "from-orange-500 to-red-600";
    } else if (name.includes("devsecops")) {
      return "from-red-500 to-rose-600";
    } else {
      return "from-gray-500 to-gray-600";
    }
  };

  // Fetch data on slug change
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch category
        const categoryRes = await fetch(`${API_BASE_URL}/categories/${slug}/`);
        if (!categoryRes.ok)
          throw new Error(
            `Error ${categoryRes.status}: ${categoryRes.statusText}`
          );
        const categoryData = await categoryRes.json();
        setCategory(categoryData);

        // Fetch articles by category slug
        const articlesRes = await fetch(
          `${API_BASE_URL}/articles/?category__slug=${slug}`
        );
        const articlesData = await articlesRes.json();
        const articlesList = Array.isArray(articlesData)
          ? articlesData
          : articlesData.results || [];

        // 🔥 ENHANCED: Fetch comment counts AND reactions for each article
        const articlesWithEngagement = await Promise.all(
          articlesList.map(async (article: Article) => {
            try {
              // Fetch comments
              const commentsRes = await fetch(
                `${API_BASE_URL}/articles/${article.slug}/comments/`
              );

              // 🔥 NEW: Fetch reactions
              const reactionsRes = await fetch(
                `${API_BASE_URL}/articles/${article.slug}/reactions/`
              );

              let comment_count = 0;
              let reactions_summary = {
                like: 0,
                love: 0,
                celebrate: 0,
                insightful: 0,
              };

              if (commentsRes.ok) {
                const commentsData = await commentsRes.json();
                // Count all comments (including replies)
                comment_count = commentsData.reduce(
                  (total: number, comment: any) => {
                    return total + 1 + (comment.replies?.length || 0);
                  },
                  0
                );
              }

              if (reactionsRes.ok) {
                const reactionsData = await reactionsRes.json();
                reactions_summary = {
                  like: reactionsData.summary?.like || 0,
                  love: reactionsData.summary?.love || 0,
                  celebrate: reactionsData.summary?.celebrate || 0,
                  insightful: reactionsData.summary?.insightful || 0,
                };
              }

              return {
                ...article,
                comment_count,
                reactions_summary,
                read_time: calculateReadTime(article.content),
              };
            } catch (error) {
              console.error(
                `Failed to fetch engagement for article ${article.slug}:`,
                error
              );
            }

            // Fallback if fetch fails
            return {
              ...article,
              comment_count: 0,
              reactions_summary: {
                like: 0,
                love: 0,
                celebrate: 0,
                insightful: 0,
              },
              read_time: calculateReadTime(article.content),
            };
          })
        );

        setArticles(articlesWithEngagement);

        // Fetch authors
        const authorsRes = await fetch(`${API_BASE_URL}/authors/`);
        const authorsData = await authorsRes.json();
        const authorsList = Array.isArray(authorsData)
          ? authorsData
          : authorsData.results || [];
        setAuthors(authorsList);

        // Fetch tags
        const tagsRes = await fetch(`${API_BASE_URL}/tags/`);
        const tagsData = await tagsRes.json();
        setTags(Array.isArray(tagsData) ? tagsData : tagsData.results || []);

        setLoading(false);
        setCurrentPage(1);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  // Scroll to top on page change (not on first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  // Helpers
  const getAuthor = (id: number) => authors.find((a) => a.id === id);
  const getTagById = (id: number) => tags.find((t) => t.id === id);
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const stripMarkdown = (md: string) =>
    md
      .replace(/<[^>]+>/g, "")
      .replace(/[#_*>[\]~`-]/g, "")
      .trim();
  const truncate = (str: string, max = 150) =>
    str.length <= max ? str : str.slice(0, max) + "...";

  // Get cover image URL
  const getCoverImage = (article: Article) => {
    if (article.cover_image && article.cover_image.trim() !== "") {
      return article.cover_image;
    }

    // Fallback based on category
    const categoryName = category?.name?.toLowerCase() || "";
    if (categoryName.includes("kubernetes")) {
      return "/kubernetes.webp";
    } else if (
      categoryName.includes("cicd") ||
      categoryName.includes("ci/cd")
    ) {
      return "/cicd.webp";
    } else if (categoryName.includes("python")) {
      return "/python.webp";
    } else if (categoryName.includes("terraform")) {
      return "/terraform.webp";
    } else if (categoryName.includes("cloud")) {
      return "/cloud.webp";
    } else if (categoryName.includes("devops")) {
      return "/devops.webp";
    } else if (categoryName.includes("devsecops")) {
      return "/security.webp";
    }

    return "/devops.webp";
  };

  // Check if article has a real cover image
  const hasRealCoverImage = (article: Article) => {
    return !!(article.cover_image && article.cover_image.trim() !== "");
  };

  // Calculate stats
  const totalArticles = articles.length;
  const totalViews = articles.reduce(
    (sum, article) => sum + (article.read_count || 0),
    0
  );
  const avgViews =
    totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

  // Calculate total comments
  const totalComments = articles.reduce(
    (sum, article) => sum + (article.comment_count || 0),
    0
  );

  // 🔥 NEW: Calculate total reactions
  const totalReactions = articles.reduce((sum, article) => {
    const reactions = article.reactions_summary || {};
    return (
      sum +
      (reactions.like || 0) +
      (reactions.love || 0) +
      (reactions.celebrate || 0) +
      (reactions.insightful || 0)
    );
  }, 0);

  // Get unique authors in this category
  const uniqueAuthors = new Set(articles.map((article) => article.author));
  const totalAuthors = uniqueAuthors.size;

  // Calculate total read time
  const totalReadTime = articles.reduce(
    (sum, article) => sum + calculateReadTime(article.content),
    0
  );
  const avgReadTime =
    totalArticles > 0 ? Math.round(totalReadTime / totalArticles) : 0;

  // Pagination logic
  const totalPages = Math.ceil(totalArticles / pageSize);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300">
        <MinimalHeader />
        <main className="px-6 md:px-11 py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Category Not Found
            </h1>
            <p className="text-lg text-black dark:text-gray-300 mb-8 max-w-md mx-auto">
              {error}
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Browse All Categories
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  // Loading state
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
                  <div className="w-32 h-32 rounded-full border-4 border-blue-200/50 dark:border-blue-800/30 border-t-blue-500 dark:border-t-blue-400 animate-spin">
                    <img
                      src="/logo.png"
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

  const CategoryIcon = category ? getCategoryIcon(category.name) : Wrench;
  const categoryGradient = category
    ? getCategoryGradient(category.name)
    : "from-slate-500 to-slate-600";

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] relative overflow-hidden transition-colors duration-300">
      <MinimalHeader />

      <main className="px-4 sm:px-6 md:px-11 md:py-8 relative z-10">
        {/* Category Header - Premium Design */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full mb-12 md:mb-16"
        >
          {/* Simple Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Category
              </span>
            </div>
            <h1 className="text-3xl md:text-7xl font-light text-black dark:text-white md:mb-6 tracking-tight">
              {category?.name}
            </h1>
          </div>

          {/* Category Profile */}
          <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-12 md:mb-10">
            {/* Icon Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <CategoryIcon className="w-8 h-8 md:w-12 md:h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1">
              {/* Description */}
              <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed mb-6 md:mb-8 max-w-2xl">
                Explore all articles in the {category?.name} category. Stay
                updated with the latest insights, tutorials, and best practices.
              </p>

              {/* Simple Badges */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                <span className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs md:text-sm font-medium rounded-full shadow-sm">
                  {totalArticles} Related Articles
                </span>
                <span className="px-3 py-1.5 md:px-4 md:py-2 bg-black dark:bg-gray-700 text-white dark:text-gray-300 text-xs md:text-sm font-medium rounded-full shadow-sm">
                  {totalAuthors} Related Authors
                </span>
              </div>
            </div>
          </div>

          {/* Stats - Premium Design */}
          {/* 🔥 UPDATED: Added comments AND reactions stats */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 md:gap-8 max-w-6xl mx-auto text-center py-8 md:py-12">
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-4xl font-light text-black dark:text-white">
                {totalArticles}
              </div>
              <div className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                Articles
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-4xl font-light text-black dark:text-white">
                {totalViews.toLocaleString()}
              </div>
              <div className="text-xs md:text-sm text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider">
                Total Views
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-4xl font-light text-black dark:text-white">
                {avgReadTime}m
              </div>
              <div className="text-xs md:text-sm text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider">
                Avg Read Time
              </div>
            </div>
            {/* Comments Stat */}
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-4xl font-light text-black dark:text-white">
                {totalComments}
              </div>
              <div className="text-xs md:text-sm text-pink-600 dark:text-pink-400 font-semibold uppercase tracking-wider">
                Total Comments
              </div>
            </div>
            {/* 🔥 NEW: Reactions Stat */}
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-4xl font-light text-black dark:text-white">
                {totalReactions}
              </div>
              <div className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                Total Reactions
              </div>
            </div>
          </div>
        </motion.section>

        {/* Articles Section - Premium Design */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700/60 shadow-2xl overflow-hidden mb-10"
        >
          <div className="px-4 py-4 md:px-8 md:py-6 border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
              <div>
                <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1 md:mb-2">
                  Latest Articles
                </h2>
                <p className="text-xs md:text-base text-slate-600 dark:text-gray-400 font-medium">
                  {totalArticles} articles • {totalViews.toLocaleString()} reads
                </p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-xs md:text-sm text-slate-500 dark:text-gray-500 font-medium">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl">
                <FileText className="w-6 h-6 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 md:mb-4">
                No Articles Yet
              </h3>
              <p className="text-sm md:text-lg text-slate-600 dark:text-gray-400 mb-6 md:mb-8 font-medium max-w-md mx-auto px-4">
                Stay tuned! We're preparing amazing {category?.name} content for
                you.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-200/50 dark:divide-gray-700/50">
                {paginatedArticles.map((article, index) => {
                  // Use excerpt if available, otherwise strip markdown from content and truncate
                  const previewText =
                    article.excerpt?.trim() ||
                    truncate(stripMarkdown(article.content || ""), 150) ||
                    "Discover insights and best practices in this comprehensive article...";

                  const author = getAuthor(article.author);
                  const coverImage = getCoverImage(article);
                  const readTime = calculateReadTime(article.content);
                  const reactions = article.reactions_summary || {};

                  return (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 md:p-8 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 group border-b border-slate-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex flex-col gap-4 md:gap-8 md:flex-row items-start">
                        {/* Article Cover - Mobile Optimized */}
                        <div className="flex-shrink-0 w-full md:w-32 h-24 md:h-32 rounded-xl md:rounded-2xl overflow-hidden border border-slate-200/50 dark:border-gray-600/50 shadow-lg group-hover:shadow-xl transition-all duration-300 relative">
                          <img
                            src={coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              console.log(
                                `Image failed to load: ${coverImage}`
                              );
                              // Fallback to category-based image
                              const categoryName =
                                category?.name?.toLowerCase() || "";
                              let fallbackImage = "/devops.webp";
                              if (categoryName.includes("kubernetes"))
                                fallbackImage = "/kubernetes.webp";
                              if (
                                categoryName.includes("cicd") ||
                                categoryName.includes("ci/cd")
                              )
                                fallbackImage = "/cicd.webp";
                              if (categoryName.includes("python"))
                                fallbackImage = "/python.webp";
                              if (categoryName.includes("terraform"))
                                fallbackImage = "/terraform.webp";
                              if (categoryName.includes("cloud"))
                                fallbackImage = "/cloud.webp";
                              if (categoryName.includes("devops"))
                                fallbackImage = "/devops.webp";
                              if (categoryName.includes("devsecops"))
                                fallbackImage = "/security.webp";
                              (e.target as HTMLImageElement).src =
                                fallbackImage;
                            }}
                          />
                        </div>

                        {/* Article Info - Mobile Optimized */}
                        <div className="flex-1 min-w-0 w-full">
                          {/* Article Metadata - Stacked on Mobile */}
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2 md:mb-3">
                            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-slate-500 dark:text-gray-500" />
                              {formatDate(article.published_at)}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                              <Clock className="w-3 h-3 md:w-4 md:h-4 text-slate-500 dark:text-gray-500" />
                              {readTime} min read
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                              <Eye className="w-3 h-3 md:w-4 md:h-4 text-sky-600 dark:text-sky-400" />
                              {article.read_count?.toLocaleString() || "0"}{" "}
                              views
                            </span>
                            {/* Comment count for each article */}
                            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                              <MessageSquare className="w-3 h-3 md:w-4 md:h-4 text-pink-600 dark:text-pink-400" />
                              {article.comment_count || 0}
                            </span>
                          </div>

                          {/* Article Title */}
                          <h3 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white mb-2 md:mb-3 line-clamp-2 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                            <Link href={`/articles/${article.slug}`}>
                              {article.title}
                            </Link>
                          </h3>

                          {/* 🔥 NEW: Reactions for each article - Mobile Optimized */}
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-4">
                            {(reactions.like ?? 0) > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium">
                                <ThumbsUp className="w-3 h-3 md:w-4 md:h-4" />
                                {reactions.like}
                              </span>
                            )}
                            {(reactions.love ?? 0) > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs md:text-sm text-red-500 dark:text-red-400 font-medium">
                                <Heart className="w-3 h-3 md:w-4 md:h-4" />
                                {reactions.love}
                              </span>
                            )}
                            {(reactions.celebrate ?? 0) > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs md:text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                                {reactions.celebrate}
                              </span>
                            )}
                            {(reactions.insightful ?? 0) > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs md:text-sm text-green-600 dark:text-green-400 font-medium">
                                <Lightbulb className="w-3 h-3 md:w-4 md:h-4" />
                                {reactions.insightful}
                              </span>
                            )}
                          </div>

                          {/* Article Excerpt/Content Preview */}
                          <div className="mb-3 md:mb-4">
                            <p className="text-slate-600 dark:text-gray-400 text-sm md:text-lg leading-relaxed line-clamp-2 md:line-clamp-3 font-medium">
                              {previewText}
                            </p>

                            {/* Show content length indicator */}
                            {article.content && (
                              <div className="mt-2 flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-gray-500">
                                <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
                                <span>
                                  {article.content
                                    .split(/\s+/)
                                    .length.toLocaleString()}{" "}
                                  words
                                  {article.content.length > 5000 &&
                                    " • Comprehensive guide"}
                                  {article.content.length > 10000 &&
                                    " • In-depth tutorial"}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Author Info */}
                          {author && (
                            <div className="flex items-center gap-3 mb-3 md:mb-4">
                              <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300 font-medium">
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 p-0.5">
                                  <img
                                    src={author.avatar || "/placeholder.svg"}
                                    alt={author.name}
                                    className="w-full h-full rounded-full object-cover border border-white dark:border-gray-800"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/placeholder.svg";
                                    }}
                                  />
                                </div>
                                <Link
                                  href={`/authors/${author.slug}`}
                                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-xs md:text-sm"
                                >
                                  {author.name}
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Read More Button - Mobile Optimized */}
                        <div className="flex items-center w-full md:w-auto justify-end md:justify-start">
                          <Link
                            href={`/articles/${article.slug}`}
                            className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-105 group/btn text-sm md:text-base w-full md:w-auto justify-center"
                          >
                            Read Article
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination Controls - Mobile Optimized */}
              {totalPages > 1 && (
                <div className="px-4 py-4 md:px-8 md:py-6 border-t border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs md:text-sm text-slate-600 dark:text-gray-400 font-medium text-center sm:text-left">
                      Showing {paginatedArticles.length} of {totalArticles}{" "}
                      articles
                    </div>

                    {/* Mobile: Simple Previous/Next */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-slate-300 dark:border-gray-600 text-xs md:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md text-slate-700 dark:text-gray-300 flex-1 sm:flex-none justify-center"
                      >
                        <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden xs:inline">Previous</span>
                      </button>

                      {/* Page Numbers - Hidden on very small screens */}
                      <div className="hidden xs:flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(3, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage <= 2) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 1) {
                              pageNum = totalPages - 2 + i;
                            } else {
                              pageNum = currentPage - 1 + i;
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all shadow-sm ${
                                  currentPage === pageNum
                                    ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md"
                                    : "border border-slate-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 backdrop-blur-sm"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-slate-300 dark:border-gray-600 text-xs md:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md text-slate-700 dark:text-gray-300 flex-1 sm:flex-none justify-center"
                      >
                        <span className="hidden xs:inline">Next</span>
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>

                    {/* Mobile Page Indicator - Only show on very small screens */}
                    <div className="xs:hidden text-xs text-slate-500 dark:text-gray-500 font-medium text-center">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.section>
      </main>

      <MinimalFooter />
    </div>
  );
}
