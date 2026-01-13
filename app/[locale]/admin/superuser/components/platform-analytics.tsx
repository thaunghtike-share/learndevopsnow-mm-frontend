"use client";
import { useState, useEffect } from "react";
import { 
  Users, FileText, MessageSquare, Calendar, User, Eye, 
  ArrowUpRight, TrendingUp, Clock, CheckCircle, XCircle,
  Star, Target, BarChart3,
  Zap,
  PlusCircle,
  TrendingUp as TrendingUpIcon,
  Crown,
  Award,
  BookOpen,
  Hash
} from "lucide-react";
import Link from "next/link";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  total_views?: number;
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

interface AnalyticsData {
  new_authors: Author[];
  recent_articles: Article[];
  recent_comments: Comment[];
  stats: {
    total_new_authors: number;
    total_recent_articles: number;
    total_recent_comments: number;
    authors_with_completed_profiles: number;
    total_recent_views: number;
  };
  all_authors?: Author[];
}

// Pie Chart Component
function AllAuthorsPieChart({ 
  data 
}: { 
  data: { author: string; count: number }[];
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const html = document.documentElement;
      setIsDarkMode(html.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  const allAuthors = [...data].sort((a, b) => b.count - a.count);

  const generateColors = (count: number) => {
    const baseColors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#06B6D4',
    ];
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  const chartData = {
    labels: allAuthors.map(item => 
      item.author.length > 12 
        ? item.author.substring(0, 12) + "..." 
        : item.author
    ),
    datasets: [
      {
        label: 'Articles',
        data: allAuthors.map(item => item.count),
        backgroundColor: generateColors(allAuthors.length),
        borderColor: isDarkMode ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        hoverOffset: 15,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
          font: { size: 11, family: 'Inter, sans-serif' },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        titleColor: isDarkMode ? '#FFFFFF' : '#000000',
        bodyColor: isDarkMode ? '#D1D5DB' : '#000000',
        borderColor: isDarkMode ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = allAuthors.reduce((sum, item) => sum + item.count, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} articles (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Articles Distribution
          </h3>
        </div>
        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
          {allAuthors.length} authors
        </span>
      </div>
      <div className="relative h-80">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}

// Bar Chart Component
function AllAuthorsBarChart({ 
  data 
}: { 
  data: { author: string; views: number }[];
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const html = document.documentElement;
      setIsDarkMode(html.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  const allAuthors = [...data].sort((a, b) => b.views - a.views);

  const generateColors = (count: number) => {
    const baseColors = [
      '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
    ];
    return allAuthors.map((_, i) => baseColors[i % baseColors.length]);
  };

  const chartData = {
    labels: allAuthors.map(item => 
      item.author.length > 15 
        ? item.author.substring(0, 15) + "..." 
        : item.author
    ),
    datasets: [
      {
        label: 'Views',
        data: allAuthors.map(item => item.views),
        backgroundColor: generateColors(allAuthors.length),
        borderColor: generateColors(allAuthors.length),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? '#374151' : '#E5E7EB',
        },
        ticks: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
          font: { size: 11, family: 'Inter, sans-serif' },
          callback: (value) => {
            if (typeof value === 'number') {
              if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
              if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
              return value.toString();
            }
            return value;
          },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
          font: { size: 10, family: 'Inter, sans-serif' },
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        titleColor: isDarkMode ? '#FFFFFF' : '#000000',
        bodyColor: isDarkMode ? '#D1D5DB' : '#000000',
        borderColor: isDarkMode ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `Views: ${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingUpIcon className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Total Views
          </h3>
        </div>
        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full">
          {allAuthors.length} authors
        </span>
      </div>
      <div className="relative h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default function PlatformAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'authors' | 'articles' | 'comments'>('authors');

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
      console.log("📊 Analytics data:", analyticsData);
      
      // Fetch all authors separately if not included
      if (!analyticsData.all_authors) {
        const authorsRes = await fetch(`${API_BASE_URL}/super/authors/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (authorsRes.ok) {
          const authorsData = await authorsRes.json();
          analyticsData.all_authors = authorsData;
        }
      }
      
      setData(analyticsData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Get all authors with articles (excluding 0 articles)
  const authorsWithArticles = data?.all_authors?.filter(author => 
    author.articles_count > 0
  ) || [];

  // Sort by article count descending
  const sortedAuthors = [...authorsWithArticles].sort((a, b) => b.articles_count - a.articles_count);

  // Calculate total articles from all authors
  const totalArticlesAllAuthors = sortedAuthors.reduce((total, author) => total + author.articles_count, 0);

  // Prepare data for charts
  const prepareAllAuthorsArticlesData = () => {
    const authorMap = new Map<string, number>();
    sortedAuthors.forEach((author) => {
      authorMap.set(author.name, author.articles_count);
    });
    return Array.from(authorMap.entries())
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count);
  };

  const prepareAllAuthorsViewsData = () => {
    const authorMap = new Map<string, number>();
    sortedAuthors.forEach((author) => {
      if (author.total_views) {
        authorMap.set(author.name, author.total_views);
      }
    });
    return Array.from(authorMap.entries())
      .map(([author, views]) => ({ author, views }))
      .sort((a, b) => b.views - a.views);
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-800" />
        <div className="relative p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-black dark:text-white">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-800" />
        <div className="relative p-6">
          <div className="text-center py-8">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Simple background */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800" />
      
      <div className="relative">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Platform Analytics
                </h2>
                <p className="text-black dark:text-white text-sm">
                  Performance overview
                </p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('authors')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'authors'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Authors
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'articles'
                    ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400'
                    : 'text-black dark:text-white hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                Articles
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'comments'
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400'
                    : 'text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                Comments
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview - SIMPLE - Only 2 cards */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Authors */}
            <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-black dark:text-white mb-1">
                {sortedAuthors.length}
              </div>
              <p className="text-sm font-medium text-black dark:text-white">Active Authors</p>
            </div>
            
            {/* Total Articles */}
            <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-black dark:text-white mb-1">
                {totalArticlesAllAuthors}
              </div>
              <p className="text-sm font-medium text-black dark:text-white">Total Articles</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'authors' ? (
            <div className="space-y-8">
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AllAuthorsPieChart
                  data={prepareAllAuthorsArticlesData()}
                />
                <AllAuthorsBarChart
                  data={prepareAllAuthorsViewsData()}
                />
              </div>

              {/* YOUR EXACT ORIGINAL AUTHORS GRID - UNCHANGED */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                      Top Authors by Articles ({sortedAuthors.length})
                    </h3>
                    <p className="text-sm text-black dark:text-white mt-1">
                      Authors with published content, sorted by article count
                    </p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1.5 rounded-full font-medium">
                    All Active Authors
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedAuthors.map((author, index) => (
                    <Link
                      key={author.id}
                      href={`/admin/author/${author.slug}`}
                      className="group"
                    >
                      <div className="p-4 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-full">
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-blue-200 dark:border-blue-700 shadow-md">
                              <img
                                src={author.avatar}
                                alt={author.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-500 text-white' :
                              index === 1 ? 'bg-gray-400 text-white' :
                              index === 2 ? 'bg-amber-700 text-white' :
                              'bg-blue-500 text-white'
                            }`}>
                              {index + 1}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                {author.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium">
                                  <FileText className="w-3 h-3" />
                                  {author.articles_count}
                                </div>
                                {author.total_views && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium">
                                    <Eye className="w-3 h-3" />
                                    {author.total_views.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {author.job_title && (
                              <p className="text-sm text-black dark:text-white mb-2 truncate">
                                {author.job_title} {author.company && `at ${author.company}`}
                              </p>
                            )}
                            
                            {author.profile_complete && (
                              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <CheckCircle className="w-3 h-3" />
                                Complete
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'articles' ? (
            <div className="space-y-6">
              {/* YOUR EXACT ORIGINAL ARTICLE LIST - UNCHANGED */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    Recent Articles ({data?.recent_articles.length || 0})
                  </h3>
                  <p className="text-sm text-black dark:text-white mt-1">
                    Latest articles published
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.recent_articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group"
                  >
                    <div className="p-4 rounded-2xl border border-orange-200/50 dark:border-orange-800/30 bg-white dark:bg-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-orange-200 dark:border-orange-800 shadow-sm">
                          {article.cover_image ? (
                            <img
                              src={article.cover_image}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                              <FileText className="w-8 h-8 text-white/80" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-black dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 mb-2">
                            {article.title}
                          </h4>
                          
                          <div className="flex items-center justify-between text-sm text-black dark:text-white mb-3">
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
                            <div className="flex items-center gap-2">
                              {article.comment_count && article.comment_count > 0 && (
                                <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                                  <MessageSquare className="w-3 h-3" />
                                  {article.comment_count}
                                </span>
                              )}
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-black dark:text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* YOUR EXACT ORIGINAL COMMENTS LIST - UNCHANGED */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    Recent Comments ({data?.recent_comments?.length || 0})
                  </h3>
                  <p className="text-sm text-black dark:text-white mt-1">
                    Latest community interactions
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.recent_comments?.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-2xl border border-purple-200/50 dark:border-purple-800/30 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-black dark:text-white line-clamp-3 mb-3 font-medium">
                          "{comment.content}"
                        </p>
                        
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-medium text-black dark:text-white">
                            by {comment.author_name || comment.anonymous_name || "Anonymous"}
                          </span>
                        </div>
                        
                        <Link
                          href={`/articles/${comment.article_slug}`}
                          className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium"
                        >
                          <FileText className="w-3 h-3" />
                          <span className="truncate">"{comment.article_title}"</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}