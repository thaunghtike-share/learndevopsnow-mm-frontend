"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/[locale]/auth/hooks/use-auth";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import UserManagement from "./components/user-management";
import ArticleManagement from "./components/article-management";
import ImpersonationBanner from "./components/impersonation-banner";
import { Crown, AlertTriangle, Loader } from "lucide-react";
import PlatformAnalytics from "./components/platform-analytics";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface PlatformStats {
  total_authors: number;
  total_articles: number;
  total_comments: number;
  total_views: number;
}

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

export default function SuperUserDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSuperUser = user?.is_super_user;

  useEffect(() => {
    if (!isAuthenticated || isLoading || !isSuperUser) return;

    const fetchSuperData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [statsRes, articlesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/super/stats/`, {
            headers: { Authorization: `Token ${token}` },
          }),
          fetch(`${API_BASE_URL}/super/articles/`, {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);

        if (!statsRes.ok || !articlesRes.ok) {
          throw new Error("Failed to fetch super user data");
        }

        const [statsData, articlesData] = await Promise.all([
          statsRes.json(),
          articlesRes.json(),
        ]);

        setStats(statsData.platform_stats);
        setArticles(articlesData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuperData();
  }, [isAuthenticated, isLoading, isSuperUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000]">
        <MinimalHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-600" />
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  if (!isSuperUser) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000]">
        <MinimalHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Super user access required
            </p>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] relative">
      <MinimalHeader />

      <ImpersonationBanner />

      <main className="max-w-7xl mx-auto px-4 pt-8 pb-16 relative z-10">
        {/* Header */}
        <div className="w-full mb-16">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                WELCOME BACK
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-light text-black dark:text-white mb-6 tracking-tight">
              Super User Dashboard
            </h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader className="w-8 h-8 animate-spin text-sky-600" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <div className="lg:col-span-2">
                <PlatformAnalytics />
              </div>

              {/* User Management */}
              <div className="lg:col-span-1">
                <UserManagement />
              </div>

              {/* Article Management - NEW */}
              <div className="lg:col-span-2">
                <ArticleManagement />
              </div>
            </div>
          </div>
        )}
      </main>

      <MinimalFooter />
    </div>
  );
}
