"use client";

import { useState, useEffect } from "react";
import {
  UserMinus,
  Crown,
  Mail,
  Calendar,
  Loader, AlertCircle, Users,
  FileText, User
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface SuperUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_super_user: boolean;
  created_at: string;
  date_joined: string;
  last_login: string | null;
  author_profile: {
    name: string;
    slug: string;
    avatar: string;
    profile_complete: boolean;
    job_title?: string;
    company?: string;
  } | null;
  articles_count?: number;
}

interface ActiveUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  last_login: string | null;
  is_author: boolean;
  author_profile: {
    name: string;
    slug: string;
    avatar: string;
    profile_complete: boolean;
    job_title?: string;
    company?: string;
  } | null;
  articles_count: number;
}

export default function SuperUserManagement() {
  const [superUsers, setSuperUsers] = useState<SuperUser[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActive, setLoadingActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ActiveUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeView, setActiveView] = useState<"super" | "active">("super");

  // Fetch super users with author profiles
  const fetchSuperUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/super/users/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch super users");

      const data = await response.json();
      setSuperUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch active users
  const fetchActiveUsers = async () => {
    try {
      setLoadingActive(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/super/users/active/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch active users");

      const data = await response.json();
      setActiveUsers(data.active_users || []);
    } catch (err) {
      console.error("Error fetching active users:", err);
    } finally {
      setLoadingActive(false);
    }
  };

  // Search active users
  const searchActiveUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/super/users/search/?q=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Toggle super user status
  const handleToggleSuperUser = async (
    userId: number,
    action: "make_super" | "remove_super"
  ) => {
    const userName =
      action === "make_super"
        ? searchResults.find((u) => u.id === userId)?.username ||
          activeUsers.find((u) => u.id === userId)?.username
        : superUsers.find((u) => u.id === userId)?.username;

    const confirmMessage =
      action === "make_super"
        ? `Are you sure you want to make "${userName}" a super user?`
        : `Are you sure you want to remove super user privileges from "${userName}"?`;

    if (!confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/super/users/toggle/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          action: action,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        // Refresh all data
        await Promise.all([fetchSuperUsers(), fetchActiveUsers()]);
        // Clear search results if we made someone super
        if (action === "make_super") {
          setSearchResults((prev) => prev.filter((user) => user.id !== userId));
          setSearchQuery("");
        }
      } else {
        alert(`Error: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  useEffect(() => {
    Promise.all([fetchSuperUsers(), fetchActiveUsers()]);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) searchActiveUsers(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative group">
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="p-6 border-b border-white/20 dark:border-gray-700/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Super User Management
                </h2>
                <p className="text-black dark:text-gray-400 text-sm">
                  Manage platform administrators from active users
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setActiveView("super")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    activeView === "super"
                      ? "bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400"
                      : "text-black dark:text-white hover:text-amber-600 dark:hover:text-amber-400"
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  Super Users ({superUsers.length})
                </button>
                <button
                  onClick={() => setActiveView("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    activeView === "active"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                      : "text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Active Users ({activeUsers.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeView === "super" ? (
            // SUPER USERS VIEW
            <>
              {/* Current Super Users List */}
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                  Current Super Users
                </h3>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-amber-600" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-red-600 dark:text-red-400 mb-2">
                      {error}
                    </p>
                    <button
                      onClick={fetchSuperUsers}
                      className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      Try Again
                    </button>
                  </div>
                ) : superUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Crown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-black dark:text-gray-400">
                      No super users found
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {superUsers.map((user) => (
                      <div
                        key={user.id}
                        className="p-4 rounded-2xl border border-white/20 dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {/* Avatar with crown badge - Replaced crown icon with avatar */}
                            <div className="relative">
                              {user.author_profile?.avatar ? (
                                <>
                                  <img
                                    src={user.author_profile.avatar}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500"
                                  />
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                    <Crown className="w-3 h-3 text-white" />
                                  </div>
                                </>
                              ) : (
                                <div className="relative w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center border-2 border-amber-500">
                                  <User className="w-6 h-6 text-white" />
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                    <Crown className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-black dark:text-white">
                                  {user.username}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-sm text-black dark:text-gray-400">
                                  <Mail className="w-3 h-3" />
                                  {user.email}
                                </div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <div className="flex items-center gap-1 text-sm text-black dark:text-gray-400">
                                  <Calendar className="w-3 h-3" />
                                  Joined {formatDate(user.date_joined)}
                                </div>
                              </div>

                              {/* Author profile info if available */}
                              {user.author_profile && (
                                <div className="mt-2">
                                  <div className="text-sm font-medium text-black dark:text-white">
                                    {user.author_profile.name}
                                  </div>
                                  {(user.author_profile.job_title ||
                                    user.author_profile.company) && (
                                    <p className="text-sm text-black dark:text-gray-400">
                                      {user.author_profile.job_title || ""}
                                      {user.author_profile.job_title &&
                                        user.author_profile.company &&
                                        " at "}
                                      {user.author_profile.company || ""}
                                    </p>
                                  )}
                                  {user.articles_count &&
                                    user.articles_count > 0 && (
                                      <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 mt-1">
                                        <FileText className="w-3 h-3" />
                                        {user.articles_count} article
                                        {user.articles_count !== 1 ? "s" : ""}
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleToggleSuperUser(user.id, "remove_super")
                              }
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium"
                            >
                              <UserMinus className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            // ACTIVE USERS VIEW (remains the same)
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Recent Active Users
                </h3>
              </div>

              {loadingActive ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : activeUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-black dark:text-gray-400">
                    No active users found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 rounded-2xl border border-white/20 dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        {user.author_profile?.avatar ? (
                          <img
                            src={user.author_profile.avatar}
                            alt={user.username}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-black dark:text-white">
                                {user.username}
                              </h4>
                              <p className="text-sm text-black dark:text-gray-400 mt-1">
                                {user.email}
                              </p>
                            </div>
                            {!superUsers.some((su) => su.id === user.id) && (
                              <button
                                onClick={() =>
                                  handleToggleSuperUser(user.id, "make_super")
                                }
                                className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg hover:shadow-md transition-all duration-300 text-xs font-medium"
                              >
                                <Crown className="w-3 h-3" />
                                Make Super
                              </button>
                            )}
                          </div>

                          {user.author_profile && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-black dark:text-white">
                                  {user.author_profile.name}
                                </div>
                              </div>

                              {(user.author_profile.job_title ||
                                user.author_profile.company) && (
                                <p className="text-sm text-black dark:text-gray-400">
                                  {user.author_profile.job_title || ""}
                                  {user.author_profile.job_title &&
                                    user.author_profile.company &&
                                    " at "}
                                  {user.author_profile.company || ""}
                                </p>
                              )}

                              {user.articles_count > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                    <FileText className="w-3 h-3" />
                                    {user.articles_count} article
                                    {user.articles_count !== 1 ? "s" : ""}
                                  </div>
                                  <div className="text-black dark:text-gray-400">
                                    •
                                  </div>
                                  <div className="text-black dark:text-gray-400">
                                    Joined {formatDate(user.date_joined)}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
