"use client";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Eye, 
  MessageSquare, 
  Heart, 
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Loader
} from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState } from "react";
import AuthorStatsPieChart from "./AuthorStatsPieChart";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StatsSectionProps {
  totalArticles: number;
  totalViews: number;
  totalComments: number;
  totalReactions: number;
  topArticles: Array<{ title: string; read_count: number }>;
  articlesByAuthor?: Array<{ 
    name: string; 
    article_count: number;
    avatar?: string;
  }>;
  chartsLoaded: boolean;
  loadingCharts: boolean;
  authorAvatar?: string;
  authorName?: string;
}

const StatsSection = ({
  totalArticles,
  totalViews,
  totalComments,
  totalReactions,
  topArticles,
  articlesByAuthor = [],
  chartsLoaded,
  loadingCharts,
  authorAvatar,
  authorName
}: StatsSectionProps) => {
  const [currentChartPage, setCurrentChartPage] = useState(1);
  const ARTICLES_PER_CHART_PAGE = 8;

  // Format numbers
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Get paginated articles for chart
  const getPaginatedArticles = () => {
    const startIndex = (currentChartPage - 1) * ARTICLES_PER_CHART_PAGE;
    const endIndex = startIndex + ARTICLES_PER_CHART_PAGE;
    return topArticles.slice(startIndex, endIndex);
  };

  const totalChartPages = Math.ceil(topArticles.length / ARTICLES_PER_CHART_PAGE);
  const displayedArticles = getPaginatedArticles();

  // Prepare data for bar chart
  const chartData = {
    labels: displayedArticles.map(article => 
      article.title.length > 30 
        ? article.title.substring(0, 27) + '...' 
        : article.title
    ),
    datasets: [
      {
        data: displayedArticles.map(article => article.read_count),
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
        borderColor: 'rgb(14, 165, 233)',
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Views: ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#000000',
          font: {
            size: 11,
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#000000',
          font: {
            size: 11,
          }
        }
      },
    },
  };

  // Prepare data for pie chart
  const preparePieChartData = () => {
    if (!articlesByAuthor || articlesByAuthor.length === 0) return [];
    
    return articlesByAuthor.map(author => ({
      author: author.name,
      count: author.article_count
    }));
  };

  return (
    <motion.section
      id="stats-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 dark:bg-[#000000] backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 md:px-8 py-4 md:py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
          <div>
            <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1 md:mb-2">
              Performance Analytics
            </h2>
            <p className="text-xs md:text-base text-gray-600 dark:text-gray-400 font-medium">
              Detailed insights about your content performance
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto text-center py-6 md:py-8 mb-6 md:mb-8">
          <div className="space-y-2">
            <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
              {totalArticles}
            </div>
            <div className="text-xs md:text-sm text-blue-600 font-semibold uppercase tracking-wider">
              Articles
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
              {formatNumber(totalViews)}
            </div>
            <div className="text-xs md:text-sm text-green-600 font-semibold uppercase tracking-wider">
              Total Views
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
              {totalComments}
            </div>
            <div className="text-xs md:text-sm text-pink-600 font-semibold uppercase tracking-wider">
              Total Comments
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl md:text-5xl font-light text-black dark:text-white">
              {totalReactions}
            </div>
            <div className="text-xs md:text-sm text-amber-600 font-semibold uppercase tracking-wider">
              Total Reactions
            </div>
          </div>
        </div>

        {/* Bar Chart - Full Width */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <span className="text-xs md:text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Your Top Articles by Views
            </span>
          </div>

          {loadingCharts ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                <p className="text-black dark:text-gray-300 text-lg font-medium">
                  Loading analytics...
                </p>
              </div>
            </div>
          ) : !chartsLoaded || topArticles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-black dark:text-white mb-4">
                No Analytics Data Yet
              </h3>
              <p className="text-lg text-black dark:text-gray-300 mb-8 max-w-md mx-auto">
                Analytics data will appear here as your articles gain views
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white">
                    Articles Sorted by View Count
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Real statistics based on all platform articles
                  </p>
                </div>
                
                {topArticles.length > ARTICLES_PER_CHART_PAGE && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentChartPage(prev => Math.max(1, prev - 1))}
                      disabled={currentChartPage === 1}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-black dark:text-white disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-black dark:text-white font-medium text-sm">
                      Page {currentChartPage} of {totalChartPages}
                    </span>
                    <button
                      onClick={() => setCurrentChartPage(prev => Math.min(totalChartPages, prev + 1))}
                      disabled={currentChartPage === totalChartPages}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-black dark:text-white disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="h-80 md:h-96">
                <Bar data={chartData} options={chartOptions} />
              </div>
              
              {/* Top Article Info */}
              {topArticles.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Top Performing Article</p>
                      <p className="text-lg md:text-lg text-black dark:text-white">
                        {topArticles[0].title}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Views</p>
                      <p className="text-3xl md:text-3xl text-black dark:text-white">
                        {formatNumber(topArticles[0].read_count)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Simple Summary */}
        <div className="text-center py-4 md:py-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Analytics updated in real-time • Data reflects all-time statistics
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default StatsSection;