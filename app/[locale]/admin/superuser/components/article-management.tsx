"use client";
import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Search,
  Trash2,
  CheckSquare,
  Square,
  AlertTriangle,
  Eye,
  Calendar,
  User,
  Loader,
  Edit,
  ExternalLink,
  Clock,
  Folder,
  Tag as TagIcon,
  MessageSquare,
  Heart,
  Sparkles,
  Lightbulb,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  PenSquare,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface Article {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  read_count: number;
  author_name: string;
  author_slug: string;
  author_avatar?: string;
  cover_image?: string;
  excerpt?: string;
  content?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags?: {
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

interface Author {
  id: number;
  name: string;
  slug: string;
  avatar: string;
}

export default function ArticleManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "search">("all");
  const [impersonationLoading, setImpersonationLoading] = useState<
    string | null
  >(null);
  const [deletingArticleId, setDeletingArticleId] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [authors, setAuthors] = useState<Author[]>([]);
  const articlesPerPage = 6;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all articles with engagement data
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch articles
      const articlesResponse = await fetch(`${API_BASE_URL}/super/articles/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();

        // Fetch all authors to get their avatars
        const authorsResponse = await fetch(`${API_BASE_URL}/super/authors/`, {
          headers: { Authorization: `Token ${token}` },
        });

        let authorsList: Author[] = [];
        if (authorsResponse.ok) {
          const authorsData = await authorsResponse.json();
          authorsList = Array.isArray(authorsData) ? authorsData : [];
          setAuthors(authorsList);
        }

        // Enhance articles with engagement data and author avatars
        const enhancedArticles = await Promise.all(
          articlesData.slice(0, 50).map(async (article: any) => {
            // Find author by name to get avatar
            const author = authorsList.find(
              (a) =>
                a.name === article.author_name ||
                a.slug ===
                  article.author_name?.toLowerCase().replace(/\s+/g, "-")
            );

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
                author_slug:
                  author?.slug ||
                  article.author_name?.toLowerCase().replace(/\s+/g, "-") ||
                  "unknown",
                author_avatar: author?.avatar || "/placeholder-avatar.jpg",
              };
            } catch (error) {
              console.error(
                `Failed to fetch engagement for article ${article.slug}:`,
                error
              );
            }

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
              author_slug:
                author?.slug ||
                article.author_name?.toLowerCase().replace(/\s+/g, "-") ||
                "unknown",
              author_avatar: author?.avatar || "/placeholder-avatar.jpg",
            };
          })
        );

        // Sort by latest published date
        const sortedArticles = enhancedArticles.sort(
          (a: Article, b: Article) =>
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime()
        );

        setArticles(sortedArticles);
        setSelectedArticles([]);
        setSelectAll(false);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate read time
  const calculateReadTime = (content?: string) => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // Local search for instant results
  const handleLocalSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setActiveTab("all");
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = articles.filter(
      (article) =>
        article.title?.toLowerCase().includes(query) ||
        article.excerpt?.toLowerCase().includes(query) ||
        article.author_name?.toLowerCase().includes(query) ||
        article.content?.toLowerCase().includes(query) ||
        article.tags?.some((tag) => tag.name.toLowerCase().includes(query)) ||
        article.category?.name.toLowerCase().includes(query)
    );

    setSearchResults(filtered);
    setActiveTab("search");
    setSelectedArticles([]);
    setSelectAll(false);
  };

  // API Search for advanced search (when needed)
  const handleApiSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setActiveTab("all");
      return;
    }

    setSearchLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/super/articles/search/?q=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Enhance search results with author avatars
        const enhancedResults = await Promise.all(
          data.results.slice(0, 15).map(async (article: any) => {
            // Find author by name to get avatar
            const author = authors.find(
              (a) =>
                a.name === article.author_name ||
                a.slug ===
                  article.author_name?.toLowerCase().replace(/\s+/g, "-")
            );

            return {
              ...article,
              author_slug:
                author?.slug ||
                article.author_name?.toLowerCase().replace(/\s+/g, "-") ||
                "unknown",
              author_avatar: author?.avatar || "/placeholder-avatar.jpg",
            };
          })
        );

        setSearchResults(enhancedResults);
        setActiveTab("search");
        setSelectedArticles([]);
        setSelectAll(false);
      }
    } catch (error) {
      console.error("Error searching articles:", error);
      // Fallback to local search if API fails
      handleLocalSearch();
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout for debouncing
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim().length > 0) {
        // Use local search for instant results
        handleLocalSearch();

        // Also trigger API search in background for more comprehensive results
        if (value.trim().length >= 3) {
          handleApiSearch();
        }
      } else {
        // If search is cleared, show all articles
        setSearchResults([]);
        setActiveTab("all");
      }
    }, 300); // 300ms debounce
  };

  // Handle manual search button click
  const handleSearchButtonClick = () => {
    if (!searchQuery.trim()) return;

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Trigger API search
    handleApiSearch();
  };

  // Selection handlers
  const handleSelectArticle = (articleId: number) => {
    setSelectedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleSelectAll = () => {
    const displayArticles = getDisplayArticles();
    if (selectAll) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(displayArticles.map((article) => article.id));
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
      .filter((article) => selectedArticles.includes(article.id))
      .map((article) => article.title)
      .join("\n• ");

    if (
      !confirm(
        `Are you sure you want to permanently delete the following ${selectedArticles.length} articles?\n\n• ${articleTitles}\n\nThis action cannot be undone!`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/super/articles/bulk-delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article_ids: selectedArticles,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Successfully deleted ${result.deleted_count} articles`);

        // Refresh data
        fetchArticles();
        if (activeTab === "search") {
          // Refresh search results
          if (searchQuery.trim().length >= 3) {
            handleApiSearch();
          } else {
            handleLocalSearch();
          }
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

  // Handle view article
  const handleViewArticle = (articleSlug: string) => {
    window.open(`/articles/${articleSlug}`, "_blank");
  };

  // Handle impersonate author for editing
  const handleImpersonateAuthor = async (
    authorSlug: string,
    authorName: string
  ) => {
    if (!authorSlug || authorSlug === "unknown") {
      alert(
        `Cannot impersonate author "${authorName}". Author slug not found.`
      );
      return;
    }

    if (
      !confirm(
        `Impersonate ${authorName}? You will be logged in as them and redirected to their dashboard to edit articles.`
      )
    ) {
      return;
    }

    try {
      setImpersonationLoading(authorSlug);
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
        if (response.status === 404) {
          throw new Error(`Author "${authorName}" not found`);
        }
        throw new Error(`Failed to impersonate: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem("original_token", token!);
      localStorage.setItem("token", data.impersonation_token);
      localStorage.setItem("is_impersonating", "true");
      localStorage.setItem("impersonated_author", authorSlug);

      // Redirect to the author's dashboard
      window.location.href = `/admin/author/${authorSlug}`;
    } catch (error: any) {
      console.error("Impersonation failed:", error);
      alert(`Impersonation failed: ${error.message || "Unknown error"}`);
    } finally {
      setImpersonationLoading(null);
    }
  };

  // Handle delete single article
  const handleDeleteArticle = async (
    articleId: number,
    articleTitle: string,
    articleSlug: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete "${articleTitle}" as superuser? This action cannot be undone!`
      )
    ) {
      return;
    }

    try {
      setDeletingArticleId(articleId);
      const token = localStorage.getItem("token");

      // Use the existing bulk delete endpoint for single article
      const response = await fetch(
        `${API_BASE_URL}/super/articles/bulk-delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article_ids: [articleId],
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(`✅ ${result.message}`);

        // Refresh data
        fetchArticles();
        if (activeTab === "search") {
          // Refresh search results
          if (searchQuery.trim().length >= 3) {
            handleApiSearch();
          } else {
            handleLocalSearch();
          }
        }
        // Reset selection if needed
        setSelectedArticles((prev) => prev.filter((id) => id !== articleId));
      } else {
        const error = await response.json();
        alert(`❌ Failed to delete article: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("❌ Delete failed. Please try again.");
    } finally {
      setDeletingArticleId(null);
    }
  };

  // Get clean excerpt
  const getCleanExcerpt = (article: Article) => {
    if (article.excerpt?.trim()) {
      return article.excerpt;
    }

    if (article.content) {
      const content = article.content;
      return content.length > 120 ? content.substring(0, 120) + "..." : content;
    }

    return "Read the full article to learn more...";
  };

  // Get cover image
  const getCoverImage = (article: Article) => {
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

  const getDisplayArticles = () => {
    const articlesToShow = activeTab === "search" ? searchResults : articles;
    const startIndex = (currentPage - 1) * articlesPerPage;
    return articlesToShow.slice(startIndex, startIndex + articlesPerPage);
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

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const displayArticles = getDisplayArticles();
  const totalArticles =
    activeTab === "search" ? searchResults.length : articles.length;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  return (
    <div className="relative group">
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="p-6 border-b border-white/20 dark:border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white">
                Article Management
              </h2>
              <p className="text-black dark:text-gray-400 text-sm">
                Superuser privileges
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-4 mb-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles by title, content, author, or tags..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSearchButtonClick()
                }
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-700/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-black dark:text-white placeholder-gray-500"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <button
              onClick={handleSearchButtonClick}
              disabled={searchLoading || !searchQuery.trim()}
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
                      {selectedArticles.length} article
                      {selectedArticles.length > 1 ? "s" : ""} selected
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-black dark:text-gray-400">
                  Loading articles...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active tab indicator */}
              {searchQuery.trim() && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing{" "}
                    {activeTab === "search" ? "search results" : "all articles"}
                    {searchQuery.trim() && ` for "${searchQuery}"`}
                    {activeTab === "search" && searchResults.length > 0 && (
                      <span className="font-semibold">
                        {" "}
                        ({searchResults.length} found)
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Articles */}
              <div className="space-y-4">
                {displayArticles.map((article) => {
                  const coverImage = getCoverImage(article);
                  const excerpt = getCleanExcerpt(article);
                  const reactions = article.reactions_summary || {};
                  const totalReactions =
                    (reactions.like || 0) +
                    (reactions.love || 0) +
                    (reactions.celebrate || 0) +
                    (reactions.insightful || 0);

                  return (
                    <div
                      key={article.id}
                      className="group/item p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        {/* Cover Image */}
                        <div className="flex-shrink-0 w-full md:w-32 h-24 md:h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-lg">
                          <img
                            src={coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                          />
                          {article.category && (
                            <div className="absolute top-2 left-2">
                              <span className="inline-flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold">
                                <Folder className="w-3 h-3" />
                                {article.category.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Article Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            {/* Left side: Article preview */}
                            <div className="flex-1">
                              {/* Title with hover effect */}
                              <h3 className="text-lg md:text-xl font-bold text-black dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                                <a
                                  href={`/articles/${article.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className=""
                                >
                                  {article.title}
                                </a>
                              </h3>

                              {/* Author with Avatar */}
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex-shrink-0">
                                  <img
                                    src={article.author_avatar}
                                    alt={article.author_name}
                                    className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                                  />
                                </div>
                                <span className="text-sm font-medium text-black dark:text-gray-300">
                                  {article.author_name}
                                </span>
                              </div>

                              {/* Excerpt */}
                              {excerpt && (
                                <p className="text-black dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                  {excerpt}
                                </p>
                              )}

                              {/* Tags */}
                              {article.tags && article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {article.tags.slice(0, 3).map((tag) => (
                                    <span
                                      key={tag.id}
                                      className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-gray-300 px-2 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-600"
                                    >
                                      <TagIcon className="w-3 h-3" />
                                      {tag.name}
                                    </span>
                                  ))}
                                  {article.tags.length > 3 && (
                                    <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 text-black dark:text-gray-400 px-2 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-600">
                                      +{article.tags.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Meta info - Date and Views only */}
                              <div className="flex items-center gap-4 text-black dark:text-gray-400 text-sm">
                                <span className="inline-flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(article.published_at)}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                  <Search className="w-4 h-4" />
                                  {article.read_count?.toLocaleString()} views
                                </span>
                              </div>
                            </div>

                            {/* Right side: Buttons and stats */}
                            <div className="flex flex-col items-end gap-3">
                              {/* Action Buttons - Beside article preview */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleDeleteArticle(
                                      article.id,
                                      article.title,
                                      article.slug
                                    )
                                  }
                                  disabled={deletingArticleId === article.id}
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-sm font-medium"
                                >
                                  {deletingArticleId === article.id ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Empty States */}
                {displayArticles.length === 0 &&
                  searchQuery &&
                  activeTab === "search" && (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                        No Articles Found
                      </h3>
                      <p className="text-black dark:text-gray-400">
                        No articles matching "{searchQuery}"
                      </p>
                    </div>
                  )}

                {displayArticles.length === 0 && !searchQuery && !loading && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                      No Articles Yet
                    </h3>
                    <p className="text-black dark:text-gray-400">
                      There are no articles in the system yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 text-black dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                              : "border border-gray-300 dark:border-gray-600 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 text-black dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
