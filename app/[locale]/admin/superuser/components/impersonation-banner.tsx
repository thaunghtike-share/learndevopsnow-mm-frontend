"use client";
import { useEffect, useState } from "react";
import { LogOut, X, Shield, AlertTriangle } from "lucide-react";

export default function ImpersonationBanner() {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedAuthor, setImpersonatedAuthor] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

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
    <div 
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl animate-in slide-in-from-top duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Floating card with shadow */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-amber-200 dark:border-amber-800 overflow-hidden">
          {/* Warning header */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 py-3 border-b border-amber-200 dark:border-amber-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Super User Mode
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    You're impersonating another user
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Currently viewing the dashboard as:
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                  <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-bold text-lg text-amber-700 dark:text-amber-300">
                    {impersonatedAuthor}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  All actions will be performed as this user
                </p>
              </div>
              
              <button
                onClick={stopImpersonating}
                className={`flex items-center gap-2 px-5 py-3 bg-gradient-to-r ${
                  isHovered 
                    ? 'from-red-600 to-rose-600' 
                    : 'from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700'
                } text-white rounded-xl hover:shadow-xl transition-all duration-300 font-medium shadow-lg`}
              >
                <LogOut className="w-4 h-4" />
                Stop
              </button>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 animate-progress"
              style={{ animation: 'progress 2s linear infinite' }}
            />
            <style jsx>{`
              @keyframes progress {
                0% { width: 0%; margin-left: 0%; }
                50% { width: 100%; margin-left: 0%; }
                100% { width: 0%; margin-left: 100%; }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}