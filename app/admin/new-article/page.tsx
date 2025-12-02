"use client";
import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { useRouter } from "next/navigation";
import { relative } from "path";
import {
  Save,
  Image,
  Calendar,
  Tag,
  Folder,
  Link,
  Eye,
  X,
  Plus,
  Check,
  Upload,
  Trash2,
  Maximize2,
  Minimize2
} from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const DRAFT_KEY = "new-article-draft";
const SAVE_INTERVAL = 5000;

export default function NewArticlePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    tags: [] as number[],
    featured: false,
    published_at: new Date().toISOString().slice(0, 10),
    content: "",
    cover_image: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [coverImageUploading, setCoverImageUploading] = useState(false);
  const [coverImageProgress, setCoverImageProgress] = useState(0);
  const [coverImageError, setCoverImageError] = useState<string | null>(null);

  const [newTagName, setNewTagName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
      setLoading(false);
      
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
          }
        });
      });
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      return () => observer.disconnect();
    }
  }, []);

  const generateSlug = (title: string, date: string) => {
    if (!title) return "";

    const titleSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const dateObj = new Date(date);
    const monthNames = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const month = monthNames[dateObj.getMonth()];
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    return `${titleSlug}-${month}-${day}-${year}`;
  };

  useEffect(() => {
    if (form.title && form.published_at) {
      const generatedSlug = generateSlug(form.title, form.published_at);
      setForm((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [form.title, form.published_at]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
      setLoading(false);

      if (savedToken) {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) {
          try {
            const parsedDraft = JSON.parse(draft);
            setForm({
              ...parsedDraft,
              slug: parsedDraft.slug || "",
            });
          } catch (error) {
            console.error("Error parsing draft:", error);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && !token) {
      const countdown = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [loading, token, router]);

  useEffect(() => {
    if (!token) return;

    const saveDraft = () => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setLastSaved(new Date().toLocaleTimeString());
    };

    const interval = setInterval(saveDraft, SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [form, token]);

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch(`${API_BASE_URL}/categories/`),
          fetch(`${API_BASE_URL}/tags/`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(
            Array.isArray(catData) ? catData : catData.results || []
          );
        }

        if (tagRes.ok) {
          const tagData = await tagRes.json();
          setTags(Array.isArray(tagData) ? tagData : tagData.results || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    fetchData();
  }, [API_BASE_URL, token]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleEditorFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!editorRef.current) return;

    if (!fullscreen) {
      editorRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setCoverImageError(
        "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setCoverImageError("File size must be less than 5MB");
      return;
    }

    setCoverImageUploading(true);
    setCoverImageError(null);
    setCoverImageProgress(10);

    try {
      const formData = new FormData();
      formData.append("cover_image", file);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      setCoverImageProgress(30);

      const response = await fetch(`${API_BASE_URL}/upload-cover-image/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      setCoverImageProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Cover image upload failed");
      }

      const data = await response.json();

      setCoverImageProgress(100);

      setForm((prev) => ({
        ...prev,
        cover_image: data.cover_image_url || data.url,
      }));

      setTimeout(() => {
        setCoverImageProgress(0);
        setCoverImageUploading(false);
      }, 1000);
    } catch (error: any) {
      setCoverImageError(error.message);
      setCoverImageProgress(0);
      setCoverImageUploading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    setCreatingTag(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/tags/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });

      if (res.ok) {
        const newTag = await res.json();
        setTags((prev) => [...prev, newTag]);
        setForm((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag.id],
        }));
        setNewTagName("");
        setShowNewTagInput(false);
        setMessage({ text: "Tag created successfully", type: "success" });
      } else {
        throw new Error("Failed to create tag");
      }
    } catch (error) {
      setMessage({ text: "Error creating tag", type: "error" });
    } finally {
      setCreatingTag(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setCreatingCategory(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/categories/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (res.ok) {
        const newCategory = await res.json();
        setCategories((prev) => [...prev, newCategory]);
        setForm((prev) => ({
          ...prev,
          category: newCategory.id.toString(),
        }));
        setNewCategoryName("");
        setShowNewCategoryInput(false);
        setMessage({ text: "Category created successfully", type: "success" });
      } else {
        throw new Error("Failed to create category");
      }
    } catch (error) {
      setMessage({ text: "Error creating category", type: "error" });
    } finally {
      setCreatingCategory(false);
    }
  };

  function handleChange(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleTag(id: number) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(id)
        ? prev.tags.filter((tagId) => tagId !== id)
        : [...prev.tags, id],
    }));
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setForm({
      title: "",
      slug: "",
      category: "",
      tags: [],
      featured: false,
      published_at: new Date().toISOString().slice(0, 10),
      content: "",
      cover_image: "",
    });
    setMessage({ text: "Draft cleared", type: "success" });
  }

  const [authorSlug, setAuthorSlug] = useState("");

  useEffect(() => {
    if (!token) return;

    async function fetchCurrentAuthor() {
      try {
        const res = await fetch(`${API_BASE_URL}/authors/me/dashboard/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (res.ok) {
          const authorData = await res.json();
          setAuthorSlug(authorData.slug);
        }
      } catch (error) {
        console.error("Error fetching author data:", error);
      }
    }

    fetchCurrentAuthor();
  }, [token, API_BASE_URL]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setMessage({
        text: "You must be logged in to submit an article.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/articles/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          category: Number(form.category),
          tags: form.tags,
          featured: form.featured,
          published_at: form.published_at,
          content: form.content,
          cover_image: form.cover_image || null,
        }),
      });

      if (res.ok) {
        setMessage({
          text: "Article submitted successfully! Redirecting to dashboard...",
          type: "success",
        });
        localStorage.removeItem(DRAFT_KEY);

        setTimeout(() => {
          if (authorSlug) {
            router.push(`/admin/author/${authorSlug}`);
          } else {
            const userData = localStorage.getItem("userData");
            if (userData) {
              try {
                const parsed = JSON.parse(userData);
                if (parsed.author?.slug) {
                  router.push(`/admin/author/${parsed.author.slug}`);
                  return;
                }
              } catch (error) {
                console.error("Error parsing user data:", error);
              }
            }
            router.push("/articles");
          }
        }, 1500);
      } else {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }
    } catch (error: any) {
      setMessage({ text: "Error: " + error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
        <MinimalHeader />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
        <MinimalHeader />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="text-center max-w-md">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
              You need to be logged in to create articles.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting in {redirectCountdown} seconds...
            </p>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col bg-white dark:bg-[#0A0A0A] transition-colors relative overflow-x-hidden duration-300 ${
        fullscreen ? "overflow-hidden" : ""
      }`}
    >
      {!fullscreen && <MinimalHeader />}

      <main
        className={`${
          fullscreen
            ? "fixed inset-0 z-50 bg-white dark:bg-[#0A0A0A]"
            : "flex-grow w-full"
        }`}
      >
        <div
          className={`${
            fullscreen
              ? "h-full"
              : "max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-11 md:py-10"
          }`}
        >
          <div
            className={`${
              fullscreen
                ? "h-full"
                : "bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 md:p-8"
            }`}
          >
            {!fullscreen && (
              <div className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Write New Article
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Save className="w-4 h-4" />
                      {lastSaved ? (
                        <span>Draft auto-saved at {lastSaved}</span>
                      ) : (
                        <span>Draft will auto-save every 5 seconds</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={clearDraft}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium text-sm md:text-base"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Draft
                  </button>
                </div>

                {message && (
                  <div
                    className={`p-3 md:p-4 rounded-lg border mb-4 text-sm ${
                      message.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className={`${fullscreen ? "h-full" : "space-y-6"}`}
            >
              <div
                className={`${fullscreen ? "h-full flex flex-col" : "space-y-6"}`}
              >
                {!fullscreen && (
                  <>
                    {/* Article Title */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
                        <span>Title</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        required
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm md:text-base"
                        placeholder="Enter your article title"
                      />
                    </div>

                    {/* Slug Field */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
                        <Link className="w-4 h-4" />
                        <span>URL Slug</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.slug || ""}
                        onChange={(e) => handleChange("slug", e.target.value)}
                        required
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm md:text-base"
                        placeholder="URL will be auto-generated from title and date"
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Format: title-month-day-year
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {form.slug.length} characters
                        </p>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Final URL: /articles/{form.slug}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Category */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
                          <Folder className="w-4 h-4" />
                          <span>Category</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          <select
                            value={form.category}
                            onChange={(e) =>
                              handleChange("category", e.target.value)
                            }
                            required
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                          >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>

                          {!showNewCategoryInput ? (
                            <button
                              type="button"
                              onClick={() => setShowNewCategoryInput(true)}
                              className="w-full px-4 py-2 text-sm text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg border border-dashed border-sky-300 dark:border-sky-600 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Create New Category
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) =>
                                  setNewCategoryName(e.target.value)
                                }
                                placeholder="Enter new category name"
                                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              />
                              <button
                                type="button"
                                onClick={handleCreateCategory}
                                disabled={creatingCategory}
                                className="px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 text-sm font-medium flex items-center gap-1"
                              >
                                {creatingCategory ? (
                                  <>Creating...</>
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowNewCategoryInput(false)}
                                className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm flex items-center"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Published Date */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
                          <Calendar className="w-4 h-4" />
                          <span>Published Date</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={form.published_at}
                          onChange={(e) =>
                            handleChange("published_at", e.target.value)
                          }
                          required
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Defaults to today's date
                        </p>
                      </div>
                    </div>

                    {/* Tags Dropdown */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
                        <Tag className="w-4 h-4" />
                        <span>Tags</span>
                      </label>
                      <div className="space-y-2">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowTagDropdown(!showTagDropdown)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-left focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base flex items-center justify-between"
                          >
                            <span>
                              {form.tags.length > 0
                                ? `${form.tags.length} tags selected`
                                : "Select tags"}
                            </span>
                            <svg
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                showTagDropdown ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {showTagDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-auto">
                              {tags.map((tag) => (
                                <label
                                  key={tag.id}
                                  className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                                >
                                  <input
                                    type="checkbox"
                                    checked={form.tags.includes(tag.id)}
                                    onChange={() => toggleTag(tag.id)}
                                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                    {tag.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        {!showNewTagInput ? (
                          <button
                            type="button"
                            onClick={() => setShowNewTagInput(true)}
                            className="w-full px-4 py-2 text-sm text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg border border-dashed border-sky-300 dark:border-sky-600 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Create New Tag
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newTagName}
                              onChange={(e) => setNewTagName(e.target.value)}
                              placeholder="Enter new tag name"
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            <button
                              type="button"
                              onClick={handleCreateTag}
                              disabled={creatingTag}
                              className="px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 text-sm font-medium flex items-center gap-1"
                            >
                              {creatingTag ? (
                                <>Creating...</>
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowNewTagInput(false)}
                              className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm flex items-center"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {form.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {form.tags.map((tagId) => {
                            const tag = tags.find((t) => t.id === tagId);
                            return tag ? (
                              <span
                                key={tag.id}
                                className="bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-1"
                              >
                                {tag.name}
                                <button
                                  type="button"
                                  onClick={() => toggleTag(tag.id)}
                                  className="hover:text-sky-900 dark:hover:text-sky-200"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>

                    {/* Cover Image Upload */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
                        <Image className="w-4 h-4" />
                        <span>Cover Image</span>
                      </label>

                      {form.cover_image && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Current Cover Image:
                          </p>
                          <div className="relative w-32 h-32">
                            <img
                              src={form.cover_image}
                              alt="Cover preview"
                              className="w-full h-full object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                            />
                            <button
                              type="button"
                              onClick={() => handleChange("cover_image", "")}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleCoverImageUpload}
                            className="hidden"
                          />
                          <div className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 md:p-6 text-center hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-300">
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="w-6 h-6 md:w-8 md:h-8 text-gray-400 dark:text-gray-500" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Click to upload cover image
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                JPEG, PNG, GIF, WebP (max 5MB)
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>

                      {coverImageProgress > 0 && coverImageProgress < 100 && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>Uploading cover image...</span>
                            <span>{coverImageProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 md:h-2">
                            <div
                              className="bg-sky-600 h-1.5 md:h-2 rounded-full transition-all duration-300"
                              style={{ width: `${coverImageProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {coverImageError && (
                        <p className="text-red-600 dark:text-red-400 text-xs md:text-sm mt-1">
                          {coverImageError}
                        </p>
                      )}

                      <div className="mt-3">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Or use image URL:
                        </label>
                        <input
                          type="url"
                          value={form.cover_image}
                          onChange={(e) =>
                            handleChange("cover_image", e.target.value)
                          }
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 md:py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="https://example.com/cover-image.jpg"
                        />
                      </div>
                    </div>

                    {/* Featured Article Checkbox */}
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <input
                        id="featured"
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) =>
                          handleChange("featured", e.target.checked)
                        }
                        className="h-5 w-5 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="featured"
                        className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Mark as Featured Article
                      </label>
                    </div>
                  </>
                )}

                {/* Content Editor */}
                <div className={`${fullscreen ? "flex-grow flex flex-col" : ""}`}>
                  {!fullscreen && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <span>Content (Markdown)</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPreview(!showPreview)}
                          className="px-3 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          {showPreview ? "Hide Preview" : "Show Preview"}
                        </button>
                        <button
                          type="button"
                          onClick={handleEditorFullscreen}
                          className="px-3 py-2 border border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-gray-800 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                        >
                          {fullscreen ? (
                            <>
                              <Minimize2 className="w-4 h-4" />
                              Exit Fullscreen
                            </>
                          ) : (
                            <>
                              <Maximize2 className="w-4 h-4" />
                              Fullscreen
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  <div
                    ref={editorRef}
                    data-color-mode={isDarkMode ? "dark" : "light"}
                    className={`${fullscreen ? "h-full" : ""}`}
                  >
                    <MDEditor
                      value={form.content}
                      onChange={(val) => handleChange("content", val || "")}
                      height={fullscreen ? "100%" : 500}
                      preview={
                        fullscreen ? "edit" : showPreview ? "live" : "edit"
                      }
                      hideToolbar={false}
                      style={{
                        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                        color: isDarkMode ? '#f9fafb' : '#000000',
                      }}
                      textareaProps={{
                        placeholder: "Write your article content here...",
                        style: {
                          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                          color: isDarkMode ? '#f9fafb' : '#000000',
                        },
                      }}
                      previewOptions={{
                        style: {
                          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                          color: isDarkMode ? '#f9fafb' : '#000000',
                        },
                      }}
                      className={`${
                        fullscreen
                          ? "h-full rounded-none"
                          : "rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                      }`}
                      extraCommands={[
                        {
                          name: "fullscreen",
                          keyCommand: "fullscreen",
                          buttonProps: { "aria-label": "Toggle fullscreen" },
                          icon: fullscreen ? (
                            <Minimize2 className="w-4 h-4" />
                          ) : (
                            <Maximize2 className="w-4 h-4" />
                          ),
                          execute: (state, api) => {
                            handleEditorFullscreen({
                              preventDefault: () => {},
                            } as React.MouseEvent);
                          },
                        },
                      ]}
                    />
                  </div>
                </div>

                {!fullscreen && (
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="submit"
                      disabled={loading || coverImageUploading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Submit Article</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      {!fullscreen && <MinimalFooter />}
    </div>
  );
}