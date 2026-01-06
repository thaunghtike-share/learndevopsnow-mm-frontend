"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import React from "react";
import "highlight.js/styles/atom-one-light.css";
import CountUp from "react-countup";
import {
  Settings,
  Cloud,
  Bot,
  Building,
  Lock,
  BarChart3,
  Server,
  Code,
  Folder,
  ChevronRight,
  Container,
  GitBranch,
  PlusCircle,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { visit } from "unist-util-visit";
import { CommentsReactions } from "./comment-reactions";
import {
  ArrowRight,
  Linkedin,
  ListOrdered,
  CalendarDays,
  Clipboard,
  Check,
  Eye,
  TrendingUp,
  TagIcon,
  ChevronLeft,
  Clock,
  FileText,
  Award,
  Star,
  Trophy,
  Zap,
  Crown,
  Hash,
  Lightbulb,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SimpleTTSPlayer } from "./tts-player";
import { ShareButtons } from "./share-buttons";
import { BellSubscription } from "./subscription-button";

interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  published_at: string;
  category: number;
  tags: number[];
  author: number;
  cover_image?: string;
  featured: boolean;
  image_url?: string;
  author_name?: string;
  category_name?: string;
  read_count?: number;
  author_slug?: string;
  author_avatar?: string;
  author_bio?: string;
  author_linkedin?: string;
  author_job_title?: string;
  author_company?: string;
}

interface Author {
  id: number;
  name: string;
  bio?: string;
  slug: string;
  avatar?: string;
  linkedin?: string;
  job_title?: string;
  articles?: Article[];
  featured?: boolean;
  company?: string;
  articles_count?: number;
}

interface Tag {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  post_count?: number;
  slug: string;
}

interface ArticleContentProps {
  article: Article;
  author: Author | null;
  headings: { text: string; level: number; id: string }[];
  prevArticle: Article | null;
  nextArticle: Article | null;
  recentArticles: Article[];
  sameCategoryArticles: Article[];
  publishDate: string;
  categoryName: string;
  tagNames: string[];
  authors: Author[];
  categories: Category[];
  readCount?: number;
}

function flattenChildren(children: any): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(flattenChildren).join("");
  if (children?.props?.children)
    return flattenChildren(children.props.children);
  return "";
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function excerpt(content: string) {
  const plainText = content
    .replace(/<[^>]+>/g, "")
    .replace(/[#_*>\-[\]$$$$`~]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return plainText.length === 120 ? plainText + "..." : plainText;
}

const isYouTubeParagraph = (
  children: any
): { isYouTube: boolean; url?: string; title?: string } => {
  const text = flattenChildren(children);

  // Check for markdown link pattern [text](url)
  const markdownLinkMatch = text.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
  if (markdownLinkMatch) {
    const [, title, url] = markdownLinkMatch;
    if (extractYouTubeId(url)) {
      return { isYouTube: true, url, title };
    }
  }

  // Check for plain URL
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const urlMatch = text.match(urlRegex);
  if (urlMatch && extractYouTubeId(urlMatch[0])) {
    return { isYouTube: true, url: urlMatch[0] };
  }

  return { isYouTube: false };
};

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button
      onClick={handleCopy}
      variant="ghost"
      size="sm"
      className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-sky-300 dark:border-sky-600 text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 hover:bg-white dark:hover:bg-gray-700 hover:border-sky-400 dark:hover:border-sky-500 px-3 py-2 text-xs transition-all duration-200 shadow-sm hover:shadow-md"
    >
      {copied ? (
        <Check className="w-3 h-3 mr-1" />
      ) : (
        <Clipboard className="w-3 h-3 mr-1" />
      )}
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Inline code component - Update to quote/italic style
const InlineCode = ({ children, ...props }: any) => (
  <code
    className="text-gray-700 dark:text-gray-300 italic px-1 text-base font-sans"
    {...props}
  >
    "{children}"
  </code>
);

// YouTube embed function
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

// YouTube Embed Component
const YouTubeEmbed = ({ url, title }: { url: string; title?: string }) => {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sky-600 hover:underline"
      >
        {title || url}
      </a>
    );
  }

  return (
    <div className="my-8 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="relative pt-[56.25%] bg-gradient-to-br from-gray-900 to-black overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&color=white`}
          title={title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <div className="p-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white test-sm md:text-sm mb-2 line-clamp-2">
              {title || "YouTube Video"}
            </h4>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Watch on YouTube
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export function ArticleContent({
  article,
  author,
  headings,
  prevArticle,
  nextArticle,
  recentArticles,
  sameCategoryArticles,
  publishDate,
  categoryName,
  tagNames,
  authors,
  categories,
  readCount,
}: ArticleContentProps) {
  const articleUrl = typeof window !== "undefined" ? window.location.href : "";
  const [topReadArticles, setTopReadArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");

  // Add fullscreen image state
  const [fullscreenImage, setFullscreenImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  // Define validHeadings early so useEffect can use it
  const validHeadings = headings.filter(({ text, level }) => {
    const cleanText = text.trim();

    // Only include H1, H2, H3
    const isLevelValid = level <= 3; // <-- Add this line

    const isValidHeading =
      cleanText.length > 0 &&
      isLevelValid && // <-- Add this condition
      level >= 1 &&
      level <= 6 &&
      !cleanText.startsWith("```") &&
      !cleanText.match(/^[#`\s]*$/);

    return isValidHeading;
  });

  // Add loading state at the component level
  useEffect(() => {
    // Simulate loading or check if essential data is available
    if (article && article.content) {
      setIsLoading(false);
    }
  }, [article]);

  const effectiveAuthor = author || {
    id: article.author,
    name: article.author_name,
    slug: article.author_slug,
    avatar: article.author_avatar,
    bio: article.author_bio,
    linkedin: article.author_linkedin,
    job_title: article.author_job_title,
    company: article.author_company,
  };

  const authorSlug =
    effectiveAuthor?.slug || slugify(effectiveAuthor?.name || "unknown");

  useEffect(() => {
    const incrementReadCount = async () => {
      try {
        await fetch(`${API_BASE_URL}/articles/${article.id}/increment-read/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
      } catch (error) {
        console.error("Failed to increment read count:", error);
      }
    };
    incrementReadCount();
  }, [article.id]);

  useEffect(() => {
    const fetchTopReadArticles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/articles/top-read/?limit=5`);
        if (!res.ok) throw new Error("Failed to fetch top read articles");
        const data = await res.json();
        setTopReadArticles(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTopReadArticles();
  }, []);

  // Effect for tracking active heading
  useEffect(() => {
    const handleScroll = () => {
      const headings = validHeadings
        .map(({ id }) => {
          const element = document.getElementById(id);
          if (!element) return null;

          const rect = element.getBoundingClientRect();
          return {
            id,
            top: rect.top,
          };
        })
        .filter(Boolean) as { id: string; top: number }[];

      if (headings.length === 0) return;

      // Find the heading that's closest to the top but not past it too much
      let activeId = "";
      const offset = 100; // Adjust this value based on your header height

      for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].top < offset + 50) {
          activeId = headings[i].id;
          break;
        }
      }

      // If no heading is above the threshold, use the first one
      if (!activeId && headings.length > 0) {
        activeId = headings[0].id;
      }

      setActiveHeadingId(activeId);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [validHeadings]);

  function fixMarkdownSpacing(content: string): string {
    let fixedContent = content
      .replace(/(#{1,6} .+)\n(```)/g, "$1\n\n$2")
      .replace(/([^\n])\n(!\[)/g, "$1\n\n$2")
      .replace(/(!\[.*?\]$$.*?$$)\n([^\n])/g, "$1\n\n$2");

    fixedContent = fixedContent.replace(/^(- .*?)(?=\n-|\n$)/gm, (match) => {
      return match.replace(/\n/g, " ");
    });

    return fixedContent;
  }

  const remarkYouTube = () => {
    return (tree: any) => {
      visit(tree, "paragraph", (node) => {
        // Check if paragraph has only one child that's a link
        if (node.children.length === 1 && node.children[0].type === "link") {
          const link = node.children[0];
          const url = link.url || "";
          const youtubeId = extractYouTubeId(url);

          if (youtubeId) {
            // Transform this node
            node.type = "html";
            node.value = `<div data-youtube-id="${youtubeId}" data-youtube-title="${
              link.children[0]?.value || ""
            }"></div>`;
            node.children = [];
          }
        }
      });
    };
  };

  return (
    <div className="relative">
      <main className="px-6 md:px-11 py-15 md:py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <article className="lg:col-span-3">
          {/* REMOVED: bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl p-6 md:p-8 lg:p-10 */}
          <div className="mb-10 md:mb-12">
            {/* Breadcrumb Navigation - Mobile responsive - SIMPLE FIX */}
            <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium text-black dark:text-white mb-4 sm:mb-6">
              <Link
                href="/"
                className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 truncate text-black dark:text-white flex items-center"
              >
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-black dark:text-white mx-0.5" />
              <Link
                href="/articles"
                className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 truncate text-black dark:text-white flex items-center"
              >
                Articles
              </Link>
              <ChevronRight className="w-3 h-3 text-black dark:text-white mx-0.5" />
              <Link
                href={`/categories/${slugify(categoryName)}`}
                className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 truncate text-black dark:text-white flex items-center"
              >
                <span className="hidden sm:inline">{categoryName}</span>
                <span className="sm:hidden truncate max-w-[80px]">
                  {categoryName.length > 10
                    ? `${categoryName.substring(0, 10)}...`
                    : categoryName}
                </span>
              </Link>
            </div>

            {/* Main Title with Bell Button */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-black dark:text-white leading-[1.2] sm:leading-[1.15] tracking-tight flex-1">
                {article.title}
              </h1>
            </div>

            {article.cover_image && (
              <div className="mb-6 sm:mb-8 md:mb-10 overflow-hidden">
                <div
                  className="relative group cursor-pointer"
                  onClick={() =>
                    setFullscreenImage({
                      src: article.cover_image || "",
                      alt: article.title,
                    })
                  }
                >
                  <img
                    src={article.cover_image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"></div>
                </div>
              </div>
            )}

            {/* Author Info and Date - Mobile responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                {/* Author Avatar */}
                <Link href={`/authors/${authorSlug}`} className="group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white dark:border-gray-800 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={effectiveAuthor?.avatar || "/placeholder.svg"}
                      alt={effectiveAuthor?.name || "Author"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Author Name and Date */}
                <div className="flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <Link
                      href={`/authors/${authorSlug}`}
                      className="text-black dark:text-white text-base sm:text-lg hover:text-sky-600 dark:hover:text-sky-400 transition-colors tracking-tight truncate"
                    >
                      {effectiveAuthor?.name || "Unknown Author"}
                    </Link>
                    <div className="hidden sm:block text-gray-500 dark:text-gray-400">
                      |
                    </div>
                    <div className="flex items-center gap-1 text-black dark:text-gray-400 text-sm sm:text-base">
                      <span>
                        {new Date(article.published_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Views count with BarChart icon */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-gray-400" />
                    <span className="text-black dark:text-gray-400 text-sm sm:text-base">
                      <CountUp
                        end={article.read_count || 0}
                        duration={2}
                        separator=","
                      />
                      {article.read_count === 1 ? " view" : " views"}
                    </span>
                  </div>
                </div>
              </div>

              <SimpleTTSPlayer
                text={article.content}
                articleTitle={article.title}
              />
            </div>

            {/* Tags with reduced gap for mobile */}
            {tagNames.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                {tagNames.map((tag, index) => (
                  <Link
                    href={`/articles?tag=${slugify(tag)}`}
                    key={index}
                    className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 text-black dark:text-white transition-all duration-200 text-sm sm:text-base font-medium group hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    <span className="text-orange-600 dark:text-sky-400 mr-0.5 sm:mr-1">
                      #
                    </span>
                    <span className="truncate max-w-[120px] sm:max-w-none">
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkYouTube]} // ← ADDED remarkYouTube
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                // Use separate component for inline code
                code: InlineCode,

                pre: ({ children, ...props }: any) => {
                  const child = React.Children.only(children) as any;
                  const codeProps = child?.props || {};
                  const className = codeProps.className || "";
                  const childrenContent = codeProps.children || "";

                  const match = /language-(\w+)/.exec(className || "");
                  let language = match?.[1]?.toLowerCase() || "";

                  const extractCodeString = (children: any): string => {
                    if (typeof children === "string") return children;
                    if (Array.isArray(children)) {
                      return children
                        .map((child) => extractCodeString(child))
                        .join("");
                    }
                    if (children?.props?.children) {
                      return extractCodeString(children.props.children);
                    }
                    return String(children);
                  };

                  const codeString = extractCodeString(childrenContent).replace(
                    /\n$/,
                    ""
                  );
                  const lines = codeString.split("\n");

                  const getLanguageName = (lang: string): string => {
                    if (!lang || lang.trim() === "") return "Code";

                    const langMap: { [key: string]: string } = {
                      js: "JavaScript",
                      ts: "TypeScript",
                      py: "Python",
                      yml: "YAML",
                      hcl: "HCL",
                      tf: "Terraform",
                      sh: "Shell",
                      zsh: "Z Shell",
                      sql: "SQL",
                      postgresql: "PostgreSQL",
                      postgres: "PostgreSQL",
                      mysql: "MySQL",
                      html: "HTML",
                      css: "CSS",
                      json: "JSON",
                      xml: "XML",
                      java: "Java",
                      cpp: "C++",
                      csharp: "C#",
                      go: "Go",
                      rust: "Rust",
                      ruby: "Ruby",
                      php: "PHP",
                      swift: "Swift",
                      kotlin: "Kotlin",
                      dockerfile: "Dockerfile",
                      yaml: "YAML",
                      toml: "TOML",
                      ini: "INI",
                      markdown: "Markdown",
                      md: "Markdown",
                      txt: "Text",
                      text: "Text",
                    };
                    return (
                      langMap[lang] ||
                      lang.charAt(0).toUpperCase() + lang.slice(1)
                    );
                  };

                  return (
                    <div className="relative my-8 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
                      {/* Language header - cleaner design */}
                      <div className="flex items-center justify-between bg-gray-900 text-gray-300 px-4 py-2.5 border-b border-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                          <span className="text-xs font-medium tracking-wide">
                            {getLanguageName(language)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {lines.length} line{lines.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Code block */}
                      <div className="relative">
                        <pre
                          className={`p-6 overflow-x-auto bg-gray-950 text-gray-100 text-sm font-mono leading-relaxed`}
                        >
                          <code className="block">
                            {lines.map((line, idx) => {
                              const isEmptyLine = line.trim() === "";
                              return (
                                <div
                                  key={idx}
                                  className={`group flex hover:bg-gray-800/30 transition-colors ${
                                    isEmptyLine ? "min-h-[1.2em]" : ""
                                  }`}
                                >
                                  <span className="text-gray-500 text-xs w-8 text-right pr-3 select-none border-r border-gray-800 mr-4">
                                    {idx + 1}
                                  </span>
                                  <span
                                    className={
                                      isEmptyLine
                                        ? "inline-block min-w-[1px]"
                                        : ""
                                    }
                                  >
                                    {line || " "}
                                  </span>
                                </div>
                              );
                            })}
                          </code>
                        </pre>
                      </div>
                    </div>
                  );
                },

                h1: ({ children, ...props }) => {
                  const id = slugify(flattenChildren(children));
                  return (
                    <h1
                      id={id}
                      className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-6 pb-3 border-b-2 border-sky-100 dark:border-sky-900"
                      {...props}
                    >
                      {children}
                    </h1>
                  );
                },
                h2: ({ children, ...props }) => {
                  const id = slugify(flattenChildren(children));
                  return (
                    <h2
                      id={id}
                      className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-6 pb-2 border-l-4 border-sky-500 dark:border-sky-400 pl-4 bg-gradient-to-r from-sky-50 dark:from-sky-900/20 to-transparent rounded-r-lg"
                      {...props}
                    >
                      {children}
                    </h2>
                  );
                },
                h3: ({ children, ...props }) => {
                  const id = slugify(flattenChildren(children));
                  return (
                    <h3
                      id={id}
                      className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4 pl-4 border-l-4 border-sky-400 dark:border-sky-500 bg-gradient-to-r from-sky-50 dark:from-sky-900/10 to-transparent rounded-r-lg py-2"
                      {...props}
                    >
                      {children}
                    </h3>
                  );
                },
                h4: ({ children, ...props }) => {
                  const id = slugify(flattenChildren(children));
                  return (
                    <h4
                      id={id}
                      className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 pl-4 border-l-2 border-sky-300 dark:border-sky-600 bg-gradient-to-r from-sky-50/50 dark:from-sky-900/5 to-transparent rounded-r-lg py-1"
                      {...props}
                    >
                      {children}
                    </h4>
                  );
                },

                div: ({ ...props }: any) => {
                  if (props["data-youtube-id"]) {
                    const youtubeId = props["data-youtube-id"];
                    const title = props["data-youtube-title"];
                    return (
                      <YouTubeEmbed
                        url={`https://www.youtube.com/watch?v=${youtubeId}`}
                        title={title}
                      />
                    );
                  }
                  return <div {...props} />;
                },

                // Keep p and a components simple
                p: ({ children, ...props }) => (
                  <p
                    className="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-300"
                    {...props}
                  >
                    {children}
                  </p>
                ),

                a: ({ href, children, ...props }) => (
                  <a
                    href={href}
                    className="text-sky-600 font-serif italic dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline decoration-2 underline-offset-2 break-words text-base md:text-lg transition-all duration-200 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),

                ul: ({ children, ...props }) => (
                  <ul
                    className="mb-6 space-y-3 pl-6 text-gray-700 dark:text-gray-300 text-base list-disc marker:text-sky-600 dark:marker:text-sky-400"
                    {...props}
                  >
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol
                    className="mb-6 space-y-3 pl-6 text-gray-700 dark:text-gray-300 text-base list-decimal marker:text-sky-600 dark:marker:text-sky-400 marker:font-semibold"
                    {...props}
                  >
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li
                    className="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed pl-2"
                    {...props}
                  >
                    {children}
                  </li>
                ),

                blockquote: ({ children, ...props }) => (
                  <blockquote
                    className="border-l-4 border-sky-500 dark:border-sky-400 pl-6 pr-4 py-4 italic text-gray-700 dark:text-gray-300 my-6 text-sm md:text-base bg-gradient-to-r from-sky-50 dark:from-sky-900/20 to-blue-50 dark:to-blue-900/20 rounded-r-2xl shadow-sm"
                    {...props}
                  >
                    {children}
                  </blockquote>
                ),

                em: ({ children, ...props }) => (
                  <em
                    className="italic text-gray-800 dark:text-gray-200"
                    {...props}
                  >
                    {children}
                  </em>
                ),

                strong: ({ children, ...props }) => (
                  <strong
                    className="font-semibold text-gray-900 dark:text-white"
                    {...props}
                  >
                    {children}
                  </strong>
                ),

                table: ({ children, ...props }) => (
                  <div className="overflow-x-auto my-8 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    <table
                      className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800"
                      {...props}
                    >
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children, ...props }) => (
                  <thead className="bg-gray-50 dark:bg-gray-700" {...props}>
                    {children}
                  </thead>
                ),
                tbody: ({ children, ...props }) => (
                  <tbody
                    className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800"
                    {...props}
                  >
                    {children}
                  </tbody>
                ),
                tr: ({ children, ...props }) => (
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    {...props}
                  >
                    {children}
                  </tr>
                ),
                th: ({ children, ...props }) => (
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                    {...props}
                  >
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td
                    className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600"
                    {...props}
                  >
                    {children}
                  </td>
                ),

                hr: ({ ...props }) => (
                  <hr
                    className="my-8 border-gray-300 dark:border-gray-600"
                    {...props}
                  />
                ),

                img: ({ ...props }) => (
                  <img
                    {...props}
                    className="my-8 max-w-full rounded-2xl shadow-lg mx-auto border border-sky-100 dark:border-gray-600 transition-all duration-500 transform"
                    alt={props.alt || "Article image"}
                  />
                ),
              }}
            >
              {fixMarkdownSpacing(article.content)}
            </ReactMarkdown>
          </div>

          <div className="mt-12 mb-6">
            <CommentsReactions
              articleSlug={article.slug}
              currentUser={{
                isAuthenticated: true,
                authorSlug: effectiveAuthor?.slug,
              }}
            />
          </div>

          <div className="mb-2 hidden md:block">
            <ShareButtons
              articleId={article.id}
              title={article.title}
              url={typeof window !== "undefined" ? window.location.href : ""}
            />
          </div>

          <div className="mt-12 flex items-center justify-between gap-4">
            {prevArticle && (
              <Link
                href={`/articles/${prevArticle.slug}`}
                className="group flex items-center gap-3 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-all duration-300 flex-1 min-w-0"
              >
                <div className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Previous
                    </span>
                    <span className="text-sm font-medium line-clamp-1 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
                      {prevArticle.title}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {nextArticle && (
              <Link
                href={`/articles/${nextArticle.slug}`}
                className="group flex items-center gap-3 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-all duration-300 flex-1 min-w-0 justify-end text-right"
              >
                <div className="flex items-center gap-2 flex-row-reverse">
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Next
                    </span>
                    <span className="text-sm font-medium line-clamp-1 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
                      {nextArticle.title}
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </article>

        {/* Sidebar inside the grid column */}
        <aside
          className="hidden lg:block lg:col-span-1"
          style={{
            position: "sticky",
            top: "140px",
            alignSelf: "flex-start",
            maxHeight: "calc(100vh - 140px)",
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="space-y-4">
            {/* Table of Contents with auto-focus */}
            <Card className="border border-gray-200 dark:border-gray-700 transition-all duration-300 rounded-2xl bg-white dark:bg-gray-900">
              <CardContent className="">
                <div className="flex items-center gap-3 mb-4 pb-3 ">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <ListOrdered className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-black dark:text-white">
                    Table of Contents
                  </h3>
                </div>

                {validHeadings.length > 0 ? (
                  <div className="max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                    <nav className="space-y-1">
                      {validHeadings.map(({ id, text, level }) => {
                        // Indentation
                        const indent =
                          level === 1
                            ? "pl-0"
                            : level === 2
                            ? "pl-4"
                            : level === 3
                            ? "pl-6"
                            : level === 4
                            ? "pl-8"
                            : level === 5
                            ? "pl-10"
                            : "pl-12";

                        const isActive = activeHeadingId === id;

                        return (
                          <a
                            key={id}
                            href={`#${id}`}
                            className={`${indent} py-2 px-2 rounded-lg transition-colors group block ${
                              isActive
                                ? "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-l-2 border-sky-500"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              const target = document.getElementById(id);
                              if (target) {
                                const headerOffset = 80;
                                const elementPosition =
                                  target.getBoundingClientRect().top;
                                const offsetPosition =
                                  elementPosition +
                                  window.pageYOffset -
                                  headerOffset;

                                window.scrollTo({
                                  top: offsetPosition,
                                  behavior: "smooth",
                                });

                                history.replaceState(null, "", `#${id}`);
                              }
                            }}
                          >
                            <span
                              className={`text-sm font-medium truncate transition-colors ${
                                isActive
                                  ? "text-sky-600 dark:text-sky-400"
                                  : "text-gray-700 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-400"
                              }`}
                            >
                              {text}
                            </span>
                          </a>
                        );
                      })}
                    </nav>
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <div className="w-10 h-10 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                      <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No headings found
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Articles */}
            <Card className="border border-gray-200 dark:border-gray-700 transition-all duration-300 rounded-3xl bg-white dark:bg-gray-900">
              <CardContent className="">
                <div className="flex items-center gap-3 mb-4 pb-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-black dark:text-white">
                    Recent Articles
                  </h3>
                </div>
                <div className="space-y-4">
                  {recentArticles.slice(0, 4).map((article) => {
                    const itemAuthor = authors.find(
                      (a) => a.id === article.author
                    );
                    const coverImage = article.cover_image || "/devops.webp";
                    const articleExcerpt = excerpt(article.content || "");

                    return (
                      <Link
                        href={`/articles/${article.slug}`}
                        key={article.id}
                        className="block group"
                      >
                        <div className="bg-white dark:bg-gray-800 p-3 hover:shadow-md dark:hover:border-sky-600 transition-all duration-300">
                          <div className="mb-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm">
                            <img
                              src={coverImage}
                              alt={article.title}
                              className="w-full h-20 object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold text-black dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 text-sm leading-tight">
                              {article.title}
                            </h4>

                            <p className="text-xs text-black/70 dark:text-gray-400 leading-relaxed line-clamp-2">
                              {articleExcerpt}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 overflow-hidden border border-white dark:border-gray-800 shadow-sm">
                                  <img
                                    src={
                                      itemAuthor?.avatar || "/placeholder.svg"
                                    }
                                    alt={itemAuthor?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-xs font-medium text-black/80 dark:text-gray-300">
                                  {itemAuthor?.name || "Unknown"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Featured Authors */}
            <Card className="border border-gray-200 dark:border-gray-700 transition-all duration-300 rounded-3xl bg-white dark:bg-gray-900">
              <CardContent className="">
                <div className="flex items-center gap-3 mb-4 pb-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Star className="w-4 h-4 text-sky-600" />
                  </div>
                  <h3 className="text-base font-semibold text-black dark:text-white">
                    Featured Authors
                  </h3>
                </div>
                <div className="space-y-3">
                  {authors
                    .sort(
                      (a, b) =>
                        (b.articles_count || 0) - (a.articles_count || 0)
                    )
                    .slice(0, 3)
                    .map((author, index) => (
                      <Link
                        href={`/authors/${author.slug}`}
                        key={author.id}
                        className="block group"
                      >
                        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-gray-800 transition-all duration-300">
                          {/* Author Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 overflow-hidden border border-white dark:border-gray-800 shadow-sm flex-shrink-0">
                            <img
                              src={author.avatar || "/placeholder.svg"}
                              alt={author.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder.svg";
                              }}
                            />
                          </div>

                          {/* Author Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-black dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 text-sm">
                              {author.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-black dark:text-gray-400">
                              {author.job_title}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Reads */}
            <Card className="border border-gray-200 dark:border-gray-700 transition-all duration-300 rounded-3xl bg-white dark:bg-gray-900">
              <CardContent className="">
                <div className="flex items-center gap-3 mb-4 pb-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-sky-600" />
                  </div>
                  <h3 className="text-base font-semibold text-black dark:text-white">
                    Popular Reads
                  </h3>
                </div>
                <div className="space-y-3">
                  {topReadArticles.map((article) => {
                    const itemAuthor = authors.find(
                      (a) => a.id === article.author
                    );

                    return (
                      <Link
                        href={`/articles/${article.slug}`}
                        key={article.id}
                        className="block group"
                      >
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 dark:hover:bg-gray-800 transition-all duration-300">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-black dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 text-sm leading-tight mb-1">
                              {article.title}
                            </h4>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs text-black/70 dark:text-gray-400"></div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </main>
    </div>
  );
}
