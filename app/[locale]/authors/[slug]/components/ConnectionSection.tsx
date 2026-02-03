"use client";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Follower {
  id: number;
  follower: number;
  created_at: string;
  follower_name: string;
  follower_slug: string;
  follower_avatar: string;
}

interface Following {
  id: number;
  follower: number;
  following: number;
  created_at: string;
  following_name: string;
  following_slug: string;
  following_avatar: string;
  articles_count?: number;
}

interface ConnectionsSectionProps {
  authorSlug: string;
}

const ITEMS_PER_PAGE = 10;

export default function ConnectionsSection({
  authorSlug,
}: ConnectionsSectionProps) {
  // State for data
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Following[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers",
  );
  const [loading, setLoading] = useState({ followers: true, following: true });
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const fetchFollowers = async () => {
    try {
      setLoading((prev) => ({ ...prev, followers: true }));
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/authors/${authorSlug}/followers/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch followers");
      }

      const data = await response.json();
      setFollowers(data);
    } catch (err) {
      console.error("Error fetching followers:", err);
      setError(err instanceof Error ? err.message : "Failed to load followers");
    } finally {
      setLoading((prev) => ({ ...prev, followers: false }));
    }
  };

  const fetchFollowing = async () => {
    try {
      setLoading((prev) => ({ ...prev, following: true }));
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/authors/${authorSlug}/following/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch following");
      }

      const data = await response.json();
      setFollowing(data);
    } catch (err) {
      console.error("Error fetching following:", err);
      setError(err instanceof Error ? err.message : "Failed to load following");
    } finally {
      setLoading((prev) => ({ ...prev, following: false }));
    }
  };

  useEffect(() => {
    fetchFollowers();
    fetchFollowing();
  }, [authorSlug]);

  // Get current data based on active tab
  const currentItems = activeTab === "followers" ? followers : following;
  const currentLoading =
    activeTab === "followers" ? loading.followers : loading.following;

  // Calculate pagination for current items
  const totalItems = currentItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedItems = currentItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const element = document.getElementById("connections-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const tabConfig = {
    followers: {
      title: "Followers",
      icon: Users,
      gradient: "from-pink-600 to-rose-600 dark:from-pink-300 dark:to-rose-300",
      color: "text-pink-600 dark:text-pink-400",
      emptyTitle: "No Followers Yet",
      emptyMessage:
        "Share your articles and engage with the community to get followers",
      countText: `${followers.length} people are following you`,
    },
    following: {
      title: "Following",
      icon: UserPlus,
      gradient:
        "from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300",
      color: "text-indigo-600 dark:text-indigo-400",
      emptyTitle: "Not Following Anyone Yet",
      emptyMessage: "Follow authors to see their latest articles in your feed",
      countText: `${following.length} authors you're following`,
    },
  };

  const config = tabConfig[activeTab];

  return (
    <motion.section
      id="connections-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl overflow-hidden mb-7"
    >
      {/* Header with Tabs */}
      <div className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4">
          <div>
            <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent mb-1 md:mb-2">
              Connections
            </h2>
            <p className="text-xs md:text-base text-slate-600 dark:text-gray-400 font-medium">
              Followers and following for this author
            </p>
          </div>
          {(followers.length > 0 || following.length > 0) && (
            <div className="text-xs md:text-sm text-purple-600 dark:text-purple-400 font-medium">
              <Users className="w-4 h-4 inline mr-1" />
              Community
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200/50 dark:border-gray-700">
          <button
            onClick={() => {
              setActiveTab("followers");
              setCurrentPage(1);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base font-medium transition-all duration-200 ${
              activeTab === "followers"
                ? "border-b-2 border-pink-600 text-pink-600 dark:text-pink-400"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-300"
            }`}
          >
            <Users className="w-4 h-4" />
            Followers
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === "followers"
                  ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
                  : "bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-400"
              }`}
            >
              {followers.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("following");
              setCurrentPage(1);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base font-medium transition-all duration-200 ${
              activeTab === "following"
                ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-300"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Following
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === "following"
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  : "bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-400"
              }`}
            >
              {following.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      {currentLoading ? (
        <div className="flex items-center justify-center py-12 md:py-20">
          <div className="text-center">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-6 ${
                activeTab === "followers"
                  ? "border-pink-600"
                  : "border-indigo-600"
              }`}
            ></div>
            <p className="text-slate-700 dark:text-gray-300 text-lg font-medium">
              Loading {activeTab}...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12 md:py-20">
          <div
            className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl ${
              activeTab === "followers"
                ? "bg-gradient-to-br from-pink-500 to-rose-600"
                : "bg-gradient-to-br from-indigo-500 to-purple-600"
            }`}
          >
            <config.icon className="w-6 h-6 md:w-10 md:h-10 text-white" />
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 md:mb-4">
            Unable to Load{" "}
            {activeTab === "followers" ? "Followers" : "Following"}
          </h3>
          <p className="text-sm md:text-lg text-slate-600 dark:text-gray-400 mb-6 md:mb-8 font-medium max-w-md mx-auto px-4">
            {error}
          </p>
          <button
            onClick={
              activeTab === "followers" ? fetchFollowers : fetchFollowing
            }
            className={`inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 ${
              activeTab === "followers"
                ? "bg-gradient-to-r from-pink-600 to-rose-600"
                : "bg-gradient-to-r from-indigo-600 to-purple-600"
            }`}
          >
            Try Again
          </button>
        </div>
      ) : totalItems === 0 ? (
        <div className="text-center py-12 md:py-20">
          <div
            className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl ${
              activeTab === "followers"
                ? "bg-gradient-to-br from-pink-500 to-rose-600"
                : "bg-gradient-to-br from-indigo-500 to-purple-600"
            }`}
          >
            <config.icon className="w-6 h-6 md:w-10 md:h-10 text-white" />
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 md:mb-4">
            {config.emptyTitle}
          </h3>
          <p className="text-sm md:text-lg text-slate-600 dark:text-gray-400 mb-6 md:mb-8 font-medium max-w-md mx-auto px-4">
            {config.emptyMessage}
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-slate-200/50 dark:divide-gray-700">
            {paginatedItems.map((item, index) => {
              if (activeTab === "followers") {
                const follower = item as Follower;
                return (
                  <motion.div
                    key={follower.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 md:p-6 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar with Link */}
                      <Link
                        href={`/authors/${follower.follower_slug}`}
                        className="relative hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={follower.follower_avatar || "/placeholder.svg"}
                          alt={follower.follower_name}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white dark:border-gray-800 shadow-lg object-cover"
                        />
                      </Link>

                      {/* Info with Link */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div>
                            <Link
                              href={`/authors/${follower.follower_slug}`}
                              className="hover:opacity-80 transition-opacity"
                            >
                              <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                                {follower.follower_name}
                              </h3>
                            </Link>
                            <p className="text-xs text-slate-500 dark:text-gray-400">
                              Started following{" "}
                              {formatDate(follower.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              } else {
                const followingItem = item as Following;
                return (
                  <motion.div
                    key={followingItem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 md:p-6 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar with Link */}
                      <Link
                        href={`/authors/${followingItem.following_slug}`}
                        className="relative hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={
                            followingItem.following_avatar || "/placeholder.svg"
                          }
                          alt={followingItem.following_name}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white dark:border-gray-800 shadow-lg object-cover"
                        />
                      </Link>

                      {/* Info with Link */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div>
                            <Link
                              href={`/authors/${followingItem.following_slug}`}
                              className="hover:opacity-80 transition-opacity"
                            >
                              <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                                {followingItem.following_name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-gray-400">
                              <span>
                                Followed {formatDate(followingItem.created_at)}
                              </span>
                              {followingItem.articles_count && (
                                <span className="inline-flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  {followingItem.articles_count} articles
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }
            })}
          </div>

          {/* Pagination */}
          {totalItems > 0 && totalPages > 1 && (
            <div className="px-4 md:px-8 py-4 md:py-6 border-t border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs md:text-sm text-slate-600 dark:text-gray-400 font-medium text-center sm:text-left">
                  Showing {paginatedItems.length} of {totalItems}{" "}
                  {activeTab === "followers" ? "followers" : "authors"}
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
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
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
                              ? `bg-gradient-to-r ${activeTab === "followers" ? "from-pink-600 to-rose-600" : "from-indigo-600 to-purple-600"} text-white shadow-md`
                              : "border border-slate-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 backdrop-blur-sm"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
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