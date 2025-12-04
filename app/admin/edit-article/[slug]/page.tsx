"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import {
  Save,
  Image as ImageIcon,
  Calendar,
  Tag,
  Folder,
  Upload,
  Trash2,
  Maximize2,
  Minimize2,
  Paperclip,
  FileText,
  Eye,
  X,
  Plus,
  Check,
  LinkIcon,
  Type,
  AlertCircle,
  AlertTriangle,
  Info,
  Zap,
} from "lucide-react";

interface Article {
  slug: string;
  title: string;
  content: string;
  published_at: string;
  category: number;
  tags: number[];
  featured: boolean;
  cover_image: string;
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const DRAFT_KEY = "edit-article-draft";
const SAVE_INTERVAL = 5000;

// Alert Dialog Component
const AlertDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Upload",
  cancelText = "Cancel",
  type = "info",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "warning" | "error";
}) => {
  if (!isOpen) return null;

  const bgColor = {
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    warning: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  };

  const iconColor = {
    info: "text-blue-600 dark:text-blue-400",
    warning: "text-orange-600 dark:text-orange-400",
    error: "text-red-600 dark:text-red-400",
  };

  const Icon = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`max-w-md w-full mx-4 rounded-xl border ${bgColor[type]} shadow-2xl`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 ${iconColor[type]}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {message}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium flex-1"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium flex-1"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirm Dialog Component
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Update",
  cancelText = "Cancel",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="max-w-md w-full mx-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-sky-600 dark:text-sky-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {message}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium flex-1"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-colors font-medium flex-1"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [token, setToken] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [articleLoading, setArticleLoading] = useState(false);
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
  const [article, setArticle] = useState<Article | null>(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [coverImageUploading, setCoverImageUploading] = useState(false);
  const [coverImageProgress, setCoverImageProgress] = useState(0);
  const [coverImageError, setCoverImageError] = useState<string | null>(null);

  // Article content image upload states
  const [contentImageUploading, setContentImageUploading] = useState(false);
  const [contentImageProgress, setContentImageProgress] = useState(0);
  const [contentImageError, setContentImageError] = useState<string | null>(
    null
  );

  // New state for creating tags/categories
  const [newTagName, setNewTagName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Alert and Confirm Dialogs
  const [showContentImageAlert, setShowContentImageAlert] = useState(false);
  const [showCoverImageAlert, setShowCoverImageAlert] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Auto-dismiss message timeout
  useEffect(() => {
    if (message) {
      const timeout = message.type === "success" ? 3000 : 5000;
      const timer = setTimeout(() => {
        setMessage(null);
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Check for dark mode on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
      setLoading(false);

      // Check for dark mode
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);

      // Observe for dark mode changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            const isDark = document.documentElement.classList.contains("dark");
            setIsDarkMode(isDark);
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }
  }, []);

  // Auto-redirect if not logged in
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

  // Fetch article when token changes
  useEffect(() => {
    const loadData = async () => {
      if (token) {
        try {
          await fetchArticle();
        } catch (error) {
          console.error("Error loading article:", error);
          setMessage({ text: "Failed to load article", type: "error" });
        }
      }
    };

    loadData();
  }, [token]);

  const fetchArticle = async () => {
    setArticleLoading(true);
    try {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const res = await fetch(`${API_BASE_URL}/articles/${slug}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch article: ${res.status}`);
      }

      const articleData: Article = await res.json();
      setArticle(articleData);
      setForm({
        title: articleData.title,
        slug: articleData.slug,
        category: articleData.category.toString(),
        tags: articleData.tags,
        featured: articleData.featured,
        published_at: articleData.published_at.slice(0, 10),
        content: articleData.content,
        cover_image: articleData.cover_image || "",
      });
    } catch (error) {
      console.error("Error in fetchArticle:", error);
      throw error;
    } finally {
      setArticleLoading(false);
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (!token) return;
    const saveDraft = () => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setLastSaved(new Date().toLocaleTimeString());
    };
    const interval = setInterval(saveDraft, SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [form, token]);

  // Fetch categories and tags
  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch(`${API_BASE_URL}/categories/`),
          fetch(`${API_BASE_URL}/tags/`),
        ]);
        if (!catRes.ok) throw new Error("Failed to fetch categories");
        if (!tagRes.ok) throw new Error("Failed to fetch tags");

        const catData = await catRes.json();
        const tagData = await tagRes.json();

        setCategories(Array.isArray(catData) ? catData : catData.results || []);
        setTags(Array.isArray(tagData) ? tagData : tagData.results || []);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      }
    }
    fetchData();
  }, []);

  // Handle article content image upload
  const handleContentImageUpload = async () => {
    // Create a hidden file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept =
      "image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];

      if (!allowedTypes.includes(file.type)) {
        setMessage({
          text: "Please select a valid image file (JPEG, PNG, GIF, WebP, or SVG)",
          type: "error",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setMessage({
          text: "File size must be less than 10MB",
          type: "error",
        });
        return;
      }

      setPendingFile(file);
      setShowContentImageAlert(true);
    };

    input.click();
  };

  const confirmContentImageUpload = async () => {
    if (!pendingFile) return;
    setShowContentImageAlert(false);

    setContentImageUploading(true);
    setContentImageError(null);
    setContentImageProgress(10);

    try {
      const formData = new FormData();
      formData.append("image", pendingFile);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      setContentImageProgress(30);

      // Upload article content image
      const response = await fetch(`${API_BASE_URL}/upload-article-image/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      setContentImageProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Image upload failed");
      }

      const data = await response.json();

      setContentImageProgress(100);

      // Insert the Markdown image syntax at cursor position
      const markdownImage = data.markdown || `![${pendingFile.name}](${data.url})`;

      // Insert at current cursor position or at the end
      const currentContent = form.content;

      // For simplicity, insert at the end with line breaks
      const newContent =
        currentContent +
        (currentContent ? "\n\n" : "") +
        markdownImage +
        "\n";

      setForm((prev) => ({
        ...prev,
        content: newContent,
      }));

      setMessage({
        text: "✅ Image uploaded and inserted into editor!",
        type: "success",
      });

      setTimeout(() => {
        setContentImageProgress(0);
        setContentImageUploading(false);
      }, 1000);
    } catch (error: any) {
      setContentImageError(error.message);
      setMessage({
        text: `Upload failed: ${error.message}`,
        type: "error",
      });
      setContentImageProgress(0);
      setContentImageUploading(false);
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = (
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

    setPendingFile(file);
    setShowCoverImageAlert(true);
  };

  const confirmCoverImageUpload = async () => {
    if (!pendingFile) return;
    setShowCoverImageAlert(false);

    setCoverImageUploading(true);
    setCoverImageError(null);
    setCoverImageProgress(10);

    try {
      const formData = new FormData();
      formData.append("cover_image", pendingFile);

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

      setMessage({
        text: "✅ Cover image uploaded successfully!",
        type: "success",
      });

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

  // Create new tag
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

  // Create new category
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
    setMessage({ text: "Draft cleared", type: "success" });
  }

  // Custom fullscreen handler for MDEditor
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

  const handleSubmitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.title.trim()) {
      setMessage({ text: "Article title is required", type: "error" });
      return;
    }
    
    if (!form.category) {
      setMessage({ text: "Category is required", type: "error" });
      return;
    }
    
    if (!form.content.trim()) {
      setMessage({ text: "Article content is required", type: "error" });
      return;
    }
    
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowSubmitConfirm(false);
    
    if (!article) return;

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/articles/${article.slug}/`, {
        method: "PUT",
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
        const updatedArticle = await res.json();
        setMessage({
          text: "Article updated successfully!",
          type: "success",
        });
        localStorage.removeItem(DRAFT_KEY);
        router.push(`/articles/${updatedArticle.slug}`);
      } else {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }
    } catch (error: any) {
      setMessage({ text: "Error: " + error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Show redirect message if not authenticated
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#000000] transition-colors duration-300">
        <MinimalHeader />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="text-center max-w-md">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
              You need to be logged in to edit articles.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to home page in {redirectCountdown} seconds...
            </p>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col py-10 bg-white dark:bg-[#000000] transition-colors duration-300">
        <MinimalHeader />
        <main className="flex-grow flex items-center justify-center px-4 md:py-20">
          <div className="text-center mt-24 mb-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col bg-white dark:bg-[#000000] transition-colors duration-300 overflow-x-hidden ${
        fullscreen ? "overflow-hidden" : ""
      }`}
    >
      {!fullscreen && <MinimalHeader />}

      <main
        className={`${
          fullscreen
            ? "fixed inset-0 z-50 bg-white dark:bg-[#000000]"
            : "flex-grow w-full"
        }`}
      >
        <div
          className={`${
            fullscreen
              ? "h-full"
              : "px-6 md:px-11 md:py-5 grid grid-cols-1 lg:grid-cols-4 gap-8"
          }`}
        >
          {/* Main Content Area - 3 columns on desktop */}
          <div className="lg:col-span-3 space-y-8">
            {/* Page Title and Auto-save Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-medium text-black dark:text-white">
                  Article Editor
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <FileText className="w-4 h-4" />
                  {lastSaved ? (
                    <span>Draft auto-saved at {lastSaved}</span>
                  ) : (
                    <span>Draft will auto-save every 5 seconds</span>
                  )}
                </div>
              </div>

              {/* Top Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={clearDraft}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:shadow-lg hover:bg-red-700 transition-all duration-300 font-medium text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Draft
                </button>
              </div>
            </div>

            {/* Article Title Input */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <label className="text-base font-medium text-black dark:text-white">
                  Article Title
                </label>
              </div>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                placeholder="Enter your article title here..."
                className="w-full text-3xl md:text-4xl font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Cover Image Preview */}
            {form.cover_image && (
              <div className="overflow-hidden rounded-lg">
                <div className="relative group">
                  <img
                    src={form.cover_image}
                    alt="Cover preview"
                    className="w-full h-auto max-h-[400px] object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange("cover_image", "")}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Content Image Upload Progress */}
            {contentImageUploading && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex justify-between text-sm text-green-700 dark:text-green-300 mb-2">
                  <span className="flex items-center gap-2">
                    <div className="animate-spin h-3 w-3 border-2 border-green-500 border-t-transparent rounded-full"></div>
                    Uploading article image...
                  </span>
                  <span>{contentImageProgress}%</span>
                </div>
                <div className="w-full bg-green-200 dark:bg-green-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${contentImageProgress}%` }}
                  ></div>
                </div>
                {contentImageError && (
                  <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                    {contentImageError}
                  </p>
                )}
              </div>
            )}

            {articleLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Loading Article
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Preparing your content for editing...
                </p>
              </div>
            ) : !article ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Article Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  The article you're looking for doesn't exist.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className={`${fullscreen ? "h-full flex flex-col" : ""}`}>
                <div
                  className={`${fullscreen ? "flex-grow flex flex-col" : ""}`}
                >
                  {/* Editor Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-black dark:text-white">
                      <span>Article Content</span>
                      <span className="text-red-500">*</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* Upload Article Image Button */}
                      <button
                        type="button"
                        onClick={handleContentImageUpload}
                        disabled={contentImageUploading}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:shadow-lg hover:bg-yellow-700 transition-all duration-300 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                      >
                        {contentImageUploading ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-4 h-4" />
                            Upload Image
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        {showPreview ? "Hide Preview" : "Show Preview"}
                      </button>
                      <button
                        type="button"
                        onClick={handleEditorFullscreen}
                        className="px-4 py-2 border border-sky-500 text-white dark:text-sky-400 bg-sky-600 dark:bg-gray-800 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-300 text-sm font-medium flex items-center gap-2"
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

                  {/* Editor */}
                  <div
                    ref={editorRef}
                    data-color-mode={isDarkMode ? "dark" : "light"}
                    className={`${fullscreen ? "h-full" : ""}`}
                  >
                    <MDEditor
                      value={form.content}
                      onChange={(val) => handleChange("content", val || "")}
                      height={fullscreen ? "100%" : 600}
                      preview={
                        fullscreen ? "edit" : showPreview ? "live" : "edit"
                      }
                      hideToolbar={false}
                      style={{
                        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                        color: isDarkMode ? "#f9fafb" : "#000000",
                      }}
                      textareaProps={{
                        placeholder: "Write your article content here...",
                        style: {
                          backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                          color: isDarkMode ? "#f9fafb" : "#000000",
                        },
                      }}
                      previewOptions={{
                        style: {
                          backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                          color: isDarkMode ? "#f9fafb" : "#000000",
                        },
                      }}
                      className={`${
                        fullscreen
                          ? "h-full rounded-none"
                          : "rounded-lg"
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
                        {
                          name: "upload-image",
                          keyCommand: "uploadImage",
                          buttonProps: {
                            "aria-label": "Upload image",
                            title: "Upload image from computer",
                            disabled: contentImageUploading,
                          },
                          icon: contentImageUploading ? (
                            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                          ) : (
                            <Paperclip className="w-4 h-4" />
                          ),
                          execute: () => {
                            handleContentImageUpload();
                          },
                        },
                      ]}
                    />
                  </div>

                  {/* Submit Button */}
                  {!fullscreen && (
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={handleSubmitClick}
                        disabled={
                          loading ||
                          coverImageUploading ||
                          contentImageUploading
                        }
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:shadow-lg hover:bg-blue-700 focus:outline-none transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex items-center justify-center gap-2 flex-1"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Update Article</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 1 column on desktop */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Article Settings Card */}
            <div className="space-y-6">
              <div>
                {/* Slug Input - Editable */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <LinkIcon className="w-4 h-4" />
                      <span>URL Slug</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="article-slug"
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    /articles/{form.slug || "article-slug"}
                  </p>
                </div>

                {/* Published Date */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>Published Date</span>
                  </div>
                  <input
                    type="date"
                    value={form.published_at}
                    onChange={(e) =>
                      handleChange("published_at", e.target.value)
                    }
                    required
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Folder className="w-4 h-4" />
                    <span>Category</span>
                  </div>
                  <div className="space-y-2">
                    <select
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      required
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
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
                        className="w-full px-3 py-2 text-sm text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg border border-dashed border-sky-300 dark:border-sky-600 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        New Category
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Category name"
                          className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={creatingCategory}
                          className="px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 text-sm font-medium flex items-center gap-1"
                        >
                          {creatingCategory ? (
                            <>...</>
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewCategoryInput(false)}
                          className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm flex items-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Tag className="w-4 h-4" />
                    <span>Tags</span>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTagDropdown(!showTagDropdown)}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-left focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm flex items-center justify-between"
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
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {tags.map((tag) => (
                            <label
                              key={tag.id}
                              className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
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
                        className="w-full px-3 py-2 text-sm text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg border border-dashed border-sky-300 dark:border-sky-600 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        New Tag
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="Tag name"
                          className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={handleCreateTag}
                          disabled={creatingTag}
                          className="px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 text-sm font-medium flex items-center gap-1"
                        >
                          {creatingTag ? (
                            <>...</>
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewTagInput(false)}
                          className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm flex items-center"
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
                            className="bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300 text-xs px-2 py-1 rounded-full flex items-center gap-1"
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
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <ImageIcon className="w-4 h-4" />
                    <span>Cover Image</span>
                  </div>

                  <div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                      />
                      <div className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-300">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Upload Cover Image
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            JPEG, PNG, GIF, WebP
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>

                  {coverImageProgress > 0 && coverImageProgress < 100 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Uploading...</span>
                        <span>{coverImageProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${coverImageProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {coverImageError && (
                    <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                      {coverImageError}
                    </p>
                  )}

                  <div className="mt-3">
                    <input
                      type="url"
                      value={form.cover_image}
                      onChange={(e) =>
                        handleChange("cover_image", e.target.value)
                      }
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Or enter image URL"
                    />
                  </div>
                </div>

                {/* Featured Article Checkbox */}
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
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
              </div>
            </div>
          </aside>
        </div>
      </main>

      {!fullscreen && <MinimalFooter />}

      {/* Toast Notification */}
      {message && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-xl max-w-sm border ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === "success" ? (
                <Check className="w-5 h-5 flex-shrink-0" />
              ) : (
                <X className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Alert and Confirm Dialogs */}
      <AlertDialog
        isOpen={showContentImageAlert}
        onClose={() => {
          setShowContentImageAlert(false);
          setPendingFile(null);
        }}
        onConfirm={confirmContentImageUpload}
        title="Upload Article Image"
        message="Are you sure you want to upload this image? It will be inserted at the cursor position in your article."
        confirmText="Upload Image"
        type="info"
      />

      <AlertDialog
        isOpen={showCoverImageAlert}
        onClose={() => {
          setShowCoverImageAlert(false);
          setPendingFile(null);
        }}
        onConfirm={confirmCoverImageUpload}
        title="Upload Cover Image"
        message="Are you sure you want to upload this image as your article cover?"
        confirmText="Upload Cover"
        type="info"
      />

      <ConfirmDialog
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={confirmSubmit}
        title="Update Article"
        message="Are you sure you want to update this article? The changes will be visible to all readers."
        confirmText="Update Now"
      />
    </div>
  );
}