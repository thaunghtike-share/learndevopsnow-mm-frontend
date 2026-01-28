"use client";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { TrendingUp, Loader } from "lucide-react";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  ChartOptions,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

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
        <Loader className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  const topAuthors = [...data].sort((a, b) => b.count - a.count).slice(0, 8);

  const generateColors = (count: number) => {
    const standardColors = [
      "rgba(255, 99, 132, 0.8)",
      "rgba(54, 162, 235, 0.8)",
      "rgba(255, 206, 86, 0.8)",
      "rgba(75, 192, 192, 0.8)",
      "rgba(153, 102, 255, 0.8)",
      "rgba(255, 159, 64, 0.8)",
      "rgba(199, 199, 199, 0.8)",
      "rgba(83, 102, 255, 0.8)",
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
          color: isDarkMode ? "#ffffff" : "#000000",
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

export default AuthorStatsPieChart;