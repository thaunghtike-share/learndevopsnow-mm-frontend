"use client";
import { useState, useEffect, useRef } from "react";
import {
  User,
  ArrowRight,
  Folder,
  Tag as TagIcon,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ChevronDown,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Article {
  id: number;
  slug: string;
  title: string;
  read_count: number;
  content: string;
  published_at: string;
  category: number | null;
  tags: number[];
  author: number;
  cover_image?: string;
  excerpt?: string;
}

interface Author {
  id: number;
  name: string;
  avatar?: string;
  username?: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface MinimalBlogListProps {
  searchQuery?: string;
  filterTagSlug?: string | null;
}

const PAGE_SIZE = 12;

export function MinimalBlogList({
  searchQuery = "",
  filterTagSlug: propFilterTagSlug,
}: MinimalBlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  const [filterTagSlug, setFilterTagSlug] = useState<string | null>(() => {
    const tagParam = searchParams.get("tag");
    return propFilterTagSlug ?? tagParam ?? null;
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  // Calculate read time (approx 200 words per minute)
  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsTagDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = `${API_BASE_URL}/articles/?`;
        const params = new URLSearchParams();

        if (searchQuery.trim()) params.append("search", searchQuery.trim());
        if (filterTagSlug) params.append("tags__slug", filterTagSlug);

        url += params.toString();

        const [
          articlesResponse,
          authorsResponse,
          tagsResponse,
          categoriesResponse,
        ] = await Promise.all([
          fetch(url),
          fetch(`${API_BASE_URL}/authors/`),
          fetch(`${API_BASE_URL}/tags/`),
          fetch(`${API_BASE_URL}/categories/`),
        ]);

        const [articlesData, authorsData, tagsData, categoriesData] =
          await Promise.all([
            articlesResponse.json(),
            authorsResponse.json(),
            tagsResponse.json(),
            categoriesResponse.json(),
          ]);

        setArticles(
          Array.isArray(articlesData)
            ? articlesData
            : articlesData.results || []
        );
        setAuthors(
          Array.isArray(authorsData) ? authorsData : authorsData.results || []
        );
        setTags(Array.isArray(tagsData) ? tagsData : tagsData.results || []);
        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : categoriesData.results || []
        );
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setCurrentPage(1);
  }, [searchQuery, filterTagSlug]);

  useEffect(() => {
    const tagFromUrl = searchParams.get("tag") ?? null;
    if (tagFromUrl !== filterTagSlug) {
      setFilterTagSlug(tagFromUrl);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getAuthor = (id: number) => authors.find((a) => a.id === id);
  const getCategoryById = (id: number | null) =>
    categories.find((c) => c.id === id);
  const getTagById = (id: number) => tags.find((t) => t.id === id);
  const getCurrentTagName = () =>
    tags.find((tag) => tag.slug === filterTagSlug)?.name || "this tag";

  const stripMarkdown = (md: string) =>
    md
      .replace(/<[^>]+>/g, "")
      .replace(/[#_*>![\]$$$$~-]/g, "")
      .trim();

  const truncate = (str: string, max = 120) =>
    str.length <= max ? str : str.slice(0, max) + "...";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (localSearch) {
      params.set("search", localSearch);
    }
    if (filterTagSlug) {
      params.set("tags__slug", filterTagSlug);
    }

    const newUrl = `/articles?${params.toString()}`;
    router.push(newUrl);
  };

  const clearFilters = () => {
    setLocalSearch("");
    setFilterTagSlug(null);
    setIsTagDropdownOpen(false);
    router.push("/articles");
  };

  const getCoverImage = (article: Article) => {
    return article.cover_image || "/devops.webp";
  };

  // Get selected tag name for dropdown display
  const selectedTagName = filterTagSlug
    ? tags.find((tag) => tag.slug === filterTagSlug)?.name
    : null;

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-8">
          <AlertTriangle className="w-16 h-16 text-sky-600 dark:text-sky-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-sky-600 dark:text-sky-400 mb-2">
            Error Loading Articles
          </h3>
          <p className="text-sky-600 dark:text-sky-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-12">
        {/* Blue/Purple gradient line with "Author Dashboard" style */}
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <span className="text-xs md:text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Articles Dashboard
          </span>
        </div>
        {/* Main title with your font style */}
        <h1 className="text-3xl md:text-7xl text-black dark:text-white mb-4 md:mb-6 tracking-tight">
          Latest Articles
        </h1>
        <p className="text-lg text-black dark:text-gray-300 max-w-3xl leading-relaxed">
          Explore comprehensive tutorials, best practices, and real-world DevOps
          scenarios. Master modern tools through practical, hands-on examples.
        </p>
      </div>

      {/* Search and Filters Section */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search Bar - Left Side */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles by topic, technology, or keyword..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-700 text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Tag Filter Dropdown - Right Side */}
          <div className="w-full lg:w-auto" ref={dropdownRef}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                  filterTagSlug
                    ? "bg-sky-600 text-white border-sky-600 shadow-md"
                    : "bg-white dark:bg-gray-800 text-black dark:text-gray-100 border-gray-500 dark:border-gray-700 hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-sm"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">
                  {selectedTagName || "Filter by Tag"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isTagDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {filterTagSlug && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Dropdown Menu */}
            {isTagDropdownOpen && (
              <div className="absolute mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                <div className="p-3">
                  <div className="text-sm font-semibold text-black dark:text-gray-100 mb-2">
                    Select a tag:
                  </div>
                  <div className="space-y-1">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          setFilterTagSlug(
                            tag.slug === filterTagSlug ? null : tag.slug
                          );
                          setIsTagDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          filterTagSlug === tag.slug
                            ? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <TagIcon className="w-4 h-4" />
                        <span>{tag.name}</span>
                        {filterTagSlug === tag.slug && (
                          <div className="w-2 h-2 bg-sky-600 dark:bg-sky-400 rounded-full ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {loading ? (
        // Loading State
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center bg-sky-50 dark:bg-sky-900/20 rounded-full p-6 mb-6 border border-sky-200 dark:border-sky-800">
            <div className="w-12 h-12 border-4 border-sky-200 dark:border-sky-700 border-t-sky-600 dark:border-t-sky-400 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-2xl font-bold text-black dark:text-gray-100 mb-3">
            Loading Articles...
          </h3>
          <p className="text-black dark:text-gray-300 mb-6 max-w-md mx-auto">
            Fetching the latest DevOps content for you
          </p>
        </div>
      ) : articles.length === 0 ? (
        // Empty State (only show when loading is false)
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 rounded-full p-6 mb-6 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-2xl font-bold text-black dark:text-gray-100 mb-3">
            No articles found
          </h3>
          <p className="text-black dark:text-gray-300 mb-6 max-w-md mx-auto">
            {filterTagSlug
              ? `No articles match the tag "${getCurrentTagName()}". Try another tag!`
              : "No articles available. Check back later for new content!"}
          </p>
          {filterTagSlug && (
            <button
              onClick={() => setFilterTagSlug(null)}
              className="px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:shadow-lg font-medium"
            >
              Show all articles
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Articles Grid - UPDATED: Everything inside the same box */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article) => {
              const author = getAuthor(article.author);
              const category = getCategoryById(article.category);
              const readTime = calculateReadTime(article.content);

              // Get article tags
              const articleTags = article.tags
                .map((tagId) => getTagById(tagId))
                .filter(Boolean)
                .slice(0, 3); // Show max 3 tags

              return (
                <article
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow"
                >
                  {/* Cover Image Container */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {/* Read time overlay at bottom right */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                        {readTime}
                      </div>
                    </div>

                    {/* Cover Image */}
                    <Link
                      href={`/articles/${article.slug}`}
                      className="block w-full h-full"
                    >
                      <img
                        src={getCoverImage(article)}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/devops.webp";
                        }}
                      />
                    </Link>
                  </div>

                  {/* Content - Now inside the same box as the cover image */}
                  <div className="p-5">
                    {/* Category and Views */}
                    <div className="flex items-center justify-between mb-3">
                      {category && (
                        <Link
                          href={`/categories/${category.slug}`}
                          className="inline-block"
                        >
                          <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide hover:text-sky-700 dark:hover:text-sky-300">
                            {category.name}
                          </span>
                        </Link>
                      )}
                      <div className="flex items-center gap-1 text-sm text-sky-600 dark:text-sky-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {article.read_count?.toLocaleString() || 0} view
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <Link
                      href={`/articles/${article.slug}`}
                      className="block mb-3"
                    >
                      <h3 className="font-bold text-black dark:text-gray-100 line-clamp-2 hover:text-sky-600 dark:hover:text-sky-400 transition-colors leading-tight text-lg">
                        {article.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <div className="mb-4">
                      <p className="text-black dark:text-gray-300 line-clamp-2 leading-relaxed text-sm">
                        {article.excerpt ||
                          truncate(stripMarkdown(article.content))}
                      </p>
                    </div>

                    {/* Author and Main Tag */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-4">
                      {/* Author - Left Side */}
                      <div className="flex items-center gap-2">
                        {author?.avatar ? (
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 flex items-center justify-center">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <span className="font-medium text-black dark:text-gray-100">
                          {author?.name || `Author ${article.author}`}
                        </span>
                      </div>

                      {/* Main Tag - Right Side */}
                      {articleTags.length > 0 && (
                        <Link
                          href={`/articles?tag=${articleTags[0]!.slug}`}
                          className="flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-medium text-sm"
                        >
                          <TagIcon className="w-4 h-4" />
                          {articleTags[0]!.name}
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <nav className="mt-12">
              <div className="flex flex-col items-center gap-4">
                {/* Simple 3-Page Test Design */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-black dark:text-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {/* Always show 3 pages (or less if fewer pages exist) */}
                  {(() => {
                    // For testing: Let's see how many pages we have
                    console.log("Total pages:", totalPages);
                    console.log("Current page:", currentPage);

                    // Create an array of page numbers to show
                    let pagesToShow: number[] = [];

                    if (totalPages <= 3) {
                      // If 3 or fewer pages, show all
                      pagesToShow = Array.from(
                        { length: totalPages },
                        (_, i) => i + 1
                      );
                    } else {
                      // Always show 3 pages with current page in the middle if possible
                      if (currentPage === 1) {
                        // At start: show 1, 2, 3
                        pagesToShow = [1, 2, 3];
                      } else if (currentPage === totalPages) {
                        // At end: show last 3 pages
                        pagesToShow = [
                          totalPages - 2,
                          totalPages - 1,
                          totalPages,
                        ];
                      } else {
                        // In middle: show current-1, current, current+1
                        pagesToShow = [
                          currentPage - 1,
                          currentPage,
                          currentPage + 1,
                        ];
                      }
                    }

                    return pagesToShow.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white"
                            : "border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ));
                  })()}

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-black dark:text-gray-100"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Page Info */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
}