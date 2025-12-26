"use client";
import { useState, useEffect } from "react";
import { Users, FileText, LogIn, Sparkles, Search, UserX, Shield, Ban, UserCheck, AlertTriangle } from "lucide-react";

interface Author {
  id: number;
  name: string;
  slug: string;
  avatar: string;
  email?: string;
  articles_count: number;
  featured: boolean;
  job_title: string;
  company: string;
  is_banned?: boolean;
  last_login?: string;
  date_joined?: string;
}

interface BannedAuthor {
  id: number;
  name: string;
  slug: string;
  email: string;
  is_banned: boolean;
  banned_reason: string;
  banned_at: string;
  banned_by_name: string;
  articles_count: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function UserManagement() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [bannedAuthors, setBannedAuthors] = useState<BannedAuthor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Author[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "search" | "banned">("all");
  const [actionLoading, setActionLoading] = useState<{ impersonate: string | null; ban: number | null }>({
    impersonate: null,
    ban: null
  });

  // Fetch all authors
  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/super/authors/`, {
        headers: { Authorization: `Token ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuthors(data);
        setFilteredAuthors(data);
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch banned authors
  const fetchBannedAuthors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/super/banned-authors/`, {
        headers: { Authorization: `Token ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBannedAuthors(data);
      }
    } catch (error) {
      console.error("Error fetching banned authors:", error);
    }
  };

  // Search authors via API
  const handleApiSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/super/authors/search/?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error("Error searching authors:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Filter authors locally
  const handleLocalSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredAuthors(authors);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = authors.filter(author =>
      author.name.toLowerCase().includes(query) ||
      author.slug.toLowerCase().includes(query) ||
      author.job_title?.toLowerCase().includes(query) ||
      author.company?.toLowerCase().includes(query) ||
      author.email?.toLowerCase().includes(query)
    );
    
    setFilteredAuthors(filtered);
  };

  // Handle search based on active tab
  const handleSearch = () => {
    if (activeTab === "search") {
      handleApiSearch();
    } else {
      handleLocalSearch();
    }
  };

  // Impersonate author
  const handleImpersonate = async (authorSlug: string) => {
    if (!confirm(`Impersonate ${authorSlug}? You will be logged in as them.`)) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, impersonate: authorSlug }));
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/super/impersonate/${authorSlug}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to impersonate author");
      }

      const data = await response.json();
      localStorage.setItem("original_token", token!);
      localStorage.setItem("token", data.impersonation_token);
      localStorage.setItem("is_impersonating", "true");
      localStorage.setItem("impersonated_author", authorSlug);
      window.location.href = `/admin/author/${authorSlug}`;
    } catch (error) {
      console.error("Impersonation failed:", error);
      alert("Impersonation failed. Please try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, impersonate: null }));
    }
  };

  // Ban/Unban author
  const handleBanAction = async (authorId: number, authorName: string, action: "ban" | "unban") => {
    const reason = prompt(
      action === "ban" 
        ? `Enter reason for banning ${authorName}:`
        : `Enter reason for unbanning ${authorName}:`
    );
    
    if (!reason) return;

    setActionLoading(prev => ({ ...prev, ban: authorId }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/super/authors/ban/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author_id: authorId,
          reason: reason,
          ban_action: action,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        
        // Refresh all data
        fetchAuthors();
        fetchBannedAuthors();
        if (activeTab === "search") {
          handleApiSearch();
        }
      } else {
        alert("Action failed. Please try again.");
      }
    } catch (error) {
      console.error("Error performing ban action:", error);
      alert("Action failed. Please try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, ban: null }));
    }
  };

  // Load data on component mount and tab switch
  useEffect(() => {
    fetchAuthors();
    fetchBannedAuthors();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      handleLocalSearch();
    }
  }, [searchQuery, activeTab, authors]);

  const getDisplayAuthors = () => {
    switch (activeTab) {
      case "search":
        return searchResults;
      case "banned":
        return [];
      default:
        return filteredAuthors;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="relative group">
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="p-6 border-b border-white/20 dark:border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                User Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Impersonate and manage authors
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              All Authors ({filteredAuthors.length})
            </button>
            <button
              onClick={() => setActiveTab("banned")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === "banned"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Banned ({bannedAuthors.length})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={
                  activeTab === "search" 
                    ? "Search authors by name, email, or username..."
                    : "Search authors by name, username, job title, or company..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-black dark:border-gray-700/30 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searchLoading || !searchQuery.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-0">
          {activeTab === "banned" ? (
            <div className="space-y-4">
              {/* Banned Authors List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bannedAuthors.map((author) => (
                  <div
                    key={author.id}
                    className="p-4 rounded-2xl border border-red-200 dark:border-red-800/30 bg-red-50/30 dark:bg-red-900/20 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {author.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {author.email}
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-red-600 dark:text-red-400">
                            <strong>Reason:</strong> {author.banned_reason}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Banned by {author.banned_by_name} on {new Date(author.banned_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBanAction(author.id, author.name, "unban")}
                        disabled={actionLoading.ban === author.id}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-sm font-medium ml-4"
                      >
                        {actionLoading.ban === author.id ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                        Unban
                      </button>
                    </div>
                  </div>
                ))}

                {bannedAuthors.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No banned authors</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Authors List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getDisplayAuthors().map((author) => (
                  <div
                    key={author.id}
                    className="group/item relative p-4 rounded-2xl border border-white/20 dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="relative">
                          <img
                            src={author.avatar || "/placeholder-avatar.jpg"}
                            alt={author.name}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-white/50 shadow-lg"
                          />
                          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            author.is_banned ? "bg-red-500" : author.featured ? "bg-yellow-500" : "bg-green-500"
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {author.name}
                            </h3>
                            {author.is_banned && (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
                                Banned
                              </span>
                            )}
                            {author.featured && !author.is_banned && (
                              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {author.job_title} {author.company && `at ${author.company}`}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <FileText className="w-3 h-3" />
                              {author.articles_count} articles
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              @{author.slug}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 ml-4">
                        {author.is_banned ? (
                          <button
                            onClick={() => handleBanAction(author.id, author.name, "unban")}
                            disabled={actionLoading.ban === author.id}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-sm font-medium"
                          >
                            {actionLoading.ban === author.id ? (
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                            Unban
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleBanAction(author.id, author.name, "ban")}
                              disabled={actionLoading.ban === author.id}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-sm font-medium"
                            >
                              {actionLoading.ban === author.id ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                              Ban
                            </button>
                            <button
                              onClick={() => handleImpersonate(author.slug)}
                              disabled={actionLoading.impersonate === author.slug}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-sm font-medium"
                            >
                              {actionLoading.impersonate === author.slug ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <LogIn className="w-4 h-4" />
                              )}
                              Impersonate
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {getDisplayAuthors().length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <UserX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No authors found matching "{searchQuery}"
                    </p>
                  </div>
                )}

                {getDisplayAuthors().length === 0 && !searchQuery && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No authors found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}