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
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/app/[locale]/auth/hooks/use-auth";
import Link from "next/link";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface Comment {
  id: number;
  content: string;
  created_at: string;
  author_name: string;
  author_avatar?: string;
  author_slug?: string;
  anonymous_name: string;
  is_author: boolean;
  author_id?: number;
  replies: Comment[];
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

const ReactionButton = ({
  type,
  count,
  icon: Icon,
  isActive,
  onClick,
  isAuthenticated,
  onAuthRequired,
  reactorNames = [], // Add this prop
}: {
  type: string;
  count: number;
  icon: any;
  isActive: boolean;
  onClick: () => void;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
  reactorNames?: Array<{ name: string; avatar?: string; slug?: string }>; // Add this
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
    if (!isAuthenticated) {
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
        className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 ${
          isActive
            ? `${getReactionColor(type)} font-medium`
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
        title={!isAuthenticated ? "Sign in to react" : ""}
      >
        <Icon className="w-5 h-5" />
        <span className="text-xs font-medium">{count}</span>
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
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
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

  // In your CommentsReactions component, update the fetchReactions function:
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
        { headers }
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

        // Store reactor names
        if (data.reactor_names) {
          setReactorNames(data.reactor_names);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reactions:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/articles/${articleSlug}/comments/`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleReaction = async (reactionType: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowAuthModal(true);
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
        }
      );

      if (response.ok) {
        fetchReactions();
        toast.success("Reaction updated!");
      } else if (response.status === 401) {
        setShowAuthModal(true);
      }
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
      toast.error("Failed to add reaction");
    }
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const submitComment = async (
    content: string,
    parentId: number | null = null
  ) => {
    if (!content.trim()) {
      toast.error("Please enter a comment");
      return;
    }

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

      const response = await fetch(
        `${API_BASE_URL}/articles/${articleSlug}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            content: content.trim(),
            parent: parentId,
          }),
        }
      );

      if (response.ok) {
        fetchComments();
        if (parentId) {
          toast.success("Reply posted!");
        } else {
          setNewComment("");
          toast.success("Comment posted!");
        }
      } else if (response.status === 401) {
        setShowAuthModal(true);
      } else {
        toast.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    toast.custom(
      (t) => (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Delete Comment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This action cannot be undone
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => toast.dismiss(t)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                toast.dismiss(t);
                try {
                  const token = localStorage.getItem("token");
                  if (!token) {
                    setShowAuthModal(true);
                    return;
                  }

                  const response = await fetch(
                    `${API_BASE_URL}/comments/${commentId}/`,
                    {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                      },
                    }
                  );

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
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const updateComment = async (commentId: number, content: string) => {
    if (!content.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowAuthModal(true);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
        }),
      });

      if (response.ok) {
        setEditingComment(null);
        setEditContent("");
        fetchComments();
        toast.success("Comment updated!");
      } else if (response.status === 401) {
        setShowAuthModal(true);
      } else if (response.status === 403) {
        toast.error("You can only edit your own comments");
      } else {
        toast.error("Failed to update comment");
      }
    } catch (error) {
      console.error("Failed to update comment:", error);
      toast.error("Failed to update comment");
    }
  };

  const isCommentOwner = (comment: Comment) => {
    return isAuthenticated && comment.author_id === user?.id;
  };

  interface CommentItemProps {
    comment: Comment;
    depth?: number;
  }

  const CommentItem: React.FC<CommentItemProps> = ({ comment, depth = 0 }) => {
    const [showReplies, setShowReplies] = useState(true);
    const [localEditContent, setLocalEditContent] = useState(comment.content);
    const [localReplyContent, setLocalReplyContent] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const userOwnsComment = isCommentOwner(comment);
    const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
    const editTextareaRef = useRef<HTMLTextAreaElement>(null);

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

    const handleDelete = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setShowAuthModal(true);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/comments/${comment.id}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );

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

    const confirmDelete = () => {
      console.log("confirmDelete function called");

      // Simple window.confirm approach that always works
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this comment? This action cannot be undone."
      );

      if (shouldDelete) {
        console.log("User confirmed deletion, calling handleDelete");
        handleDelete();
      } else {
        console.log("User cancelled deletion");
      }
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

    const handleStartEdit = () => {
      setIsEditing(true);
      setIsReplying(false);
      setTimeout(() => {
        editTextareaRef.current?.focus();
      }, 10);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
      setLocalEditContent(comment.content);
    };

    const handleSubmitEdit = async () => {
      if (!localEditContent.trim()) {
        toast.error("Please enter a comment");
        return;
      }
      await updateComment(comment.id, localEditContent);
      setIsEditing(false);
    };

    const getAvatarColor = (name: string) => {
      const colors = [
        "bg-gradient-to-br from-red-500 to-pink-500",
        "bg-gradient-to-br from-blue-500 to-cyan-500",
        "bg-gradient-to-br from-green-500 to-emerald-500",
        "bg-gradient-to-br from-purple-500 to-indigo-500",
      ];
      const index = name.charCodeAt(0) % colors.length;
      return colors[index];
    };

    const initial = comment.author_name?.charAt(0)?.toUpperCase() || "A";
    const avatarColor = getAvatarColor(comment.author_name || "Anonymous");
    const authorProfileLink = comment.author_slug
      ? `/authors/${comment.author_slug}`
      : "#";

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
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
            href={authorProfileLink}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 ${
              comment.author_avatar ? "bg-transparent" : avatarColor
            }`}
          >
            {comment.author_avatar ? (
              <img
                src={comment.author_avatar}
                alt={comment.author_name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${avatarColor} rounded-full`}
              >
                {initial}
              </div>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={authorProfileLink}
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
              <div className="mb-3">
                <Textarea
                  ref={editTextareaRef}
                  value={localEditContent}
                  onChange={(e) => setLocalEditContent(e.target.value)}
                  className="mb-2 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSubmitEdit}
                    disabled={!localEditContent.trim()}
                    className="rounded-lg text-xs"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="rounded-lg text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
                {comment.content}
              </p>
            )}

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
                    console.log("Setting comment to delete:", comment.id);
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
                <Textarea
                  ref={replyTextareaRef}
                  value={localReplyContent}
                  onChange={(e) => setLocalReplyContent(e.target.value)}
                  className="mb-3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
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
            reactorNames={reactorNames.like} // Pass reactor names
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
                comments
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
              <div className="flex justify-end">
                <Button
                  onClick={() => submitComment(newComment)}
                  disabled={!newComment.trim() || loading}
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
                      console.log("Deleting comment:", commentToDelete);
                      try {
                        const token = localStorage.getItem("token");
                        if (!token) {
                          setShowAuthModal(true);
                          setShowDeleteModal(false);
                          return;
                        }

                        const response = await fetch(
                          `${API_BASE_URL}/comments/${commentToDelete}/`,
                          {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Token ${token}`,
                            },
                          }
                        );

                        console.log("Delete response status:", response.status);

                        if (response.ok) {
                          fetchComments();
                          toast.success("Comment deleted!");
                        } else if (response.status === 401) {
                          setShowAuthModal(true);
                          toast.error("Please sign in again");
                        } else if (response.status === 403) {
                          toast.error("You can only delete your own comments");
                        } else {
                          toast.error("Failed to delete comment");
                        }
                      } catch (error) {
                        console.error("Failed to delete comment:", error);
                        toast.error("Failed to delete comment");
                      }
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
      </div>

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
