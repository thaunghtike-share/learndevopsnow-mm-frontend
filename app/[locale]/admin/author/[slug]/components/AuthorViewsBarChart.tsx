"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { BarChart3, Loader } from "lucide-react";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  ChartOptions,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

function AuthorViewsBarChart({
  data,
  title = "Your Top Articles",
  height = 280,
}: {
  data: { title?: string; read_count?: number }[];
  title?: string;
  height?: number;
}) {
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartKey, setChartKey] = useState(Date.now());

  useEffect(() => {
    setIsClient(true);

    const checkDarkMode = () => {
      if (typeof window !== "undefined") {
        const html = document.documentElement;
        const isDark = html.classList.contains("dark");
        setIsDarkMode(isDark);
        setChartKey(Date.now());
      }
    };

    checkDarkMode();

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

  // Transform data to ensure consistent structure
  const validData = (data || []).filter(item => item && item.title);
  const topArticles = [...validData]
    .sort((a, b) => (b.read_count || 0) - (a.read_count || 0))
    .slice(0, 20);

  const generateBarColors = (count: number) => {
    const colors = [
      "rgba(34, 197, 94, 0.8)",
      "rgba(59, 130, 246, 0.8)",
      "rgba(168, 85, 247, 0.8)",
      "rgba(245, 158, 11, 0.8)",
      "rgba(239, 68, 68, 0.8)",
      "rgba(14, 165, 233, 0.8)",
      "rgba(20, 184, 166, 0.8)",
      "rgba(249, 115, 22, 0.8)",
    ];

    return colors.slice(0, count);
  };

  const chartData = {
    labels: topArticles.map((item) =>
      (item.title || '').length > 15
        ? (item.title || '').substring(0, 15) + "..."
        : item.title || 'Unknown'
    ),
    datasets: [
      {
        label: "Views",
        data: topArticles.map((item) => item.read_count || 0),
        backgroundColor: generateBarColors(topArticles.length),
        borderColor: generateBarColors(topArticles.length).map((color) =>
          color.replace("0.8", "1")
        ),
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: generateBarColors(topArticles.length).map(
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
          color: isDarkMode ? "#ffffff" : "#000000",
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
          color: isDarkMode ? "#ffffff" : "#000000",
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
            const total = topArticles.reduce((sum, item) => sum + (item.read_count || 0), 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
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
            {topArticles[0]?.title || 'Unknown'}: {topArticles[0]?.read_count?.toLocaleString() || 0} views
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorViewsBarChart;