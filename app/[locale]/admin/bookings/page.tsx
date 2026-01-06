"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/[locale]/auth/hooks/use-auth";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  RefreshCw,
  Download,
  Mail,
  Phone,
  Building,
  Users,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

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

interface Pagination {
  count: number;
  next: string | null;
  previous: string | null;
}

export default function BookingsManagementPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [environmentFilter, setEnvironmentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("-booked_at");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Booking>>({});
  const [pagination, setPagination] = useState<Pagination>({
    count: 0,
    next: null,
    previous: null,
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  // Add to your state declarations:
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const isSuperUser = user?.is_super_user;

  // Fetch bookings with filters
  const fetchBookings = async () => {
    if (!isSuperUser) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let url = `${API_BASE_URL}/consultations/?page=${page}&page_size=${pageSize}&ordering=${sortBy}`;

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }
      if (environmentFilter !== "all") {
        url += `&current_environment=${environmentFilter}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.results || data);

      if (data.count !== undefined) {
        setPagination({
          count: data.count,
          next: data.next,
          previous: data.previous,
        });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch booking statistics
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

  // In your updateBookingStatus function, add logic to show the date
  const updateBookingStatus = async (
    bookingId: number,
    status: Booking["status"]
  ) => {
    try {
      const token = localStorage.getItem("token");
      const booking = bookings.find((b) => b.id === bookingId);

      // Prepare update data
      const updateData: any = { status };

      // If confirming, add consultation date if not already set
      if (status === "confirmed" && !booking?.consultation_date) {
        // Set consultation date to tomorrow at 10 AM as default
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

      console.log(`📊 Response status: ${response.status}`);

      const data = await response.json();
      console.log(`📊 Response data:`, data);

      if (response.ok) {
        // Update local state immediately
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
        );

        // Show success alert
        setAlertState({
          isOpen: true,
          title: "Success",
          message: "Booking status updated successfully",
          type: "success",
        });

        fetchBookingStats();
        return true;
      } else {
        console.error(`❌ API Error: ${JSON.stringify(data)}`);
        // Show error alert
        setAlertState({
          isOpen: true,
          title: "Error",
          message:
            data.error ||
            `Failed to update booking status (${response.status})`,
          type: "error",
        });
        return false;
      }
    } catch (error) {
      console.error("💥 Network error:", error);
      // Show error alert
      setAlertState({
        isOpen: true,
        title: "Error",
        message: "Network error. Please try again.",
        type: "error",
      });
      return false;
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
        setAlertState({
          isOpen: true,
          title: "Success",
          message: "Booking updated successfully",
          type: "success",
        });
        fetchBookings();
        return true;
      } else {
        setAlertState({
          isOpen: true,
          title: "Error",
          message: result.error || "Failed to update booking",
          type: "error",
        });
        return false;
      }
    } catch (error) {
      setAlertState({
        isOpen: true,
        title: "Error",
        message: "Network error. Please try again.",
        type: "error",
      });
      console.error("Error:", error);
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

  // Format date for display
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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status: Booking["status"]) => {
    const config = {
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: <AlertCircle className="w-4 h-4" />,
        label: "Pending",
      },
      confirmed: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Confirmed",
      },
      cancelled: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: <XCircle className="w-4 h-4" />,
        label: "Cancelled",
      },
      completed: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Completed",
      },
    };

    return config[status];
  };

  // Get environment badge
  const getEnvironmentBadge = (env: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> =
      {
        "on-premise": {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-700 dark:text-gray-300",
          label: "On-premise",
        },
        aws: {
          bg: "bg-orange-100 dark:bg-orange-900/30",
          text: "text-orange-700 dark:text-orange-400",
          label: "AWS",
        },
        azure: {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-700 dark:text-blue-400",
          label: "Azure",
        },
        gcp: {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-700 dark:text-green-400",
          label: "GCP",
        },
        hybrid: {
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-700 dark:text-purple-400",
          label: "Hybrid",
        },
      };

    return (
      config[env] || {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
        label: env,
      }
    );
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    if (isAuthenticated && isSuperUser) {
      fetchBookings();
      fetchBookingStats();
    }
  }, [
    isAuthenticated,
    isSuperUser,
    page,
    statusFilter,
    environmentFilter,
    sortBy,
  ]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchBookings();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000]">
        <MinimalHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
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
        <main className="max-w-7xl mx-auto px-4 py-8 mb-35">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Super user access required to view bookings
            </p>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000]">
      <MinimalHeader />

      <main className="px-6 md:px-11 pt-8 pb-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="h-px w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  ADMIN DASHBOARD
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-black dark:text-white mb-2 tracking-tight">
                Consultation Bookings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track all consultation requests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  fetchBookings();
                  fetchBookingStats();
                }}
                className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium opacity-90">
                  Total Bookings
                </h3>
                <Users className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm opacity-80 mt-1">All time</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium opacity-90">Pending</h3>
                <AlertCircle className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-bold">{stats.pending}</div>
              <div className="text-sm opacity-80 mt-1">Awaiting action</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium opacity-90">Confirmed</h3>
                <CheckCircle className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-bold">{stats.confirmed}</div>
              <div className="text-sm opacity-80 mt-1">Scheduled</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium opacity-90">This Week</h3>
                <Calendar className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-bold">{stats.weekly}</div>
              <div className="text-sm opacity-80 mt-1">New bookings</div>
            </div>
          </div>
        )}
        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Environment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Environment
              </label>
              <select
                value={environmentFilter}
                onChange={(e) => setEnvironmentFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Environments</option>
                <option value="on-premise">On-premise</option>
                <option value="aws">AWS</option>
                <option value="azure">Azure</option>
                <option value="gcp">Google Cloud</option>
                <option value="hybrid">Hybrid / Multi-cloud</option>
              </select>
            </div>
          </div>

          {/* Sort and Actions */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-sm text-gray-600 dark:text-gray-400"
                >
                  <option value="-booked_at">Newest First</option>
                  <option value="booked_at">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="-name">Name Z-A</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  // Export functionality
                  const dataStr = JSON.stringify(bookings, null, 2);
                  const dataUri =
                    "data:application/json;charset=utf-8," +
                    encodeURIComponent(dataStr);
                  const exportFileDefaultName = `bookings-${
                    new Date().toISOString().split("T")[0]
                  }.json`;

                  const linkElement = document.createElement("a");
                  linkElement.setAttribute("href", dataUri);
                  linkElement.setAttribute("download", exportFileDefaultName);
                  linkElement.click();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-300 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
        {/* Bookings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
              <button
                onClick={fetchBookings}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No bookings found
              </p>
              {searchQuery ||
              statusFilter !== "all" ||
              environmentFilter !== "all" ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setEnvironmentFilter("all");
                  }}
                  className="mt-3 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Client
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Environment
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Preferred Time
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Booked Date
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                      >
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {booking.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                              <Mail className="w-3 h-3" />
                              {booking.email}
                            </div>
                            {booking.company && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                <Building className="w-3 h-3" />
                                {booking.company}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              getEnvironmentBadge(booking.current_environment)
                                .bg
                            } ${
                              getEnvironmentBadge(booking.current_environment)
                                .text
                            }`}
                          >
                            {
                              getEnvironmentBadge(booking.current_environment)
                                .label
                            }
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {booking.preferred_time
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                getStatusBadge(booking.status).bg
                              } ${getStatusBadge(booking.status).text}`}
                            >
                              {getStatusBadge(booking.status).icon}
                              {getStatusBadge(booking.status).label}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {formatDate(booking.booked_at)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(booking.booked_at).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setEditFormData({
                                  consultation_date:
                                    booking.consultation_date || undefined,
                                  notes: booking.notes,
                                });
                                setIsEditModalOpen(true);
                              }}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const newStatus =
                                  booking.status === "pending"
                                    ? "confirmed"
                                    : booking.status === "confirmed"
                                    ? "completed"
                                    : "pending";
                                updateBookingStatus(booking.id, newStatus);
                              }}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-300"
                              title="Update Status"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            {booking.status === "pending" && (
                              <button
                                onClick={() => {
                                  if (confirm("Cancel this booking?")) {
                                    updateBookingStatus(
                                      booking.id,
                                      "cancelled"
                                    );
                                  }
                                }}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                                title="Cancel"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                // View details
                                setSelectedBooking(booking);
                              }}
                              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.count > pageSize && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {(page - 1) * pageSize + 1} to{" "}
                    {Math.min(page * pageSize, pagination.count)} of{" "}
                    {pagination.count} bookings
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={!pagination.previous}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-lg font-medium">
                      {page}
                    </span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={!pagination.next}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {/* Selected Booking Details Modal */}
        {selectedBooking && !isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Booking Details
                  </h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
                  >
                    <XCircle className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Client Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Client Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {selectedBooking.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4" />
                            {selectedBooking.email}
                          </div>
                        </div>
                        {selectedBooking.company && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            {selectedBooking.company}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Booking Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                getStatusBadge(selectedBooking.status).bg
                              } ${getStatusBadge(selectedBooking.status).text}`}
                            >
                              {getStatusBadge(selectedBooking.status).label}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                getEnvironmentBadge(
                                  selectedBooking.current_environment
                                ).bg
                              } ${
                                getEnvironmentBadge(
                                  selectedBooking.current_environment
                                ).text
                              }`}
                            >
                              {
                                getEnvironmentBadge(
                                  selectedBooking.current_environment
                                ).label
                              }
                            </span>
                          </div>
                        </div>
                        {/* In the Booking Details Modal */}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {selectedBooking.consultation_date ? (
                              <>
                                Consultation:{" "}
                                {formatDateTime(
                                  selectedBooking.consultation_date
                                )}
                              </>
                            ) : (
                              "Not scheduled yet"
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Preferred:{" "}
                            {selectedBooking.preferred_time
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Goals */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Project Goals
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {selectedBooking.project_goals ||
                          "No project goals provided."}
                      </p>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {selectedBooking.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Admin Notes
                      </h4>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {selectedBooking.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setEditFormData({
                          consultation_date:
                            selectedBooking.consultation_date || undefined,
                          notes: selectedBooking.notes,
                        });
                        setIsEditModalOpen(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
                    >
                      Edit Booking
                    </button>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Edit Booking Modal */}
        {isEditModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Edit Booking
                </h3>
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                          consultation_date: e.target.value + ":00Z", // Add seconds and timezone
                        })
                      }
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <AlertDialog
          isOpen={alertState.isOpen}
          onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
          title={alertState.title}
          message={alertState.message}
          type={alertState.type}
          duration={5000}
        />
      </main>

      <MinimalFooter />
    </div>
  );
}
