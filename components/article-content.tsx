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
} from "lucide-react";
import { motion } from "framer-motion";
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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "./share-buttons";

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
      className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-sky-300 dark:border-sky-600 text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 hover:bg-white dark:hover:bg-gray-700 hover:border-sky-400 dark:hover:border-sky-500 px-3 py-2 text-xs rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
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

// Separate component for inline code
const InlineCode = ({ children, ...props }: any) => (
  <code
    className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded px-1.5 py-0.5 text-sm font-mono border border-gray-300 dark:border-gray-600"
    {...props}
  >
    {children}
  </code>
);

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

  const validHeadings = headings.filter(({ text, level }) => {
    const cleanText = text.trim();

    // Instead of blacklisting, look for legitimate heading patterns
    const isValidHeading =
      cleanText.length > 0 &&
      level >= 1 &&
      level <= 6 &&
      !cleanText.startsWith("```") && // Basic code block exclusion
      !cleanText.match(/^[#`\s]*$/); // Only special chars

    return isValidHeading;
  });

  return (
    <main className="px-6 md:px-11 py-20 md:py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <article className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-500 p-6 md:p-8 lg:p-10">
        <div className="mb-10 md:mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link href={`/categories/${slugify(categoryName)}`}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all duration-300 hover:scale-105">
                <Folder className="w-4 h-4" />
                {categoryName}
              </span>
            </Link>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-black dark:text-white">
                <CalendarDays className="w-3 h-3" />
                <span>
                  {new Date(article.published_at).toLocaleDateString()}
                </span>
              </div>
              <div className="w-1 h-1 bg-black/30 dark:bg-gray-600 rounded-full"></div>
              <div className="flex items-center gap-1 text-black dark:text-white">
                <Eye className="w-3 h-3" />
                <span>
                  <CountUp
                    end={article.read_count || 0}
                    duration={2}
                    separator=","
                  />{" "}
                  views
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-6 leading-tight tracking-tight">
            {article.title}
          </h1>

          {tagNames.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {tagNames.map((tag, index) => (
                <Link
                  href={`/articles?tag=${slugify(tag)}`}
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 text-black dark:text-white text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <TagIcon className="w-4 h-4 text-orange" />
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
        {article.cover_image && (
          <div className="mb-8 md:mb-10 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500">
            <img
              src={article.cover_image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            components={{
              // Use separate component for inline code
              code: InlineCode,

              // Block code component
              pre: ({ children, ...props }: any) => {
                const child = React.Children.only(children) as any;
                const codeProps = child?.props || {};
                const className = codeProps.className || "";
                const childrenContent = codeProps.children || "";

                const match = /language-(\w+)/.exec(className || "");
                const language = match?.[1]?.toLowerCase() || "";

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

                const isShellLike = ["bash", "shell", "sh", "zsh"].includes(
                  language
                );
                const startsWithDollar =
                  isShellLike && lines[0]?.trim().match(/^(\$|#|>)/);
                const promptChar =
                  lines[0]?.trim().match(/^(\$|#|>)/)?.[1] || "$";

                const showCopyButton = [
                  "bash",
                  "shell",
                  "sh",
                  "zsh",
                  "python",
                  "py",
                  "javascript",
                  "js",
                  "typescript",
                  "ts",
                  "hcl",
                  "terraform",
                  "yaml",
                  "yml",
                  "toml",
                  "json",
                  "html",
                  "css",
                  "dockerfile",
                  "sql",
                  "ruby",
                  "go",
                  "rust",
                ].includes(language);

                const getLanguageName = (lang: string): string => {
                  const langMap: { [key: string]: string } = {
                    js: "JavaScript",
                    ts: "TypeScript",
                    py: "Python",
                    yml: "YAML",
                    hcl: "HCL",
                    tf: "Terraform",
                    sh: "Shell",
                    zsh: "Z Shell",
                  };
                  return (
                    langMap[lang] ||
                    lang.charAt(0).toUpperCase() + lang.slice(1)
                  );
                };

                return (
                  <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-sky-50 dark:from-gray-800 to-white dark:to-gray-900 text-gray-700 dark:text-gray-300 font-mono text-sm shadow-lg border border-sky-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {language && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-700 dark:to-blue-700 text-white rounded-t-2xl px-4 py-2 text-xs font-semibold flex justify-between items-center">
                        <span>{getLanguageName(language)}</span>
                        <span className="text-sky-200 dark:text-sky-300 text-xs font-normal">
                          {lines.length} line{lines.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                    {showCopyButton && <CopyButton code={codeString} />}
                    <pre
                      className={`p-6 overflow-x-auto rounded-2xl ${
                        language ? "pt-12" : "pt-6"
                      }`}
                    >
                      <code className="font-mono text-sm block">
                        {lines.map((line, idx) => {
                          const hasPrompt = idx === 0 && startsWithDollar;
                          const isEmptyLine = line.trim() === "";

                          return (
                            <div
                              key={idx}
                              className={`hover:bg-sky-50 dark:hover:bg-gray-700/50 rounded-lg px-2 -mx-2 transition-colors ${
                                isEmptyLine ? "min-h-[1.2em]" : ""
                              }`}
                            >
                              {hasPrompt && (
                                <span className="text-sky-600 dark:text-sky-400 font-bold select-none mr-2">
                                  {promptChar}
                                </span>
                              )}
                              <span
                                className={
                                  isEmptyLine ? "inline-block min-w-[1px]" : ""
                                }
                              >
                                {hasPrompt
                                  ? line.slice(promptChar.length).trimStart()
                                  : line}
                              </span>
                            </div>
                          );
                        })}
                      </code>
                    </pre>
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
                  className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline decoration-2 underline-offset-2 break-words text-base md:text-lg transition-all duration-200 font-medium"
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
                  className="my-8 max-w-full rounded-2xl shadow-lg mx-auto border border-sky-100 dark:border-gray-600 hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
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
        {/* ADD SHARE BUTTONS HERE */}
        <div className="mb-2 hidden md:block">
          <ShareButtons
            articleId={article.id}
            title={article.title}
            url={typeof window !== "undefined" ? window.location.href : ""}
          />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12 mt-16"
        >
          <div className="bg-gradient-to-br from-white dark:from-gray-800 to-slate-50 dark:to-gray-900 rounded-3xl border border-slate-200 dark:border-gray-700 p-4 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left gap-4 md:gap-6">
              <div className="group relative">
                <Link href={`/authors/${authorSlug}`} className="block">
                  <div className="relative">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-1 shadow-lg md:shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={effectiveAuthor?.avatar || "/placeholder.svg"}
                        alt={effectiveAuthor?.name || "Author"}
                        className="w-full h-full rounded-2xl object-cover border-4 border-white dark:border-gray-800"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.svg";
                        }}
                      />
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex-1 w-full">
                <div className="inline-flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl text-xs md:text-sm font-semibold mb-3 shadow-md md:shadow-lg">
                  <Crown className="w-2.5 h-2.5 md:w-4 md:h-4" />
                  <span className="hidden md:inline">Author</span>
                  <span className="md:hidden">Author</span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-1 md:mb-2 text-base md:text-xl">
                  <span className="md:hidden">Written By</span>
                  <span className="hidden md:inline">Written By</span>
                </h3>

                <Link
                  href={`/authors/${authorSlug}`}
                  className="group block mb-2 md:mb-3"
                >
                  <p className="text-base md:text-xl text-sky-700 dark:text-sky-400 font-semibold mb-2 md:mb-3 group-hover:text-sky-800 dark:group-hover:text-sky-300 transition-colors line-clamp-1 md:line-clamp-none">
                    {effectiveAuthor?.name || "Unknown Author"}
                  </p>
                </Link>

                <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4 md:mb-6 text-xs md:text-base line-clamp-3 md:line-clamp-none">
                  {effectiveAuthor?.bio || "No bio available."}
                </p>

                <Link href={`/authors/${authorSlug}`} className="block">
                  <Button className="group w-full md:w-auto bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs md:text-base">
                    <span className="hidden md:inline">
                      View Author Profile
                    </span>
                    <span className="md:hidden">View Profile</span>
                    <ArrowRight className="w-2.5 h-2.5 md:w-4 md:h-4 ml-1.5 md:ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

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

      <aside className="lg:col-span-1 space-y-6 hidden md:block">
        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl bg-white dark:bg-gray-900">
          <CardContent className="">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-sky-100 dark:border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <ListOrdered className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-black dark:text-white">
                Table of Contents
              </h3>
            </div>
            <nav className="space-y-1">
              {validHeadings.map(({ id, text, level }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`block py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-2 ${
                    level === 1
                      ? "border-blue-500 font-semibold text-black dark:text-white"
                      : level === 2
                      ? "border-black-100 dark:border-gray-600 text-black dark:text-gray-300 ml-4"
                      : "border-black-100 dark:border-gray-700 text-black dark:text-gray-400 ml-8 text-sm"
                  }`}
                >
                  {text}
                </a>
              ))}
            </nav>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl bg-white dark:bg-gray-900">
          <CardContent className="">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-sky-100 dark:border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-black dark:text-white">
                Recent Articles
              </h3>
            </div>
            <div className="space-y-4">
              {recentArticles.slice(0, 4).map((article) => {
                const itemAuthor = authors.find((a) => a.id === article.author);
                const coverImage = article.cover_image || "/devops.webp";
                const articleExcerpt = excerpt(article.content || "");

                return (
                  <Link
                    href={`/articles/${article.slug}`}
                    key={article.id}
                    className="block group"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-300">
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
                                src={itemAuthor?.avatar || "/placeholder.svg"}
                                alt={itemAuthor?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs font-medium text-black/80 dark:text-gray-300">
                              {itemAuthor?.name || "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-black/70 dark:text-gray-400 font-medium">
                            <Eye className="w-3 h-3" />
                            <CountUp
                              end={article.read_count || 0}
                              duration={1.5}
                              separator=","
                            />
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

        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl bg-white dark:bg-gray-900">
          <CardContent className="">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-sky-100 dark:border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-black dark:text-white">
                Featured Authors
              </h3>
            </div>
            <div className="space-y-3">
              {authors
                .sort(
                  (a, b) => (b.articles_count || 0) - (a.articles_count || 0)
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

        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl bg-white dark:bg-gray-900">
          <CardContent className="">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-sky-100 dark:border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-black dark:text-white">
                Popular Reads
              </h3>
            </div>
            <div className="space-y-3">
              {topReadArticles.map((article) => {
                const itemAuthor = authors.find((a) => a.id === article.author);

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
      </aside>
    </main>
  );
}
