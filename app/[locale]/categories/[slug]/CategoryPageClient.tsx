"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Tag as TagIcon,
  Search,
} from "lucide-react";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import Link from "next/link";
import { motion } from "framer-motion";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  published_at: string;
  read_count: number;
  cover_image?: string;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  author: {
    id: number;
    slug: string;
    name: string;
    avatar?: string;
  } | null;
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
  comment_count?: number;
  reactions_summary?: {
    like?: number;
    love?: number;
    celebrate?: number;
    insightful?: number;
  };
}

interface ApiResponse {
  category: Category;
  articles: Article[];
  stats: {
    total_articles: number;
    total_views: number;
    total_comments: number;
    total_reactions: number;
    total_authors: number;
    avg_read_time: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const DEFAULT_PAGE_SIZE = 8;

export default function CategoryPageClient() {
  const { slug } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState({
    total_articles: 0,
    total_views: 0,
    total_comments: 0,
    total_reactions: 0,
    total_authors: 0,
    avg_read_time: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);
        setError(null);

        // Use the optimized endpoint - single API call
        const res = await fetch(`${API_BASE_URL}/categories/${slug}/public/`);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Category not found");
          }
          throw new Error("Failed to load category");
        }

        const data: ApiResponse = await res.json();

        console.log("API Response:", data); // Debug log

        // Set category data
        setCategory(data.category);

        // Set articles - sort by published date
        const sortedArticles = [...(data.articles || [])].sort(
          (a, b) =>
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime()
        );
        setArticles(sortedArticles);

        // Set stats
        setStats(
          data.stats || {
            total_articles: sortedArticles.length,
            total_views: sortedArticles.reduce(
              (sum, a) => sum + (a.read_count || 0),
              0
            ),
            total_comments: sortedArticles.reduce(
              (sum, a) => sum + (a.comment_count || 0),
              0
            ),
            total_reactions: sortedArticles.reduce((sum, a) => {
              const reactions = a.reactions_summary || {};
              return (
                sum +
                (reactions.like || 0) +
                (reactions.love || 0) +
                (reactions.celebrate || 0) +
                (reactions.insightful || 0)
              );
            }, 0),
            total_authors: new Set(
              sortedArticles.map((a) => a.author?.id).filter(Boolean)
            ).size,
            avg_read_time: Math.round(
              sortedArticles.reduce((sum, a) => {
                const words = a.content ? a.content.split(/\s+/).length : 0;
                return sum + Math.max(1, Math.ceil(words / 200));
              }, 0) / (sortedArticles.length || 1)
            ),
          }
        );
      } catch (err) {
        console.error("Error fetching category:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchCategory();
  }, [slug]);

  // Helper functions
  const calculateReadTime = (content?: string) => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

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

  const stripMarkdown = (md?: string) => {
    if (!md) return "";
    let text = md;
    text = text.replace(/^#{1,6}\s+/gm, "");
    text = text.replace(/```[\s\S]*?```/g, "");
    text = text.replace(/`([^`]*)`/g, "$1");
    text = text.replace(/!\[.*?\]\$\$.*?\$\$/g, "");
    text = text.replace(/!\[.*?\]\(.*?\)/g, "");
    text = text.replace(/\[(.*?)\]\\$\$.*?\\$\$/g, "$1");
    text = text.replace(/\[(.*?)\]\(.*?\)/g, "$1");
    text = text.replace(/[*_~>/\\-]/g, "");
    text = text.replace(/^\s*[-*+]\s+/gm, "");
    text = text.replace(/^\s*\d+\.\s+/gm, "");
    text = text.replace(/<[^>]+>/g, "");
    text = text.replace(/^>\s+/gm, "");
    text = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
    return text;
  };

  const getCoverImage = (article: Article) => {
    if (article.cover_image && article.cover_image.trim() !== "") {
      return article.cover_image;
    }

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

  const getCleanExcerpt = (article: Article) => {
    if (article.excerpt?.trim()) {
      return stripMarkdown(article.excerpt);
    }

    if (article.content) {
      const cleanContent = stripMarkdown(article.content);
      return cleanContent.length > 150
        ? cleanContent.slice(0, 150) + "..."
        : cleanContent;
    }

    return "Read the full article to learn more...";
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Pagination
  const totalPages = Math.ceil(stats.total_articles / pageSize);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const CategoryIcon = category ? getCategoryIcon(category.name) : Wrench;
  const categoryGradient = category
    ? getCategoryGradient(category.name)
    : "from-slate-500 to-slate-600";

  // Loading state (same as your author page)
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300 relative">
        <MinimalHeader />
        <main className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-blue-200/50 dark:border-blue-800/30 animate-spin">
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

  // Error state
  if (error || !category) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300">
        <MinimalHeader />
        <main className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Star className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Category Not Found
            </h1>
            <p className="text-lg text-black dark:text-gray-300 mb-8 max-w-md mx-auto">
              {error || "The category could not be loaded."}
            </p>
            <Link
              href="/articles"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Browse All Articles
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] relative transition-colors duration-300">
      <MinimalHeader />

      <main className="px-4 sm:px-6 md:px-11 md:py-8 relative z-10">
        {/* Category Header - Same design as author page */}
        <section className="w-full mb-8 md:mb-10">
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Category
              </span>
            </div>
            <h1 className="text-3xl md:text-7xl font-light text-black dark:text-white md:mb-6 tracking-tight">
              Articles in the {category.name} Category
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-12 md:mb-16">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <CategoryIcon className="w-12 h-12 md:w-14 md:h-14 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed mb-6 md:mb-8 max-w-2xl">
                Explore all articles in the {category.name} category. Stay
                updated with the latest insights, tutorials, and best practices.
              </p>

              <div className="flex flex-wrap gap-2 md:gap-3">
                <span
                  className={`px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r ${categoryGradient} text-white text-xs md:text-sm font-medium rounded-full shadow-sm`}
                >
                  {stats.total_articles} Related Articles
                </span>
                <span className="px-3 py-1.5 md:px-4 md:py-2 bg-black dark:bg-gray-700 text-white dark:text-gray-300 text-xs md:text-sm font-medium rounded-full shadow-sm">
                  {stats.total_authors} Related Authors
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid - Matches author detail page spacing */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 max-w-4xl mx-auto text-center py-8 md:py-12">
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
                {stats.total_articles}
              </div>
              <div className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                Articles
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
                {stats.total_views.toLocaleString()}
              </div>
              <div className="text-xs md:text-sm text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider">
                Total Views
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
                {stats.total_comments}
              </div>
              <div className="text-xs md:text-sm text-pink-600 dark:text-pink-400 font-semibold uppercase tracking-wider">
                Total Comments
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
                {stats.total_reactions}
              </div>
              <div className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                Total Reactions
              </div>
            </div>
          </div>
        </section>

        {/* Articles Section - Same design as author page */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl overflow-hidden mb-12 md:mb-16"
        >
          <div className="px-4 py-4 md:px-8 md:py-6 border-b border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
              <div>
                <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1 md:mb-2">
                  Latest Articles
                </h2>
                <p className="text-xs md:text-base text-slate-600 dark:text-gray-400 font-medium">
                  {stats.total_articles} articles •{" "}
                  {stats.total_views.toLocaleString()} reads
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
                Stay tuned! We're preparing amazing {category.name} content for
                you.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-200/50 dark:divide-gray-700">
                {paginatedArticles.map((article, index) => {
                  const previewText = getCleanExcerpt(article);
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
                        {/* Cover Image with Category Badge */}
                        <div className="flex-shrink-0 w-full md:w-32 h-24 md:h-32 rounded-xl md:rounded-2xl overflow-hidden border border-slate-200/50 dark:border-gray-600 shadow-lg group-hover:shadow-xl transition-all duration-300 relative">
                          <img
                            src={coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 md:top-3 md:left-3">
                            {article.category && (
                              <span className="inline-flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-semibold">
                                <Folder className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                {article.category.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Article Info */}
                        <div className="flex-1 min-w-0 w-full">
                          {/* Metadata */}
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
                              <Search className="w-3 h-3 md:w-4 md:h-4 text-sky-600 dark:text-sky-400" />
                              {article.read_count?.toLocaleString()} views
                            </span>
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

                          {/* Author */}
                          {article.author && (
                            <div className="flex items-center gap-2 mb-2 md:mb-3">
                              <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 p-0.5">
                                  <img
                                    src={
                                      article.author.avatar ||
                                      "/placeholder.svg"
                                    }
                                    alt={article.author.name}
                                    className="w-full h-full rounded-full object-cover border border-white dark:border-gray-800"
                                  />
                                </div>
                                <Link
                                  href={`/authors/${article.author.slug}`}
                                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                                >
                                  {article.author.name}
                                </Link>
                              </div>
                            </div>
                          )}

                          {/* Reactions */}
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

                          {/* Excerpt */}
                          <p className="text-black dark:text-gray-400 text-sm md:text-lg line-clamp-2 mb-3 md:mb-4 font-medium leading-relaxed">
                            {previewText}
                          </p>

                          {/* Tags */}
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-0">
                              {article.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag.id}
                                  className="inline-flex items-center gap-1 bg-slate-100/80 dark:bg-gray-700 text-slate-700 dark:text-gray-300 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-medium border border-slate-200/50 dark:border-gray-600"
                                >
                                  <TagIcon className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                                  {tag.name}
                                </span>
                              ))}
                              {article.tags.length > 3 && (
                                <span className="inline-flex items-center bg-slate-100/80 dark:bg-gray-700 text-slate-600 dark:text-gray-400 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-medium border border-slate-200/50 dark:border-gray-600">
                                  +{article.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Read More Button */}
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

              {/* Pagination - Same as author page */}
              {totalPages > 1 && (
                <div className="px-4 py-4 md:px-8 md:py-6 border-t border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs md:text-sm text-slate-600 dark:text-gray-400 font-medium text-center sm:text-left">
                      Showing {paginatedArticles.length} of{" "}
                      {stats.total_articles} articles
                    </div>

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

                      {/* Page Numbers */}
                      <div className="hidden xs:flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(3, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 3) pageNum = i + 1;
                            else if (currentPage <= 2) pageNum = i + 1;
                            else if (currentPage >= totalPages - 1)
                              pageNum = totalPages - 2 + i;
                            else pageNum = currentPage - 1 + i;

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
