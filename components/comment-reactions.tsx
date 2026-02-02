"use client";
import { useState, useEffect, useRef } from "react";
import {
  Heart,
  ThumbsUp,
  Sparkles,
  Lightbulb,
  Send,
  Reply,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  MessageSquare,
  Code,
  Upload,
  FileText,
  Download,
  Maximize2,
  Copy,
} from "lucide-react";
import { CodeBlockEditor } from "@/components/comment/CodeBlockEditor";
import { FileUploader } from "@/components/comment/FileUploader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/app/[locale]/auth/hooks/use-auth";
import Link from "next/link";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface Comment {
  id: number;
  content: string;
  display_content?: string;
  created_at: string;
  author_name: string;
  author_avatar?: string;
  author_slug?: string;
  anonymous_name: string;
  is_author: boolean;
  author_id?: number;
  replies: Comment[];
  code_snippet?: string;
  code_language?: string;
  has_attachment?: boolean;
  attachment_name?: string;
  attachment_type?: string;
  attachment_url?: string;
}

interface ReactionsSummary {
  like: number;
  love: number;
  celebrate: number;
  insightful: number;
}

interface CommentsReactionsProps {
  articleSlug: string;
  currentUser?: {
    isAuthenticated: boolean;
    authorSlug?: string;
  };
}

export function CommentsReactions({
  articleSlug,
  currentUser,
}: CommentsReactionsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<ReactionsSummary>({
    like: 0,
    love: 0,
    celebrate: 0,
    insightful: 0,
  });
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [loadingReaction, setLoadingReaction] = useState<string | null>(null);

  // Code and file upload states for NEW comment
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [codeToInsert, setCodeToInsert] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("");
  const [filesToAttach, setFilesToAttach] = useState<
    Array<{
      name: string;
      url: string;
      path: string;
      type: string;
    }>
  >([]);

  const { user, isAuthenticated } = useAuth();
  const [reactorNames, setReactorNames] = useState<{
    like: Array<{ name: string; avatar?: string; slug?: string }>;
    love: Array<{ name: string; avatar?: string; slug?: string }>;
    celebrate: Array<{ name: string; avatar?: string; slug?: string }>;
    insightful: Array<{ name: string; avatar?: string; slug?: string }>;
  }>({
    like: [],
    love: [],
    celebrate: [],
    insightful: [],
  });

  useEffect(() => {
    fetchComments();
    fetchReactions();
  }, [articleSlug]);

  const fetchReactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Token ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/articles/${articleSlug}/reactions/`,
        { headers },
      );

      if (response.ok) {
        const data = await response.json();
        setReactions({
          like: Number(data.summary?.like) || 0,
          love: Number(data.summary?.love) || 0,
          celebrate: Number(data.summary?.celebrate) || 0,
          insightful: Number(data.summary?.insightful) || 0,
        });

        if (data.user_reactions) {
          setUserReactions(data.user_reactions);
        }

        if (data.reactor_names) {
          setReactorNames(data.reactor_names);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reactions:", error);
    }
  };

  const ReactionButton = ({
    type,
    count,
    icon: Icon,
    isActive,
    onClick,
    isAuthenticated,
    onAuthRequired,
    reactorNames = [],
    isLoading = false,
  }: {
    type: string;
    count: number;
    icon: any;
    isActive: boolean;
    onClick: () => void;
    isAuthenticated: boolean;
    onAuthRequired: () => void;
    reactorNames?: Array<{ name: string; avatar?: string; slug?: string }>;
    isLoading?: boolean;
  }) => {
    const getReactionColor = (type: string) => {
      switch (type) {
        case "like":
          return "text-blue-600 dark:text-blue-400";
        case "love":
          return "text-rose-600 dark:text-rose-400";
        case "celebrate":
          return "text-amber-600 dark:text-amber-400";
        case "insightful":
          return "text-emerald-600 dark:text-emerald-400";
        default:
          return "text-gray-600 dark:text-gray-400";
      }
    };

    const handleClick = () => {
      if (!isAuthenticated || isLoading) {
        onAuthRequired();
        return;
      }
      onClick();
    };

    // Tooltip content with reactor names
    const getTooltipContent = () => {
      if (reactorNames.length === 0) {
        return "Be the first to react!";
      }

      return (
        <div className="max-w-xs">
          <div className="font-medium text-sm mb-2">
            {reactorNames.length}{" "}
            {reactorNames.length === 1 ? "person" : "people"} reacted
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {reactorNames.map((reactor, index) => (
              <div key={index} className="flex items-center gap-2">
                {reactor.avatar ? (
                  <img
                    src={reactor.avatar}
                    alt={reactor.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                    {reactor.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm truncate">{reactor.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="relative group">
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 relative ${
            isLoading
              ? "opacity-70 cursor-not-allowed"
              : isActive
                ? `${getReactionColor(type)} font-medium`
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          }`}
          title={
            !isAuthenticated
              ? "Sign in to react"
              : isLoading
                ? "Processing..."
                : ""
          }
        >
          {/* Loading spinner overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-xl">
              <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
            </div>
          )}

          <Icon className={`w-5 h-5 ${isLoading ? "opacity-50" : ""}`} />
          <span
            className={`text-xs font-medium ${isLoading ? "opacity-50" : ""}`}
          >
            {count}
          </span>
        </button>

        {/* Hover tooltip showing reactor names */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px]">
            {getTooltipContent()}
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-3 h-3 bg-white dark:bg-gray-900 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45"></div>
          </div>
        </div>
      </div>
    );
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/articles/${articleSlug}/comments/`,
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched comments:", data);
        setComments(data);
      } else {
        console.error("Failed to fetch comments:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  // Handle code insertion for new comment
  const handleInsertCode = (code: string, language: string) => {
    const formattedCode = `\`\`\`${language}\n${code}\n\`\`\``;
    setCodeToInsert(formattedCode);
    setCodeLanguage(language);
    setShowCodeEditor(false);
    toast.success("Code ready to insert!");
  };

  // Handle file upload for new comment
  const handleFileUpload = (fileInfo: {
    name: string;
    url: string;
    path: string;
    type: string;
  }) => {
    setFilesToAttach((prev) => [...prev, fileInfo]);
    setShowFileUploader(false);
    toast.success("File attached!");
  };

  // Remove attached file for new comment
  const removeAttachedFile = (index: number) => {
    setFilesToAttach((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReaction = async (reactionType: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const toastId = toast.loading(
      userReactions.includes(reactionType)
        ? "Removing reaction..."
        : "Adding reaction...",
    );

    setLoadingReaction(reactionType);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowAuthModal(true);
        setLoadingReaction(null);
        toast.dismiss(toastId);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/articles/${articleSlug}/reactions/${reactionType}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        },
      );

      if (response.ok) {
        await fetchReactions();
        toast.success(
          userReactions.includes(reactionType)
            ? `Removed ${reactionType} reaction`
            : `Added ${reactionType} reaction`,
          { id: toastId },
        );
      } else if (response.status === 401) {
        setShowAuthModal(true);
        await fetchReactions();
        toast.error("Please sign in again", { id: toastId });
      } else {
        await fetchReactions();
        toast.error("Failed to update reaction", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
      await fetchReactions();
      toast.error("Failed to add reaction", { id: toastId });
    } finally {
      setLoadingReaction(null);
    }
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const submitComment = async (
    content: string,
    parentId: number | null = null,
  ) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowAuthModal(true);
        return;
      }

      // Build final content
      let finalContent = content.trim();
      if (codeToInsert) {
        finalContent += (finalContent ? "\n\n" : "") + codeToInsert;
      }

      // If content is empty but we have file, add placeholder
      if (!finalContent && filesToAttach.length > 0) {
        finalContent = "📎 Attachment"; // This ensures content is NOT empty
      }

      // ALWAYS send content, never send empty string
      const requestBody: any = {
        content: finalContent || "Comment", // NEVER send empty string
      };

      // Add parent
      if (parentId) {
        requestBody.parent = parentId;
      }

      // Add code language
      if (codeLanguage) {
        requestBody.code_language = codeLanguage;
      }

      // Add attachment data
      if (filesToAttach.length > 0) {
        const file = filesToAttach[0];
        requestBody.attachment_name = file.name;
        requestBody.attachment_type = file.type;
        requestBody.attachment_cloud_path = file.path;
        requestBody.attachment_url = file.url;
      }

      console.log("SENDING:", requestBody);

      const response = await fetch(
        `${API_BASE_URL}/articles/${articleSlug}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (response.ok) {
        fetchComments();
        setNewComment("");
        setCodeToInsert("");
        setCodeLanguage("");
        setFilesToAttach([]);
        toast.success(parentId ? "Reply posted!" : "Comment posted!");
      } else {
        const errorText = await response.text();
        console.error("RAW ERROR:", errorText);

        if (response.status === 400) {
          toast.error("Please add some text or a file");
        } else if (response.status === 401) {
          setShowAuthModal(true);
          toast.error("Please sign in");
        } else {
          toast.error("Error posting comment");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (
    commentId: number,
    content: string,
    codeToInsert?: string,
    filesToAttach?: Array<{
      name: string;
      url: string;
      path: string;
      type: string;
    }>,
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowAuthModal(true);
        return;
      }

      let finalContent = content.trim();
      if (codeToInsert) {
        finalContent += (finalContent ? "\n\n" : "") + codeToInsert;
      }

      // Ensure content is not empty
      if (!finalContent && (!filesToAttach || filesToAttach.length === 0)) {
        toast.error("Please enter content");
        return;
      }

      const requestBody: any = {
        content: finalContent || "Updated comment",
      };

      // Add attachment data
      if (filesToAttach && filesToAttach.length > 0) {
        const file = filesToAttach[0];
        requestBody.attachment_name = file.name;
        requestBody.attachment_type = file.type;
        requestBody.attachment_cloud_path = file.path;
        requestBody.attachment_url = file.url;
      }

      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        fetchComments();
        toast.success("Comment updated!");
      } else if (response.status === 401) {
        setShowAuthModal(true);
      } else if (response.status === 403) {
        toast.error("You can only edit your own comments");
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update failed");
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowAuthModal(true);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        fetchComments();
        toast.success("Comment deleted!");
      } else if (response.status === 401) {
        setShowAuthModal(true);
      } else if (response.status === 403) {
        toast.error("You can only delete your own comments");
      } else {
        toast.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const isCommentOwner = (comment: Comment) => {
    return isAuthenticated && comment.author_id === user?.id;
  };

  // Render comment content with attachments
  const renderCommentContent = (content: string, comment?: Comment) => {
    if (!content) return "";

    const parts = [];
    let lastIndex = 0;
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      const language = match[1] || "text";
      const code = match[2];
      parts.push(
        <div key={match.index} className="my-2">
          <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-3 py-1 rounded-t text-xs">
            <span className="font-mono">{language}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                toast.success("Code copied!");
              }}
              className="hover:text-white flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-3 rounded-b overflow-x-auto text-sm font-mono">
            <code>{code}</code>
          </pre>
        </div>,
      );

      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    // Check for attachments
    if (comment?.has_attachment && comment?.attachment_url) {
      const isImage =
        comment.attachment_type === "image" ||
        comment.attachment_name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
        comment.attachment_url?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

      if (isImage) {
        parts.push(
          <div key="attachment-image" className="mt-3">
            <div className="relative group inline-block">
              <img
                src={comment.attachment_url}
                alt={comment.attachment_name || "Image attachment"}
                className="max-w-full max-h-96 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(comment.attachment_url, "_blank")}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {comment.attachment_name || "Image"}
            </p>
          </div>,
        );
      } else {
        const fileName = comment.attachment_name || "Download file";
        const fileExtension =
          fileName.split(".").pop()?.toUpperCase() || "FILE";

        parts.push(
          <div key="attachment-file" className="mt-3">
            <a
              href={comment.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {fileName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                    {fileExtension}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Click to download
                  </span>
                </div>
              </div>
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </a>
          </div>,
        );
      }
    }

    if (parts.length === 0) {
      return content.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ));
    }

    return parts.map((part, index) =>
      typeof part === "string" ? (
        <span key={index}>
          {part.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </span>
      ) : (
        part
      ),
    );
  };

  // CommentItem component with edit functionality
  const CommentItem: React.FC<{ comment: Comment; depth?: number }> = ({
    comment,
    depth = 0,
  }) => {
    const [showReplies, setShowReplies] = useState(true);
    const [localReplyContent, setLocalReplyContent] = useState("");
    const [isReplying, setIsReplying] = useState(false);

    // LOCAL STATE FOR EDITING (like your original working code)
    const [isEditing, setIsEditing] = useState(false);
    const [localEditContent, setLocalEditContent] = useState(
      comment.display_content || comment.content,
    );
    const [localEditCodeToInsert, setLocalEditCodeToInsert] = useState("");
    const [localEditFilesToAttach, setLocalEditFilesToAttach] = useState<
      Array<{
        name: string;
        url: string;
        path: string;
        type: string;
      }>
    >([]);

    const userOwnsComment = isCommentOwner(comment);
    const editTextareaRef = useRef<HTMLTextAreaElement>(null);
    const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

    // Start editing
    const handleStartEdit = () => {
      setIsEditing(true);
      setIsReplying(false);
      setLocalEditContent(comment.display_content || comment.content);
      setLocalEditCodeToInsert("");
      setLocalEditFilesToAttach([]);
      setTimeout(() => {
        editTextareaRef.current?.focus();
      }, 10);
    };

    // Cancel editing
    const handleCancelEdit = () => {
      setIsEditing(false);
      setLocalEditContent(comment.display_content || comment.content);
      setLocalEditCodeToInsert("");
      setLocalEditFilesToAttach([]);
    };

    // Handle code insertion for edit
    const handleEditInsertCode = (code: string, language: string) => {
      const formattedCode = `\`\`\`${language}\n${code}\n\`\`\``;
      setLocalEditCodeToInsert(formattedCode);
      toast.success("Code ready to insert!");
    };

    // Handle file upload for edit
    const handleEditFileUpload = (fileInfo: {
      name: string;
      url: string;
      path: string;
      type: string;
    }) => {
      setLocalEditFilesToAttach((prev) => [...prev, fileInfo]);
      toast.success("File attached!");
    };

    // Remove attached file for edit
    const removeEditAttachedFile = (index: number) => {
      setLocalEditFilesToAttach((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmitEdit = async () => {
      let finalContent = localEditContent.trim();
      if (localEditCodeToInsert) {
        finalContent += (finalContent ? "\n\n" : "") + localEditCodeToInsert;
      }

      // Ensure content is not empty
      if (!finalContent && localEditFilesToAttach.length === 0) {
        toast.error("Please enter content");
        return;
      }

      await updateComment(
        comment.id,
        finalContent,
        localEditCodeToInsert,
        localEditFilesToAttach,
      );
      setIsEditing(false);
    };

    const handleStartReply = () => {
      setIsReplying(true);
      setIsEditing(false);
      setTimeout(() => {
        replyTextareaRef.current?.focus();
      }, 10);
    };

    const handleCancelReply = () => {
      setIsReplying(false);
      setLocalReplyContent("");
    };

    const handleSubmitReply = async () => {
      if (!localReplyContent.trim()) {
        toast.error("Please enter a reply");
        return;
      }
      await submitComment(localReplyContent, comment.id);
      setIsReplying(false);
      setLocalReplyContent("");
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60),
      );

      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else if (diffInHours < 168) {
        return `${Math.floor(diffInHours / 24)}d ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    };

    return (
      <div
        className={`mb-4 ${
          depth > 0
            ? "ml-8 border-l-2 border-gray-100 dark:border-gray-700 pl-4"
            : ""
        }`}
      >
        <div className="flex items-start gap-3">
          <Link
            href={comment.author_slug ? `/authors/${comment.author_slug}` : "#"}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600"
          >
            {comment.author_avatar ? (
              <img
                src={comment.author_avatar}
                alt={comment.author_name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-full">
                {comment.author_name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={
                  comment.author_slug ? `/authors/${comment.author_slug}` : "#"
                }
                className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                {comment.author_name || "Anonymous"}
              </Link>
              {comment.is_author && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                  Author
                </span>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                • {formatDate(comment.created_at)}
              </span>
            </div>

            {isEditing ? (
              <div className="mb-4">
                <Textarea
                  ref={editTextareaRef}
                  placeholder="Edit your comment..."
                  value={localEditContent}
                  onChange={(e) => setLocalEditContent(e.target.value)}
                  className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 resize-none min-h-[100px] text-sm mb-3"
                  rows={3}
                />

                {/* Code and File Upload Buttons for Edit */}
                <div className="flex gap-2 mb-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Create a simple code editor modal for editing
                      const code = prompt(
                        "Enter code to insert (optional):",
                        "",
                      );
                      const language = prompt(
                        "Enter language (e.g., python, javascript):",
                        "text",
                      );
                      if (code) {
                        handleEditInsertCode(code, language || "text");
                      }
                    }}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Code className="w-4 h-4" />
                    Add Code
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // You can create a separate FileUploader for edit mode
                      toast.info(
                        "Use the main file uploader above to attach files",
                      );
                    }}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Upload className="w-4 h-4" />
                    Attach File
                  </Button>
                </div>

                {/* Show attached files preview for edit */}
                {localEditFilesToAttach.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Attached files:
                    </p>
                    {localEditFilesToAttach.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeEditAttachedFile(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="rounded-lg text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitEdit}
                    disabled={
                      !localEditContent.trim() &&
                      !localEditCodeToInsert &&
                      localEditFilesToAttach.length === 0
                    }
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed whitespace-pre-wrap">
                  {renderCommentContent(
                    comment.display_content || comment.content,
                    comment,
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Reply button */}
                  {isAuthenticated ? (
                    <button
                      onClick={handleStartReply}
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-1 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <Reply className="w-3 h-3" />
                      Reply
                    </button>
                  ) : (
                    <button
                      onClick={handleAuthRequired}
                      className="text-xs text-gray-400 cursor-not-allowed flex items-center gap-1 px-2 py-1"
                    >
                      <Reply className="w-3 h-3" />
                      Reply
                    </button>
                  )}

                  {/* Edit button (only for comment owner) */}
                  {userOwnsComment && !isEditing && (
                    <button
                      onClick={handleStartEdit}
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors flex items-center gap-1 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  )}

                  {/* Delete button (only for comment owner) */}
                  {userOwnsComment && (
                    <button
                      onClick={() => {
                        setCommentToDelete(comment.id);
                        setShowDeleteModal(true);
                      }}
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors flex items-center gap-1 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  )}

                  {/* Show replies toggle */}
                  {comment.replies && comment.replies.length > 0 && (
                    <button
                      onClick={() => setShowReplies(!showReplies)}
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-1 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      {showReplies ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                      <span className="font-medium">
                        {comment.replies.length}{" "}
                        {comment.replies.length === 1 ? "reply" : "replies"}
                      </span>
                    </button>
                  )}
                </div>
              </>
            )}

            {isReplying && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Reply className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Replying to {comment.author_name}
                  </span>
                </div>
                <textarea
                  ref={replyTextareaRef}
                  value={localReplyContent}
                  onChange={(e) => setLocalReplyContent(e.target.value)}
                  className="w-full mb-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 text-sm"
                  rows={2}
                  placeholder="Write your reply..."
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelReply}
                    className="rounded-lg text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitReply}
                    disabled={!localReplyContent.trim() || loading}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    {loading ? "Posting..." : "Post Reply"}
                  </Button>
                </div>
              </div>
            )}

            {showReplies && comment.replies && comment.replies.length > 0 && (
              <div className="mt-3">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Reactions Section */}
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
          How do you feel about this article?
        </h3>
        <div className="flex justify-center flex-wrap gap-3">
          <ReactionButton
            type="like"
            count={reactions.like}
            icon={ThumbsUp}
            isActive={userReactions.includes("like")}
            onClick={() => handleReaction("like")}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
            reactorNames={reactorNames.like}
            isLoading={loadingReaction === "like"}
          />

          <ReactionButton
            type="love"
            count={reactions.love}
            icon={Heart}
            isActive={userReactions.includes("love")}
            onClick={() => handleReaction("love")}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
            reactorNames={reactorNames.love}
            isLoading={loadingReaction === "love"}
          />

          <ReactionButton
            type="celebrate"
            count={reactions.celebrate}
            icon={Sparkles}
            isActive={userReactions.includes("celebrate")}
            onClick={() => handleReaction("celebrate")}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
            reactorNames={reactorNames.celebrate}
            isLoading={loadingReaction === "celebrate"}
          />

          <ReactionButton
            type="insightful"
            count={reactions.insightful}
            icon={Lightbulb}
            isActive={userReactions.includes("insightful")}
            onClick={() => handleReaction("insightful")}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
            reactorNames={reactorNames.insightful}
            isLoading={loadingReaction === "insightful"}
          />
        </div>
      </div>

      {/* Comments Section */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Comments
              </h3>
            </div>
          </div>
          {comments.length > 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllComments(!showAllComments)}
              className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs"
            >
              {showAllComments ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  Show All
                </>
              )}
            </Button>
          )}
        </div>

        {/* Comment Form */}
        <div className="mb-6">
          {isAuthenticated ? (
            <div className="space-y-3">
              <Textarea
                placeholder="What are your thoughts?"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 resize-none min-h-[100px] text-sm"
                rows={3}
              />

              {/* Code and File Upload Buttons */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCodeEditor(!showCodeEditor)}
                  className="flex items-center gap-1 text-xs"
                >
                  <Code className="w-4 h-4" />
                  Add Code
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFileUploader(!showFileUploader)}
                  className="flex items-center gap-1 text-xs"
                >
                  <Upload className="w-4 h-4" />
                  Attach File
                </Button>
              </div>

              {/* Show code editor when toggled */}
              {showCodeEditor && (
                <CodeBlockEditor
                  onCodeSubmit={handleInsertCode}
                  onCancel={() => setShowCodeEditor(false)}
                />
              )}

              {/* Show file uploader when toggled */}
              {showFileUploader && (
                <FileUploader
                  onFileUpload={handleFileUpload}
                  onCancel={() => setShowFileUploader(false)}
                />
              )}

              {/* Show attached files preview */}
              {filesToAttach.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Attached files:
                  </p>
                  {filesToAttach.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeAttachedFile(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={() => submitComment(newComment)}
                  disabled={
                    (!newComment.trim() &&
                      !codeToInsert &&
                      filesToAttach.length === 0) ||
                    loading
                  }
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Sign in to join the conversation
              </p>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In to Comment
              </Button>
            </div>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {displayedComments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isAuthenticated
                  ? "Be the first to share your thoughts!"
                  : "Sign in to be the first to comment!"}
              </p>
            </div>
          ) : (
            <>
              {displayedComments.map((comment) => (
                <div
                  key={comment.id}
                  className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                >
                  <CommentItem comment={comment} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Delete Comment
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCommentToDelete(null);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
              Are you sure you want to delete this comment?
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-6 text-center">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCommentToDelete(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (commentToDelete) {
                    await deleteComment(commentToDelete);
                  }
                  setShowDeleteModal(false);
                  setCommentToDelete(null);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Sign In Required
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
              Please sign in to react to articles and leave comments.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-6 text-center">
              Join our community of readers and share your thoughts!
            </p>
            <Button
              onClick={() => setShowAuthModal(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg"
            >
              Got it, I'll sign in
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
