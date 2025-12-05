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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/app/auth/hooks/use-auth";
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
}: {
  type: string;
  count: number;
  icon: any;
  isActive: boolean;
  onClick: () => void;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
}) => {
  const getReactionColor = (type: string) => {
    switch (type) {
      case "like":
        return "text-blue-600 dark:text-blue-400";
      case "love":
        return "text-red-600 dark:text-red-400";
      case "celebrate":
        return "text-yellow-600 dark:text-yellow-400";
      case "insightful":
        return "text-green-600 dark:text-green-400";
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

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2.5 transition-all duration-200 ${
        isActive
          ? `${getReactionColor(type)} font-medium`
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      }`}
      title={!isAuthenticated ? "Sign in to react" : ""}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{count}</span>
    </button>
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
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

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
          setReplyContent("");
          setReplyTo(null);
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
    const userOwnsComment = isCommentOwner(comment);
    const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
    const editTextareaRef = useRef<HTMLTextAreaElement>(null);

    // Use local state for reply content instead of global state
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

    return (
      <div className={`mb-4 ${depth > 0 ? "ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4" : ""}`}>
        <div className="flex items-start gap-3">
          <Link
            href={authorProfileLink}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 ${
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
              <div className={`w-full h-full flex items-center justify-center ${avatarColor} rounded-full`}>
                {initial}
              </div>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
              <Link
                href={authorProfileLink}
                className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {comment.author_name || "Anonymous"}
              </Link>
              <div className="flex items-center gap-2">
                {comment.is_author && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full">
                    Author
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {isEditing ? (
              <div className="mb-3">
                <Textarea
                  ref={editTextareaRef}
                  value={localEditContent}
                  onChange={(e) => setLocalEditContent(e.target.value)}
                  className="mb-2 rounded-lg resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSubmitEdit}
                    disabled={!localEditContent.trim()}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                {comment.content}
              </p>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              {isAuthenticated ? (
                <button
                  onClick={handleStartReply}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-1"
                >
                  <Reply className="w-3 h-3" />
                  Reply
                </button>
              ) : (
                <button
                  onClick={handleAuthRequired}
                  className="text-xs text-gray-400 cursor-not-allowed flex items-center gap-1"
                >
                  <Reply className="w-3 h-3" />
                  Reply
                </button>
              )}

              {userOwnsComment && !isEditing && (
                <button
                  onClick={handleStartEdit}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-1"
                >
                  {showReplies ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                  {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </button>
              )}
            </div>

            {isReplying && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Textarea
                  ref={replyTextareaRef}
                  value={localReplyContent}
                  onChange={(e) => setLocalReplyContent(e.target.value)}
                  className="mb-2 rounded-lg"
                  rows={2}
                  placeholder="Write your reply..."
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelReply}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitReply}
                    disabled={!localReplyContent.trim() || loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? "Posting..." : "Post Reply"}
                  </Button>
                </div>
              </div>
            )}

            {showReplies && comment.replies && comment.replies.length > 0 && (
              <div className="mt-3">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Reactions Section */}
      <div className="text-center p-4 md:p-6">
        <div className="flex justify-center flex-wrap gap-2">
          <ReactionButton
            type="like"
            count={reactions.like}
            icon={ThumbsUp}
            isActive={userReactions.includes("like")}
            onClick={() => handleReaction("like")}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
          />
          <ReactionButton
            type="love"
            count={reactions.love}
            icon={Heart}
            isActive={userReactions.includes("love")}
            onClick={() => handleReaction("love")}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
          />
          <ReactionButton
            type="celebrate"
            count={reactions.celebrate}
            icon={Sparkles}
            isActive={userReactions.includes("celebrate")}
            onClick={() => handleReaction("celebrate")}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
          />
          <ReactionButton
            type="insightful"
            count={reactions.insightful}
            icon={Lightbulb}
            isActive={userReactions.includes("insightful")}
            onClick={() => handleReaction("insightful")}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
          />
        </div>
      </div>

      {/* Comments Section */}
      <Card className="border border-gray-200 dark:border-gray-600 shadow-sm rounded-2xl dark:bg-gray-800">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 dark:text-gray-100">
            Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          {isAuthenticated ? (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2 md:mb-3 text-sm rounded-xl resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                rows={3}
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Commenting as{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {user?.username || "User"}
                  </span>
                </div>
                <Button
                  onClick={() => submitComment(newComment)}
                  disabled={!newComment.trim() || loading}
                  size="sm"
                  className="rounded-lg w-full sm:w-auto text-xs md:text-sm"
                >
                  <Send className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {loading ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-4 md:mb-6 p-4 md:p-6 text-center bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3">
                Please sign in to leave a comment
              </p>
              <Button
                onClick={() => setShowAuthModal(true)}
                size="sm"
                className="rounded-lg w-full sm:w-auto text-xs md:text-sm"
              >
                Sign In to Comment
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {displayedComments.length === 0 ? (
              <div className="text-center py-6 md:py-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Edit className="w-5 h-5 md:w-6 md:h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  {isAuthenticated
                    ? "Be the first to share your thoughts!"
                    : "Sign in to be the first to comment!"}
                </p>
              </div>
            ) : (
              <>
                {displayedComments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}

                {/* Show More/Less Button - Only show if there are more than 5 comments */}
                {comments.length > 5 && (
                  <div className="flex justify-center pt-3 md:pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllComments(!showAllComments)}
                      className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs md:text-sm"
                    >
                      {showAllComments ? (
                        <>
                          <ChevronUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                          Show Less Comments
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                          Show All {comments.length} Comments
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-2xl">
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Please sign in to react to articles and leave comments.
            </p>
            <Button
              onClick={() => setShowAuthModal(false)}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}