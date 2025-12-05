"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Mail, Copy, Check, Share2, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ShareButtonsProps {
  articleId: number
  title: string
  url: string
}

export function ShareButtons({ articleId, title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
  }

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5 p-5 md:p-7 bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-gray-700/80 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl md:rounded-2xl shadow-lg">
          <Share2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg">Share this article</h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Spread knowledge with your network
          </p>
        </div>
      </div>
      
      {/* Main Share Buttons - Stack on mobile */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 md:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.facebook, "_blank")}
          className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 text-blue-600 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/30 dark:text-blue-400 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm font-semibold group flex-1 justify-start"
        >
          <div className="p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
            <Facebook className="h-3 w-3 md:h-4 md:w-4" />
          </div>
          <span className="text-xs md:text-sm">Facebook</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.linkedin, "_blank")}
          className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 text-blue-700 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/30 dark:text-blue-400 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm font-semibold group flex-1 justify-start"
        >
          <div className="p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
            <Linkedin className="h-3 w-3 md:h-4 md:w-4" />
          </div>
          <span className="text-xs md:text-sm">LinkedIn</span>
        </Button>

        {/* More Options Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 text-gray-600 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-400 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm font-semibold group flex-1 justify-start"
            >
              <div className="p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <Share2 className="h-3 w-3 md:h-4 md:w-4" />
              </div>
              <span className="text-xs md:text-sm">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="rounded-xl md:rounded-2xl shadow-2xl border border-gray-200/80 dark:border-gray-700/80 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 p-2 min-w-[160px] md:min-w-[180px]"
          >
            <DropdownMenuItem 
              onClick={copyLink}
              className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 cursor-pointer rounded-lg md:rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-200 group"
            >
              {copied ? (
                <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Check className="h-3 w-3 md:h-4 md:w-4 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-sky-100 dark:group-hover:bg-sky-800/30">
                  <Copy className="h-3 w-3 md:h-4 md:w-4 text-gray-600 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
                </div>
              )}
              <span className="text-xs md:text-sm font-medium">
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => window.open(`mailto:?subject=${encodedTitle}&body=${encodedUrl}`, "_blank")}
              className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 cursor-pointer rounded-lg md:rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-200 group"
            >
              <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-sky-100 dark:group-hover:bg-sky-800/30">
                <Mail className="h-3 w-3 md:h-4 md:w-4 text-gray-600 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
              </div>
              <span className="text-xs md:text-sm font-medium">Email</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Ready to share</span>
        </div>
        <div className="hidden sm:block w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
          Help others discover this content
        </div>
      </div>
    </div>
  )
}