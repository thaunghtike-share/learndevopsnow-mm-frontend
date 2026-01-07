"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/[locale]/auth/hooks/use-auth";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Mail,
  Building,
  Users,
  ArrowUpDown,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
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
  
  // Pagination state - ALWAYS SHOW even with 1 booking
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [pageSize] = useState(10);
  
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

  const fetchBookings = async () => {
    if (!isSuperUser) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let url = `${API_BASE_URL}/consultations/?page=${currentPage}&page_size=${pageSize}&ordering=${sortBy}`;

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
      
      // Handle both array response and paginated response
      if (Array.isArray(data)) {
        setBookings(data);
        setTotalBookings(data.length);
      } else if (data.results) {
        setBookings(data.results);
        setTotalBookings(data.count || 0);
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
        setBookings(bookings.filter(b => b.id !== bookingId));
        setTotalBookings(prev => prev - 1);
        
        setAlertState({
          isOpen: true,
          title: "Success",
          message: "Booking deleted successfully",
          type: "success",
        });
        
        fetchBookingStats();
        return true;
      } else {
        const data = await response.json();
        setAlertState({
          isOpen: true,
          title: "Error",
          message: data.error || "Failed to delete booking",
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
      return false;
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

        setAlertState({
          isOpen: true,
          title: "Success",
          message: "Booking status updated successfully",
          type: "success",
        });

        fetchBookingStats();
        return true;
      } else {
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

  useEffect(() => {
    if (isAuthenticated && isSuperUser) {
      fetchBookings();
      fetchBookingStats();
    }
  }, [
    isAuthenticated,
    isSuperUser,
    currentPage,
    statusFilter,
    environmentFilter,
    sortBy,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to page 1 when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Calculate total pages - ALWAYS at least 1
  const totalPages = Math.max(1, Math.ceil(totalBookings / pageSize));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000]">
        <MinimalHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-black dark:text-white">Loading...</p>
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
            <p className="text-lg text-black dark:text-white mb-8">
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
              <p className="text-black dark:text-white">
                Manage and track all consultation requests
              </p>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto text-center py-8 md:py-12">
            {/* Total Bookings */}
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-light text-black dark:text-white">
                {stats.total}
              </div>
              <div className="text-sm text-blue-600 font-semibold uppercase tracking-wider">
                Total Bookings
              </div>
            </div>

            {/* Pending */}
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-light text-black dark:text-white">
                {stats.pending}
              </div>
              <div className="text-sm text-yellow-600 font-semibold uppercase tracking-wider">
                Pending
              </div>
            </div>

            {/* Confirmed */}
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-light text-black dark:text-white">
                {stats.confirmed}
              </div>
              <div className="text-sm text-green-600 font-semibold uppercase tracking-wider">
                Confirmed
              </div>
            </div>

            {/* This Week */}
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-light text-black dark:text-white">
                {stats.weekly}
              </div>
              <div className="text-sm text-purple-600 font-semibold uppercase tracking-wider">
                This Week
              </div>
            </div>
          </div>
        )}
        
        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black dark:text-white" />
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-black dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-black dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Environment
              </label>
              <select
                value={environmentFilter}
                onChange={(e) => setEnvironmentFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-black dark:text-white"
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

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-black dark:text-white" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-sm text-black dark:text-white"
                >
                  <option value="-booked_at">Newest First</option>
                  <option value="booked_at">Oldest First</option>
                </select>
              </div>
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
              <Calendar className="w-12 h-12 text-black dark:text-white mx-auto mb-4" />
              <p className="text-black dark:text-white">
                No bookings found
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-black dark:text-white">
                        Client
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-black dark:text-white">
                        Environment
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-black dark:text-white">
                        Preferred Time
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-black dark:text-white">
                        Status
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-black dark:text-white">
                        Booked Date
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-black dark:text-white">
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
                            <div className="font-medium text-black dark:text-white">
                              {booking.name}
                            </div>
                            <div className="text-sm text-black dark:text-white flex items-center gap-2 mt-1">
                              <Mail className="w-3 h-3" />
                              {booking.email}
                            </div>
                            {booking.company && (
                              <div className="text-sm text-black dark:text-white flex items-center gap-2 mt-1">
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
                          <div className="text-sm text-black dark:text-white">
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
                          <div className="text-sm text-black dark:text-white">
                            {formatDate(booking.booked_at)} at {new Date(booking.booked_at).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {/* Edit Button */}
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
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300"
                              title="Edit Booking"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete booking from ${booking.name}? This action cannot be undone.`)) {
                                  deleteBooking(booking.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            
                            {/* Search/View Details Button */}
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="p-2 text-black dark:text-white hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
                              title="View Details"
                            >
                              <Search className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION - ALWAYS SHOW (even with only 1 booking) */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Showing count */}
                  <div className="text-sm text-black dark:text-white font-medium text-center sm:text-left">
                    {bookings.length > 0 ? (
                      <>
                        Showing {Math.min(currentPage * pageSize, totalBookings)} of {totalBookings} bookings
                      </>
                    ) : (
                      "No bookings found"
                    )}
                  </div>

                  {/* Pagination buttons - SHOW EVEN IF ONLY 1 PAGE */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md text-black dark:text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {(() => {
                        // Always show page numbers, even if there's only 1 page
                        const pagesToShow = 3;
                        let startPage = Math.max(1, currentPage - 1);
                        let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
                        
                        if (endPage - startPage + 1 < pagesToShow) {
                          startPage = Math.max(1, endPage - pagesToShow + 1);
                        }

                        const pages = [];
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(i);
                        }

                        return pages.map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all shadow-sm ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md"
                                : "border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 backdrop-blur-sm"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ));
                      })()}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md text-black dark:text-white"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile page info */}
                  <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 font-medium text-center">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Selected Booking Details Modal */}
        {selectedBooking && !isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    Booking Details
                  </h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
                  >
                    <XCircle className="w-5 h-5 text-black dark:text-white" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-black dark:text-white mb-2">
                        Client Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="font-semibold text-black dark:text-white">
                            {selectedBooking.name}
                          </div>
                          <div className="text-sm text-black dark:text-white flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4" />
                            {selectedBooking.email}
                          </div>
                        </div>
                        {selectedBooking.company && (
                          <div className="text-sm text-black dark:text-white flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            {selectedBooking.company}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-black dark:text-white mb-2">
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
                        <div className="text-sm text-black dark:text-white">
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
                        <div className="text-sm text-black dark:text-white">
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

                  <div>
                    <h4 className="text-sm font-medium text-black dark:text-white mb-2">
                      Project Goals
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <p className="text-black dark:text-white whitespace-pre-wrap">
                        {selectedBooking.project_goals ||
                          "No project goals provided."}
                      </p>
                    </div>
                  </div>

                  {selectedBooking.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-black dark:text-white mb-2">
                        Admin Notes
                      </h4>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                        <p className="text-black dark:text-white whitespace-pre-wrap">
                          {selectedBooking.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setEditFormData({
                          consultation_date:
                            selectedBooking.consultation_date || undefined,
                          notes: selectedBooking.notes,
                          status: selectedBooking.status,
                        });
                        setIsEditModalOpen(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
                    >
                      Edit Booking
                    </button>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
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
                <h3 className="text-xl font-bold text-black dark:text-white mb-6">
                  Edit Booking
                </h3>
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
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-black dark:text-white"
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
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-black dark:text-white"
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
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-black dark:text-white"
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