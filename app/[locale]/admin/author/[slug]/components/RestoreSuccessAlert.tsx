"use client";
import { motion } from "framer-motion";

function RestoreSuccessAlert({
  message,
  isVisible,
}: {
  message: string | null;
  isVisible: boolean;
}) {
  if (!isVisible || !message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100]"
    >
      <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-2xl p-4 max-w-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-emerald-600 dark:text-emerald-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-emerald-800 dark:text-emerald-200 font-medium">
              {message}
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 text-sm">
              The article will appear in your articles list shortly.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default RestoreSuccessAlert;