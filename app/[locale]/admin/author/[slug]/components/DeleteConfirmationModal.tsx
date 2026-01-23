"use client";
import { motion } from "framer-motion";
import { AlertTriangle, Loader, Trash2 } from "lucide-react";

interface Article {
  id: number;
  slug: string;
  title: string;
  read_count: number;
}

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  article,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  article: Article | null;
  isLoading: boolean;
}) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-[#000000]/80 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-slate-600 dark:text-gray-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Delete Article
            </h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              This article will be moved to Trash and can be restored within 7
              days.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-slate-700 dark:text-gray-300 font-medium mb-2">
            Delete &ldquo;{article.title}&rdquo;?
          </p>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            This article has {article.read_count?.toLocaleString()} views and
            will be moved to the trash.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-800 dark:bg-gray-700 text-white rounded-xl hover:bg-slate-900 dark:hover:bg-gray-600 transition-all duration-200 font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DeleteConfirmationModal;