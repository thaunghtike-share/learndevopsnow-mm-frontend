"use client";
import { useState, useEffect } from "react";
import { 
  Users, FileText, MessageSquare, Calendar, User, Eye, 
  ArrowUpRight, TrendingUp, Clock, CheckCircle, XCircle,
  Star, Target, BarChart3,
  Zap,
  PlusCircle,
  TrendingUp as TrendingUpIcon
} from "lucide-react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface Author {
  id: number;
  name: string;
  slug: string;
  avatar: string;
  job_title: string;
  company: string;
  date_joined: string;
  articles_count: number;
  profile_complete: boolean;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  read_count: number;
  author_name: string;
  author_slug: string;
  cover_image?: string;
  excerpt?: string;
  comment_count?: number;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  author_name: string;
  author_slug: string;
  article_title: string;
  article_slug: string;
  anonymous_name?: string;
}

interface AnalyticsData {
  new_authors: Author[];
  recent_articles: Article[];
  recent_comments: Comment[];
  stats: {
    total_new_authors: number;
    total_recent_articles: number;
    total_recent_comments: number;
    authors_with_completed_profiles: number;
    total_recent_views: number; // Add this line
  };
}

export default function PlatformAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/super/analytics/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const analyticsData = await response.json();
      console.log("📊 Analytics data:", analyticsData); // Debug log
      setData(analyticsData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  // Filter only authors with avatars (completed profiles)
  const completedAuthors = data?.new_authors.filter(author => 
    author.avatar && author.avatar.trim() !== "" && author.avatar !== "/placeholder-avatar.jpg"
  ) || [];

  // Calculate actual completed count based on avatar presence
  const actualCompletedCount = completedAuthors.length;
  const totalNewAuthors = data?.stats.total_new_authors || 0;

  // Calculate total views from recent articles
  const totalRecentViews = data?.recent_articles.reduce((total, article) => total + article.read_count, 0) || 0;

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl" />
        <div className="relative p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl" />
        <div className="relative p-6">
          <div className="text-center py-8">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="p-6 border-b border-white/20 dark:border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Platform Analytics
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Last 30 days performance metrics
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {data && (
          <div className="p-6 border-b border-white/20 dark:border-gray-700/30">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/30 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {actualCompletedCount}
                </div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Completed Profiles</p>
              </div>
              
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700/30 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {data.stats.total_recent_articles}
                </div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">New Articles</p>
                <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">
                  published recently
                </p>
              </div>
              
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700/30 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {data.stats.total_recent_comments}
                </div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Engagements</p>
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                  community interactions
                </p>
              </div>

              {/* NEW: Total Views Stat */}
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700/30 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <TrendingUpIcon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {totalRecentViews.toLocaleString()}
                </div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Views</p>
                <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                  on recent articles
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content Tabs */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Completed Authors Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  Active Authors ({actualCompletedCount})
                </h3>
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                  Profile Completed
                </span>
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {completedAuthors.map((author) => (
                  <Link
                    key={author.id}
                    href={`/admin/author/${author.slug}`}
                    className="block group"
                  >
                    <div className="p-4 rounded-2xl border border-green-200/50 dark:border-green-800/30 bg-gradient-to-br from-green-50/50 to-white/30 dark:from-green-900/10 dark:to-gray-800/30 backdrop-blur-sm hover:from-green-100/70 hover:to-white/50 dark:hover:from-green-900/20 dark:hover:to-gray-700/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-green-200 dark:border-green-700 shadow-md"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">
                              {author.name}
                            </h4>
                            {author.articles_count > 0 && (
                              <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                                <PlusCircle className="w-3 h-3" />
                                Article {author.articles_count}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                            {author.job_title} {author.company && `at ${author.company}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {completedAuthors.length === 0 && (
                  <div className="text-center py-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/20">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No authors with avatars</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">in the last 30 days</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Articles Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <PlusCircle className="w-4 h-4 text-white" />
                  </div>
                  Recent Articles ({data?.recent_articles.length || 0})
                </h3>
                <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded-full">
                  Last 30 days
                </span>
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {data?.recent_articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="block group"
                  >
                    <div className="p-4 rounded-2xl border border-orange-200/50 dark:border-orange-800/30 bg-gradient-to-br from-orange-50/50 to-white/30 dark:from-orange-900/10 dark:to-gray-800/30 backdrop-blur-sm hover:from-orange-100/70 hover:to-white/50 dark:hover:from-orange-900/20 dark:hover:to-gray-700/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 mb-3">
                        {article.title}
                      </h4>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{article.author_name}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span className="font-medium">{article.read_count.toLocaleString()}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(article.published_at)}
                        </span>
                        <div className="flex items-center gap-2">
                          {article.comment_count && article.comment_count > 0 && (
                            <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                              <MessageSquare className="w-3 h-3" />
                              {article.comment_count}
                            </span>
                          )}
                          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {(!data?.recent_articles || data.recent_articles.length === 0) && (
                  <div className="text-center py-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/20">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No articles published</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">in the last 30 days</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Comments Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  Recent Comments ({data?.recent_comments.length || 0})
                </h3>
                <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded-full">
                  Community
                </span>
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {data?.recent_comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-2xl border border-purple-200/50 dark:border-purple-800/30 bg-gradient-to-br from-purple-50/50 to-white/30 dark:from-purple-900/10 dark:to-gray-800/30 backdrop-blur-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 flex-1">
                        "{comment.content}"
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span className="font-medium">
                        by {comment.author_name || comment.anonymous_name || "Anonymous"}
                      </span>
                      <span>{formatRelativeTime(comment.created_at)}</span>
                    </div>
                    
                    <Link
                      href={`/articles/${comment.article_slug}`}
                      className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      <Zap className="w-3 h-3" />
                      <span className="truncate">"{comment.article_title}"</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
                
                {(!data?.recent_comments || data.recent_comments.length === 0) && (
                  <div className="text-center py-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/20">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">in the last 30 days</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}