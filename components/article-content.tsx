"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import React from "react";
import "highlight.js/styles/atom-one-light.css";
import CountUp from "react-countup";
import {
  BarChart3,
  ChevronRight,
  Home,
  Flag,
  AlertTriangle,
  Send,
  X,
  CheckCircle,
  Loader2,
  Shield,
  Edit,
} from "lucide-react";
import { motion } from "framer-motion";
import { visit } from "unist-util-visit";
import { CommentsReactions } from "./comment-reactions";
import {
  ArrowRight,
  ListOrdered,
  TrendingUp,
  ChevronLeft,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { SimpleTTSPlayer } from "./tts-player";
import { ShareButtons } from "./share-buttons";
import { SaveButton } from "./SaveButton";
import { useAuth } from "@/app/[locale]/auth/hooks/use-auth";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const InlineCode = ({ children, ...props }: any) => (
  <code
    className="text-gray-700 dark:text-gray-300 italic px-1 text-base font-sans"
    {...props}
  >
    "{children}"
  </code>
);

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
  const [topReadArticles, setTopReadArticles] = useState<Article[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [fullscreenImage, setFullscreenImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Add report form states
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState("abuse");
  const [description, setDescription] = useState("");
  const [suggestedCorrection, setSuggestedCorrection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isAuthenticated, user } = useAuth();

  const validHeadings = headings.filter(({ text, level }) => {
    const cleanText = text.trim();
    const isLevelValid = level >= 2 && level <= 3;
    const isValidHeading =
      cleanText.length > 0 &&
      isLevelValid &&
      !cleanText.startsWith("```") &&
      !cleanText.match(/^[#`\s]*$/);
    return isValidHeading;
  });

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

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -60% 0px",
      threshold: 0.1,
    };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeadingId(entry.target.id);
        }
      });
    };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    validHeadings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });
    return () => {
      validHeadings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
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
        if (node.children.length === 1 && node.children[0].type === "link") {
          const link = node.children[0];
          const url = link.url || "";
          const youtubeId = extractYouTubeId(url);
          if (youtubeId) {
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

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      setErrorMessage("You must be logged in as an author to submit reports");
      return;
    }

    if (!description.trim()) {
      setErrorMessage("Please provide a description");
      return;
    }

    if (reportType === "correction" && !suggestedCorrection.trim()) {
      setErrorMessage("Please provide the correct information");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const payload = {
        article_slug_input: article.slug,
        report_type: reportType,
        description: description.trim(),
        suggested_correction:
          reportType === "correction" ? suggestedCorrection.trim() : "",
        supporting_evidence: suggestedCorrection.trim(), // Using the same field for simplicity
      };

      const response = await fetch(`${API_BASE_URL}/reports/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setDescription("");
        setSuggestedCorrection("");
        // Reset form after 5 seconds
        setTimeout(() => {
          setShowReportForm(false);
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setErrorMessage(
          data.error || data.errors?.join(", ") || "Failed to submit report",
        );
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
      console.error("Report submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <main className="px-4 md:px-11 py-5 md:py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <article className="lg:col-span-3">
          <div className="mb-10 md:mb-12">
            <nav aria-label="Breadcrumb" className="mb-5 sm:mb-7 px-2 sm:px-0">
              <div className="flex items-baseline gap-2 sm:gap-3 text-sm sm:text-base font-medium">
                <Link
                  href="/"
                  className="group flex items-center text-sky-600 dark:text-sky-600 hover:text-sky-600 font-medium dark:hover:text-sky-400 transition-all duration-250 truncate"
                >
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                  Home
                </Link>
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 dark:text-gray-500 mx-1 flex-shrink-0" />
                <Link
                  href="/articles"
                  className="text-black dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-250 truncate px-1 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Articles
                </Link>
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 dark:text-gray-500 mx-1 flex-shrink-0" />
                <Link
                  href={`/categories/${slugify(categoryName)}`}
                  className="text-black dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-250 truncate px-1.5 py-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold relative group"
                  aria-current="page"
                >
                  <span className="hidden sm:inline">{categoryName}</span>
                  <span className="sm:hidden truncate max-w-[80px]">
                    {categoryName.length > 10
                      ? `${categoryName.substring(0, 10)}...`
                      : categoryName}
                  </span>
                  <span className="absolute -bottom-1 left-1.5 right-1.5 h-0.5 bg-sky-500 dark:bg-sky-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-250"></span>
                </Link>
              </div>
            </nav>
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
                    className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"></div>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                <Link href={`/authors/${authorSlug}`} className="group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white dark:border-gray-800 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={effectiveAuthor?.avatar || "/placeholder.svg"}
                      alt={effectiveAuthor?.name || "Author"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
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
                          },
                        )}
                      </span>
                    </div>
                  </div>
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
              <SaveButton
                articleId={article.id}
                articleTitle={article.title}
                size="md"
                showLabel={true}
              />
              <div className="hidden sm:block">
                <SimpleTTSPlayer
                  text={article.content}
                  articleTitle={article.title}
                />
              </div>
            </div>
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
              remarkPlugins={[remarkGfm, remarkYouTube]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
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
                    "",
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
                      className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mt-12 mb-8"
                      {...props}
                    >
                      <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-purple-700 dark:from-blue-500 dark:via-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
                        {children}
                      </span>
                    </h1>
                  );
                },
                h2: ({ children, ...props }) => {
                  const id = slugify(flattenChildren(children));
                  return (
                    <h2
                      id={id}
                      className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-600 mt-10 mb-6"
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
                      className="text-xl md:text-2xl font-semibold text-green-700 dark:text-green-600 mt-8 mb-4"
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
                      className="text-lg md:text-xl font-semibold text-purple-700 dark:text-purple-300 mt-6 mb-3"
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
                p: ({ children, node, ...props }) => {
                  const childrenArray = React.Children.toArray(children);
                  const hasOnlyImage =
                    childrenArray.length === 1 &&
                    React.isValidElement(childrenArray[0]) &&
                    childrenArray[0].type === "img";
                  const hasImageAsFirstChild =
                    childrenArray.length > 0 &&
                    React.isValidElement(childrenArray[0]) &&
                    childrenArray[0].type === "img";
                  if (hasOnlyImage || hasImageAsFirstChild) {
                    return (
                      <div className="my-8 w-full overflow-hidden cursor-pointer group">
                        {children}
                      </div>
                    );
                  }
                  return (
                    <p
                      className="mb-6 text-base leading-relaxed text-black dark:text-gray-300"
                      {...props}
                    >
                      {children}
                    </p>
                  );
                },
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
                    className="mb-6 space-y-3 pl-6 text-black dark:text-gray-300 text-base list-disc marker:text-sky-600 dark:marker:text-sky-400"
                    {...props}
                  >
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol
                    className="mb-6 space-y-3 pl-6 text-black dark:text-gray-300 text-base list-decimal marker:text-sky-600 dark:marker:text-sky-400 marker:font-semibold"
                    {...props}
                  >
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li
                    className="mb-2 text-black dark:text-gray-300 leading-relaxed pl-2"
                    {...props}
                  >
                    {children}
                  </li>
                ),
                blockquote: ({ children, ...props }) => (
                  <blockquote
                    className="border-l-4 border-sky-500 dark:border-sky-400 pl-6 pr-4 py-4 italic text-black dark:text-gray-300 my-6 text-sm md:text-base bg-gradient-to-r from-sky-50 dark:from-sky-900/20 to-blue-50 dark:to-blue-900/20 rounded-r-2xl shadow-sm"
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
                img: ({ ...props }) => {
                  return (
                    <img
                      {...props}
                      className="w-full h-auto max-h-[500px] object-contain transition-all duration-500 group-hover:scale-105"
                      alt={props.alt || "Article image"}
                      onClick={() => {
                        if (props.src) {
                          let srcValue: string;
                          if (typeof props.src === "string") {
                            srcValue = props.src;
                          } else {
                            if (objectUrlRef.current) {
                              try {
                                URL.revokeObjectURL(objectUrlRef.current);
                              } catch (e) {}
                            }
                            objectUrlRef.current = URL.createObjectURL(
                              props.src as Blob,
                            );
                            srcValue = objectUrlRef.current;
                          }
                          setFullscreenImage({
                            src: srcValue,
                            alt: props.alt || "Article image",
                          });
                        }
                      }}
                    />
                  );
                },
              }}
            >
              {fixMarkdownSpacing(article.content)}
            </ReactMarkdown>
          </div>
          <div className="mt-12">
            <div className="">
              <div className="flex items-center gap-3 mb-6 pb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    Discussion
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Join the conversation
                  </p>
                </div>
              </div>
              <CommentsReactions
                articleSlug={article.slug}
                currentUser={{
                  isAuthenticated: true,
                  authorSlug: effectiveAuthor?.slug,
                }}
              />
            </div>
          </div>
          <div className="mb-8">
            <ShareButtons
              articleId={article.id}
              title={article.title}
              url={typeof window !== "undefined" ? window.location.href : ""}
            />
          </div>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Recent Articles
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.slice(0, 5).map((article) => {
                const itemAuthor = authors.find((a) => a.id === article.author);
                const coverImage = article.cover_image || "/devops.webp";
                const articleExcerpt = excerpt(article.content || "");
                return (
                  <Link
                    href={`/articles/${article.slug}`}
                    key={article.id}
                    className="block group"
                  >
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-400 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                      <div className="relative">
                        <div className="mb-4 overflow-hidden">
                          <img
                            src={coverImage}
                            alt={article.title}
                            className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-5">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-black dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 text-lg leading-tight">
                              {article.title}
                            </h4>
                            <p className="text-sm text-black/70 dark:text-gray-400 leading-relaxed line-clamp-2">
                              {articleExcerpt}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg">
                                  <img
                                    src={
                                      itemAuthor?.avatar || "/placeholder.svg"
                                    }
                                    alt={itemAuthor?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <span className="text-sm font-semibold text-black dark:text-white block">
                                    {itemAuthor?.name || "Unknown"}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {itemAuthor?.job_title}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-medium text-sky-600 dark:text-sky-400 px-2 py-1 rounded-full">
                                  {new Date(
                                    article.published_at,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
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
        {/* SIDEBAR - ONLY THIS SECTION IS UPDATED */}
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
            {/* EXISTING Table of Contents - NO CHANGES */}
            <div className="bg-white dark:bg-[#000000]/95 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <ListOrdered className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">
                    Table of Contents
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Navigate through sections
                  </p>
                </div>
              </div>
              {validHeadings.length > 0 ? (
                <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                  <nav className="space-y-1">
                    {validHeadings.map(({ id, text, level }) => {
                      const indent =
                        level === 2
                          ? "pl-0 font-semibold"
                          : level === 3
                            ? "pl-4 font-medium"
                            : "pl-0";
                      const isActive = activeHeadingId === id;
                      return (
                        <a
                          key={id}
                          href={`#${id}`}
                          className={`${indent} py-2.5 px-3 rounded-xl transition-all duration-300 group block ${
                            isActive
                              ? ""
                              : "hover:bg-gray-50 dark:hover:bg-gray-800 hover:translate-x-1"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            const target = document.getElementById(id);
                            if (target) {
                              const headerOffset = 100;
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
                            className={`text-sm truncate transition-colors ${
                              isActive
                                ? "text-blue-600 dark:text-blue-400 font-semibold"
                                : "text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
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
                <div className="py-8 text-center">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No headings found
                  </p>
                </div>
              )}
            </div>

            {/* NEW Report Form Section - ADDED AT THE END */}
            <div className="bg-white dark:bg-[#000000]/95 p-6 mt-6">
              {!showReportForm ? (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <Flag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black dark:text-white">
                        Report Issues
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Help improve content quality
                      </p>
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Found an issue? Help us maintain quality content.
                    </p>

                    {!isAuthenticated ? (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            Authors Only
                          </span>
                        </div>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400/80">
                          You must be logged in as an author to report issues or
                          suggest corrections.
                        </p>
                      </div>
                    ) : null}

                    <button
                      onClick={() => setShowReportForm(true)}
                      disabled={!isAuthenticated}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                        isAuthenticated
                          ? "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isAuthenticated ? (
                        <span className="flex items-center justify-center gap-2">
                          <Flag className="w-4 h-4" />
                          Report or Suggest
                        </span>
                      ) : (
                        "Login to Report"
                      )}
                    </button>
                  </div>
                </div>
              ) : submitSuccess ? (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                        Report Submitted
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Thank you for your contribution
                      </p>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Thank you for helping improve our content. We'll review it
                      shortly.
                    </p>
                    <button
                      onClick={() => {
                        setShowReportForm(false);
                        setSubmitSuccess(false);
                      }}
                      className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black dark:text-white">
                          Report/Suggest Correction
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Provide details about the issue
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowReportForm(false)}
                      className="text-red-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {errorMessage}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmitReport}>
                    <div className="space-y-4">
                      {/* Auto-filled article info */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-4 h-4 text-blue-600 dark:text-blue-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Article Being Reported
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                              {article.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                              Link:{" "}
                              {typeof window !== "undefined"
                                ? window.location.href
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Report Type Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Report Type *
                        </label>
                        <select
                          value={reportType}
                          onChange={(e) => setReportType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent"
                          required
                        >
                          <option value="abuse">🚨 Report Abuse</option>
                          <option value="correction">
                            📝 Suggest Correction
                          </option>
                          <option value="inaccurate">
                            ⚠️ Inaccurate Information
                          </option>
                          <option value="plagiarism">
                            🔍 Plagiarism Concern
                          </option>
                          <option value="other">❓ Other Issue</option>
                        </select>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description *
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            {reportType === "abuse"
                              ? "(Describe the abusive content)"
                              : "(Explain what needs correction)"}
                          </span>
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder={
                            reportType === "abuse"
                              ? "Please describe the abusive content, harassment, spam, or inappropriate material..."
                              : reportType === "correction"
                                ? "What's factually incorrect? Please be specific about the error..."
                                : "Please describe the issue in detail..."
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent"
                          required
                        />
                      </div>

                      {/* Correction Field - Only for correction reports */}
                      {reportType === "correction" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Correct Information *
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                              (Please provide accurate information)
                            </span>
                          </label>
                          <textarea
                            value={suggestedCorrection}
                            onChange={(e) =>
                              setSuggestedCorrection(e.target.value)
                            }
                            placeholder="Please provide the correct information with sources if possible..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            required
                          />
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit{" "}
                              {reportType === "abuse"
                                ? "Abuse Report"
                                : reportType === "correction"
                                  ? "Suggestion"
                                  : "Report"}
                            </>
                          )}
                        </button>
                      </div>

                      {/* Info Text */}
                      <div className="text-center mt-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Reports are only accepted from registered authors.
                          {reportType === "abuse" &&
                            " Abuse reports are reviewed within 24 hours."}
                          {reportType === "correction" &&
                            " Correction suggestions are reviewed within 48 hours."}
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
