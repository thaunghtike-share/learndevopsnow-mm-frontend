"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Building,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Users,
  Edit,
  CalendarDays,
  X,
  ChevronDown,
} from "lucide-react";
import debounce from "lodash/debounce";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface Booking {
  id: number;
  name: string;
  email: string;
  company: string;
  current_environment: string;
  project_goals: string;
  preferred_time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  booked_at: string;
  consultation_date: string | null;
  notes: string;
}

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  weekly: number;
  by_environment: Array<{ current_environment: string; count: number }>;
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [environmentFilter, setEnvironmentFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Booking>>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [pageSize] = useState(10);

  // Debounced search function
  const debouncedFetchBookings = useCallback(
    debounce(() => {
      setCurrentPage(1);
      fetchBookings();
    }, 500),
    []
  );

  // Update the search effect to only trigger on searchQuery changes
  useEffect(() => {
    debouncedFetchBookings();
    return () => debouncedFetchBookings.cancel();
  }, [searchQuery, debouncedFetchBookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Build URL
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("page_size", pageSize.toString());
      params.append("ordering", "-booked_at");

      // ✅ Send 'search' parameter (not 'name' or 'company')
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (environmentFilter !== "all") {
        params.append("current_environment", environmentFilter);
      }

      const url = `${API_BASE_URL}/consultations/?${params}`;

      // DEBUG: Log the URL being called
      console.log("🔍 API URL:", url);
      console.log("🔍 Search Query:", searchQuery);

      const response = await fetch(url, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();

      // DEBUG: Log the response
      console.log("📊 API Response:", data);

      // Handle paginated response
      if (data.results !== undefined) {
        setBookings(data.results);
        setTotalBookings(data.count || 0);
      } else if (Array.isArray(data)) {
        setBookings(data);
        setTotalBookings(data.length);
      } else {
        setBookings([]);
        setTotalBookings(0);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingStats = async () => {
    try {
      setStatsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/consultations/stats/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching booking stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Delete booking function
  const deleteBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/consultations/${bookingId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        setBookings(bookings.filter((b) => b.id !== bookingId));
        setTotalBookings((prev) => prev - 1);
        fetchBookingStats();
      } else {
        const data = await response.json();
        alert(`Failed to delete booking: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const updateBookingStatus = async (
    bookingId: number,
    status: Booking["status"]
  ) => {
    try {
      const token = localStorage.getItem("token");
      const booking = bookings.find((b) => b.id === bookingId);

      const updateData: any = { status };

      if (status === "confirmed" && !booking?.consultation_date) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        updateData.consultation_date = tomorrow.toISOString();
      }

      const response = await fetch(
        `${API_BASE_URL}/consultations/${bookingId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
        );
        fetchBookingStats();
      } else {
        alert(`Failed to update booking: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const updateBookingDetails = async (
    bookingId: number,
    data: Partial<Booking>
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/consultations/${bookingId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        fetchBookings();
        return true;
      } else {
        alert(`Failed to update booking: ${result.error || "Unknown error"}`);
        return false;
      }
    } catch (error) {
      alert("Network error. Please try again.");
      return false;
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    const success = await updateBookingDetails(
      selectedBooking.id,
      editFormData
    );
    if (success) {
      setIsEditModalOpen(false);
      setSelectedBooking(null);
      setEditFormData({});
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

  const getStatusBadge = (status: Booking["status"]) => {
    const config = {
      pending: {
        bg: "bg-yellow-500/10 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Pending",
      },
      confirmed: {
        bg: "bg-blue-500/10 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Confirmed",
      },
      cancelled: {
        bg: "bg-red-500/10 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: <XCircle className="w-3 h-3" />,
        label: "Cancelled",
      },
      completed: {
        bg: "bg-green-500/10 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Completed",
      },
    };

    return config[status];
  };

  const getEnvironmentBadge = (env: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> =
      {
        "on-premise": {
          bg: "bg-gray-500/10 dark:bg-gray-800",
          text: "text-gray-700 dark:text-gray-300",
          label: "On-premise",
        },
        aws: {
          bg: "bg-orange-500/10 dark:bg-orange-900/30",
          text: "text-orange-700 dark:text-orange-400",
          label: "AWS",
        },
        azure: {
          bg: "bg-blue-500/10 dark:bg-blue-900/30",
          text: "text-blue-700 dark:text-blue-400",
          label: "Azure",
        },
        gcp: {
          bg: "bg-green-500/10 dark:bg-green-900/30",
          text: "text-green-700 dark:text-green-400",
          label: "GCP",
        },
        hybrid: {
          bg: "bg-purple-500/10 dark:bg-purple-900/30",
          text: "text-purple-700 dark:text-purple-400",
          label: "Hybrid",
        },
      };

    return (
      config[env] || {
        bg: "bg-gray-500/10 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
        label: env,
      }
    );
  };

  useEffect(() => {
    fetchBookings();
    fetchBookingStats();
  }, [currentPage, statusFilter, environmentFilter]);

  const totalPages = Math.ceil(totalBookings / pageSize);

  return (
    <>
      <div className="relative group">
        {/* Glass background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl" />

        <div className="relative">
          {/* Header */}
          <div className="p-6 border-b border-white/20 dark:border-gray-700/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Consultation Bookings
                  </h2>
                  <p className="text-black dark:text-gray-400 text-sm">
                    Manage and track consultation requests
                  </p>
                </div>
              </div>

              {/* Stats */}
              {!statsLoading && stats && (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-black dark:text-white">
                      {stats.total}
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Total
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {stats.pending}
                    </div>
                    <div className="text-xs text-black dark:text-gray-400">
                      Pending
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {stats.confirmed}
                    </div>
                    <div className="text-xs text-black dark:text-gray-400">
                      Confirmed
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search and Filters - FIXED: Search text doesn't push filters down */}
          <div className="p-6 pb-4">
            <div className="flex flex-col md:flex-row gap-4 mb-1">
              {" "}
              {/* Added mb-1 */}
              {/* Search */}
              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-700/30 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-black dark:text-white placeholder-gray-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
              {/* Filters - Will NOT move when search text appears */}
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-4 pr-8 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-700/30 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-black dark:text-white text-sm appearance-none w-full"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={environmentFilter}
                    onChange={(e) => setEnvironmentFilter(e.target.value)}
                    className="pl-4 pr-8 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-700/30 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-black dark:text-white text-sm appearance-none w-full"
                  >
                    <option value="all">All Environments</option>
                    <option value="on-premise">On-premise</option>
                    <option value="aws">AWS</option>
                    <option value="azure">Azure</option>
                    <option value="gcp">GCP</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search status text - positioned separately so it doesn't affect filters */}
            {searchQuery && (
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Searching for names or companies containing: "{searchQuery}"
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-black dark:text-gray-400">
                    Loading bookings...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
                <button
                  onClick={fetchBookings}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Bookings List */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {bookings.map((booking) => {
                    const statusBadge = getStatusBadge(booking.status);
                    const envBadge = getEnvironmentBadge(
                      booking.current_environment
                    );

                    return (
                      <div
                        key={booking.id}
                        className="group/item p-4 rounded-2xl border border-white/20 dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:shadow-xl"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Client Info */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-black dark:text-white truncate">
                                  {booking.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1 text-sm text-black dark:text-gray-400">
                                    <Mail className="w-3 h-3" />
                                    {booking.email}
                                  </div>
                                  {booking.company && (
                                    <>
                                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                      <div className="flex items-center gap-1 text-sm text-black dark:text-gray-400">
                                        <Building className="w-3 h-3" />
                                        {booking.company}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Booking Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                                >
                                  {statusBadge.icon}
                                  {statusBadge.label}
                                </span>
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${envBadge.bg} ${envBadge.text}`}
                                >
                                  {envBadge.label}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-black dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                {formatDate(booking.booked_at)}
                              </div>
                            </div>

                            {/* Project Goals */}
                            {booking.project_goals && (
                              <div className="mt-3">
                                <div className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-xl">
                                  <p className="text-sm text-black dark:text-gray-400 whitespace-pre-wrap">
                                    {booking.project_goals}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                updateBookingStatus(booking.id, "confirmed")
                              }
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-sm font-medium hover:scale-105"
                              disabled={booking.status === "confirmed"}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Confirm
                            </button>

                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setEditFormData({
                                  consultation_date:
                                    booking.consultation_date || undefined,
                                  notes: booking.notes,
                                  status: booking.status,
                                });
                                setIsEditModalOpen(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium hover:scale-105"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>

                            <button
                              onClick={() => deleteBooking(booking.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium hover:scale-105"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {bookings.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-black dark:text-gray-400">
                        {searchQuery
                          ? "No bookings found for your search"
                          : "No bookings found"}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Pagination - Always show if totalBookings > 0 */}
                {totalBookings > 0 && (
                  <div className="flex items-center justify-between pt-6 border-t border-white/20 dark:border-gray-700/30">
                    <div className="text-sm text-black dark:text-gray-400">
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, totalBookings)} of{" "}
                      {totalBookings} bookings
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 text-black dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 disabled:opacity-50 text-sm font-medium"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                                  currentPage === pageNum
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                                    : "border border-white/20 dark:border-gray-700/30 text-black dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 backdrop-blur-sm"
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
                        className="flex items-center gap-2 px-4 py-2 text-black dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 disabled:opacity-50 text-sm font-medium"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Booking Modal */}
      {isEditModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full border border-white/20 dark:border-gray-700/30 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  Edit Booking
                </h3>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedBooking(null);
                    setEditFormData({});
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
                >
                  <X className="w-5 h-5 text-black dark:text-white" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Consultation Date
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      editFormData.consultation_date
                        ? new Date(editFormData.consultation_date)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        consultation_date: e.target.value + ":00Z",
                      })
                    }
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-black dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Status
                  </label>
                  <select
                    value={editFormData.status || selectedBooking.status}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        status: e.target.value as Booking["status"],
                      })
                    }
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-black dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Notes
                  </label>
                  <textarea
                    value={editFormData.notes || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        notes: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-black dark:text-white"
                    placeholder="Add notes..."
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditFormData({});
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
