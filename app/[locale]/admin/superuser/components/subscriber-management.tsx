"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  User,
  Calendar,
  Loader,
  AlertCircle,
  Bell,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface Subscriber {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  last_login: string | null;
  subscribed_at: string;
  articles_count?: number;
  author_profile: {
    name: string;
    slug: string;
    avatar: string;
    profile_complete: boolean;
    job_title?: string;
    company?: string;
  } | null;
}

export default function SubscriberManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>(
    []
  );
  const [deleting, setDeleting] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/super/subscribers/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch subscribers");

      const data = await response.json();
      setSubscribers(data.subscribers || []);
      setFilteredSubscribers(data.subscribers || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Delete subscriber
  const handleDeleteSubscriber = async (userId: number, userEmail: string) => {
    if (
      !confirm(`Are you sure you want to remove ${userEmail} from subscribers?`)
    ) {
      return;
    }

    try {
      setDeleting(userId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/super/subscribers/${userId}/delete/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.ok) {
        alert("Subscriber removed successfully");
        // Refresh the list
        await fetchSubscribers();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || "Failed to delete subscriber"}`);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  // Search subscribers
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSubscribers(subscribers);
      setCurrentPage(1); // Reset to first page when search is cleared
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = subscribers.filter(
      (subscriber) =>
        subscriber.email.toLowerCase().includes(query) ||
        subscriber.username.toLowerCase().includes(query) ||
        subscriber.first_name?.toLowerCase().includes(query) ||
        subscriber.last_name?.toLowerCase().includes(query) ||
        subscriber.author_profile?.name?.toLowerCase().includes(query)
    );
    setFilteredSubscribers(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchQuery, subscribers]);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubscribers = filteredSubscribers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative group">
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl border border-emerald-200/30 shadow-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="p-6 border-b border-emerald-200/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-br from-emerald-900 to-teal-800 bg-clip-text text-transparent">
                  Subscriber Management
                </h2>
                <p className="text-black text-sm">
                  Manage newsletter subscribers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subscribers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-emerald-200/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-sm w-full md:w-64"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={fetchSubscribers}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-black">
                {searchQuery ? "No subscribers found" : "No subscribers yet"}
              </p>
            </div>
          ) : (
            <>
              {/* Subscribers List */}
              <div className="space-y-3 mb-6">
                {currentSubscribers.map((subscriber) => (
                  <div
                    key={subscriber.id}
                    className="p-4 rounded-2xl border border-emerald-200/30 bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative">
                          {subscriber.author_profile?.avatar ? (
                            <>
                              <img
                                src={subscriber.author_profile.avatar}
                                alt={subscriber.username}
                                className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500"
                              />
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Bell className="w-3 h-3 text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center border-2 border-emerald-500">
                              <User className="w-6 h-6 text-white" />
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Bell className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-black">
                              {subscriber.username}
                            </h4>
                            <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg">
                              Subscribed
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-sm text-black">
                              <Mail className="w-3 h-3" />
                              {subscriber.email}
                            </div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="flex items-center gap-1 text-sm text-black">
                              <Calendar className="w-3 h-3" />
                              Joined {formatDate(subscriber.date_joined)}
                            </div>
                          </div>

                          {/* Author profile info if available */}
                          {subscriber.author_profile && (
                            <div className="mt-2">
                              <div className="text-sm font-medium text-black">
                                {subscriber.author_profile.name}
                              </div>
                              {(subscriber.author_profile.job_title ||
                                subscriber.author_profile.company) && (
                                <p className="text-sm text-black">
                                  {subscriber.author_profile.job_title || ""}
                                  {subscriber.author_profile.job_title &&
                                    subscriber.author_profile.company &&
                                    " at "}
                                  {subscriber.author_profile.company || ""}
                                </p>
                              )}
                              {subscriber.articles_count &&
                                subscriber.articles_count > 0 && (
                                  <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                                    <UserCheck className="w-3 h-3" />
                                    {subscriber.articles_count} article
                                    {subscriber.articles_count !== 1 ? "s" : ""}
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleDeleteSubscriber(
                              subscriber.id,
                              subscriber.email
                            )
                          }
                          disabled={deleting === subscriber.id}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleting === subscriber.id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination - Only show if more than one page */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-emerald-200/30 pt-6">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredSubscribers.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredSubscribers.length}
                    </span>{" "}
                    subscribers
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, index, array) => (
                          <div key={page} className="flex items-center">
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 text-sm font-medium rounded-lg ${
                                currentPage === page
                                  ? "bg-emerald-500 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        ))}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}