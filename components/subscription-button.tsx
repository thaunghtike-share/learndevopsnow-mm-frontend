"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function BellSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAlert, setShowAlert] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Check subscription status
  useEffect(() => {
    console.log("Auth state changed:", { isAuthenticated, isSubscribed });
    if (isAuthenticated) {
      checkSubscription();
    } else {
      setChecking(false);
      setIsSubscribed(false);
    }
  }, [isAuthenticated]);

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Checking subscription, token exists:", !!token);
      if (!token) {
        setChecking(false);
        setIsSubscribed(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/subscribe/`, {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Subscription data:", data);
        setIsSubscribed(data.subscribed);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("Failed to check subscription:", error);
      setIsSubscribed(false);
    } finally {
      setChecking(false);
    }
  };

  const showCustomAlert = (type: "success" | "error", message: string) => {
    setShowAlert({ show: true, type, message });
    setTimeout(() => {
      setShowAlert({ show: false, type: "success", message: "" });
    }, 3000);
  };

  const toggleSubscription = async () => {
    console.log("Toggle clicked, current state:", { isSubscribed, isAuthenticated });
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showCustomAlert("error", "Please sign in to subscribe");
        setLoading(false);
        return;
      }

      if (isSubscribed) {
        // Unsubscribe
        console.log("Unsubscribing...");
        const response = await fetch(`${API_BASE_URL}/subscribe/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Token ${token}`,
          },
        });

        if (response.ok) {
          setIsSubscribed(false);
          showCustomAlert("success", "Unsubscribed from notifications");
        } else {
          showCustomAlert("error", "Failed to unsubscribe");
        }
      } else {
        // Subscribe
        console.log("Subscribing...");
        const response = await fetch(`${API_BASE_URL}/subscribe/`, {
          method: "POST",
          headers: {
            "Authorization": `Token ${token}`,
          },
        });

        if (response.ok) {
          setIsSubscribed(true);
          showCustomAlert("success", "Subscribed! You'll get email notifications");
        } else {
          showCustomAlert("error", "Failed to subscribe");
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
      showCustomAlert("error", "Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    setShowAuthModal(false);
    router.push("/auth");
  };

  if (checking) {
    console.log("Showing loading state");
    return (
      <Button variant="ghost" className="px-4" disabled>
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  console.log("Rendering button with state:", { isSubscribed, loading });

  return (
    <>
      <Button
        variant="ghost"
        onClick={toggleSubscription}
        disabled={loading}
        className="px-4"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing...
          </>
        ) : isSubscribed ? (
          <>
            <BellRing className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            Unsubscribe
          </>
        ) : (
          <>
            <Bell className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            Subscribe
          </>
        )}
      </Button>

      {/* Custom Alert Box */}
      {showAlert.show && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className={`rounded-lg shadow-xl border p-4 max-w-sm ${
            showAlert.type === "success" 
              ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" 
              : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                showAlert.type === "success" 
                  ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300" 
                  : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300"
              }`}>
                {showAlert.type === "success" ? "✓" : "!"}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  showAlert.type === "success" 
                    ? "text-green-800 dark:text-green-300" 
                    : "text-red-800 dark:text-red-300"
                }`}>
                  {showAlert.message}
                </p>
              </div>
              <button
                onClick={() => setShowAlert({ show: false, type: "success", message: "" })}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Required Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Sign In Required
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    To subscribe to notifications
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-1 hover:bg-sky-600 bg-sky-600 hover:scale-100 border-sky-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white dark:text-gray-400" />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Sign in to get email notifications when new articles are published.
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAuthModal(false)}
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}