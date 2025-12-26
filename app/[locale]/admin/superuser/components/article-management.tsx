"use client";
import { useState, useEffect } from "react";
import { 
  FileText, Search, Trash2, CheckSquare, Square, AlertTriangle, 
  Eye, Calendar, User, Loader, Filter, 
  PlusCircle
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface Article {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  read_count: number;
  author_name: string;
  cover_image?: string;
  excerpt?: string;
}

export default function ArticleManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "search">("all");

  // Fetch all articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/super/articles/`, {
        headers: { Authorization: `Token ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
        setSelectedArticles([]);
        setSelectAll(false);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search articles
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setActiveTab("all");
      return;
    }

    setSearchLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/super/articles/search/?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
        setActiveTab("search");
        setSelectedArticles([]);
        setSelectAll(false);
      }
    } catch (error) {
      console.error("Error searching articles:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Selection handlers
  const handleSelectArticle = (articleId: number) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleSelectAll = () => {
    const displayArticles = getDisplayArticles();
    if (selectAll) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(displayArticles.map(article => article.id));
    }
    setSelectAll(!selectAll);
  };

  // Bulk delete functionality
  const handleBulkDelete = async () => {
    if (selectedArticles.length === 0) {
      alert("Please select at least one article to delete.");
      return;
    }

    const articleTitles = getDisplayArticles()
      .filter(article => selectedArticles.includes(article.id))
      .map(article => article.title)
      .join("\n• ");

    if (!confirm(`Are you sure you want to permanently delete the following ${selectedArticles.length} articles?\n\n• ${articleTitles}\n\nThis action cannot be undone!`)) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/super/articles/bulk-delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          article_ids: selectedArticles
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Successfully deleted ${result.deleted_count} articles`);
        
        // Refresh data
        fetchArticles();
        if (activeTab === "search") {
          handleSearch();
        }
        // Reset selection
        setSelectedArticles([]);
        setSelectAll(false);
      } else {
        alert("❌ Failed to delete articles. Please try again.");
      }
    } catch (error) {
      console.error("Error in bulk delete:", error);
      alert("❌ Bulk delete failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const getDisplayArticles = () => {
    return activeTab === "search" ? searchResults : articles;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Load articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="relative group">
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="p-6 border-b border-white/20 dark:border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Article Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Bulk delete and manage articles
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles by title, content, author, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-black dark:border-gray-700/30 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {searchLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedArticles.length > 0 && (
          <div className="px-6 pb-4">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-red-700 dark:text-red-400">
                      {selectedArticles.length} article{selectedArticles.length > 1 ? 's' : ''} selected
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      This will permanently delete all selected articles
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleBulkDelete}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 font-medium"
                >
                  {actionLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete Selected ({selectedArticles.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Articles List */}
        <div className="p-6 pt-0">
          <div className="space-y-4">
            {/* Header with select all */}
            {getDisplayArticles().length > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/20 dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {selectAll ? (
                    <CheckSquare className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                  Select All ({getDisplayArticles().length})
                </button>
                <div className="flex-1 text-right text-sm text-gray-500 dark:text-gray-400">
                  {activeTab === "search" ? (
                    <>Found {searchResults.length} articles</>
                  ) : (
                    <>Showing {articles.length} recent articles</>
                  )}
                </div>
              </div>
            )}

            {/* Articles */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getDisplayArticles().map((article) => (
                <div
                  key={article.id}
                  className="group/item relative p-4 rounded-2xl border border-white/20 dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleSelectArticle(article.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      {selectedArticles.includes(article.id) ? (
                        <CheckSquare className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>

                    {/* Article Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                      </div>

                      {article.excerpt && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {article.author_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(article.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.read_count.toLocaleString()} views
                        </span>
                      </div>
                    </div>

                    {/* Cover Image */}
                    {article.cover_image && (
                      <div className="flex-shrink-0">
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-16 h-16 rounded-xl object-cover border border-white/50 shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Empty States */}
              {getDisplayArticles().length === 0 && searchQuery && activeTab === "search" && (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No articles found matching "{searchQuery}"
                  </p>
                </div>
              )}

              {getDisplayArticles().length === 0 && !searchQuery && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No articles found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}