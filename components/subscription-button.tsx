"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function BellSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Check subscription status
  useEffect(() => {
    if (isAuthenticated) {
      checkSubscription();
    } else {
      setChecking(false);
    }
  }, [isAuthenticated]);

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setChecking(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/subscribe/`, {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.subscribed);
      }
    } catch (error) {
      console.error("Failed to check subscription:", error);
    } finally {
      setChecking(false);
    }
  };

  const toggleSubscription = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please sign in to subscribe");
        return;
      }

      if (isSubscribed) {
        // Unsubscribe
        const response = await fetch(`${API_BASE_URL}/subscribe/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Token ${token}`,
          },
        });

        if (response.ok) {
          setIsSubscribed(false);
          // ✅ SHOW CLEAR ALERT
          alert("✅ Unsubscribed from notifications");
          toast.success("Unsubscribed from notifications");
        } else {
          toast.error("Failed to unsubscribe");
        }
      } else {
        // Subscribe
        const response = await fetch(`${API_BASE_URL}/subscribe/`, {
          method: "POST",
          headers: {
            "Authorization": `Token ${token}`,
          },
        });

        if (response.ok) {
          setIsSubscribed(true);
          // ✅ SHOW CLEAR ALERT
          alert("✅ Subscribed! You'll get email notifications for new articles");
          toast.success("Subscribed! You'll get email notifications for new articles");
        } else {
          toast.error("Failed to subscribe");
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  // Get the correct tooltip text
  const getTooltipText = () => {
    if (!isAuthenticated) {
      return "Sign in to subscribe to notifications";
    }
    return isSubscribed 
      ? "You're subscribed! Click to unsubscribe from email notifications"
      : "Subscribe to get email notifications for new articles";
  };

  const handleSignIn = () => {
    setShowAuthModal(false);
    router.push("/auth");
  };

  if (checking) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSubscription}
        disabled={loading}
        className="relative"
        title={getTooltipText()}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSubscribed ? (
          <Bell className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : (
          <BellOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
        
        {/* Active indicator */}
        {isSubscribed && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></span>
        )}
      </Button>

      {/* Auth Required Modal - SIMPLE VERSION */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
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
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Please sign in to subscribe to email notifications
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAuthModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSignIn}
                className="flex-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}