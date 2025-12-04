"use client";

import { useState, useEffect, useRef } from "react";
import type React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  X,
  Menu,
  Search,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Crown,
  Trash2,
  AlertTriangle,
  Loader,
  Home,
  FileText,
  BookOpen,
  Server,
  HelpCircle,
  Users,
  PenSquare,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "@/app/auth/auth-modal";
import { useAuth } from "@/app/auth/hooks/use-auth";

export function MinimalHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Desktop dropdown states
  const [isArticlesOpen, setIsArticlesOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isOthersOpen, setIsOthersOpen] = useState(false);

  // Mobile states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<
    string | null
  >(null);

  // Desktop timeout refs
  const articlesTimeout = useRef<NodeJS.Timeout | null>(null);
  const resourcesTimeout = useRef<NodeJS.Timeout | null>(null);
  const servicesTimeout = useRef<NodeJS.Timeout | null>(null);
  const userDropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const othersTimeout = useRef<NodeJS.Timeout | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (articlesTimeout.current) clearTimeout(articlesTimeout.current);
      if (resourcesTimeout.current) clearTimeout(resourcesTimeout.current);
      if (servicesTimeout.current) clearTimeout(servicesTimeout.current);
      if (othersTimeout.current) clearTimeout(othersTimeout.current);
      if (userDropdownTimeout.current)
        clearTimeout(userDropdownTimeout.current);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
        setActiveMobileDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle auth modal scroll
  useEffect(() => {
    if (showAuthModal) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showAuthModal]);

  // Search functionality
  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/articles/?search=${encodeURIComponent(searchQuery)}`
        );
        if (!res.ok)
          throw new Error(`Error fetching results: ${res.statusText}`);
        const data = await res.json();
        setSearchResults(Array.isArray(data.results) ? data.results : data);
      } catch {
        setSearchResults([]);
        setError("Failed to fetch results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAuthModal(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      logout();
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    }, 500);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  // Desktop hover handlers
  function handleMouseEnter(
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  }

  function handleMouseLeave(
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
      timeoutRef.current = null;
    }, 200);
  }

  // Mobile dropdown toggle
  const toggleMobileDropdown = (dropdown: string) => {
    setActiveMobileDropdown(
      activeMobileDropdown === dropdown ? null : dropdown
    );
  };

  // Mobile navigation items
  const mobileNavItems = [{ href: "/", label: "Home", icon: Home }];

  const mobileArticlesItems = [
    { href: "/articles", label: "All Articles" },
    { href: "/100-days-cloud-challenge", label: "Explore 100 Days of Cloud" },
  ];

  const mobileResourcesItems = [
    { href: "/learn-devops-on-youtube", label: "Learn DevOps on YouTube" },
    { href: "/devops-playgrounds", label: "Explore DevOps Playgrounds" },
  ];

  const mobileServicesItems = [
    { href: "/services/cloud-migration", label: "Cloud Migration" },
    {
      href: "/services/infrastructure-automation",
      label: "Infrastructure as Code",
    },
    { href: "/services/part-time-devops-support", label: "DevOps Support" },
  ];

  const mobileOthersItems = [
    { href: "/about", label: "About" },
    { href: "/faqs", label: "FAQs" },
    { href: "/user-guide", label: "User Guide" },
  ];

  // Delete account functionality
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/auth/delete-account/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        alert(
          `Failed to delete account: ${errorData.error || "Unknown error"}`
        );
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete Account Modal Component
  const DeleteAccountModal = () => {
    if (!showDeleteConfirm) return null;

    return createPortal(
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="bg-white dark:bg-[#000000] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
                Delete Your Account
              </h3>
              <p className="text-red-600 dark:text-red-400 text-sm">
                This action cannot be undone
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-900 dark:text-gray-100 font-medium mb-3">
              Are you absolutely sure you want to delete your account?
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <ul className="text-red-800 dark:text-red-200 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <span>All your articles will be permanently deleted</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Your author profile will be removed</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <span>All comments and reactions will be deleted</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <span>This action cannot be reversed</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200 font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Yes, Delete My Account
                </>
              )}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // User Dropdown Component for Desktop
  const UserDropdown = () => {
    const openDeleteConfirmation = () => {
      setIsUserDropdownOpen(false);
      setShowDeleteConfirm(true);
    };

    return (
      <>
        <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-[#000000]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 py-2">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
              Hello, {user?.username}!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>

          <Link
            href="/author-profile-form"
            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
            onClick={() => setIsUserDropdownOpen(false)}
          >
            <Settings className="w-4 h-4 mr-3" />
            Edit Your Profile
          </Link>

          <Link
            href={`/admin/author/${user?.username}`}
            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
            onClick={() => setIsUserDropdownOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4 mr-3" />
            Dashboard
          </Link>

          <Link
            href={`/authors/${user?.slug}`}
            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
            onClick={() => setIsUserDropdownOpen(false)}
          >
            <Crown className="w-4 h-4 mr-3" />
            Public Profile View
          </Link>

          <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>

            <button
              onClick={openDeleteConfirmation}
              className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium border-t border-gray-100 dark:border-gray-700 mt-2 pt-2"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Delete Account
            </button>
          </div>
        </div>

        <DeleteAccountModal />
      </>
    );
  };

  // User Dropdown for Mobile Menu
  const MobileUserDropdown = () => {
    const openDeleteConfirmation = () => {
      setIsMobileMenuOpen(false);
      setShowDeleteConfirm(true);
    };

    return (
      <div className="space-y-2 px-6 mt-4">
        {/* User Info Section */}
        <div className="px-3 py-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {user?.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* User Menu Items */}
        <Link
          href="/author-profile-form"
          className={`flex items-center px-4 py-4 rounded-xl transition-all duration-200 font-medium text-lg ${
            pathname === "/author-profile-form"
              ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Settings className="w-6 h-6 mr-3" />
          Edit Your Profile
        </Link>

        <Link
          href={`/admin/author/${user?.username}`}
          className={`flex items-center px-4 py-4 rounded-xl transition-all duration-200 font-medium text-lg ${
            pathname.includes("/admin/author")
              ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <LayoutDashboard className="w-6 h-6 mr-3" />
          Dashboard
        </Link>

        <Link
          href={`/authors/${user?.slug}`}
          className={`flex items-center px-4 py-4 rounded-xl transition-all duration-200 font-medium text-lg ${
            pathname.includes(`/authors/${user?.slug}`)
              ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Crown className="w-6 h-6 mr-3" />
          Public Profile View
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-lg"
        >
          <LogOut className="w-6 h-6 mr-3" />
          Sign Out
        </button>

        <button
          onClick={openDeleteConfirmation}
          className="flex items-center w-full px-4 py-4 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium text-lg mt-2"
        >
          <Trash2 className="w-6 h-6 mr-3" />
          Delete Account
        </button>
      </div>
    );
  };

  // Auth Modal Component
  const AuthModalOverlay = () => {
    if (!mounted || !showAuthModal) return null;

    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 bg-white/80 dark:bg-[#000000]/80 overflow-y-auto pt-20">
        <div className="relative w-full max-w-md mx-auto my-8">
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute -top-12 right-0 text-black dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 transition-colors z-[10001]"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="bg-white dark:bg-[#000000] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <AuthModal onSuccess={handleAuthSuccess} />
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-[#000000] backdrop-blur-sm">
        {/* MOBILE HEADER - Simple: Logo, Search, Menu */}
        <div className="md:hidden">
          <div className="flex items-center justify-between py-4 px-6 gap-3">
            {/* Logo - KEEP ORIGINAL SIZE */}
            <Link
              href="/"
              className="flex items-center justify-start group flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="h-23 w-21 transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Search Bar - WIDER */}
            <div className="flex-1 relative max-w-[200px] ml-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl text-sm pl-10 pr-8 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-black dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 font-medium h-10 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  autoComplete="off"
                  spellCheck={false}
                />
                {searchQuery && (
                  <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-200 w-4 h-4 flex items-center justify-center"
                    aria-label="Clear"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchQuery && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((article) => (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="block px-4 py-3 text-sm text-black dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-all font-medium hover:text-blue-700 dark:hover:text-blue-300"
                      onClick={() => {
                        handleClear();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <div className="line-clamp-2">{article.title}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex-shrink-0 font-medium rounded-xl ml-1"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* DESKTOP HEADER - Only removed the border/frame around navigation */}
        <div className="hidden md:flex items-center justify-between h-25 relative z-10 px-6 md:px-11">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-200 to-purple-200 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <img
                src="/logo.png"
                alt="Logo"
                className="h-37 w-35 relative z-10 transition-transform group-hover:scale-105"
              />
            </div>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
          </Link>

          {/* Navigation - Removed border/frame (the bg-white/80 dark:bg-[#000000]/80 backdrop-blur-md rounded-2xl border border-gray-400/50 dark:border-gray-700/50 px-2 py-1 shadow-sm) */}
          <nav className="flex items-center space-x-1 -ml-12">
            <Link
              href="/"
              className={`px-5 py-2.5 rounded-xl transition-all duration-200 relative group font-medium ${
                pathname === "/"
                  ? "bg-blue-600 dark:bg-blue-700 text-white"
                  : "text-black dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <span className="relative z-10">Home</span>
            </Link>

            {/* Articles Dropdown */}
            <div
              className="relative"
              onMouseEnter={() =>
                handleMouseEnter(setIsArticlesOpen, articlesTimeout)
              }
              onMouseLeave={() =>
                handleMouseLeave(setIsArticlesOpen, articlesTimeout)
              }
            >
              <button
                className={`flex items-center px-5 py-2.5 rounded-xl transition-all duration-200 relative group font-medium ${
                  pathname.includes("/articles") ||
                  pathname.includes("/100-days-cloud-challenge")
                    ? "bg-blue-600 dark:bg-blue-700 text-white"
                    : "text-black dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <span className="relative z-10">Articles</span>
                <ChevronDown className="ml-2 w-4 h-4 relative z-10 transition-transform group-hover:rotate-180" />
              </button>
              {isArticlesOpen && (
                <div
                  className="absolute top-full left-0 mt-3 w-64 bg-white dark:bg-[#000000]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 py-2"
                  onMouseEnter={() =>
                    handleMouseEnter(setIsArticlesOpen, articlesTimeout)
                  }
                  onMouseLeave={() =>
                    handleMouseLeave(setIsArticlesOpen, articlesTimeout)
                  }
                >
                  <Link
                    href="/articles"
                    className="block px-4 py-3 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-all font-medium"
                  >
                    Read Articles
                  </Link>
                  <Link
                    href="/100-days-cloud-challenge"
                    className="block px-4 py-3 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
                  >
                    Explore 100 Days of Cloud
                  </Link>
                  <Link
                    href="/categories"
                    className="block px-4 py-3 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
                  >
                    Explore All Categories
                  </Link>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() =>
                handleMouseEnter(setIsResourcesOpen, resourcesTimeout)
              }
              onMouseLeave={() =>
                handleMouseLeave(setIsResourcesOpen, resourcesTimeout)
              }
            >
              <button
                className={`flex items-center px-5 py-2.5 rounded-xl transition-all duration-200 relative group font-medium ${
                  pathname.includes("/learn-devops-on-youtube") ||
                  pathname.includes("/free-courses") ||
                  pathname.includes("/devops-playgrounds")
                    ? "bg-blue-600 dark:bg-blue-700 text-white"
                    : "text-black dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <span className="relative z-10">Resources</span>
                <ChevronDown className="ml-2 w-4 h-4 relative z-10 transition-transform group-hover:rotate-180" />
              </button>
              {isResourcesOpen && (
                <div
                  className="absolute top-full left-0 mt-3 w-64 bg-white dark:bg-[#000000]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 py-2"
                  onMouseEnter={() =>
                    handleMouseEnter(setIsResourcesOpen, resourcesTimeout)
                  }
                  onMouseLeave={() =>
                    handleMouseLeave(setIsResourcesOpen, resourcesTimeout)
                  }
                >
                  <Link
                    href="/learn-devops-on-youtube"
                    className="block px-4 py-3 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-all font-medium"
                  >
                    Learn DevOps on YouTube
                  </Link>
                  <Link
                    href="/free-courses"
                    className="block px-4 py-3 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-all font-medium"
                  >
                    Learn Free Courses
                  </Link>
                  <Link
                    href="/devops-playgrounds"
                    className="block px-4 py-3 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
                  >
                    Explore DevOps Playgrounds
                  </Link>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() =>
                handleMouseEnter(setIsServicesOpen, servicesTimeout)
              }
              onMouseLeave={() =>
                handleMouseLeave(setIsServicesOpen, servicesTimeout)
              }
            >
              <button
                className={`flex items-center px-5 py-2.5 rounded-xl transition-all duration-200 relative group font-medium ${
                  pathname.includes("/services")
                    ? "bg-blue-600 dark:bg-blue-700 text-white"
                    : "text-black dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <span className="relative z-10">Services</span>
                <ChevronDown className="ml-2 w-4 h-4 relative z-10 transition-transform group-hover:rotate-180" />
              </button>
              {isServicesOpen && (
                <div
                  className="absolute top-full left-0 mt-3 w-64 bg-white dark:bg-[#000000]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 py-2"
                  onMouseEnter={() =>
                    handleMouseEnter(setIsServicesOpen, servicesTimeout)
                  }
                  onMouseLeave={() =>
                    handleMouseLeave(setIsServicesOpen, servicesTimeout)
                  }
                >
                  <Link
                    href="/services/cloud-migration"
                    className="block px-4 py-3 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-all font-medium"
                  >
                    Cloud Migration
                  </Link>
                  <Link
                    href="/services/infrastructure-automation"
                    className="block px-4 py-3 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-all font-medium"
                  >
                    Infrastructure as Code
                  </Link>
                  <Link
                    href="/services/part-time-devops-support"
                    className="block px-4 py-3 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
                  >
                    DevOps Support
                  </Link>
                </div>
              )}
            </div>

            {/* Others Dropdown */}
            <div
              className="relative"
              onMouseEnter={() =>
                handleMouseEnter(setIsOthersOpen, othersTimeout)
              }
              onMouseLeave={() =>
                handleMouseLeave(setIsOthersOpen, othersTimeout)
              }
            >
              <button
                className={`flex items-center px-5 py-2.5 rounded-xl transition-all duration-200 relative group font-medium ${
                  pathname.includes("/about") ||
                  pathname.includes("/faqs") ||
                  pathname.includes("/user-guide")
                    ? "bg-blue-600 dark:bg-blue-700 text-white"
                    : "text-black dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <span className="relative z-10">Others</span>
                <ChevronDown className="ml-2 w-4 h-4 relative z-10 transition-transform group-hover:rotate-180" />
              </button>
              {isOthersOpen && (
                <div
                  className="absolute top-full left-0 mt-3 w-64 bg-white dark:bg-[#000000]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 py-2"
                  onMouseEnter={() =>
                    handleMouseEnter(setIsOthersOpen, othersTimeout)
                  }
                  onMouseLeave={() =>
                    handleMouseLeave(setIsOthersOpen, othersTimeout)
                  }
                >
                  <Link
                    href="/about"
                    className="block px-4 py-3 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-all font-medium"
                  >
                    About
                  </Link>
                  <Link
                    href="/faqs"
                    className="block px-4 py-3 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-all font-medium"
                  >
                    FAQs
                  </Link>
                  <Link
                    href="/user-guide"
                    className="block px-4 py-3 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
                  >
                    User Guide
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Section - Search + Auth */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative w-64">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 dark:text-gray-300 w-4 h-4 z-10" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full pl-10 pr-8 bg-white dark:bg-gray-900 border-gray-400 dark:border-gray-700 text-black dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 transition-all group-hover:border-gray-300 dark:group-hover:border-gray-600 font-medium"
                />
                {searchQuery && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 w-6 h-6"
                    aria-label="Clear"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {searchQuery && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-72 overflow-y-auto">
                  {searchResults.map((article) => (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="block px-4 py-3 text-black dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-all group font-medium"
                      onClick={handleClear}
                    >
                      <div className="group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Section - Desktop */}
            {!isLoading && (
              <div className="flex items-center">
                {isAuthenticated ? (
                  <div
                    className="relative"
                    onMouseEnter={() =>
                      handleMouseEnter(
                        setIsUserDropdownOpen,
                        userDropdownTimeout
                      )
                    }
                    onMouseLeave={() =>
                      handleMouseLeave(
                        setIsUserDropdownOpen,
                        userDropdownTimeout
                      )
                    }
                  >
                    <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 border border-gray-200 dark:border-gray-700 hover:shadow-inner transition-all">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      )}
                    </button>
                    {isUserDropdownOpen && <UserDropdown />}
                  </div>
                ) : (
                  <button
                    onClick={handleSignInClick}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-blue-500/25 font-medium"
                  >
                    Write Article
                  </button>
                )}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE MENU COMPONENTS */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" />
      )}

      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-white dark:bg-[#000000] transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Menu
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto py-6">
            {/* Show User Dropdown when logged in */}
            {isAuthenticated ? (
              <MobileUserDropdown />
            ) : (
              /* Show Write Article Button for Non-logged in users */
              <div className="px-6 mb-6">
                <button
                  onClick={handleSignInClick}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-medium flex items-center justify-center gap-2"
                >
                  <PenSquare className="w-5 h-5" />
                  Write Article
                </button>
              </div>
            )}

            {/* Main Navigation */}
            <div className="space-y-2 px-6 mt-6">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-4 rounded-xl transition-all duration-200 font-medium text-lg ${
                      pathname === item.href
                        ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-6 h-6 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Articles Dropdown */}
            <div className="mt-6 px-6">
              <button
                onClick={() => toggleMobileDropdown("articles")}
                className="flex items-center justify-between w-full px-4 py-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-lg"
              >
                <div className="flex items-center">
                  <FileText className="w-6 h-6 mr-3" />
                  Articles
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    activeMobileDropdown === "articles" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeMobileDropdown === "articles" && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {mobileArticlesItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors font-medium"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveMobileDropdown(null);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="mt-2 px-6">
              <button
                onClick={() => toggleMobileDropdown("resources")}
                className="flex items-center justify-between w-full px-4 py-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-lg"
              >
                <div className="flex items-center">
                  <Zap className="w-6 h-6 mr-3" />
                  Resources
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    activeMobileDropdown === "resources" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeMobileDropdown === "resources" && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {mobileResourcesItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors font-medium"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveMobileDropdown(null);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div className="mt-2 px-6">
              <button
                onClick={() => toggleMobileDropdown("services")}
                className="flex items-center justify-between w-full px-4 py-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-lg"
              >
                <div className="flex items-center">
                  <Server className="w-6 h-6 mr-3" />
                  Services
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    activeMobileDropdown === "services" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeMobileDropdown === "services" && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {mobileServicesItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors font-medium"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveMobileDropdown(null);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Others Dropdown */}
            <div className="mt-2 px-6">
              <button
                onClick={() => toggleMobileDropdown("others")}
                className="flex items-center justify-between w-full px-4 py-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-lg"
              >
                <div className="flex items-center">
                  <HelpCircle className="w-6 h-6 mr-3" />
                  Others
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    activeMobileDropdown === "others" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeMobileDropdown === "others" && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {mobileOthersItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors font-medium"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveMobileDropdown(null);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModalOverlay />

      {/* Global Styles for Mobile */}
      <style jsx global>{`
        @media (max-width: 768px) {
          body {
            -webkit-overflow-scrolling: touch;
          }

          button,
          a {
            min-height: 44px;
            min-width: 44px;
          }

          input,
          textarea,
          select {
            font-size: 16px;
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
