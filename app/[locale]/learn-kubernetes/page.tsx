"use client";

import { useEffect, useState, useRef } from "react";
import {
  Calendar,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Heart,
  Sparkles,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Layers,
  Tag as TagIcon,
} from "lucide-react";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import Link from "next/link";
import { motion } from "framer-motion";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const DEFAULT_PAGE_SIZE = 10;

export default function KubernetesEssentialsSeries() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const topRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  // Calculate read time function
  const calculateReadTime = (content?: string) => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // Extract day/part number from title or slug
  const extractPartNumber = (article: Article): number => {
    const titleMatch = article.title.match(/(?:Part|Day)\s+(\d+)/i);
    if (titleMatch) return parseInt(titleMatch[1]);

    const slugMatch = article.slug.match(/(?:part|day)-?(\d+)/i);
    if (slugMatch) return parseInt(slugMatch[1]);

    return article.id;
  };

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch articles with kubernetes-series tag
        const articlesRes = await fetch(
          `${API_BASE_URL}/articles/?tags__slug=kubernetes-series&ordering=published_at`
        );

        if (!articlesRes.ok) {
          throw new Error(
            `Error ${articlesRes.status}: ${articlesRes.statusText}`
          );
        }

        const articlesData = await articlesRes.json();
        const articlesList = Array.isArray(articlesData)
          ? articlesData
          : articlesData.results || [];

        // Fetch engagement data for each article
        const articlesWithEngagement = await Promise.all(
          articlesList.map(async (article: Article) => {
            try {
              const commentsRes = await fetch(
                `${API_BASE_URL}/articles/${article.slug}/comments/`
              );
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
                part_number: extractPartNumber(article),
              };
            } catch (error) {
              console.error(
                `Failed to fetch engagement for article ${article.slug}:`,
                error
              );
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
                part_number: extractPartNumber(article),
              };
            }
          })
        );

        // Sort articles by part number in DESCENDING order
        const sortedArticles = articlesWithEngagement.sort((a, b) => {
          const partA = extractPartNumber(a);
          const partB = extractPartNumber(b);
          if (partA > partB) return -1;
          if (partA < partB) return 1;
          return (
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime()
          );
        });

        setArticles(sortedArticles);

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
        setError(err.message || "Failed to fetch Kubernetes Series data");
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  // Helper functions
  const getAuthor = (id: number) => authors.find((a) => a.id === id);
  const getTagById = (id: number) => tags.find((t) => t.id === id);
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const stripMarkdown = (md: string) => {
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

  const truncate = (str: string, max = 150) =>
    str.length <= max ? str : str.slice(0, max) + "...";

  const getCoverImage = (article: Article) => {
    if (article.cover_image && article.cover_image.trim() !== "") {
      return article.cover_image;
    }
    return "/kubernetes-logo.png";
  };

  // Calculate series stats
  const totalArticles = articles.length;
  const totalViews = articles.reduce(
    (sum, article) => sum + (article.read_count || 0),
    0
  );
  const totalComments = articles.reduce(
    (sum, article) => sum + (article.comment_count || 0),
    0
  );
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

  // Get clean excerpt for article
  const getCleanExcerpt = (article: Article) => {
    if (article.excerpt?.trim()) {
      return stripMarkdown(article.excerpt);
    }

    if (article.content) {
      const content = article.content;
      const lines = content.split("\n");

      let startIndex = 0;
      const firstLine = lines[0].trim();
      if (
        lines.length > 1 &&
        firstLine.startsWith("#") &&
        stripMarkdown(firstLine).includes(stripMarkdown(article.title))
      ) {
        startIndex = 1;
      }

      const contentWithoutFirstHeading = lines.slice(startIndex).join("\n");
      const cleanContent = stripMarkdown(contentWithoutFirstHeading);
      return (
        truncate(cleanContent, 120) ||
        "Explore this Kubernetes essentials article to master container orchestration..."
      );
    }

    return "Explore this Kubernetes essentials article to master container orchestration...";
  };

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
        <main className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Layers className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Series Not Found
            </h1>
            <p className="text-lg text-black dark:text-gray-300 mb-8 max-w-md mx-auto">
              {error}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Return Home
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300 relative">
        <MinimalHeader />
        <main className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-blue-300/50 dark:border-blue-800/30 animate-spin">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center p-2">
                    <Layers className="w-16 h-16 text-blue-700 dark:text-blue-500 animate-pulse" />
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
    <div className="min-h-screen bg-white dark:bg-[#000000] relative transition-colors duration-300">
      <MinimalHeader />

      <main className="px-4 sm:px-6 md:px-11 md:py-10 pb-8 relative z-10">
        {/* Series Header - Navy Blue Theme */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full mb-12 md:mb-16"
        >
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-700 to-indigo-800"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-700 dark:text-blue-500 uppercase tracking-wide">
                Kubernetes Essentials Series
              </span>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-8 mb-6 md:mb-8">
              {/* Kubernetes Logo with Navy Blue Theme */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden bg-white p-1">
                  <div className="w-full h-full rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                      <Layers className="w-12 h-12 md:w-16 md:h-16 text-blue-700 dark:text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title and Description */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-6xl font-light text-black dark:text-white mb-4 md:mb-6 tracking-tight">
                  Kubernetes Essentials Series
                </h1>
                <p className="text-base md:text-xl text-black dark:text-gray-300 leading-relaxed max-w-3xl">
                  Master Kubernetes container orchestration from the ground up.
                  A structured series covering pods, deployments, services,
                  networking, storage, security, and advanced orchestration
                  through practical examples and production-ready scenarios.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards - Navy Blue Theme */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 max-w-4xl mx-auto md:py-10">
            {/* Article Count */}
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-4xl font-light text-black dark:text-white mb-1">
                {totalArticles}
              </div>
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-500">
                Articles
              </div>
            </div>

            {/* Total Views */}
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-4xl font-light text-black dark:text-white mb-1">
                {totalViews.toLocaleString()}
              </div>
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-500">
                Total Views
              </div>
            </div>

            {/* Total Comments */}
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-4xl font-light text-black dark:text-white mb-1">
                {totalComments}
              </div>
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wide text-pink-600 dark:text-pink-400">
                Total Comments
              </div>
            </div>

            {/* Total Reactions */}
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-4xl font-light text-black dark:text-white mb-1">
                {totalReactions}
              </div>
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                Total Reactions
              </div>
            </div>
          </div>
        </motion.section>

        {/* Series Articles Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700/60 shadow-2xl overflow-hidden"
        >
          <div className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
              <div>
                <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1 md:mb-2">
                  Kubernetes Series Articles
                </h2>
                <p className="text-xs md:text-base text-slate-600 dark:text-gray-400 font-medium">
                  {totalArticles} articles published •{" "}
                  {totalViews.toLocaleString()} total reads
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs md:text-sm text-slate-500 dark:text-gray-500 font-medium">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl">
                <FileText className="w-6 h-6 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 md:mb-4">
                Series Starting Soon!
              </h3>
              <p className="text-sm md:text-lg text-slate-600 dark:text-gray-400 mb-6 md:mb-8 font-medium max-w-md mx-auto px-4">
                The Kubernetes Essentials Series is being prepared. Check back soon
                for the first article!
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-200/50 dark:divide-gray-700/50">
                {paginatedArticles.map((article, index) => {
                  const partNumber = (article as any).part_number;
                  const previewText = getCleanExcerpt(article);
                  const author = getAuthor(article.author);
                  const coverImage = getCoverImage(article);
                  const readTime = calculateReadTime(article.content);
                  const reactions = article.reactions_summary || {};
                  const articleTags = article.tags
                    .map((tagId) => getTagById(tagId))
                    .filter((tag) => tag !== undefined);

                  return (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 md:p-8 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 group border-b border-slate-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex flex-col gap-4 md:gap-8 md:flex-row items-start">
                        <div className="flex-shrink-0 w-full md:w-32 h-37 md:h-32 rounded-xl md:rounded-2xl overflow-hidden border border-slate-200/50 dark:border-gray-600 shadow-lg group-hover:shadow-xl transition-all duration-300 relative">
                          <img
                            src={coverImage}
                            alt={`Part ${partNumber}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 md:top-3 md:left-3">
                            <span className="inline-flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-semibold">
                              <FileText className="w-2.5 h-2.5 md:w-3 md:h-3" />
                              Part {partNumber}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 w-full">
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
                              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-700" />
                              {article.read_count?.toLocaleString() || "0"}{" "}
                              views
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                              <MessageSquare className="w-3 h-3 md:w-4 md:h-4 text-pink-600 dark:text-pink-400" />
                              {article.comment_count || 0}
                            </span>
                          </div>

                          <h3 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white mb-2 md:mb-3 line-clamp-2 group-hover:text-blue-800 dark:group-hover:text-blue-500 transition-colors">
                            <Link href={`/articles/${article.slug}`}>
                              {article.title}
                            </Link>
                          </h3>

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

                          <div className="mb-3 md:mb-4">
                            <p className="text-black dark:text-gray-400 text-sm md:text-lg leading-relaxed line-clamp-2 md:line-clamp-3 font-medium">
                              {previewText}
                            </p>
                          </div>

                          {articleTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-0">
                              {articleTags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag!.id}
                                  className="inline-flex items-center gap-1 bg-slate-100/80 dark:bg-gray-700 text-slate-700 dark:text-gray-300 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-medium border border-slate-200/50 dark:border-gray-600"
                                >
                                  <TagIcon className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                                  {tag!.name}
                                </span>
                              ))}
                              {articleTags.length > 3 && (
                                <span className="inline-flex items-center bg-slate-100/80 dark:bg-gray-700 text-slate-600 dark:text-gray-400 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-medium border border-slate-200/50 dark:border-gray-600">
                                  +{articleTags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          {author && (
                            <div className="flex items-center gap-2 md:gap-3 mt-4">
                              <div className="flex items-center gap-1 md:gap-2 text-slate-700 dark:text-gray-300 font-medium">
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-blue-700 to-indigo-800 p-0.5">
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
                                  className="hover:text-blue-700 dark:hover:text-blue-500 transition-colors text-xs md:text-sm"
                                >
                                  {author.name}
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center w-full md:w-auto justify-end md:justify-start">
                          <Link
                            href={`/articles/${article.slug}`}
                            className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-105 group/btn text-sm md:text-base w-full md:w-auto justify-center"
                          >
                            Read More
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="px-4 py-4 md:px-8 md:py-6 border-t border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs md:text-sm text-slate-600 dark:text-gray-400 font-medium text-center sm:text-left">
                      Showing {paginatedArticles.length} of {totalArticles}{" "}
                      articles
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
                                    ? "bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md"
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