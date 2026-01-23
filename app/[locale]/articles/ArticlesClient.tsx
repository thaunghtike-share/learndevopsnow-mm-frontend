"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalBlogList } from "@/components/minimal-blog-list";
import { MinimalFooter } from "@/components/minimal-footer";
import {
  ArrowRight,
  TrendingUp, Loader2,
  BarChart,
  BarChart2
} from "lucide-react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartOptions,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement
);

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartKey, setChartKey] = useState(Date.now()); // Force re-render

  useEffect(() => {
    setIsClient(true);

    // Check for dark mode
    const checkDarkMode = () => {
      if (typeof window !== "undefined") {
        // Check if dark class is present on html element
        const html = document.documentElement;
        const isDark = html.classList.contains("dark");
        setIsDarkMode(isDark);
        setChartKey(Date.now()); // Force chart re-render
      }
    };

    checkDarkMode();

    // Listen for theme changes on html element
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (
        !document.documentElement.classList.contains("dark") &&
        !document.documentElement.classList.contains("light")
      ) {
        setIsDarkMode(e.matches);
        setChartKey(Date.now());
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
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

// Bar Chart Component for Views
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
  const [chartKey, setChartKey] = useState(Date.now()); // Force re-render

  useEffect(() => {
    setIsClient(true);

    // Check for dark mode
    const checkDarkMode = () => {
      if (typeof window !== "undefined") {
        // Check if dark class is present on html element
        const html = document.documentElement;
        const isDark = html.classList.contains("dark");
        setIsDarkMode(isDark);
        setChartKey(Date.now()); // Force chart re-render
      }
    };

    checkDarkMode();

    // Listen for theme changes on html element
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (
        !document.documentElement.classList.contains("dark") &&
        !document.documentElement.classList.contains("light")
      ) {
        setIsDarkMode(e.matches);
        setChartKey(Date.now());
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
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
            return `${context.dataset.label}: ${value.toLocaleString()} views`;
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
  const [expandedAuthorId, setExpandedAuthorId] = useState<number | null>(null);

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
        .slice(0, 4)
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

  const toggleAuthorBio = (authorId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedAuthorId(expandedAuthorId === authorId ? null : authorId);
  };

  const handleCardClick = (authorSlug: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".no-navigate")) return;
    router.push(`/authors/${authorSlug}`);
  };

  // Auto-select first author when authors load
  useEffect(() => {
    if (authors.length > 0 && expandedAuthorId === null) {
      setExpandedAuthorId(authors[0].id);
    }
  }, [authors, expandedAuthorId]);

  // Loading state
  if (authorsLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300 relative">
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
    <div className="min-h-screen bg-white dark:bg-[#000000] relative transition-colors duration-300">
      <div className="relative z-10">
        <MinimalHeader />

        <main className="px-6 md:px-11 md:py-10 relative z-10">
          <section className="w-full mb-20">
            {/* Header - Updated with your requested style */}
            <div className="max-w-3xl mb-11 md:mb-16">
              {/* Blue/Purple gradient line with "Author Dashboard" style */}
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <span className="text-xs md:text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  Articles Dashboard
                </span>
              </div>

              {/* Main title with your font style */}
              <h1 className="text-3xl md:text-7xl text-black dark:text-white mb-4 md:mb-6 tracking-tight">
                Featured Authors
              </h1>

              {/* Subtitle/description */}
              <p className="text-base md:text-lg text-black dark:text-gray-300 leading-relaxed">
                Get insights from professionals who work with cutting-edge
                technologies daily. Real-world experience, practical knowledge,
                and proven methodologies.
              </p>
            </div>

            {/* Polished KodeKloud Layout - Desktop EXACT as before, mobile added */}
            {authors.length > 0 ? (
              <div className="mb-20">
                {/* MOBILE VIEW - Completely separate */}
                <div className="block md:hidden space-y-6">
                  {authors.map((author) => {
                    // Function to limit bio length
                    const getLimitedBio = (
                      bio: string,
                      maxLength: number = 200
                    ) => {
                      if (bio.length <= maxLength) return bio;
                      const trimmed = bio.substring(0, maxLength);
                      const lastPeriod = trimmed.lastIndexOf(".");
                      const lastExclamation = trimmed.lastIndexOf("!");
                      const lastQuestion = trimmed.lastIndexOf("?");
                      const lastSentenceEnd = Math.max(
                        lastPeriod,
                        lastExclamation,
                        lastQuestion
                      );

                      if (lastSentenceEnd > maxLength * 0.7) {
                        return trimmed.substring(0, lastSentenceEnd + 1);
                      }
                      return trimmed.substring(0, maxLength - 3) + "...";
                    };

                    return (
                      <div
                        key={`mobile-${author.id}`}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        onClick={() => router.push(`/authors/${author.slug}`)}
                      >
                        <div className="p-4">
                          <div className="flex gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
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
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-wide">
                                {author.name}
                              </h3>
                              <p className="text-sky-600 dark:text-sky-400 font-medium text-sm tracking-wide">
                                {author.job_title}
                              </p>
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-black dark:text-gray-300 text-sm leading-relaxed">
                              {getLimitedBio(author.bio)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/authors/${author.slug}`);
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
                          >
                            <span className="text-sm">View Profile</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* DESKTOP VIEW - EXACTLY AS YOU HAD IT - NO CHANGES */}
                <div className="hidden md:flex flex-col md:flex-row gap-4 md:gap-6 items-stretch">
                  {authors.map((author) => {
                    const isSelected = expandedAuthorId === author.id;

                    // Function to limit bio length
                    const getLimitedBio = (
                      bio: string,
                      maxLength: number = 320
                    ) => {
                      if (bio.length <= maxLength) return bio;
                      const trimmed = bio.substring(0, maxLength);
                      const lastPeriod = trimmed.lastIndexOf(".");
                      const lastExclamation = trimmed.lastIndexOf("!");
                      const lastQuestion = trimmed.lastIndexOf("?");
                      const lastSentenceEnd = Math.max(
                        lastPeriod,
                        lastExclamation,
                        lastQuestion
                      );

                      if (lastSentenceEnd > maxLength * 0.7) {
                        return trimmed.substring(0, lastSentenceEnd + 1);
                      }
                      return trimmed.substring(0, maxLength - 3) + "...";
                    };

                    return (
                      <div
                        key={author.id}
                        className={`transition-[width,height] duration-500 ease-out cursor-pointer overflow-hidden ${
                          isSelected ? "md:w-1/2" : "md:w-1/6"
                        } ${isSelected ? "min-h-[420px]" : "min-h-[320px]"}`}
                        onClick={() => setExpandedAuthorId(author.id)}
                      >
                        <div
                          className={`h-full rounded-2xl transition-all duration-500 ease-out border ${
                            isSelected
                              ? "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                              : "bg-gray-100 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-800/70 border-gray-200 dark:border-gray-800"
                          }`}
                        >
                          {/* Always render both states, just show/hide with opacity */}
                          <div className="relative h-full">
                            {/* Collapsed State */}
                            <div
                              className={`absolute inset-0 transition-all duration-500 ${
                                isSelected
                                  ? "opacity-0 scale-95 pointer-events-none"
                                  : "opacity-100 scale-100"
                              }`}
                            >
                              <div className="h-full flex flex-col">
                                <div className="flex-1 relative overflow-hidden">
                                  <img
                                    src={author.avatar}
                                    alt={author.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/placeholder.svg";
                                    }}
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                                <div className="p-4">
                                  <h3 className="text-gray-900 dark:text-gray-100 text-center text-sm mb-1 line-clamp-1">
                                    {author.name}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-400 text-xs text-center line-clamp-1">
                                    {author.job_title}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Expanded State */}
                            <div
                              className={`absolute inset-0 transition-all duration-500 ${
                                isSelected
                                  ? "opacity-100 scale-100"
                                  : "opacity-0 scale-105 pointer-events-none"
                              }`}
                            >
                              <div className="h-full p-6 md:p-8">
                                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full">
                                  {/* Photo Left Side */}
                                  <div className="lg:w-2/5">
                                    <div className="relative w-full h-64 lg:h-full rounded-xl overflow-hidden">
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
                                  </div>

                                  {/* Content Right Side */}
                                  <div className="lg:w-3/5 flex flex-col">
                                    {/* Header Section */}
                                    <div className="mb-6">
                                      <div className="flex items-start justify-between mb-4">
                                        <div>
                                          <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">
                                            {author.name}
                                          </h3>
                                          <p className="text-sky-600 dark:text-sky-400 font-semibold text-sm tracking-wide">
                                            {author.job_title}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="h-px bg-gradient-to-r from-sky-200 to-blue-200 dark:from-gray-700 dark:to-gray-700" />
                                    </div>

                                    {/* Bio Section - FIXED HEIGHT */}
                                    <div className="flex-1 mb-4 min-h-[180px] max-h-[200px] overflow-y-auto pr-1">
                                      <p className="text-black dark:text-gray-300 text-base leading-relaxed">
                                        {getLimitedBio(author.bio)}
                                      </p>
                                      {author.bio.length > 320 && (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm italic mt-2">
                                          Read full bio in profile
                                        </p>
                                      )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          router.push(
                                            `/authors/${author.slug}`
                                          );
                                        }}
                                        className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                                      >
                                        <span className="text-base">
                                          View Full Profile
                                        </span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Hint - Desktop only */}
                <div className="hidden md:block mt-8 text-center">
                  <div className="inline-flex items-center gap-2 text-black dark:text-gray-400 text-sm">
                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                    <span>Click on any author to expand and learn more</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className=""></div>
            )}

            {/* ===== ANALYTICS DASHBOARD SECTION ===== */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 flex items-center justify-center">
                  <BarChart2 className="w-6 h-6 text-blue-600" />
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

              {/* Charts Section */}
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
                  {/* Chart 1: Articles by Author (Pie Chart) */}
                  <AuthorStatsPieChart
                    data={prepareArticlesByAuthorData()}
                    title="Articles Distribution"
                  />

                  {/* Chart 2: Views by Author (Bar Chart) */}
                  <AuthorViewsBarChart
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

        /* Dark mode adjustments for charts */
        @media (prefers-color-scheme: dark) {
          .chartjs-render-monitor {
            filter: brightness(1.1);
          }
        }
      `}</style>
    </div>
  );
}
