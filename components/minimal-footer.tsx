"use client";

import Link from "next/link";
import {
  Facebook,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
  Moon,
  Sun,
  Monitor,
  ArrowRight,
  Cloud,
  Code,
  Server,
  Send,
  Loader2,
  CheckCircle,
  X,
  Bell,
  BellOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function MinimalFooter() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Check subscription status for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      checkSubscription();
    } else {
      setIsSubscribed(false);
    }
  }, [isAuthenticated]);

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsSubscribed(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/subscribe/`, {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.subscribed);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("Failed to check subscription:", error);
      setIsSubscribed(false);
    }
  };

  // Theme handling
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "system"
      | null;

    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, []);

  const applyTheme = (theme: "light" | "dark" | "system") => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const setThemeMode = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setSubscriptionMessage({ type, text });
    setTimeout(() => setSubscriptionMessage(null), 5000);
  };

  const toggleSubscription = async () => {
    console.log("Toggle clicked, current state:", { isSubscribed, isAuthenticated });
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showMessage("error", "Please sign in to subscribe");
        setLoading(false);
        return;
      }

      if (isSubscribed) {
        // Unsubscribe
        console.log("Unsubscribing...");
        const response = await fetch(`${API_BASE_URL}/subscribe/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Token ${token}`,
          },
        });

        if (response.ok) {
          setIsSubscribed(false);
          showMessage("success", "Unsubscribed from notifications");
        } else {
          showMessage("error", "Failed to unsubscribe");
        }
      } else {
        // Subscribe
        console.log("Subscribing...");
        const response = await fetch(`${API_BASE_URL}/subscribe/`, {
          method: "POST",
          headers: {
            "Authorization": `Token ${token}`,
          },
        });

        if (response.ok) {
          setIsSubscribed(true);
          showMessage("success", "Subscribed! You'll get email notifications");
        } else {
          showMessage("error", "Failed to subscribe");
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
      showMessage("error", "Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    setShowAuthModal(false);
    router.push("/auth");
  };

  return (
    <footer className="bg-white dark:bg-[#000000] relative z-10 transition-colors duration-300 overflow-hidden">
      <div className="px-6 md:px-11 relative z-10 py-12 md:py-16">
        {/* Subscription Message Alert */}
        {subscriptionMessage && (
          <div className={`fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300 ${
            subscriptionMessage.type === "success" 
              ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" 
              : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
          } rounded-lg shadow-xl border p-4 max-w-sm`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                subscriptionMessage.type === "success" 
                  ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300" 
                  : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300"
              }`}>
                {subscriptionMessage.type === "success" ? "✓" : "!"}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  subscriptionMessage.type === "success" 
                    ? "text-green-800 dark:text-green-300" 
                    : "text-red-800 dark:text-red-300"
                }`}>
                  {subscriptionMessage.text}
                </p>
              </div>
              <button
                onClick={() => setSubscriptionMessage(null)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-lg leading-relaxed max-w-xl font-medium">
              Your go-to resource for mastering DevOps, cloud-native
              technologies, and automation. Practical guides, tutorials, and
              real-world projects.
            </p>

            {/* Social Media */}
            <div className="flex space-x-3 md:space-x-4 pt-3 md:pt-4">
              {[
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/thaung-htike-oo-6672781b1",
                  color:
                    "hover:bg-[#0077B5] hover:border-[#0077B5] text-[#0077B5] hover:text-white",
                },
                {
                  icon: Github,
                  href: "https://github.com/thaunghtike-share",
                  color:
                    "hover:bg-gray-800 hover:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-white",
                },
                {
                  icon: Facebook,
                  href: "https://www.facebook.com/learndevopsnowbytho",
                  color:
                    "hover:bg-[#1877F2] hover:border-[#1877F2] text-[#1877F2] hover:text-white",
                },
                {
                  icon: Mail,
                  href: "mailto:thaunghtikeoo.tho1234@gmail.com",
                  color:
                    "hover:bg-[#EA4335] hover:border-[#EA4335] text-[#EA4335] hover:text-white",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                >
                  <social.icon className="h-5 w-5 md:h-6 md:w-6" />
                </a>
              ))}
            </div>

            {/* Subscribe Section */}
            <div className="pt-4 md:pt-6">
              <div className="bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-100 dark:border-gray-700">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-3 flex items-center">
                  <Send className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-500" />
                  Stay Updated
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-xs md:text-sm">
                  Get email notifications when new articles are published.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={toggleSubscription}
                    disabled={loading}
                    className={`w-full px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                      isSubscribed
                        ? "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 focus:ring-red-500"
                        : "bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : isSubscribed ? (
                      <>
                        <BellOff className="h-4 w-4" />
                        <span>Unsubscribe from Notifications</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Subscribe to Notifications</span>
                      </>
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {isAuthenticated 
                      ? (isSubscribed 
                          ? "You'll receive email notifications for new articles." 
                          : "Click to get notified about new articles.")
                      : "Sign in to subscribe to article notifications."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-6 md:gap-8 lg:col-span-2">
            {/* Quick Links & Resources */}
            <div className="space-y-6 md:space-y-10">
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 flex items-center">
                  <Code className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Quick Links
                  </span>
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {[
                    { href: "/articles", label: "Articles" },
                    { href: "/categories", label: "Categories" },
                    { href: "/about", label: "About Me" },
                    { href: "/faqs", label: "FAQS" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center group font-medium text-sm md:text-base"
                      >
                        <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 flex items-center">
                  <Cloud className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-500" />
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Resources
                  </span>
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {[
                    {
                      href: "/learn-devops-on-youtube",
                      label: "YouTube Tutorials",
                    },
                    { href: "/free-courses", label: "Free Courses" },
                    {
                      href: "/devops-playgrounds",
                      label: "DevOps Playgrounds",
                    },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 flex items-center group font-medium text-sm md:text-base"
                      >
                        <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Services & Contact */}
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 flex items-center">
                  <Server className="h-4 w-4 md:h-5 md:w-5 mr-2 text-orange-500" />
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Services
                  </span>
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {[
                    {
                      href: "/services/cloud-migration",
                      label: "Cloud Migration",
                    },
                    {
                      href: "/services/infrastructure-automation",
                      label: "Infrastructure as Code",
                    },
                    {
                      href: "/services/part-time-devops-support",
                      label: "DevOps Support",
                    },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 flex items-center group font-medium text-sm md:text-base"
                      >
                        <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 flex items-center">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 mr-2 text-purple-500" />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Contact
                  </span>
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  <li>
                    <a
                      href="mailto:thaunghtikeoo.tho1234@gmail.com"
                      className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 flex items-center group font-medium text-sm md:text-base"
                    >
                      <Mail className="h-4 w-4 mr-2 md:mr-3 text-purple-500" />
                      <span>Email Me</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+959952492359"
                      className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 flex items-center group font-medium text-sm md:text-base"
                    >
                      <Phone className="h-4 w-4 mr-2 md:mr-3 text-green-500" />
                      <span>+95 9952492359</span>
                    </a>
                  </li>
                  <li className="text-gray-700 dark:text-gray-300 flex items-center font-medium text-sm md:text-base">
                    <MapPin className="h-4 w-4 mr-2 md:mr-3 text-red-500" />
                    <span>Yangon, Myanmar</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 md:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 md:space-y-6 lg:space-y-0">
            {/* Copyright */}
            <p className="text-gray-700 text-xs md:text-sm dark:text-gray-300 text-center lg:text-left font-medium">
              &copy; {new Date().getFullYear()} Learn DevOps Now. All rights
              reserved.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
                { href: "/user-guide", label: "User Guide" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium hover:scale-105"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Required Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Sign In Required
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    To subscribe to notifications
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-1 hover:bg-sky-600 bg-sky-600 hover:scale-100 border-sky-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white dark:text-gray-400" />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Sign in to get email notifications when new articles are published.
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAuthModal(false)}
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}