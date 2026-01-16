"use client";

import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  Check,
  Share2,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonsProps {
  articleId: number;
  title: string;
  url: string;
}

export function ShareButtons({ articleId, title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Share this article
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          If you found this helpful, consider sharing it
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {/* Facebook */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.facebook, "_blank")}
          className="px-3 py-2 text-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/5 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
        >
          <Facebook className="w-4 h-4 mr-2" />
          Share
        </Button>

        {/* LinkedIn */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.linkedin, "_blank")}
          className="px-3 py-2 text-[#0A66C2] hover:text-[#0A66C2] hover:bg-[#0A66C2]/5 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          Share
        </Button>

        {/* Copy Link */}
        <Button
          variant="outline"
          size="sm"
          onClick={copyLink}
          className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </>
          )}
        </Button>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg w-48"
          >
            <DropdownMenuItem
              onClick={() =>
                window.open(
                  `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
                  "_blank"
                )
              }
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Mail className="w-4 h-4 mr-2 text-gray-600" />
              Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Simple stats */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Sharing helps others discover valuable content
      </div>
    </div>
  );
}
