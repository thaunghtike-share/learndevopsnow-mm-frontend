"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { useAuth } from "@/app/[locale]/auth/hooks/use-auth";
import AuthModal from "@/app/[locale]/auth/auth-modal";
import {
  FileText,
  Eye,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  Folder,
  Tag as TagIcon,
  BarChart3,
  Edit,
  Crown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader,
  AlertTriangle,
  Clock,
  Users,
  Award,
  Zap,
  Target,
  BookOpen,
  ShieldOff,
  Ban,
  MessageSquare,
  Heart,
  ThumbsUp,
  Lightbulb,
  BarChart2,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import BanNotification from "@/components/BanNotification";
import ProtectedAction from "@/components/ProtectedAction";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  ChartOptions,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface Article {
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
  reactions_summary?: {
    like?: number;
    love?: number;
    celebrate?: number;
    insightful?: number;
  };
}

interface TrashArticle extends Article {
  days_in_trash: number;
  days_remaining: number;
  can_restore: boolean;
  author_name: string;
  author_avatar: string;
  deleted_at?: string;
}

interface Author {
  id: number;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  job_title: string;
  company: string;
  linkedin?: string;
  articles: Article[];
  is_banned?: boolean;
}

interface BanStatus {
  is_banned: boolean;
  banned_reason?: string;
}

interface BanDetails {
  is_banned: boolean;
  reason: string;
  banned_at: string;
  banned_by: string;
  banned_until?: string;
  is_temporary: boolean;
}

// Keep the original AuthorStatsPieChart component (unchanged)
function AuthorStatsPieChart({
  data,
  title = "Articles by Author",
  height = 280,
}: {
  data: { author: string; count: number }[];
  title?: string;
  height?: number;
}) {
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartKey, setChartKey] = useState(Date.now());

  useEffect(() => {
    setIsClient(true);

    // Check for dark mode
    const checkDarkMode = () => {
      if (typeof window !== "undefined") {
        const html = document.documentElement;
        const isDark = html.classList.contains("dark");
        setIsDarkMode(isDark);
        setChartKey(Date.now());
      }
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  // Sort by count and take top 8
  const topAuthors = [...data].sort((a, b) => b.count - a.count).slice(0, 8);

  // Standard pie chart colors
  const generateColors = (count: number) => {
    const standardColors = [
      "rgba(255, 99, 132, 0.8)", // Red
      "rgba(54, 162, 235, 0.8)", // Blue
      "rgba(255, 206, 86, 0.8)", // Yellow
      "rgba(75, 192, 192, 0.8)", // Teal
      "rgba(153, 102, 255, 0.8)", // Purple
      "rgba(255, 159, 64, 0.8)", // Orange
      "rgba(199, 199, 199, 0.8)", // Gray
      "rgba(83, 102, 255, 0.8)", // Indigo
    ];

    return standardColors.slice(0, count);
  };

  const chartData = {
    labels: topAuthors.map((item) =>
      item.author.length > 15
        ? item.author.substring(0, 15) + "..."
        : item.author
    ),
    datasets: [
      {
        label: "Articles",
        data: topAuthors.map((item) => item.count),
        backgroundColor: generateColors(topAuthors.length),
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: isDarkMode ? "#ffffff" : "#000000", // White in dark mode, Black in light mode
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
          padding: 10,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: isDarkMode
          ? "rgba(30, 41, 59, 0.95)"
          : "rgba(15, 23, 42, 0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = topAuthors.reduce((sum, item) => sum + item.count, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} articles (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
        </div>
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        <Pie key={chartKey} data={chartData} options={options} />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-black dark:text-gray-400">
              Most Articles
            </span>
          </div>
          <div className="text-sm font-medium text-black dark:text-white text-right">
            {topAuthors[0]?.author}: {topAuthors[0]?.count} articles
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep the Bar chart component for "Your Top Articles" only
function AuthorViewsBarChart({
  data,
  title = "Views by Author",
  height = 280,
}: {
  data: { author: string; views: number }[];
  title?: string;
  height?: number;
}) {
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartKey, setChartKey] = useState(Date.now());

  useEffect(() => {
    setIsClient(true);

    // Check for dark mode
    const checkDarkMode = () => {
      if (typeof window !== "undefined") {
        const html = document.documentElement;
        const isDark = html.classList.contains("dark");
        setIsDarkMode(isDark);
        setChartKey(Date.now());
      }
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  // Sort by views and take top 8
  const topAuthors = [...data].sort((a, b) => b.views - a.views).slice(0, 8);

  // Generate colors for bars
  const generateBarColors = (count: number) => {
    const colors = [
      "rgba(34, 197, 94, 0.8)", // Green
      "rgba(59, 130, 246, 0.8)", // Blue
      "rgba(168, 85, 247, 0.8)", // Purple
      "rgba(245, 158, 11, 0.8)", // Amber
      "rgba(239, 68, 68, 0.8)", // Red
      "rgba(14, 165, 233, 0.8)", // Sky
      "rgba(20, 184, 166, 0.8)", // Teal
      "rgba(249, 115, 22, 0.8)", // Orange
    ];

    return colors.slice(0, count);
  };

  const chartData = {
    labels: topAuthors.map((item) =>
      item.author.length > 15
        ? item.author.substring(0, 15) + "..."
        : item.author
    ),
    datasets: [
      {
        label: "Views",
        data: topAuthors.map((item) => item.views),
        backgroundColor: generateBarColors(topAuthors.length),
        borderColor: generateBarColors(topAuthors.length).map((color) =>
          color.replace("0.8", "1")
        ),
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: generateBarColors(topAuthors.length).map(
          (color) => color.replace("0.8", "1")
        ),
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDarkMode ? "#ffffff" : "#000000", // White in dark mode, Black in light mode
          font: {
            size: 11,
            family: "Inter, sans-serif",
          },
          callback: (value) => {
            if (typeof value === "number") {
              if (value >= 1000) return (value / 1000).toFixed(1) + "k";
              return value.toString();
            }
            return value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? "#ffffff" : "#000000", // White in dark mode, Black in light mode
          font: {
            size: 11,
            family: "Inter, sans-serif",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode
          ? "rgba(30, 41, 59, 0.95)"
          : "rgba(15, 23, 42, 0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = topAuthors.reduce((sum, item) => sum + item.views, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${
              context.dataset.label
            }: ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
        </div>
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        <Bar key={chartKey} data={chartData} options={options} />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm text-black dark:text-gray-400">
              Most Viewed
            </span>
          </div>
          <div className="text-sm font-medium text-black dark:text-white text-right">
            {topAuthors[0]?.author}: {topAuthors[0]?.views.toLocaleString()}{" "}
            views
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  article,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  article: Article | null;
  isLoading: boolean;
}) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-[#000000]/80 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-slate-600 dark:text-gray-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Delete Article
            </h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              This article will be moved to Trash and can be restored within 7
              days.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-slate-700 dark:text-gray-300 font-medium mb-2">
            Delete &ldquo;{article.title}&rdquo;?
          </p>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            This article has {article.read_count?.toLocaleString()} views and
            will be moved to the trash.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-800 dark:bg-gray-700 text-white rounded-xl hover:bg-slate-900 dark:hover:bg-gray-600 transition-all duration-200 font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function RestoreSuccessAlert({
  message,
  isVisible,
}: {
  message: string | null;
  isVisible: boolean;
}) {
  if (!isVisible || !message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100]"
    >
      <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-2xl p-4 max-w-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-emerald-600 dark:text-emerald-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-emerald-800 dark:text-emerald-200 font-medium">
              {message}
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 text-sm">
              The article will appear in your articles list shortly.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AuthorAdminDashboard() {
  const { slug } = useParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [banDetails, setBanDetails] = useState<BanDetails | null>(null);
  const articlesPerPage = 8;
  const [allArticlesStats, setAllArticlesStats] = useState<
    Array<{
      id: number;
      title: string;
      read_count: number;
      author_name: string;
      slug: string;
    }>
  >([]);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [restoringSlug, setRestoringSlug] = useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);
  const [showRestoreSuccess, setShowRestoreSuccess] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    article: Article | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    article: null,
    isLoading: false,
  });

  // NEW: Trash articles state
  const [trashArticles, setTrashArticles] = useState<TrashArticle[]>([]);
  const [trashLoading, setTrashLoading] = useState(false);
  const [articlesByAuthorData, setArticlesByAuthorData] = useState([]);
  const [viewsByAuthorData, setViewsByAuthorData] = useState([]);
  const [yourTopArticlesData, setYourTopArticlesData] = useState([]);
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [chartsError, setChartsError] = useState<string | null>(null);
  const [initialAuthCheck, setInitialAuthCheck] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false); // Add this

  const calculateReadTime = (content?: string) => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const checkBanStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const endpoints = [
        `${API_BASE_URL}/ban-details/`,
        `${API_BASE_URL}/api/ban-details/`,
      ];

      let response = null;
      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          if (response.ok) break;
        } catch (error) {
          console.warn(`Failed to fetch from ${endpoint}:`, error);
        }
      }

      if (response && response.ok) {
        const data: BanDetails = await response.json();
        if (data.is_banned) {
          setBanDetails(data);
        }
      }
    } catch (error) {
      console.error("Error checking ban status:", error);
    }
  };

  // Add this function to lazy load charts
  const loadChartsData = async () => {
    if (chartsLoaded || loadingCharts) return;

    try {
      setLoadingCharts(true);
      setChartsError(null);

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/authors/me/dashboard/charts/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setArticlesByAuthorData(data.articles_by_author || []);
        setViewsByAuthorData(data.views_by_author || []);
        setYourTopArticlesData(data.your_top_articles || []);
        setChartsLoaded(true);
      } else {
        throw new Error("Failed to load charts");
      }
    } catch (err) {
      console.error("Error loading charts:", err);
      setChartsError("Failed to load analytics");
    } finally {
      setLoadingCharts(false);
    }
  };

  // Add this useEffect to load charts when component mounts
  useEffect(() => {
    if (author && !chartsLoaded && !loadingCharts) {
      // Load charts after a short delay to prioritize main content
      const timer = setTimeout(() => {
        loadChartsData();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [author, chartsLoaded, loadingCharts]);

  // NEW: Fetch trash articles
  const fetchTrashArticles = async () => {
    try {
      setTrashLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/articles/trash/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTrashArticles(data);
      }
    } catch (error) {
      console.error("Error fetching trash articles:", error);
    } finally {
      setTrashLoading(false);
    }
  };

  useEffect(() => {
    if (showRestoreSuccess) {
      const timer = setTimeout(() => {
        setShowRestoreSuccess(false);
        setRestoreSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showRestoreSuccess]);

  useEffect(() => {
    // Quick token check - no delay
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      setError("Please login to access your dashboard");
      setLoading(false);
      return;
    }
    setInitialAuthCheck(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && initialAuthCheck) {
      setShowLoginModal(true);
      setError("Please login to access your dashboard");
      setLoading(false);
    }
  }, [isAuthenticated, isLoading, initialAuthCheck]);

  useEffect(() => {
    async function fetchAuthorData() {
      if (!isAuthenticated || isLoading) return;

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        // Check cache first for faster loading
        const cacheKey = `author_dashboard_cache_${slug}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          // Use cache if less than 30 seconds old
          if (Date.now() - timestamp < 30000) {
            if (data.author.slug !== slug) {
              router.push(`/admin/author/${data.author.slug}`);
              return;
            }

            setAuthor({
              ...data.author,
              articles: data.articles || [],
            });

            // Load fresh data in background
            setTimeout(() => fetchFreshData(token, cacheKey), 100);
            return;
          }
        }

        // SINGLE API CALL - no artificial delays
        await fetchFreshData(token, cacheKey);
      } catch (err) {
        console.error("Error fetching author data:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    if (slug && isAuthenticated && !isLoading) {
      fetchAuthorData();
    }
  }, [slug, isAuthenticated, isLoading, router]);

  // Helper function for fresh data
  const fetchFreshData = async (token: string, cacheKey?: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/authors/me/dashboard/optimized/`,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        // Use cache for faster subsequent loads
        next: { revalidate: 30 },
      }
    );

    if (res.status === 401) {
      localStorage.removeItem("token");
      setShowLoginModal(true);
      return;
    }

    if (res.status === 403) {
      throw new Error("You don't have permission to access this dashboard");
    }

    if (!res.ok) {
      throw new Error(`Failed to load author data: ${res.status}`);
    }

    const data = await res.json();

    if (data.author.slug !== slug) {
      router.push(`/admin/author/${data.author.slug}`);
      return;
    }

    // Set all data from single response
    setAuthor({
      ...data.author,
      articles: data.articles || [],
    });

    // Cache the data for faster future loads
    if (cacheKey) {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    }

    // Parallel loading of non-critical data
    Promise.all([checkBanStatus(), fetchTrashArticles()]).catch((error) => {
      console.error("Error loading additional data:", error);
      // Non-critical errors - don't block the UI
    });
  };

  const handleDeleteArticle = async (articleSlug: string) => {
    setDeleteModal((prev) => ({ ...prev, isLoading: true }));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/articles/${articleSlug}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      }

      if (response.status === 403) {
        throw new Error("You don't have permission to delete this article");
      }

      if (!response.ok) {
        throw new Error(`Failed to delete article: ${response.status}`);
      }

      setAuthor((prev) =>
        prev
          ? {
              ...prev,
              articles: prev.articles.filter(
                (article) => article.slug !== articleSlug
              ),
            }
          : null
      );

      // Refresh trash articles after deletion
      await fetchTrashArticles();

      setDeleteModal({ isOpen: false, article: null, isLoading: false });
      console.log("Article deleted successfully");
    } catch (err) {
      console.error("Error deleting article:", err);
      setError((err as Error).message);
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleRestoreArticle = async (articleSlug: string) => {
    try {
      setRestoringSlug(articleSlug);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/articles/${articleSlug}/restore/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        // Remove from trash list
        setTrashArticles((prev) =>
          prev.filter((article) => article.slug !== articleSlug)
        );

        // Show success message
        const restoredArticle = trashArticles.find(
          (a) => a.slug === articleSlug
        );
        setRestoreSuccess(
          `"${restoredArticle?.title}" has been restored successfully!`
        );
        setShowRestoreSuccess(true);

        // Add a small delay to show the success message before refreshing
        setTimeout(async () => {
          // Refresh author articles
          const authorRes = await fetch(
            `${API_BASE_URL}/authors/me/dashboard/`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          if (authorRes.ok) {
            const data = await authorRes.json();
            setAuthor({
              ...data,
              articles: data.articles || [],
            });
          }

          setRestoringSlug(null);
        }, 1500);
      } else {
        throw new Error("Failed to restore article");
      }
    } catch (error) {
      console.error("Error restoring article:", error);
      alert("Failed to restore article");
      setRestoringSlug(null);
    }
  };

  // NEW: Handle permanent delete from trash
  const handlePermanentDelete = async (articleSlug: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this article? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/articles/${articleSlug}/permanent-delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        // Remove from trash list
        setTrashArticles((prev) =>
          prev.filter((article) => article.slug !== articleSlug)
        );
      }
    } catch (error) {
      console.error("Error permanently deleting article:", error);
      alert("Failed to delete article");
    }
  };

  const openDeleteModal = (article: Article) => {
    setDeleteModal({
      isOpen: true,
      article,
      isLoading: false,
    });
  };

  const closeDeleteModal = () => {
    if (!deleteModal.isLoading) {
      setDeleteModal({
        isOpen: false,
        article: null,
        isLoading: false,
      });
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setError(null);
    window.location.reload();
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const totalArticles = author?.articles?.length || 0;
  const totalViews =
    author?.articles?.reduce(
      (sum, article) => sum + (article.read_count || 0),
      0
    ) || 0;
  const avgViews =
    totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

  const totalComments =
    author?.articles?.reduce(
      (sum, article) => sum + (article.comment_count || 0),
      0
    ) || 0;

  const totalReactions = author?.articles?.reduce((sum, article) => {
    const reactions = article.reactions_summary || {};
    return (
      sum +
      (reactions.like || 0) +
      (reactions.love || 0) +
      (reactions.celebrate || 0) +
      (reactions.insightful || 0)
    );
  }, 0);

  const totalReadTime =
    author?.articles?.reduce(
      (sum, article) => sum + calculateReadTime(article.content),
      0
    ) || 0;
  const avgReadTime =
    totalArticles > 0 ? Math.round(totalReadTime / totalArticles) : 0;

  const getAuthorTier = () => {
    if (totalViews > 100000)
      return {
        name: "Elite",
        color: "from-purple-600 to-pink-600",
        icon: Award,
      };
    if (totalViews > 50000)
      return {
        name: "Expert",
        color: "from-amber-500 to-orange-600",
        icon: Zap,
      };
    if (totalViews > 10000)
      return {
        name: "Pro",
        color: "from-emerald-500 to-green-600",
        icon: TrendingUp,
      };
    return { name: "Rising", color: "from-blue-500 to-cyan-600", icon: Users };
  };

  const authorTier = getAuthorTier();
  const TierIcon = authorTier.icon;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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
        truncate(cleanContent, 120) || "Read the full article to learn more..."
      );
    }

    return "Read the full article to learn more...";
  };

  const truncate = (str: string, max = 150) =>
    str.length <= max ? str : str.slice(0, max) + "...";

  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const paginatedArticles =
    author?.articles?.slice(
      (currentPage - 1) * articlesPerPage,
      currentPage * articlesPerPage
    ) || [];

  // These should work with the lazy-loaded data:
  const prepareArticlesByAuthorData = () => {
    return articlesByAuthorData || [];
  };

  const prepareViewsByAuthorData = () => {
    return viewsByAuthorData || [];
  };

  const prepareViewsData = () => {
    return yourTopArticlesData || [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300">
        <MinimalHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-600 mx-auto mb-6"></div>
              <p className="text-slate-700 dark:text-gray-300 text-lg font-medium">
                Checking authentication...
              </p>
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

      <BanNotification />

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl font-bold"
            >
              ×
            </button>
            <AuthModal onSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDeleteArticle(deleteModal.article?.slug || "")}
        article={deleteModal.article}
        isLoading={deleteModal.isLoading}
      />

      <RestoreSuccessAlert
        message={restoreSuccess}
        isVisible={showRestoreSuccess}
      />

      <main className="px-6 md:px-11 md:py-8 relative z-10">
        {!isAuthenticated && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Access Required
            </h1>
            <p className="text-lg text-black dark:text-gray-300 mb-8 max-w-md mx-auto">
              Please login to access your admin dashboard
            </p>
          </div>
        )}
        {isAuthenticated && loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-600 mx-auto mb-6"></div>
              <p className="text-slate-700 dark:text-gray-300 text-lg font-medium">
                Loading your dashboard...
              </p>
            </div>
          </div>
        )}
        {isAuthenticated && error && !loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
                {error.includes("permission") || error.includes("403")
                  ? "Access Denied"
                  : "Error Loading Dashboard"}
              </h1>
              <p className="text-lg text-black dark:text-gray-300 mb-8 max-w-md mx-auto">
                {error}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        )}
        {isAuthenticated && author && !loading && !error && (
          <>
            {/* MOBILE OPTIMIZED HEADER SECTION */}
            <section className="w-full mb-12 md:mb-16">
              <div className="mb-8 md:mb-12">
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <span className="text-xs md:text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    Author Dashboard
                  </span>
                </div>
                <h1 className="text-3xl md:text-7xl font-light text-black dark:text-white mb-4 md:mb-6 tracking-tight">
                  Welcome back, {author?.name}
                </h1>
              </div>

              {banDetails && (
                <div className="mb-6 p-4 md:p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex-shrink-0">
                      <Ban className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400 mt-0.5 md:mt-1" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-red-800 dark:text-red-200 mb-1 md:mb-2">
                        Account Banned
                      </h3>
                      <p className="text-red-700 dark:text-red-300 text-sm md:text-base mb-2 md:mb-3">
                        {banDetails.reason ||
                          "Your account has been suspended due to violations of our community guidelines."}
                      </p>
                      <div className="text-xs md:text-sm text-red-600 dark:text-red-400 space-y-1">
                        <p>
                          <strong>Banned on:</strong>{" "}
                          {new Date(banDetails.banned_at).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Banned by:</strong> {banDetails.banned_by}
                        </p>
                        {banDetails.is_temporary && banDetails.banned_until && (
                          <p>
                            <strong>Ban expires:</strong>{" "}
                            {new Date(
                              banDetails.banned_until
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-12 mb-12 md:mb-16">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                      <img
                        src={author?.avatar || "/placeholder.svg"}
                        alt={author?.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-gradient-to-r from-amber-500 to-orange-600 p-2 md:p-3 rounded-full shadow-2xl border-2 border-white dark:border-gray-800">
                      <Crown className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  {author?.job_title && author?.company && (
                    <p className="text-base md:text-xl text-blue-600 font-medium mb-4 md:mb-6">
                      {author.job_title} at {author.company}
                    </p>
                  )}

                  <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed mb-6 md:mb-8 max-w-2xl">
                    {author?.bio}
                  </p>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                    <ProtectedAction action="create new articles">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href="/admin/new-article"
                          className="inline-flex items-center gap-2 md:gap-3 px-4 py-3 md:px-8 md:py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl md:rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 shadow-lg text-sm md:text-base w-full sm:w-auto justify-center"
                        >
                          <Plus className="w-4 h-4 md:w-5 md:h-5" />
                          Write New Article
                        </Link>
                      </motion.div>
                    </ProtectedAction>

                    <Link
                      href={`/authors/${author?.slug}`}
                      className="inline-flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg md:rounded-xl font-semibold hover:shadow-xl transition-all duration-300 shadow-md text-sm md:text-base w-full sm:w-auto justify-center"
                    >
                      View Public Profile
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </Link>

                    {user?.is_super_user && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href="/admin/superuser"
                          className="inline-flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg md:rounded-xl font-semibold hover:shadow-xl transition-all duration-300 shadow-md border-2 border-purple-400/30 text-sm md:text-base w-full sm:w-auto justify-center"
                        >
                          <Crown className="w-4 h-4 md:w-5 md:h-5" />
                          Superuser Dashboard
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* MOBILE OPTIMIZED STATS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12 max-w-4xl mx-auto text-center py-8 md:py-12">
                <div className="space-y-2 md:space-y-3">
                  <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
                    {totalArticles}
                  </div>
                  <div className="text-xs md:text-sm text-blue-600 font-semibold uppercase tracking-wider">
                    Articles
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
                    {totalViews.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm text-green-600 font-semibold uppercase tracking-wider">
                    Total Views
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
                    {totalComments}
                  </div>
                  <div className="text-xs md:text-sm text-pink-600 font-semibold uppercase tracking-wider">
                    Total Comments
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
                    {totalReactions}
                  </div>
                  <div className="text-xs md:text-sm text-amber-600 font-semibold uppercase tracking-wider">
                    Total Reactions
                  </div>
                </div>
              </div>

              {/* BAR CHARTS SECTION - Lazy Loaded */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12 md:mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white">
                      Platform Analytics
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Real statistics based on all platform articles
                    </p>
                  </div>
                </div>

                {/* Lazy Loading Charts */}
                {!chartsLoaded ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Placeholder for first chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-500" />
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Articles Distribution
                          </h3>
                        </div>
                      </div>
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Loading analytics...
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Placeholder for second chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-emerald-500" />
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Your Top Articles
                          </h3>
                        </div>
                      </div>
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <Loader className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-2" />
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Loading top articles...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : chartsError ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-red-600 dark:text-red-400">
                      {chartsError}
                    </p>
                    <button
                      onClick={loadChartsData}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AuthorStatsPieChart
                      data={prepareArticlesByAuthorData()}
                      title="Articles Distribution"
                    />
                    <AuthorViewsBarChart
                      data={prepareViewsData()}
                      title="Your Top Articles"
                      height={280}
                    />
                  </div>
                )}
              </motion.div>
            </section>

            {/* MOBILE OPTIMIZED ARTICLES SECTION */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl overflow-hidden mb-12 md:mb-16"
            >
              <div className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
                  <div>
                    <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1 md:mb-2">
                      Your Articles
                    </h2>
                    <p className="text-xs md:text-base text-slate-600 dark:text-gray-400 font-medium">
                      {totalArticles} articles • {totalViews.toLocaleString()}{" "}
                      reads
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs md:text-sm text-slate-500 dark:text-gray-500 font-medium">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                </div>
              </div>

              {author?.articles && author.articles.length === 0 ? (
                <div className="text-center py-12 md:py-20">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl">
                    <FileText className="w-6 h-6 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 md:mb-4">
                    Ready to Share Your Knowledge?
                  </h3>
                  <p className="text-sm md:text-lg text-slate-600 dark:text-gray-400 mb-6 md:mb-8 font-medium max-w-md mx-auto px-4">
                    Create your first article and start building your audience.
                  </p>
                  <ProtectedAction action="create new articles">
                    <Link
                      href="/admin/new-article"
                      className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl md:rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 shadow-lg text-sm md:text-base"
                    >
                      <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      Create Your First Article
                    </Link>
                  </ProtectedAction>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-slate-200/50 dark:divide-gray-700">
                    {paginatedArticles.map((article, index) => {
                      const previewText = getCleanExcerpt(article);
                      const coverImage = getCoverImage(article);
                      const readTime = calculateReadTime(article.content);
                      const reactions = article.reactions_summary || {};

                      return (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 md:p-8 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 group border-b border-slate-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex flex-col gap-4 md:gap-8 md:flex-row items-start">
                            {/* MOBILE OPTIMIZED COVER */}
                            <div className="flex-shrink-0 w-full md:w-32 h-24 md:h-32 rounded-xl md:rounded-2xl overflow-hidden border border-slate-200/50 dark:border-gray-600 shadow-lg group-hover:shadow-xl transition-all duration-300 relative">
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

                            {/* MOBILE OPTIMIZED CONTENT */}
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
                                  <Search className="w-3 h-3 md:w-4 md:h-4 text-sky-600" />
                                  {article.read_count?.toLocaleString()} views
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                                  <MessageSquare className="w-3 h-3 md:w-4 md:h-4 text-pink-600 dark:text-pink-400" />
                                  {article.comment_count || 0}
                                </span>
                              </div>

                              <h3 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white mb-2 md:mb-3 line-clamp-2 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
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

                              <p className="text-black dark:text-gray-400 text-sm md:text-lg line-clamp-2 mb-3 md:mb-4 font-medium leading-relaxed">
                                {previewText}
                              </p>

                              {article.tags && article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-0">
                                  {article.tags.slice(0, 3).map((tag) => (
                                    <span
                                      key={tag.id}
                                      className="inline-flex items-center gap-1 bg-slate-100/80 dark:bg-gray-700 text-slate-700 dark:text-gray-300 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-medium border border-slate-200/50 dark:border-gray-600"
                                    >
                                      <TagIcon className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                                      {tag.name}
                                    </span>
                                  ))}
                                  {article.tags.length > 3 && (
                                    <span className="inline-flex items-center bg-slate-100/80 dark:bg-gray-700 text-slate-600 dark:text-gray-400 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-medium border border-slate-200/50 dark:border-gray-600">
                                      +{article.tags.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* MOBILE OPTIMIZED ACTION BUTTONS */}
                            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end md:justify-start">
                              <ProtectedAction action="edit articles">
                                <Link
                                  href={`/admin/edit-article/${article.slug}`}
                                  className="inline-flex items-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-105 text-xs md:text-sm w-full md:w-auto justify-center"
                                >
                                  <Edit className="w-3 h-3 md:w-4 md:h-4" />
                                  Edit
                                </Link>
                              </ProtectedAction>
                              <ProtectedAction action="delete articles">
                                <button
                                  onClick={() => openDeleteModal(article)}
                                  className="inline-flex items-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-105 text-xs md:text-sm w-full md:w-auto justify-center"
                                >
                                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                                  Delete
                                </button>
                              </ProtectedAction>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* MOBILE OPTIMIZED PAGINATION */}
                  {totalPages > 1 && (
                    <div className="px-4 md:px-8 py-4 md:py-6 border-t border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
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
                                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md"
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

            {/* TRASH SECTION - ADDED AT THE END */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
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
                    Articles you delete will appear here and can be restored
                    within 7 days
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200/50 dark:divide-gray-700">
                  {trashArticles.map((article, index) => {
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
                          {/* Article Info */}
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

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end md:justify-start">
                            {canRestore && (
                              <button
                                onClick={() =>
                                  handleRestoreArticle(article.slug)
                                }
                                disabled={
                                  restoringSlug === article.slug || !canRestore
                                }
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
                              onClick={() =>
                                handlePermanentDelete(article.slug)
                              }
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
              )}
            </motion.section>

            {/* Bottom spacing */}
            <div className="h-8 md:h-16"></div>
          </>
        )}
      </main>

      <MinimalFooter />
    </div>
  );
}
