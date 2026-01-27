"use client";
import { motion } from "framer-motion";
import {
  Bookmark, TagIcon, Folder,
  ArrowRight,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SavedArticle {
  id: number;
  article: {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    cover_image?: string;
    published_at: string;
    author_name: string;
    author_slug: string;
    read_time: number;
    read_count: number;
    comment_count?: number;
    reactions_summary?: {
      like?: number;
      love?: number;
      celebrate?: number;
      insightful?: number;
    };
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
    author_avatar?: string;
  };
  saved_at: string;
  notes?: string;
}

interface SavedPostsSectionProps {
  savedArticles: SavedArticle[];
  savedLoading: boolean;
  onUnsaveArticle: (articleId: number) => Promise<void>;
  unsavingId: number | null;
}

const ITEMS_PER_PAGE = 10;

export default function SavedPostsSection({
  savedArticles,
  savedLoading,
  onUnsaveArticle,
  unsavingId,
}: SavedPostsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getCoverImage = (article: SavedArticle["article"]) => {
    if (article.cover_image && article.cover_image.trim() !== "") {
      return article.cover_image;
    }
    const category = article.category?.name?.toLowerCase() || "";
    if (category.includes("cloud")) return "/cloud.webp";
    if (category.includes("automation")) return "/automation.webp";
    if (category.includes("terraform")) return "/terraform.webp";
    if (category.includes("devsecops") || category.includes("security"))
      return "/security.webp";
    return "/devops.webp";
  };

  // Calculate pagination values
  const totalItems = savedArticles.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedArticles = savedArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Scroll to top of section for better UX
    const element = document.getElementById('saved-posts-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.section
      id="saved-posts-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl overflow-hidden"
    >
      <div className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
          <div>
            <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-br from-emerald-800 to-emerald-600 dark:from-emerald-300 dark:to-emerald-100 bg-clip-text text-transparent mb-1 md:mb-2">
              Saved Articles
            </h2>
            <p className="text-xs md:text-base text-slate-600 dark:text-gray-400 font-medium">
              Your reading list for later • {savedArticles.length} article{savedArticles.length !== 1 ? 's' : ''}
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </div>
          {savedArticles.length > 0 && (
            <div className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              <Bookmark className="w-4 h-4 inline mr-1" />
              Reading List
            </div>
          )}
        </div>
      </div>

      {savedLoading ? (
        <div className="flex items-center justify-center py-12 md:py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-6"></div>
            <p className="text-slate-700 dark:text-gray-300 text-lg font-medium">
              Loading saved articles...
            </p>
          </div>
        </div>
      ) : savedArticles.length === 0 ? (
        <div className="text-center py-12 md:py-20">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl">
            <Bookmark className="w-6 h-6 md:w-10 md:h-10 text-white" />
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 md:mb-4">
            No saved articles yet
          </h3>
          <p className="text-sm md:text-lg text-slate-600 dark:text-gray-400 mb-6 md:mb-8 font-medium max-w-md mx-auto px-4">
            When you save articles using the bookmark icon, they'll appear here for easy access
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
          >
            <ArrowRight className="w-4 h-4" />
            Browse Articles
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y divide-slate-200/50 dark:divide-gray-700">
            {paginatedArticles.map((item, index) => {
              const article = item.article;
              const coverImage = getCoverImage(article);
              const reactions = article.reactions_summary || {};

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 md:p-8 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col gap-4 md:gap-8 md:flex-row items-start">
                    {/* Article Cover Image */}
                    <div className="flex-shrink-0 w-full md:w-32 h-48 md:h-32 rounded-xl md:rounded-2xl overflow-hidden border border-slate-200/50 dark:border-gray-600 shadow-lg group-hover:shadow-xl transition-all duration-300 relative">
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

                    {/* Article Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2 md:mb-3">
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-xs md:text-sm px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                          <Bookmark className="w-3 h-3 md:w-4 md:h-4" />
                          Saved {formatDate(item.saved_at)}
                        </span>
                      </div>

                      <h3 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white mb-2 md:mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        <Link href={`/articles/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>

                      <p className="text-black dark:text-gray-400 text-sm md:text-lg line-clamp-2 mb-3 md:mb-4 font-medium leading-relaxed">
                        {article.excerpt}
                      </p>

                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-0">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Link
                              key={tag.id}
                              href={`/articles?tag=${tag.slug}`}
                              className="inline-flex items-center gap-1 bg-slate-100/80 dark:bg-gray-700 text-slate-700 dark:text-gray-300 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-medium border border-slate-200/50 dark:border-gray-600 hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              <TagIcon className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                              {tag.name}
                            </Link>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="inline-flex items-center bg-slate-100/80 dark:bg-gray-700 text-slate-600 dark:text-gray-400 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-medium border border-slate-200/50 dark:border-gray-600">
                              +{article.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Notes if any */}
                      {item.notes && (
                        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
                          <p className="text-sm text-emerald-800 dark:text-emerald-300 italic">
                            🤔 Your note: "{item.notes}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end md:justify-start">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="inline-flex items-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-105 text-xs md:text-sm w-full md:w-auto justify-center"
                      >
                        <FileText className="w-3 h-3 md:w-4 md:h-4" />
                        Read Now
                      </Link>
                      <button
                        onClick={() => onUnsaveArticle(article.id)}
                        disabled={unsavingId === article.id}
                        className="inline-flex items-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-105 text-xs md:text-sm w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {unsavingId === article.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
                            Removing...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            Remove
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination - Same style as articles section */}
          {savedArticles.length > 0 && totalPages > 1 && (
            <div className="px-4 md:px-8 py-4 md:py-6 border-t border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs md:text-sm text-slate-600 dark:text-gray-400 font-medium text-center sm:text-left">
                  Showing {paginatedArticles.length} of {totalItems} saved articles
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
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
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all shadow-sm ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md"
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
                    onClick={() => handlePageChange(currentPage + 1)}
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
  );
}