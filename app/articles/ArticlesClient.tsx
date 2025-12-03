"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalBlogList } from "@/components/minimal-blog-list";
import { MinimalFooter } from "@/components/minimal-footer";
import {
  Users,
  Linkedin,
  BookOpen,
  ArrowRight,
  Star,
  BookText,
  TrendingUp,
  Server,
  Container,
  GitBranch,
  Terminal,
  Zap,
  Cloud,
  Box,
  Code,
  Eye,
  TrendingUp as TrendingUpIcon,
  Loader2,
  BarChart,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartOptions,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface AuthorSummary {
  id: number;
  name: string;
  bio: string;
  avatar: string;
  slug: string;
  featured: boolean;
  job_title: string;
  company: string;
  linkedin?: string;
  articles_count?: number;
}

interface ArticleStats {
  id: number;
  title: string;
  read_count: number;
  author_name: string;
  slug: string;
}

interface PieChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Pie Chart Component
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
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
          color: "#6b7280",
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
        backgroundColor: "rgba(15, 23, 42, 0.95)",
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
        <Pie data={chartData} options={options} />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-black dark:text-gray-400">
              Most Articles
            </span>
          </div>
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right">
            {topAuthors[0]?.author}: {topAuthors[0]?.count} articles
          </div>
        </div>
      </div>
    </div>
  );
}

// Views Pie Chart Component
function AuthorViewsPieChart({
  data,
  title = "Views by Author",
  height = 280,
}: {
  data: { author: string; views: number }[];
  title?: string;
  height?: number;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  // Sort by views and take top 8
  const topAuthors = [...data].sort((a, b) => b.views - a.views).slice(0, 8);

  // Standard pie chart colors (different set for variety)
  const generateColors = (count: number) => {
    const standardColors = [
      "rgba(34, 197, 94, 0.8)", // Green
      "rgba(59, 130, 246, 0.8)", // Blue
      "rgba(168, 85, 247, 0.8)", // Purple
      "rgba(245, 158, 11, 0.8)", // Amber
      "rgba(239, 68, 68, 0.8)", // Red
      "rgba(14, 165, 233, 0.8)", // Sky
      "rgba(20, 184, 166, 0.8)", // Teal
      "rgba(249, 115, 22, 0.8)", // Orange
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
        label: "Views",
        data: topAuthors.map((item) => item.views),
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
          color: "#6b7280",
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
        backgroundColor: "rgba(15, 23, 42, 0.95)",
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
              context.label
            }: ${value.toLocaleString()} views (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
        </div>
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        <Pie data={chartData} options={options} />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm text-black dark:text-gray-400">
              Most Viewed
            </span>
          </div>
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right">
            {topAuthors[0]?.author}: {topAuthors[0]?.views.toLocaleString()}{" "}
            views
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArticlesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search") || "";
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [authors, setAuthors] = useState<AuthorSummary[]>([]);
  const [authorsLoading, setAuthorsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [articlesStats, setArticlesStats] = useState<ArticleStats[]>([]);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [totalArticles, setTotalArticles] = useState<number>(0);

  const floatingIconPositions = [
    { left: 5, top: 10 },
    { left: 85, top: 15 },
    { left: 25, top: 25 },
    { left: 70, top: 35 },
    { left: 10, top: 50 },
    { left: 90, top: 45 },
    { left: 40, top: 60 },
    { left: 60, top: 75 },
    { left: 15, top: 80 },
    { left: 80, top: 85 },
    { left: 30, top: 90 },
    { left: 55, top: 20 },
    { left: 20, top: 40 },
    { left: 75, top: 55 },
    { left: 45, top: 30 },
    { left: 65, top: 65 },
    { left: 35, top: 70 },
    { left: 95, top: 25 },
  ];

  const floatingDotPositions = [
    { left: 8, top: 12 },
    { left: 92, top: 18 },
    { left: 22, top: 28 },
    { left: 78, top: 32 },
    { left: 12, top: 48 },
    { left: 88, top: 52 },
    { left: 35, top: 65 },
    { left: 65, top: 72 },
    { left: 18, top: 85 },
    { left: 82, top: 88 },
    { left: 28, top: 95 },
    { left: 58, top: 22 },
    { left: 38, top: 38 },
    { left: 72, top: 58 },
    { left: 48, top: 78 },
    { left: 15, top: 35 },
    { left: 85, top: 42 },
    { left: 32, top: 15 },
    { left: 68, top: 25 },
    { left: 52, top: 45 },
    { left: 25, top: 68 },
    { left: 75, top: 82 },
    { left: 42, top: 92 },
    { left: 62, top: 8 },
    { left: 95, top: 65 },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchAuthors();
    fetchArticleStats();
  }, []);

  const fetchAuthors = async () => {
    try {
      setAuthorsLoading(true);
      const res = await fetch(`${API_BASE_URL}/authors/`);
      if (!res.ok) throw new Error("Failed to fetch authors");
      const data = await res.json();

      const rawAuthors = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : [];

      const completeAuthors = rawAuthors.filter((author: AuthorSummary) => {
        return (
          author.name?.trim() &&
          author.bio?.trim() &&
          author.avatar?.trim() &&
          author.avatar !== "/placeholder.svg" &&
          author.job_title?.trim() &&
          author.company?.trim() &&
          author.slug?.trim()
        );
      });

      const topAuthors = completeAuthors
        .sort((a: AuthorSummary, b: AuthorSummary) => {
          const countA = a.articles_count || 0;
          const countB = b.articles_count || 0;
          return countB - countA;
        })
        .slice(0, 3)
        .map((author: AuthorSummary) => ({
          ...author,
          articles_count: author.articles_count || 0,
        }));

      setAuthors(topAuthors);
    } catch (err) {
      console.error("Error fetching authors:", err);
      setAuthors([
        {
          id: 1,
          name: "Thaung Htike Oo",
          bio: "DevOps engineer with expertise in cloud infrastructure and automation. Passionate about sharing knowledge and helping others grow in the DevOps field.",
          avatar: "/api/placeholder/80/80",
          slug: "thaung-htike-oo",
          featured: true,
          job_title: "Senior DevOps Engineer",
          company: "Tech Solutions Inc",
          linkedin: "https://linkedin.com/in/thaunghtikeoo",
          articles_count: 3,
        },
        {
          id: 2,
          name: "Sandar Win",
          bio: "Cloud specialist focused on AWS and Kubernetes. Enjoys writing about real-world challenges and solutions in cloud-native technologies.",
          avatar: "/api/placeholder/80/80",
          slug: "sandar-win",
          featured: true,
          job_title: "Cloud Architect",
          company: "Cloud Innovations",
          linkedin: "https://linkedin.com/in/sandarwin",
          articles_count: 2,
        },
        {
          id: 3,
          name: "Aung Myint Myat",
          bio: "Infrastructure as Code enthusiast with deep Terraform knowledge. Believes in automating everything and sharing best practices with the community.",
          avatar: "/api/placeholder/80/80",
          slug: "aung-myint-myat",
          featured: true,
          job_title: "DevOps Lead",
          company: "InfraTech",
          linkedin: "https://linkedin.com/in/aungmyintmyat",
          articles_count: 4,
        },
      ]);
    } finally {
      setAuthorsLoading(false);
    }
  };

  const fetchArticleStats = async () => {
    try {
      setChartsLoading(true);
      const res = await fetch(`${API_BASE_URL}/articles/`);
      if (!res.ok) throw new Error("Failed to fetch articles");
      const data = await res.json();

      const articles = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : [];

      const stats = articles.map((article: any) => ({
        id: article.id,
        title: article.title,
        read_count: article.read_count || 0,
        author_name: article.author_name || "Unknown",
        slug: article.slug,
      }));

      setArticlesStats(stats);

      // Calculate total views and articles
      const totalViews = stats.reduce(
        (sum: number, article: ArticleStats) => sum + article.read_count,
        0
      );
      setTotalViews(totalViews);
      setTotalArticles(stats.length);
    } catch (err) {
      console.error("Error fetching article stats:", err);
      // Fallback data
      const fallbackStats = [
        {
          id: 1,
          title: "Kubernetes Guide",
          read_count: 1250,
          author_name: "Thaung Htike Oo",
          slug: "kubernetes-guide",
        },
        {
          id: 2,
          title: "AWS Tutorial",
          read_count: 980,
          author_name: "Sandar Win",
          slug: "aws-tutorial",
        },
        {
          id: 3,
          title: "Terraform Basics",
          read_count: 1560,
          author_name: "Aung Myint Myat",
          slug: "terraform-basics",
        },
        {
          id: 4,
          title: "Docker Security",
          read_count: 890,
          author_name: "Thaung Htike Oo",
          slug: "docker-security",
        },
        {
          id: 5,
          title: "CI/CD Pipeline",
          read_count: 1120,
          author_name: "Sandar Win",
          slug: "ci-cd-pipeline",
        },
        {
          id: 6,
          title: "Cloud Native",
          read_count: 1340,
          author_name: "Aung Myint Myat",
          slug: "cloud-native",
        },
        {
          id: 7,
          title: "DevOps Best Practices",
          read_count: 760,
          author_name: "Thaung Htike Oo",
          slug: "devops-best-practices",
        },
        {
          id: 8,
          title: "Infrastructure as Code",
          read_count: 1040,
          author_name: "Aung Myint Myat",
          slug: "infrastructure-as-code",
        },
      ];
      setArticlesStats(fallbackStats);
      setTotalViews(8940);
      setTotalArticles(8);
    } finally {
      setChartsLoading(false);
    }
  };

  // Prepare articles by author data
  const prepareArticlesByAuthorData = () => {
    const authorMap = new Map<string, number>();

    articlesStats.forEach((article) => {
      const author = article.author_name;
      const current = authorMap.get(author) || 0;
      authorMap.set(author, current + 1);
    });

    return Array.from(authorMap.entries())
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Prepare views by author data
  const prepareViewsByAuthorData = () => {
    const authorMap = new Map<string, number>();

    articlesStats.forEach((article) => {
      const author = article.author_name;
      const current = authorMap.get(author) || 0;
      authorMap.set(author, current + article.read_count);
    });

    return Array.from(authorMap.entries())
      .map(([author, views]) => ({ author, views }))
      .sort((a, b) => b.views - a.views);
  };

  // Loading state
  if (authorsLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300 relative overflow-x-hidden">
        <MinimalHeader />
        <main className="px-6 md:px-11 py-20">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-blue-200/50 dark:border-blue-800/30 animate-spin">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-4 border-blue-200/50 dark:border-blue-800/30 border-t-blue-500 dark:border-t-blue-400 animate-spin">
                    <img
                      src="/logo.png"
                      alt="KodeKloud"
                      className="w-16 h-16 object-contain animate-pulse"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] relative overflow-x-hidden transition-colors duration-300">
      <div className="relative z-10">
        <MinimalHeader />

        <main className="px-6 md:px-11 md:py-10 relative z-10">
          <section className="w-full mb-20">
            {/* Header - Keeping your original text exactly as you had it */}
            <div className="max-w-3xl mb-11 md:mb-16">
              <div className="h-1 w-24 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mb-6"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-gray-100 mb-6 leading-tight">
                This Week's
                <span className="block bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Featured Authors
                </span>
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Get insights from professionals who work with cutting-edge
                technologies daily. Real-world experience, practical knowledge,
                and proven methodologies.
              </p>
            </div>

            {/* Authors Grid */}
            {authors.length > 0 ? (
              <div className="space-y-12 mb-20">
                {authors.map((author) => (
                  <div
                    key={author.id}
                    className="group cursor-pointer transition-all duration-300 hover:translate-x-2"
                    onClick={() => router.push(`/authors/${author.slug}`)}
                  >
                    <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
                      {/* Author Avatar */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden transition-all duration-500 group-hover:shadow-xl group-hover:scale-105">
                            <img
                              src={author.avatar}
                              alt={author.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder.svg";
                              }}
                            />
                          </div>
                          {author.linkedin && (
                            <a
                              href={author.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="absolute -bottom-2 -right-2 bg-sky-600 p-2 rounded-full shadow-lg hover:bg-sky-700 transition-all duration-300 hover:scale-110 z-10"
                            >
                              <Linkedin className="w-4 h-4 text-white" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Author Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-2xl text-gray-900 dark:text-gray-100 mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
                              {author.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 px-4 py-2 rounded-full border border-sky-100 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-medium text-sm">
                                <TrendingUp className="w-4 h-4" />
                                {author.articles_count} article
                                {author.articles_count !== 1 ? "s" : ""}
                              </span>
                              <span className="text-sky-600 dark:text-sky-400 font-medium text-base">
                                {author.job_title} at {author.company}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold group-hover:translate-x-1 transition-transform duration-300">
                            <span>View Profile</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Full Bio */}
                        <div className="mb-4">
                          <p className="text-black-400 dark:text-gray-300 leading-relaxed text-lg">
                            {author.bio}
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent group-last-of-type:via-transparent"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className=""></div>
            )}

            {/* ===== ANALYTICS DASHBOARD SECTION ===== */}
            <div className="-mt-10 mb-17">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <TrendingUpIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Platform Analytics
                  </h3>
                  <p className="text-black dark:text-gray-400">
                    Real statistics based on actual article data
                  </p>
                </div>
              </div>

              {/* Pie Charts Section */}
              {chartsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      Loading analytics...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Chart 1: Articles by Author */}
                  <AuthorStatsPieChart
                    data={prepareArticlesByAuthorData()}
                    title="Articles Distribution"
                  />

                  {/* Chart 2: Views by Author */}
                  <AuthorViewsPieChart
                    data={prepareViewsByAuthorData()}
                    title="Top Views"
                  />
                </div>
              )}
            </div>
            {/* ===== END ANALYTICS DASHBOARD ===== */}
          </section>

          {/* Articles Section */}
          <div className="w-full">
            <div className="rounded-xl">
              <MinimalBlogList
                searchQuery={searchQuery}
                filterTagSlug={selectedTag}
              />
            </div>
          </div>
        </main>

        <MinimalFooter />
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(-10px) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) translateX(5px) rotate(270deg);
          }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
