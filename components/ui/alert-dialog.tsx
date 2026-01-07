"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

type AlertType = "success" | "error" | "info";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertType;
  duration?: number;
}

export function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  duration = 5000,
}: AlertDialogProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-700",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      textColor: "text-emerald-800 dark:text-emerald-200",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-700",
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-800 dark:text-red-200",
    },
    info: {
      icon: AlertCircle,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
      iconColor: "text-blue-600 dark:text-blue-400",
      textColor: "text-blue-800 dark:text-blue-200",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pointer-events-none">
      <div className="w-full max-w-md">
        <div
          className={`${config.bgColor} ${config.borderColor} border rounded-2xl shadow-2xl p-4 pointer-events-auto transform transition-all duration-300 animate-slide-in`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div
                className={`p-2 rounded-lg ${config.iconColor} bg-white dark:bg-gray-800`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-semibold ${config.textColor}`}>{title}</h3>
                <button
                  onClick={onClose}
                  className="ml-2 p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <p className={`text-sm ${config.textColor} opacity-90`}>
                {message}
              </p>

              {/* Progress bar */}
              <div className="mt-3 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    type === "success"
                      ? "bg-emerald-500"
                      : type === "error"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  } animate-progress`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}