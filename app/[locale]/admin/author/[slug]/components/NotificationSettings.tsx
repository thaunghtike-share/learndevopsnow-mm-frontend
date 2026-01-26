"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  MessageSquare,
  ThumbsUp,
  Reply,
  Loader2,
  Check,
  X,
} from "lucide-react"; // Removed BellOff and Heart

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface NotificationSettings {
  comments: boolean;
  reactions: boolean;
  replies: boolean;
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    comments: true,
    reactions: true,
    replies: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch current notification settings
  useEffect(() => {
    fetchSettings();

    // Listen for changes from other components
    const handleStorageChange = () => {
      fetchSettings();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      // Only fetch notification preferences
      let notificationSettings = {
        comments: true,
        reactions: true,
        replies: true,
      };

      try {
        const settingsResponse = await fetch(
          `${API_BASE_URL}/notification-settings/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (settingsResponse.ok) {
          const data = await settingsResponse.json();
          notificationSettings = data;
        }
      } catch (error) {
        console.log("Notification settings endpoint not available");
      }

      setSettings(notificationSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof NotificationSettings) => {
    try {
      setSaving(key);
      const token = localStorage.getItem("token");
      const newValue = !settings[key];

      // Update notification settings
      const response = await fetch(
        `${API_BASE_URL}/notification-settings/${key}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ enabled: newValue }),
        }
      );

      if (response.ok) {
        setSettings((prev) => ({ ...prev, [key]: newValue }));
        showSaveStatus(
          "success",
          `${key.replace("_", " ")} notifications ${
            newValue ? "enabled" : "disabled"
          }`
        );
      } else {
        throw new Error("Failed to update setting");
      }
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      showSaveStatus("error", "Failed to update setting");
    } finally {
      setSaving(null);
    }
  };

  const showSaveStatus = (type: "success" | "error", message: string) => {
    setSaveStatus({ type, message });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const settingConfigs = [
    {
      key: "comments" as const,
      icon: MessageSquare,
      title: "Comments on Your Articles",
      description:
        "Receive notifications when someone comments on your articles",
      enabled: settings.comments,
      statusText: settings.comments ? "Enabled" : "Disabled",
    },
    {
      key: "reactions" as const,
      icon: ThumbsUp,
      title: "Reactions to Your Articles",
      description: "Get notified when someone reacts to your articles",
      enabled: settings.reactions,
      statusText: settings.reactions ? "Enabled" : "Disabled",
    },
    {
      key: "replies" as const,
      icon: Reply,
      title: "Replies to Your Comments",
      description: "Notify when someone replies to your comments",
      enabled: settings.replies,
      statusText: settings.replies ? "Enabled" : "Disabled",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading notification settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Success/Error Message */}
      {saveStatus && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mb-6 p-4 rounded-xl border ${
            saveStatus.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                saveStatus.type === "success"
                  ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300"
                  : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300"
              }`}
            >
              {saveStatus.type === "success" ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </div>
            <p
              className={`font-medium ${
                saveStatus.type === "success"
                  ? "text-green-800 dark:text-green-300"
                  : "text-red-800 dark:text-red-300"
              }`}
            >
              {saveStatus.message}
            </p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2">
              Notification Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Control how and when you receive notifications
            </p>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingConfigs.map((setting) => (
          <motion.div
            key={setting.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300" // Removed conditional styling
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-lg ${
                    setting.enabled
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <setting.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
                    {setting.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {setting.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <span
                className={`text-sm font-medium ${
                  setting.enabled
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {setting.statusText}
              </span>

              <button
                onClick={() => updateSetting(setting.key)}
                disabled={saving === setting.key}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  setting.enabled
                    ? "bg-green-600"
                    : "bg-gray-300 dark:bg-gray-600"
                } ${saving === setting.key ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    setting.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
                {saving === setting.key && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-3 h-3 animate-spin text-white" />
                  </div>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}