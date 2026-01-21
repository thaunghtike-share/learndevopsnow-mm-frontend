"use client";

import { useState } from "react";
import {
  Linkedin,
  Twitter,
  Link,
  Check,
  Mail,
  Share2,
} from "lucide-react";

interface ShareButtonsProps {
  articleId: number;
  title: string;
  url: string;
}

export function ShareButtons({ articleId, title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`,
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      onClick: () => window.open(shareLinks.linkedin, "_blank"),
      color: "bg-[#0A66C2] hover:bg-[#0A5AA8] text-white",
      description: "Professional Network",
    },
    {
      name: "Twitter",
      icon: Twitter,
      onClick: () => window.open(shareLinks.twitter, "_blank"),
      color: "bg-[#1DA1F2] hover:bg-[#1A94DA] text-white",
      description: "Tech Community",
    },
    {
      name: "Copy",
      icon: copied ? Check : Link,
      onClick: copyLink,
      color: copied
        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
      description: copied ? "Copied to clipboard" : "Copy link",
    },
    {
      name: "Email",
      icon: Mail,
      onClick: () => window.open(shareLinks.email, "_blank"),
      color: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600",
      description: "Send via email",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Share Your Article
              </h3>
            </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {shareOptions.map((option) => (
          <button
            key={option.name}
            onClick={option.onClick}
            className={`
              flex items-center gap-3 p-3 rounded-lg transition-colors
              ${option.color}
              text-sm font-medium
            `}
          >
            <option.icon className="w-4 h-4" />
            <span>{option.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Share with your professional network
        </p>
      </div>
    </div>
  );
}