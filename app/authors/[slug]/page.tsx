"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import {
  Calendar,
  Linkedin,
  Folder,
  ArrowRight,
  Tag as TagIcon,
  Star,
  Eye,
  TrendingUp,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  FileText,
  Crown,
  Clock,
  Users,
  Award,
  BookOpen,
  Zap,
  Target,
  Sparkles,
  MessageSquare, // ADDED: For comments
  Heart, // ADDED: For reactions
  ThumbsUp, // ADDED: For reactions
  Lightbulb, // ADDED: For reactions
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const DEFAULT_PAGE_SIZE = 8;

interface Article {
  id: number;
  slug: string;
  title: string;
  published_at: string;
  read_count: number;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  image_url?: string;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
  comment_count?: number; // ADDED
  reactions_summary?: {
    // ADDED
    like?: number;
    love?: number;
    celebrate?: number;
    insightful?: number;
  };
}

interface Author {
  id: number;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  job_title: string;
  company: string;
  linkedin?: string;
  articles: Article[];
}

export default function AuthorDetailPage() {
  const { slug } = useParams();
  const [author, setAuthor] = useState<Author | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    async function fetchAuthor() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/authors/${slug}/public/`);
        if (!res.ok) throw new Error("Failed to load author details");
        const data = await res.json();

        if (data.articles) {
          // 🔥 ENHANCED: Fetch comments and reactions for each article
          const articlesWithEngagement = await Promise.all(
            data.articles.map(async (article: Article) => {
              try {
                // Fetch comments
                const commentsRes = await fetch(
                  `${API_BASE_URL}/articles/${article.slug}/comments/`
                );

                // Fetch reactions
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
              };
            })
          );

          data.articles = articlesWithEngagement.sort(
            (a: Article, b: Article) =>
              new Date(b.published_at).getTime() -
              new Date(a.published_at).getTime()
          );
        }

        setAuthor(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchAuthor();
  }, [slug]);

  // Calculate advanced stats
  const totalArticles = author?.articles?.length || 0;
  const totalViews =
    author?.articles?.reduce(
      (sum, article) => sum + (article.read_count || 0),
      0
    ) || 0;
  const avgViews =
    totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

  // 🔥 NEW: Calculate total comments and reactions
  const totalComments =
    author?.articles?.reduce(
      (sum, article) => sum + (article.comment_count || 0),
      0
    ) || 0;

  const totalReactions = author?.articles?.reduce((sum, article) => {
    const reactions = article.reactions_summary || {};
    return (
      sum +
      (reactions.like || 0) +
      (reactions.love || 0) +
      (reactions.celebrate || 0) +
      (reactions.insightful || 0)
    );
  }, 0);

  // Calculate average read time across all articles
  const calculateReadTime = (content?: string) => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const totalReadTime =
    author?.articles?.reduce(
      (sum, article) => sum + calculateReadTime(article.content),
      0
    ) || 0;
  const avgReadTime =
    totalArticles > 0 ? Math.round(totalReadTime / totalArticles) : 0;

  // Get author performance tier
  const getAuthorTier = () => {
    if (totalViews > 100000)
      return {
        name: "Elite",
        color: "from-purple-600 to-pink-600",
        icon: Award,
      };
    if (totalViews > 50000)
      return {
        name: "Expert",
        color: "from-amber-500 to-orange-600",
        icon: Zap,
      };
    if (totalViews > 10000)
      return {
        name: "Pro",
        color: "from-emerald-500 to-green-600",
        icon: TrendingUp,
      };
    return { name: "Rising", color: "from-blue-500 to-cyan-600", icon: Users };
  };

  const authorTier = getAuthorTier();
  const TierIcon = authorTier.icon;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Replace the existing stripMarkdown function with this updated version:
  const stripMarkdown = (md?: string) => {
    if (!md) return "";
    let text = md;

    // Remove image markdown patterns: ![alt text](url) and variations
    text = text.replace(/!\[.*?\]\(.*?\)/g, ""); // Regular images
    text = text.replace(/!\[.*?\]\$\$.*?\$\$/g, ""); // Your specific pattern
    text = text.replace(/!\[.*?\]\\$\$.*?\\$\$/g, ""); // Another variation
    text = text.replace(/<img.*?>/g, ""); // HTML images

    // Keep the rest of your existing markdown stripping logic
    text = text.replace(/\[(.*?)\]\\$\$.*?\\$\$/g, "$1");
    text = text.replace(/[*_~`]/g, "");
    text = text.replace(/^#+\s+/gm, "");
    text = text.replace(/^>\s+/gm, "");
    text = text.replace(/^[-+*]\s+/gm, "");
    text = text.replace(/<[^>]+>/g, "");

    // Remove extra whitespace created by removing images
    text = text.replace(/\s+/g, " ");
    return text.trim();
  };

  const truncate = (str: string, max = 150) =>
    str.length <= max ? str : str.slice(0, max) + "...";

  const getCoverImage = (article: Article) => {
    if (article.cover_image && article.cover_image.trim() !== "") {
      return article.cover_image;
    }

    const category = article.category?.name?.toLowerCase() || "";
    let fallback = "/devops.webp";

    if (category.includes("cloud")) fallback = "/cloud.webp";
    if (category.includes("automation")) fallback = "/automation.webp";
    if (category.includes("terraform")) fallback = "/terraform.webp";
    if (category.includes("devsecops") || category.includes("security"))
      fallback = "/security.webp";

    return fallback;
  };

  // Pagination logic
  const totalPages = Math.ceil(totalArticles / pageSize);
  const paginatedArticles =
    author?.articles?.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    ) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300">
        <MinimalHeader />
        <main className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Star className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Author Not Found
            </h1>
            <p className="text-lg text-black dark:text-gray-300 mb-8 max-w-md mx-auto">
              {error}
            </p>
            <Link
              href="/articles"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Browse All Authors
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
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300 relative overflow-x-hidden">
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

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] relative overflow-x-hidden transition-colors duration-300">
      <MinimalHeader />

      <main className="px-4 sm:px-6 md:px-11 md:py-8 relative z-10">
        {/* Author Header - Enhanced Design */}
        <section className="w-full mb-8 md:mb-10">
          {/* Simple Header - Left Aligned */}
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Featured Author
              </span>
            </div>
            <h1 className="text-3xl md:text-7xl font-light text-black dark:text-white md:mb-6 tracking-tight">
              {author?.name}
            </h1>
          </div>

          {/* Author Profile - Left Aligned with Color */}
          <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-12 md:mb-16">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                  <img
                    src={author?.avatar || "/placeholder.svg"}
                    alt={author?.name || "Author"}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {author?.linkedin && (
                  <a
                    href={author.linkedin}
                    className="absolute -bottom-2 -right-2 bg-blue-600 p-1.5 md:p-2 rounded-full hover:scale-110 transition-transform border-2 border-white dark:border-gray-800"
                  >
                    <Linkedin className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </a>
                )}
              </div>
            </div>
            {/* Content Section */}
            <div className="flex-1">
              {/* Title & Company - Updated to conditionally show "at" */}
              <p className="text-base md:text-xl text-blue-600 dark:text-blue-400 font-medium mb-4 md:mb-6">
                {author?.job_title}
                {author?.company &&
                  author.company.trim() !== "" &&
                  ` at ${author.company}`}
              </p>

              {/* Bio */}
              <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed mb-6 md:mb-8 max-w-2xl">
                {author?.bio}
              </p>

              {/* Simple Badges */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                <span className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs md:text-sm font-medium rounded-full shadow-sm">
                  {authorTier.name} Author
                </span>
                <span className="px-3 py-1.5 md:px-4 md:py-2 bg-black dark:bg-gray-700 text-white dark:text-gray-300 text-xs md:text-sm font-medium rounded-full shadow-sm">
                  Verified Author
                </span>
              </div>
            </div>
          </div>

          {/* Stats - Enhanced Positioning */}
          {/* 🔥 UPDATED: Replaced Avg Views with Comments & Reactions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 max-w-4xl mx-auto text-center py-8 md:py-12">
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
                {totalArticles}
              </div>
              <div className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                Articles
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
                {totalViews.toLocaleString()}
              </div>
              <div className="text-xs md:text-sm text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider">
                Total Views
              </div>
            </div>
            {/* 🔥 REPLACED: Avg Views with Comments */}
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
                {totalComments}
              </div>
              <div className="text-xs md:text-sm text-pink-600 dark:text-pink-400 font-semibold uppercase tracking-wider">
                Total Comments
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
                {totalReactions}
              </div>
              <div className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                Total Reactions
              </div>
            </div>
          </div>
        </section>

        {/* Articles Section - Updated for Dark Mode */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700/60 shadow-2xl overflow-hidden mb-12 md:mb-16"
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

          {author?.articles && author.articles.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl">
                <FileText className="w-6 h-6 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 md:mb-4">
                No Articles Yet
              </h3>
              <p className="text-sm md:text-lg text-slate-600 dark:text-gray-400 mb-6 md:mb-8 font-medium max-w-md mx-auto px-4">
                Stay tuned! {author?.name} is preparing amazing content for you.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-200/50 dark:divide-gray-700/50">
                {paginatedArticles.map((article, index) => {
                  const previewText =
                    article.excerpt?.trim() ||
                    truncate(stripMarkdown(article.content), 120) ||
                    "Read the full article to learn more...";

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
                              const category =
                                article.category?.name?.toLowerCase() || "";
                              let fallbackImage = "/devops.webp";
                              if (category.includes("cloud"))
                                fallbackImage = "/cloud.webp";
                              if (category.includes("automation"))
                                fallbackImage = "/automation.webp";
                              if (category.includes("terraform"))
                                fallbackImage = "/terraform.webp";
                              if (category.includes("devsecops"))
                                fallbackImage = "/security.webp";
                              (e.target as HTMLImageElement).src =
                                fallbackImage;
                            }}
                          />
                          <div className="absolute top-2 left-2 md:top-3 md:left-3">
                            {article.category && (
                              <span className="inline-flex items-center gap-1 bg-black/70 dark:bg-gray-800/90 backdrop-blur-sm text-white dark:text-gray-200 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-semibold">
                                <Folder className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                {article.category.name}
                              </span>
                            )}
                          </div>
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
                              {article.read_count?.toLocaleString()} views
                            </span>
                            {/* 🔥 NEW: Comment count */}
                            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                              <MessageSquare className="w-3 h-3 md:w-4 md:h-4 text-pink-600 dark:text-pink-400" />
                              {article.comment_count || 0}
                            </span>
                          </div>

                          {/* Article Title */}
                          <h3 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white mb-2 md:mb-3 line-clamp-2 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                            <Link href={`/articles/${article.slug}`}>
                              {stripMarkdown(article.title)}
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

                          {/* Article Excerpt */}
                          {article.excerpt && (
                            <p className="text-slate-600 dark:text-gray-400 text-sm md:text-lg line-clamp-2 mb-3 md:mb-4 font-medium leading-relaxed">
                              {stripMarkdown(article.excerpt)}
                            </p>
                          )}

                          {/* Tags - Mobile Optimized */}
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-0">
                              {article.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag.id}
                                  className="inline-flex items-center gap-1 bg-slate-100/80 dark:bg-gray-700/80 text-slate-700 dark:text-gray-300 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-medium border border-slate-200/50 dark:border-gray-600/50"
                                >
                                  <TagIcon className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                                  {tag.name}
                                </span>
                              ))}
                              {article.tags.length > 3 && (
                                <span className="inline-flex items-center bg-slate-100/80 dark:bg-gray-700/80 text-slate-600 dark:text-gray-400 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-medium border border-slate-200/50 dark:border-gray-600/50">
                                  +{article.tags.length - 3} more
                                </span>
                              )}
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
