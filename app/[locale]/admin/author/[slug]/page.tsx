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
  Plus,
  ArrowRight,
  Calendar,
  Folder,
  TagIcon,
  Edit,
  Crown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertTriangle,
  Clock,
  Ban,
  MessageSquare,
  Heart,
  ThumbsUp,
  Lightbulb,
  Search,
  Bookmark,
  Bell,
  Menu,
  X,
  Settings,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import BanNotification from "@/components/BanNotification";
import ProtectedAction from "@/components/ProtectedAction";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from "chart.js";
import DashboardNotificationSection from "@/app/[locale]/admin/author/[slug]/components/DashboardNotificationSection";
import NotificationSettings from "./components/NotificationSettings";

import AuthorViewsBarChart from "./components/AuthorViewsBarChart";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import RestoreSuccessAlert from "./components/RestoreSuccessAlert";
import TrashSection from "./components/TrashSection";
import SavedPostsSection from "./components/SavedPostsSection";
import StatsSection from "./components/StatsSection";

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

interface BanDetails {
  is_banned: boolean;
  reason: string;
  banned_at: string;
  banned_by: string;
  banned_until?: string;
  is_temporary: boolean;
}

type ActiveSection =
  | "articles"
  | "stats"
  | "saved"
  | "trash"
  | "notifications"
  | "settings";

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
  const [restoringSlug, setRestoringSlug] = useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);
  const [showRestoreSuccess, setShowRestoreSuccess] = useState(false);
  // Remove autoHideEnabled state
  // const [autoHideEnabled, setAutoHideEnabled] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    article: Article | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    article: null,
    isLoading: false,
  });

  // Trash articles state
  const [trashArticles, setTrashArticles] = useState<TrashArticle[]>([]);
  const [trashLoading, setTrashLoading] = useState(false);
  const [articlesByAuthorData, setArticlesByAuthorData] = useState([]);
  const [yourTopArticlesData, setYourTopArticlesData] = useState([]);
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [chartsError, setChartsError] = useState<string | null>(null);
  const [initialAuthCheck, setInitialAuthCheck] = useState(false);

  // Active section and sidebar state
  const [activeSection, setActiveSection] = useState<ActiveSection>("articles");
  // Remove sidebarHovered state since we don't need auto-hide
  // const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Saved articles state
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [unsavingId, setUnsavingId] = useState<number | null>(null);

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

  // Fetch saved articles
  const fetchSavedArticles = async () => {
    try {
      setSavedLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/articles/saved/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform the data to match the component's expected structure
        const transformedData = data.map((item: any) => ({
          id: item.id,
          article: {
            id: item.article_details?.id || item.article?.id,
            slug: item.article_details?.slug || item.article?.slug,
            title: item.article_details?.title || item.article?.title,
            excerpt:
              item.article_details?.excerpt || item.article?.excerpt || "",
            cover_image:
              item.article_details?.cover_image || item.article?.cover_image,
            published_at:
              item.article_details?.published_at || item.article?.published_at,
            author_name:
              item.article_details?.author_name || item.article?.author_name,
            author_slug:
              item.article_details?.author_slug || item.article?.author_slug,
            read_time:
              item.article_details?.read_time || item.article?.read_time || 5,
            read_count:
              item.article_details?.read_count || item.article?.read_count || 0,
            comment_count:
              item.article_details?.comment_count ||
              item.article?.comment_count,
            reactions_summary:
              item.article_details?.reactions_summary ||
              item.article?.reactions_summary,
            category: item.article_details?.category || item.article?.category,
            tags: item.article_details?.tags || item.article?.tags || [],
          },
          saved_at: item.saved_at,
          notes: item.notes,
        }));
        setSavedArticles(transformedData);
      }
    } catch (error) {
      console.error("Error fetching saved articles:", error);
    } finally {
      setSavedLoading(false);
    }
  };

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

  useEffect(() => {
    if (author && !chartsLoaded && !loadingCharts) {
      const timer = setTimeout(() => {
        loadChartsData();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [author, chartsLoaded, loadingCharts]);

  // Fetch trash articles
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

        const cacheKey = `author_dashboard_cache_${slug}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 30000) {
            if (data.author.slug !== slug) {
              router.push(`/admin/author/${data.author.slug}`);
              return;
            }

            setAuthor({
              ...data.author,
              articles: data.articles || [],
            });

            setTimeout(() => fetchFreshData(token, cacheKey), 100);
            return;
          }
        }

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

  const fetchFreshData = async (token: string, cacheKey?: string) => {
    try {
      // Use a single optimized endpoint that returns everything
      const res = await fetch(
        `${API_BASE_URL}/authors/me/dashboard/optimized/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
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

      // Set author with all data including stats
      setAuthor({
        ...data.author,
        articles: data.articles || [],
      });

      // Also set stats from the optimized response
      if (data.stats) {
        // You can use these stats directly instead of calculating them
        console.log("Optimized stats received:", data.stats);
      }

      if (cacheKey) {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        );
      }

      // Now fetch only the additional data that's not in the optimized endpoint
      Promise.all([
        checkBanStatus(),
        fetchTrashArticles(),
        fetchSavedArticles(), // UNCOMMENT THIS LINE
      ]).catch((error) => {
        console.error("Error loading additional data:", error);
      });
    } catch (err) {
      console.error("Error fetching author data:", err);
      setError((err as Error).message);
    }
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

      await fetchTrashArticles();
      setDeleteModal({ isOpen: false, article: null, isLoading: false });
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
        setTrashArticles((prev) =>
          prev.filter((article) => article.slug !== articleSlug)
        );

        const restoredArticle = trashArticles.find(
          (a) => a.slug === articleSlug
        );
        setRestoreSuccess(
          `"${restoredArticle?.title}" has been restored successfully!`
        );
        setShowRestoreSuccess(true);

        setTimeout(async () => {
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

  const handleUnsaveArticle = async (articleId: number) => {
    try {
      setUnsavingId(articleId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/articles/saved/${articleId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        setSavedArticles((prev) =>
          prev.filter((article) => article.id !== articleId)
        );
      } else {
        throw new Error("Failed to unsave article");
      }
    } catch (error) {
      console.error("Error unsaving article:", error);
      alert("Failed to unsave article");
    } finally {
      setUnsavingId(null);
    }
  };

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

  const totalArticles = author?.articles?.length || 0;
  const totalViews =
    author?.articles?.reduce(
      (sum, article) => sum + (article.read_count || 0),
      0
    ) || 0;

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

  const prepareArticlesByAuthorData = () => {
    if (!articlesByAuthorData || !Array.isArray(articlesByAuthorData)) {
      return [];
    }

    return articlesByAuthorData.map((item: any) => ({
      name: item.name || "Unknown",
      article_count: item.article_count || 0,
    }));
  };

  const prepareViewsData = () => {
    if (!yourTopArticlesData || !Array.isArray(yourTopArticlesData)) {
      return [];
    }

    return yourTopArticlesData.map((item: any) => ({
      title: item.title || "Unknown",
      read_count: item.read_count || 0,
    }));
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
              onClick={() => setShowLoginModal(false)}
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

      <main className="relative z-10">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="fixed md:hidden left-4 top-4 z-50 p-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-full shadow-2xl"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex">
          <div className="hidden md:block relative">
            {/* Sidebar - ALWAYS VISIBLE */}
            <div className="h-screen sticky top-0 overflow-hidden shrink-0">
              {/* Sidebar Content */}
              <div className="h-full bg-white dark:bg-[#000000] relative transition-colors duration-300 border-r border-gray-200 dark:border-gray-700 shadow-xl flex flex-col w-64">
                {/* Navigation Items with vertical spacing */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
                  {[
                    {
                      id: "articles",
                      label: "Articles",
                      icon: FileText,
                      color: "text-blue-600 dark:text-blue-400",
                      bgColor: "bg-blue-100 dark:bg-blue-900/30",
                    },
                    {
                      id: "stats",
                      label: "Stats",
                      icon: BarChart3, // You'll need to import this icon
                      color: "text-purple-600 dark:text-purple-400",
                      bgColor: "bg-purple-100 dark:bg-purple-900/30",
                    },
                    {
                      id: "saved",
                      label: "Saved",
                      icon: Bookmark,
                      color: "text-emerald-600 dark:text-emerald-400",
                      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
                    },
                    {
                      id: "trash",
                      label: "Trash",
                      icon: Trash2,
                      color: "text-red-600 dark:text-red-400",
                      bgColor: "bg-red-100 dark:bg-red-900/30",
                    },
                    {
                      id: "notifications",
                      label: "Notifications",
                      icon: Bell,
                      color: "text-amber-600 dark:text-amber-400",
                      bgColor: "bg-amber-100 dark:bg-amber-900/30",
                    },
                    {
                      id: "settings",
                      label: "Settings",
                      icon: Settings,
                      color: "text-purple-600 dark:text-purple-400",
                      bgColor: "bg-purple-100 dark:bg-purple-900/30",
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as ActiveSection)}
                      className={`w-full flex items-center gap-3 px-3 py-4 rounded-xl transition-all duration-200 group ${
                        activeSection === item.id
                          ? `${item.bgColor} ${item.color} shadow-md`
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg ${item.bgColor} ${item.color} flex-shrink-0`}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium whitespace-nowrap">
                          {item.label}
                        </span>
                      </div>
                    </button>
                  ))}

                  {/* Vertical spacing */}
                  <div className="py-6"></div>

                  {/* Write New Button with vertical spacing */}
                  <div className="mt-4">
                    <ProtectedAction action="create new articles">
                      <Link
                        href="/admin/new-article"
                        className="w-full flex items-center gap-3 px-3 py-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:shadow-lg transition-all duration-200 group hover:from-sky-700 hover:to-blue-700"
                      >
                        <div className="p-3 rounded-lg bg-white/20 flex-shrink-0">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="font-medium whitespace-nowrap">
                          Write New Article
                        </span>
                      </Link>
                    </ProtectedAction>
                  </div>
                </nav>
              </div>
            </div>
          </div>
          {/* Mobile Sidebar Overlay */}
          {mobileMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 z-50 shadow-2xl md:hidden">
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="font-bold text-gray-800 dark:text-white text-lg">
                          Dashboard
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Manage your content
                        </p>
                      </div>
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <nav className="flex-1 p-4 space-y-1">
                    {[
                      {
                        id: "articles",
                        label: "Articles",
                        icon: FileText,
                        count: totalArticles,
                      },
                      {
                        id: "saved",
                        label: "Saved",
                        icon: Bookmark,
                        count: savedArticles.length,
                      },
                      {
                        id: "trash",
                        label: "Trash",
                        icon: Trash2,
                        count: trashArticles.length,
                      },
                      {
                        id: "notifications",
                        label: "Notifications",
                        icon: Bell,
                      },
                      {
                        id: "settings",
                        label: "Settings",
                        icon: Settings,
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id as ActiveSection);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                          activeSection === item.id
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.count !== undefined && (
                          <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                            {item.count}
                          </span>
                        )}
                      </button>
                    ))}
                    {/* Create New Button for mobile */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                      <ProtectedAction action="create new articles">
                        <Link
                          href="/admin/new-article"
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:shadow-lg transition-all duration-200 justify-center"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Plus className="w-5 h-5" />
                          <span className="font-medium">Write New</span>
                        </Link>
                      </ProtectedAction>
                    </div>
                  </nav>
                </div>
              </div>
            </>
          )}
          {/* Main Content */}
          <div className="flex-1 px-6 md:px-11 md:py-8">
            {/* Your entire original content here - everything remains exactly as you designed it */}
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
                {/* MOBILE OPTIMIZED HEADER SECTION - ALWAYS SHOWN */}
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
                              {new Date(
                                banDetails.banned_at
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Banned by:</strong> {banDetails.banned_by}
                            </p>
                            {banDetails.is_temporary &&
                              banDetails.banned_until && (
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
                </section>

                {/* MAIN CONTENT BASED ON ACTIVE SECTION */}
                {activeSection === "articles" && (
                  <>
                    {/* ARTICLES LIST SECTION - FIXED TO MATCH SAVED SECTION */}
                    <motion.section
                      key="articles"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
                          <div>
                            <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1 md:mb-2">
                              Your Articles
                            </h2>
                            <p className="text-xs md:text-base text-slate-600 dark:text-gray-400 font-medium">
                              {totalArticles} articles •{" "}
                              {totalViews.toLocaleString()} reads
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
                            Create your first article and start building your
                            audience.
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
                                className="p-4 md:p-8 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
                              >
                                <div className="flex flex-col gap-4 lg:gap-8 lg:flex-row items-start">
                                  {/* MOBILE OPTIMIZED COVER */}
                                  <div className="flex-shrink-0 w-full md:w-32 h-48 md:h-32 rounded-xl md:rounded-2xl overflow-hidden border border-slate-200/50 dark:border-gray-600 shadow-lg group-hover:shadow-xl transition-all duration-300 relative">
                                    <img
                                      src={coverImage}
                                      alt={article.title}
                                      className="object-cover group-hover:scale-110 transition-transform duration-500"
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
                                        {article.read_count?.toLocaleString()}{" "}
                                        views
                                      </span>
                                      <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                                        <MessageSquare className="w-3 h-3 md:w-4 md:h-4 text-pink-600 dark:text-pink-400" />
                                        {article.comment_count || 0}
                                      </span>
                                    </div>

                                    <h3 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white mb-2 md:mb-3 line-clamp-3 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
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

                                    {article.tags &&
                                      article.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-0">
                                          {article.tags
                                            .slice(0, 3)
                                            .map((tag) => (
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
                      )}

                      {/* MOBILE OPTIMIZED PAGINATION - MUST BE INSIDE THE SAME SECTION */}
                      {totalPages > 1 && (
                        <div className="px-4 md:px-8 py-4 md:py-6 border-t border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs md:text-sm text-slate-600 dark:text-gray-400 font-medium text-center sm:text-left">
                              Showing {paginatedArticles.length} of{" "}
                              {totalArticles} articles
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(1, prev - 1)
                                  )
                                }
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-slate-300 dark:border-gray-600 text-xs md:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md text-slate-700 dark:text-gray-300 flex-1 sm:flex-none justify-center"
                              >
                                <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="hidden xs:inline">
                                  Previous
                                </span>
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
                    </motion.section>
                  </>
                )}

                {activeSection === "stats" && (
                  <motion.section
                    key="stats"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl overflow-hidden mb-12 md:mb-16"
                  >
                    <StatsSection
                      totalArticles={totalArticles}
                      totalViews={totalViews}
                      totalComments={totalComments}
                      totalReactions={totalReactions || 0}
                      topArticles={prepareViewsData()}
                      articlesByAuthor={prepareArticlesByAuthorData()}
                      chartsLoaded={chartsLoaded}
                      loadingCharts={loadingCharts}
                    />
                  </motion.section>
                )}

                {/* SAVED POSTS SECTION */}
                {activeSection === "saved" && (
                  <motion.section
                    key="saved"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl overflow-hidden mb-12 md:mb-16"
                  >
                    <SavedPostsSection
                      savedArticles={savedArticles}
                      savedLoading={savedLoading}
                      onUnsaveArticle={handleUnsaveArticle}
                      unsavingId={unsavingId}
                    />
                  </motion.section>
                )}

                {/* TRASH SECTION */}
                {activeSection === "trash" && (
                  <motion.section
                    key="trash"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl overflow-hidden mb-12 md:mb-16"
                  >
                    <TrashSection
                      trashArticles={trashArticles}
                      trashLoading={trashLoading}
                      restoringSlug={restoringSlug}
                      onRestoreArticle={handleRestoreArticle}
                      onPermanentDelete={handlePermanentDelete}
                    />
                  </motion.section>
                )}

                {/* NOTIFICATIONS SECTION */}
                {activeSection === "notifications" && (
                  <motion.section
                    key="notifications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className=""
                  >
                    <DashboardNotificationSection />
                  </motion.section>
                )}

                {/* SETTINGS SECTION */}
                {activeSection === "settings" && (
                  <motion.section
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl overflow-hidden mb-12 md:mb-16"
                  >
                    <NotificationSettings />
                  </motion.section>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <MinimalFooter />
    </div>
  );
}
