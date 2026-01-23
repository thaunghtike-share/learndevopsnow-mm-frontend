"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  MessageSquare,
  Reply,
  Heart,
  ThumbsUp,
  Sparkles,
  Lightbulb,
  Trash2,
  Loader,
  AlertCircle,
  Calendar,
  Clock,
  TrendingUp,
  X,
  Check,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface Notification {
  id: number;
  notification_type: "comment" | "reply" | "reaction";
  message: string;
  data: {
    article_slug: string;
    article_title: string;
    commenter_name?: string;
    replier_name?: string;
    reactor_name?: string;
    comment_id?: number;
    preview?: string;
    reply_preview?: string;
    reaction_type?: string;
    reaction_display?: string;
  };
  actor_name: string;
  actor_avatar: string;
  actor_slug: string;
  article_title: string;
  article_slug: string;
  is_read: boolean;
  created_at: string;
  time_ago: string;
}

interface NotificationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

export default function DashboardNotificationSection() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [locallyRead, setLocallyRead] = useState<Set<number>>(new Set());
  const [locallyRemoved, setLocallyRemoved] = useState<Set<number>>(new Set());
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const notificationsPerPage = 8;

  const fetchNotifications = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await fetch(
        `${API_BASE_URL}/notifications/?page=${page}&page_size=${notificationsPerPage}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch notifications");
      
      const data: NotificationResponse = await response.json();
      setNotifications(data.results || []);
      setTotalCount(data.count || 0);
      setTotalPages(Math.ceil((data.count || 0) / notificationsPerPage));
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [notificationsPerPage]);

  const markAsRead = async (notificationId: number) => {
    // Update local state immediately
    setLocallyRead(prev => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      localStorage.setItem('notification_read_ids', JSON.stringify([...newSet]));
      return newSet;
    });
    
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/notifications/mark-read/${notificationId}/`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const removeNotification = async (notificationId: number) => {
    // Update local state immediately
    setLocallyRemoved(prev => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      localStorage.setItem('notification_removed_ids', JSON.stringify([...newSet]));
      return newSet;
    });
    
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/notifications/${notificationId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      // Refresh the current page after deletion
      fetchNotifications(currentPage);
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.notification_type) {
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'reply':
        return <Reply className="w-4 h-4 text-green-500" />;
      case 'reaction':
        switch (notification.data.reaction_type) {
          case 'like':
            return <ThumbsUp className="w-4 h-4 text-blue-600" />;
          case 'love':
            return <Heart className="w-4 h-4 text-red-500" />;
          case 'celebrate':
            return <Sparkles className="w-4 h-4 text-yellow-500" />;
          case 'insightful':
            return <Lightbulb className="w-4 h-4 text-green-600" />;
          default:
            return <ThumbsUp className="w-4 h-4 text-blue-500" />;
        }
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.notification_type === 'comment' || notification.notification_type === 'reaction') {
      return `/articles/${notification.article_slug}`;
    } else if (notification.notification_type === 'reply') {
      return `/articles/${notification.article_slug}#comment-${notification.data.comment_id}`;
    }
    return '#';
  };

  // Filter out locally removed notifications BEFORE displaying
  const filteredNotifications = notifications.filter(
    n => !locallyRemoved.has(n.id)
  );

  // Calculate unread count from ALL notifications (not just current page)
  const [overallUnreadCount, setOverallUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const response = await fetch(`${API_BASE_URL}/notifications/count/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setOverallUnreadCount(data.unread_count || 0);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };
    
    fetchUnreadCount();
  }, [notifications]); // Refresh when notifications change

  const unreadCountOnPage = filteredNotifications.filter(
    n => !(n.is_read || locallyRead.has(n.id))
  ).length;

  // Setup polling for new notifications
  useEffect(() => {
    const pollForNotifications = () => {
      fetchNotifications(currentPage);
    };

    // Initial fetch
    pollForNotifications();

    // Set up polling interval (every 60 seconds)
    const interval = setInterval(pollForNotifications, 60000);
    setPollingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchNotifications, currentPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [pollingInterval]);

  // Load local state from localStorage on mount
  useEffect(() => {
    const savedRead = localStorage.getItem('notification_read_ids');
    const savedRemoved = localStorage.getItem('notification_removed_ids');
    
    if (savedRead) {
      try {
        const ids = JSON.parse(savedRead);
        setLocallyRead(new Set(ids));
      } catch (e) {
        console.error("Error parsing saved read notifications:", e);
      }
    }
    
    if (savedRemoved) {
      try {
        const ids = JSON.parse(savedRemoved);
        setLocallyRemoved(new Set(ids));
      } catch (e) {
        console.error("Error parsing saved removed notifications:", e);
      }
    }
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl overflow-hidden mt-12 md:mt-16"
    >
      {/* Header - EXACT SAME AS TRASH SECTION */}
      <div className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
          <div>
            <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1 md:mb-2">
              Notifications
            </h2>
            <p className="text-xs md:text-base text-slate-600 dark:text-gray-400 font-medium">
              {overallUnreadCount > 0 ? `${overallUnreadCount} unread` : "All caught up"} • {totalCount} total
            </p>
          </div>
          {totalCount > 0 && (
            <div className="text-xs md:text-sm text-slate-500 dark:text-gray-500 font-medium">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>
      </div>

      {/* Content - EXACT SAME LAYOUT AS TRASH SECTION */}
      {loading ? (
        <div className="flex items-center justify-center py-12 md:py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-6"></div>
            <p className="text-slate-700 dark:text-gray-300 text-lg font-medium">
              Loading notifications...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12 md:py-20">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl">
            <AlertCircle className="w-6 h-6 md:w-10 md:h-10 text-white" />
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 md:mb-4">
            Error Loading Notifications
          </h3>
          <p className="text-sm md:text-lg text-slate-600 dark:text-gray-400 mb-6 md:mb-8 font-medium max-w-md mx-auto px-4">
            {error}
          </p>
          <button
            onClick={() => fetchNotifications(1)}
            className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 text-sm md:text-base font-medium"
          >
            Try Again
          </button>
        </div>
      ) : filteredNotifications.length === 0 && totalCount === 0 ? (
        <div className="text-center py-12 md:py-20">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl">
            <Bell className="w-6 h-6 md:w-10 md:h-10 text-white" />
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 md:mb-4">
            No Notifications Yet
          </h3>
          <p className="text-sm md:text-lg text-slate-600 dark:text-gray-400 mb-6 md:mb-8 font-medium max-w-md mx-auto px-4">
            Comments, replies, and reactions will appear here
          </p>
        </div>
      ) : filteredNotifications.length === 0 && totalCount > 0 ? (
        <div className="text-center py-12 md:py-20">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl">
            <Bell className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 md:mb-4">
            All Notifications Removed
          </h3>
          <p className="text-sm md:text-base text-slate-600 dark:text-gray-400 mb-6 md:mb-8 font-medium max-w-md mx-auto px-4">
            You've removed all notifications on this page
          </p>
          <button
            onClick={() => fetchNotifications(currentPage)}
            className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 text-sm md:text-base font-medium"
          >
            Refresh Page
          </button>
        </div>
      ) : (
        <>
          <div className="divide-y divide-slate-200/50 dark:divide-gray-700">
            {filteredNotifications.map((notification, index) => {
              const isRead = notification.is_read || locallyRead.has(notification.id);
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 md:p-8 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col gap-4 md:gap-8 md:flex-row items-start">
                    {/* Notification Info - Same layout as article info */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2 md:mb-3">
                        <span className={`inline-flex items-center gap-1.5 font-medium text-xs md:text-sm px-2 py-1 rounded-lg ${
                          !isRead
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                        }`}>
                          {getNotificationIcon(notification)}
                          {notification.notification_type.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 text-slate-500 dark:text-gray-500" />
                          {formatDate(notification.created_at)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium text-xs md:text-sm">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 text-slate-500 dark:text-gray-500" />
                          {notification.time_ago}
                        </span>
                        {!isRead && (
                          <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium text-xs md:text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            NEW
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        {notification.actor_avatar && (
                          <img
                            src={notification.actor_avatar}
                            alt={notification.actor_name}
                            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                          />
                        )}
                        <h3 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white line-clamp-2">
                          {notification.actor_name} {notification.message}
                        </h3>
                      </div>

                      {notification.data.preview && (
                        <p className="text-black dark:text-gray-400 text-sm md:text-lg line-clamp-2 mb-3 md:mb-4 font-medium leading-relaxed">
                          "{notification.data.preview}"
                        </p>
                      )}

                      {/* Article Link with TrendingUp icon */}
                      <div className="flex items-center gap-2 mt-4">
                        <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-sky-600 dark:text-sky-400" />
                        <Link
                          href={getNotificationLink(notification)}
                          onClick={() => !isRead && markAsRead(notification.id)}
                          className="text-sm md:text-base text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 font-medium truncate max-w-[300px] md:max-w-none"
                        >
                          {notification.article_title}
                        </Link>
                      </div>
                    </div>

                    {/* Action Buttons - Same layout as trash actions */}
                    <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end md:justify-start">
                      {!isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="inline-flex items-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-105 text-xs md:text-sm w-full md:w-auto justify-center"
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3 md:w-4 md:h-4" />
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="inline-flex items-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-105 text-xs md:text-sm w-full md:w-auto justify-center"
                        title="Remove notification"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination - EXACT SAME AS TRASH SECTION */}
          {totalPages > 1 && (
            <div className="px-4 md:px-8 py-4 md:py-6 border-t border-slate-200/50 dark:border-gray-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-700/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs md:text-sm text-slate-600 dark:text-gray-400 font-medium text-center sm:text-left">
                  Showing {filteredNotifications.length} of {totalCount} notifications
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
  );
}