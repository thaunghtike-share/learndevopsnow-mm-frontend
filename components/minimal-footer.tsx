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
} from "lucide-react";
import { useState, useEffect } from "react";

export function MinimalFooter() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // First, check if user has a saved theme preference
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "system"
      | null;

    // If there's a saved theme, use it
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // No saved theme, default to "light"
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
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      console.log("Subscribing email:", email);
      setIsSubscribed(true);
      setEmail("");
      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-white dark:bg-[#000000] relative z-10 transition-colors duration-300 overflow-hidden">
      <div className="px-6 md:px-11 relative z-10 py-12 md:py-16">
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
                  Get the latest DevOps guides, tutorials, and project updates
                  delivered to your inbox.
                </p>

                {isSubscribed ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                      <Send className="h-4 w-4" />
                      <span className="font-medium text-sm md:text-base">
                        Thank you for subscribing!
                      </span>
                    </div>
                    <p className="text-green-600 dark:text-green-400 text-xs md:text-sm mt-1">
                      You'll receive our next update.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubscribe}
                    className="space-y-2 md:space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 md:space-y-3 sm:space-y-0">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg md:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium flex items-center justify-center space-x-2 text-sm"
                      >
                        <Send className="h-4 w-4" />
                        <span>Subscribe</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      No spam. Unsubscribe at any time.
                    </p>
                  </form>
                )}
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

            {/* Theme Toggle */}
            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-1 border border-gray-200 dark:border-gray-700">
              {[
                { mode: "light", icon: Sun, label: "Light" },
                { mode: "system", icon: Monitor, label: "System" },
                { mode: "dark", icon: Moon, label: "Dark" },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() =>
                    setThemeMode(mode as "light" | "dark" | "system")
                  }
                  className={`flex items-center gap-1 md:gap-2 px-3 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl transition-all duration-200 ${
                    theme === mode
                      ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-sm font-medium">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
