"use client";
import { useEffect, useState } from "react";
import { User, LogOut, Sparkles, X, Sun } from "lucide-react";

export default function ImpersonationBanner() {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedAuthor, setImpersonatedAuthor] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const impersonating = localStorage.getItem("is_impersonating") === "true";
    const author = localStorage.getItem("impersonated_author");
    
    setIsImpersonating(impersonating);
    setImpersonatedAuthor(author);
  }, []);

  const stopImpersonating = () => {
    const originalToken = localStorage.getItem("original_token");
    
    if (originalToken) {
      localStorage.setItem("token", originalToken);
      localStorage.removeItem("original_token");
      localStorage.removeItem("is_impersonating");
      localStorage.removeItem("impersonated_author");
      window.location.reload();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isImpersonating || !isVisible) return null;

  return (
    <div className="relative">
      {/* Animated gradient background */}
      <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Info */}
            <div className="flex items-center gap-3">
              {/* Animated icon */}
              <div className="relative">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-orange-700 dark:text-white " />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Impersonation Mode Active
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Viewing as <span className="font-medium text-purple-600 dark:text-purple-400">{impersonatedAuthor}</span>
                </p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={stopImpersonating}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-medium shadow-md"
              >
                <LogOut className="w-4 h-4" />
                Stop Impersonating
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated progress bar */}
      <div className="h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" />
    </div>
  );
}