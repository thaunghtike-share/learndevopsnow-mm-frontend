"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from 'next/dynamic';
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
  Paperclip,
  FileText,
  X,
  Plus,
  Check,
  LinkIcon,
  Type,
  AlertTriangle,
  Sparkles,
  Eye,
  EyeOff,
  Clock,
  Layers,
  Hash,
  Shield,
  Edit,
  Star
} from "lucide-react";
import toast from "react-hot-toast";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false, loading: () => <div className="h-[600px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 animate-pulse"></div> }
);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="max-w-sm w-full mx-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                {message}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex-1 text-sm"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex-1 text-sm"
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
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="max-w-sm w-full mx-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Sparkles className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                {message}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex-1 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex-1 text-sm"
                >
                  Update Now
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
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [coverImageUploading, setCoverImageUploading] = useState(false);
  const [coverImageProgress, setCoverImageProgress] = useState(0);
  const [coverImageError, setCoverImageError] = useState<string | null>(null);

  const [contentImageUploading, setContentImageUploading] = useState(false);
  const [contentImageProgress, setContentImageProgress] = useState(0);
  const [contentImageError, setContentImageError] = useState<string | null>(
    null
  );

  const [newTagName, setNewTagName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [showContentImageAlert, setShowContentImageAlert] = useState(false);
  const [showCoverImageAlert, setShowCoverImageAlert] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
      setLoading(false);

      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);

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
    const loadData = async () => {
      if (token) {
        try {
          await fetchArticle();
        } catch (error) {
          console.error("Error loading article:", error);
          toast.error("Failed to load article");
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

  useEffect(() => {
    if (!token) return;
    const saveDraft = () => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      const time = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setLastSaved(time);
    };
    const interval = setInterval(saveDraft, SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [form, token]);

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

  const handleContentImageUpload = async () => {
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
        toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP, or SVG)");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
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

      const markdownImage = data.markdown || `![${pendingFile.name}](${data.url})`;

      const currentContent = form.content;

      const newContent =
        currentContent +
        (currentContent ? "\n\n" : "") +
        markdownImage +
        "\n";

      setForm((prev) => ({
        ...prev,
        content: newContent,
      }));

      toast.success("Image uploaded and inserted into editor!");

      setTimeout(() => {
        setContentImageProgress(0);
        setContentImageUploading(false);
      }, 1000);
    } catch (error: any) {
      setContentImageError(error.message);
      toast.error(`Upload failed: ${error.message}`);
      setContentImageProgress(0);
      setContentImageUploading(false);
    }
  };

  const handleCoverImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
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

      toast.success("Cover image uploaded successfully!");

      setTimeout(() => {
        setCoverImageProgress(0);
        setCoverImageUploading(false);
      }, 1000);
    } catch (error: any) {
      setCoverImageError(error.message);
      toast.error(`Upload failed: ${error.message}`);
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
        toast.success("Tag created successfully");
      } else {
        throw new Error("Failed to create tag");
      }
    } catch (error) {
      toast.error("Error creating tag");
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
        toast.success("Category created successfully");
      } else {
        throw new Error("Failed to create category");
      }
    } catch (error) {
      toast.error("Error creating category");
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
    toast.success("Draft cleared successfully");
  }

  const handleSubmitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      toast.error("Article title is required");
      return;
    }
    
    if (!form.category) {
      toast.error("Category is required");
      return;
    }
    
    if (!form.content.trim()) {
      toast.error("Article content is required");
      return;
    }
    
    if (!form.cover_image.trim()) {
      toast.error("Cover image is required");
      return;
    }
    
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowSubmitConfirm(false);
    
    if (!article) return;

    setLoading(true);
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
        toast.success("Article updated successfully!");
        localStorage.removeItem(DRAFT_KEY);
        setTimeout(() => {
          router.push(`/articles/${updatedArticle.slug}`);
        }, 1000);
      } else {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <MinimalHeader />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="text-center max-w-md">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Authentication Required
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
              You need to be logged in to edit articles.
            </p>
            <div className="bg-red-500 text-white px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">
                Redirecting in {redirectCountdown} seconds...
              </p>
            </div>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col py-10 bg-white dark:bg-gray-900">
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <MinimalHeader />

      <main className="flex-grow w-full">
        <div className="px-6 md:px-11 md:py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Edit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                    Edit Article
                  </h1>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                    <Clock className="w-4 h-4" />
                    {lastSaved ? (
                      <span>Draft saved at <span className="font-semibold text-green-600 dark:text-green-400">{lastSaved}</span></span>
                    ) : (
                      <span>Auto-saves every 5 seconds</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={clearDraft}
                  className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Draft
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  <Type className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <label className="text-base font-medium text-gray-800 dark:text-white">
                  Article Title <span className="text-red-500">*</span>
                </label>
              </div>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                placeholder="Enter your article title here..."
                className="w-full text-3xl md:text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                    <Layers className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </div>
                  <label className="text-base font-medium text-gray-800 dark:text-white">
                    Cover Image <span className="text-red-500">*</span>
                  </label>
                </div>
                {form.cover_image && (
                  <button
                    type="button"
                    onClick={() => handleChange("cover_image", "")}
                    className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>

              {form.cover_image ? (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <img
                      src={form.cover_image}
                      alt="Cover preview"
                      className="w-full h-auto max-h-[300px] object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <Upload className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        No cover image selected
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Upload a cover image (Required)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                  />
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                    <Upload className="w-4 h-4" />
                    Upload Cover Image
                  </div>
                </label>
                <input
                  type="url"
                  value={form.cover_image}
                  onChange={(e) =>
                    handleChange("cover_image", e.target.value)
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors mt-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Or enter image URL"
                />
              </div>

              {coverImageProgress > 0 && coverImageProgress < 100 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Uploading...</span>
                    <span>{coverImageProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
            </div>

            {contentImageUploading && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                    <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                    Uploading article image...
                  </span>
                  <span className="text-sm text-green-700 dark:text-green-300">{contentImageProgress}%</span>
                </div>
                <div className="w-full bg-green-200 dark:bg-green-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${contentImageProgress}%` }}
                  ></div>
                </div>
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
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        Article Content <span className="text-red-500">*</span>
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Edit your article here
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleContentImageUpload}
                      disabled={contentImageUploading}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
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
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      {showPreview ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Hide Preview
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Show Preview
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="data-color-mode" data-color-mode={isDarkMode ? "dark" : "light"}>
                  <MDEditor
                    value={form.content}
                    onChange={(val) => handleChange("content", val || "")}
                    height={600}
                    preview={showPreview ? "live" : "edit"}
                    hideToolbar={false}
                    style={{
                      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                      color: isDarkMode ? "#f9fafb" : "#000000",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                    }}
                    textareaProps={{
                      placeholder: "Write your article content here...",
                      style: {
                        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                        color: isDarkMode ? "#f9fafb" : "#000000",
                        fontSize: "16px",
                        lineHeight: "1.6",
                      },
                    }}
                    previewOptions={{
                      style: {
                        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                        color: isDarkMode ? "#f9fafb" : "#000000",
                        fontSize: "16px",
                        lineHeight: "1.6",
                      },
                    }}
                    className="rounded-lg"
                  />
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleSubmitClick}
                    disabled={
                      loading || coverImageUploading || contentImageUploading
                    }
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 text-base flex items-center justify-center gap-2 flex-1"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Update Article</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <Edit className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  Article Settings
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      URL Slug
                    </label>
                  </div>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="article-slug"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      /articles/{form.slug || "article-slug"}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Published Date
                    </label>
                  </div>
                  <input
                    type="date"
                    value={form.published_at}
                    onChange={(e) =>
                      handleChange("published_at", e.target.value)
                    }
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Folder className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <select
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      required
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="" className="text-gray-400">
                        Select category
                      </option>
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
                        className="w-full px-3 py-2 text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-dashed border-blue-300 transition-colors flex items-center justify-center gap-2"
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
                          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                        />
                        <button
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={creatingCategory}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm font-medium flex items-center"
                        >
                          {creatingCategory ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
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

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tags
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTagDropdown(!showTagDropdown)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-between"
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
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {tags.map((tag) => (
                            <label
                              key={tag.id}
                              className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            >
                              <input
                                type="checkbox"
                                checked={form.tags.includes(tag.id)}
                                onChange={() => toggleTag(tag.id)}
                                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
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
                        className="w-full px-3 py-2 text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-dashed border-blue-300 transition-colors flex items-center justify-center gap-2"
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
                          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                        />
                        <button
                          type="button"
                          onClick={handleCreateTag}
                          disabled={creatingTag}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm font-medium flex items-center"
                        >
                          {creatingTag ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
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
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                          >
                            {tag.name}
                            <button
                              type="button"
                              onClick={() => toggleTag(tag.id)}
                              className="hover:text-blue-900 dark:hover:text-blue-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      handleChange("featured", e.target.checked)
                    }
                    className="h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="featured"
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <Star className="w-4 h-4 text-amber-500" />
                    Mark as Featured Article
                  </label>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <MinimalFooter />

      <AlertDialog
        isOpen={showContentImageAlert}
        onClose={() => {
          setShowContentImageAlert(false);
          setPendingFile(null);
        }}
        onConfirm={confirmContentImageUpload}
        title="Upload Article Image"
        message="Are you sure you want to upload this image? It will be inserted at the cursor position in your article."
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
      />

      <ConfirmDialog
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={confirmSubmit}
        title="Update Article"
        message="Are you sure you want to update this article? The changes will be visible to all readers."
      />
    </div>
  );
}