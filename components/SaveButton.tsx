"use client";
import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';

interface SaveButtonProps {
  articleId: number;
  articleTitle: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function SaveButton({
  articleId,
  articleTitle,
  className = "",
  size = "md",
  showLabel = false,
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "p-1.5 text-sm",
    md: "p-2.5 text-base",
    lg: "p-3.5 text-lg",
  };

  useEffect(() => {
    checkSavedStatus();
  }, [articleId]);

  const checkSavedStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/articles/${articleId}/saved-status/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.is_saved);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleSaveToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to save articles");
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        const response = await fetch(
          `${API_BASE_URL}/articles/unsave/${articleId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.ok) {
          setIsSaved(false);
          toast.success("Article removed from saved");
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/articles/save/`, {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article_id: articleId,
            notes: "",
          }),
        });

        if (response.ok) {
          setIsSaved(true);
          toast.success("Article saved successfully");
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to save article. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleSaveToggle}
      disabled={isLoading}
      className={`
        ${className}
        ${sizeClasses[size]}
        relative flex items-center gap-2
        ${isSaved
          ? "text-emerald-600 hover:text-emerald-700"
          : "text-slate-600 hover:text-slate-700"
        }
        dark:${isSaved
          ? "text-emerald-400 hover:text-emerald-300"
          : "text-slate-400 hover:text-slate-300"
        }
        rounded-lg transition-colors duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        group
      `}
      aria-label={isSaved ? "Remove from saved" : "Save for later"}
      title={isSaved ? "Remove from saved" : "Save for later"}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </motion.div>
        ) : isSaved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <BookmarkCheck className="w-4 h-4 fill-emerald-500 text-emerald-500" />
          </motion.div>
        ) : (
          <motion.div
            key="unsaved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Bookmark className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {showLabel && (
        <span className="font-medium">
          {isSaved ? "Saved" : "Save"}
        </span>
      )}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-md shadow-lg">
              {isSaved ? "unsave" : "Save"}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}