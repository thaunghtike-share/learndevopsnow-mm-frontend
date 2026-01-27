"use client";
import { motion } from "framer-motion";
import {
  Trash2,
  Loader,
  Calendar,
  TagIcon,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface TrashArticle {
  id: number;
  slug: string;
  title: string;
  published_at: string;
  read_count: number;
  excerpt?: string;
  content?: string;
  cover_image?: string;
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
  comment_count?: number;
  days_in_trash: number;
  days_remaining: number;
  can_restore: boolean;
  author_name: string;
  author_avatar: string;
  deleted_at?: string;
}

interface TrashSectionProps {
  trashArticles: TrashArticle[];
  trashLoading: boolean;
  restoringSlug: string | null;
  onRestoreArticle: (slug: string) => Promise<void>;
  onPermanentDelete: (slug: string) => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

function TrashSection({
  trashArticles,
  trashLoading,
  restoringSlug,
  onRestoreArticle,
  onPermanentDelete,
}: TrashSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Calculate pagination values
  const totalItems = trashArticles.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedArticles = trashArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Scroll to top of section for better UX
    const element = document.getElementById('trash-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.section
      id="trash-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl overflow-hidden"
    >
      <div className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
          <div>
            <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1 md:mb-2">
              Trash Bin
            </h2>
            <p className="text-xs md:text-base text-slate-600 dark:text-gray-400 font-medium">
              Articles in trash are automatically deleted after 7 days
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </div>
          {trashArticles.length > 0 && (
            <div className="text-xs md:text-sm text-slate-500 dark:text-gray-500 font-medium">
              {trashArticles.length} articles in trash
            </div>
          )}
        </div>
      </div>

      {trashLoading ? (
        <div className="flex items-center justify-center py-12 md:py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-6"></div>
            <p className="text-slate-700 dark:text-gray-300 text-lg font-medium">
              Loading trash articles...
            </p>
          </div>
        </div>
      ) : trashArticles.length === 0 ? (
        <div className="text-center py-12 md:py-20">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl">
            <Trash2 className="w-6 h-6 md:w-10 md:h-10 text-white" />
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 md:mb-4">
            Trash is Empty
          </h3>
          <p className="text-sm md:text-lg text-slate-600 dark:text-gray-400 mb-6 md:mb-8 font-medium max-w-md mx-auto px-4">
            Articles you delete will appear here and can be restored within 7 days
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-slate-200/50 dark:divide-gray-700">
            {paginatedArticles.map((article, index) => {
              const daysRemaining = article.days_remaining;
              const daysInTrash = article.days_in_trash;
              const canRestore = article.can_restore;

              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 md:p-8 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col gap-4 md:gap-8 md:flex-row items-start">
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2 md:mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 font-medium text-xs md:text-sm px-2 py-1 rounded-lg ${
                            canRestore
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {canRestore
                            ? `🗑️ ${daysRemaining} days remaining`
                            : "⏰ Expired - Cannot restore"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 text-slate-500 dark:text-gray-500" />
                          Deleted {daysInTrash} days ago
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                          <Search className="w-3 h-3 md:w-4 md:h-4 text-sky-600" />
                          {article.read_count?.toLocaleString()} views
                        </span>
                      </div>

                      <h3 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white mb-2 md:mb-3 line-clamp-2">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-black dark:text-gray-400 text-sm md:text-lg line-clamp-2 mb-3 md:mb-4 font-medium leading-relaxed">
                          {stripMarkdown(article.excerpt).slice(0, 120)}
                          ...
                        </p>
                      )}

                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center gap-1 bg-slate-100/80 dark:bg-gray-700 text-slate-700 dark:text-gray-300 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-medium border border-slate-200/50 dark:border-gray-600"
                            >
                              <TagIcon className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end md:justify-start">
                      {canRestore && (
                        <button
                          onClick={() => onRestoreArticle(article.slug)}
                          disabled={restoringSlug === article.slug || !canRestore}
                          className="inline-flex items-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-emerald-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-105 text-xs md:text-sm w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {restoringSlug === article.slug ? (
                            <>
                              <Loader className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                              Restoring...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-3 h-3 md:w-4 md:h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                />
                              </svg>
                              Restore
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => onPermanentDelete(article.slug)}
                        className="inline-flex items-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-105 text-xs md:text-sm w-full md:w-auto justify-center"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination - Same style as other sections */}
          {trashArticles.length > 0 && totalPages > 1 && (
            <div className="px-4 md:px-8 py-4 md:py-6 border-t border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs md:text-sm text-slate-600 dark:text-gray-400 font-medium text-center sm:text-left">
                  Showing {paginatedArticles.length} of {totalItems} trash articles
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
                                ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md"
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

export default TrashSection;