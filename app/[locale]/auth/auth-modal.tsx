"use client";
import { useState, useEffect } from "react";
import SignInForm from "./sign-in-form";
import SignUpForm from "./sign-up-form";

interface AuthModalProps {
  onSuccess?: () => void;
}

export default function AuthModal({ onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

  // Load Google Identity Services script (unchanged)
  useEffect(() => {
    const loadGoogleScript = () => {
      if (
        document.querySelector('script[src*="accounts.google.com/gsi/client"]')
      ) {
        setGoogleScriptLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Sign-In script loaded successfully");
        setGoogleScriptLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load Google Sign-In script");
        setGoogleScriptLoaded(true);
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6">
      {" "}
      {/* Added horizontal padding */}
      {/* Reduced padding on mobile, increased shadow for better depth */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl sm:shadow-lg p-6 sm:p-8">
        {/* Text sizing improvements for mobile */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            {activeTab === "signup" ? "Join Our Community" : "Welcome Back"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {activeTab === "signup"
              ? "Create an account to share your knowledge"
              : "Sign in to your account to continue"}
          </p>
        </div>
        {/* Tab Navigation - improved mobile sizing */}
        <div className="flex border-b border-gray-200 dark:border-gray-600 mb-4 sm:mb-6">
          <button
            onClick={() => {
              setActiveTab("signin");
              // Trigger a re-initialization of Google script
              setGoogleScriptLoaded(false);
              setTimeout(() => setGoogleScriptLoaded(true), 50);
            }}
            className={`flex-1 py-2 sm:py-3 font-medium text-xs sm:text-sm ${
              activeTab === "signin"
                ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab("signup");
              // Trigger a re-initialization of Google script
              setGoogleScriptLoaded(false);
              setTimeout(() => setGoogleScriptLoaded(true), 50);
            }}
            className={`flex-1 py-2 sm:py-3 font-medium text-xs sm:text-sm ${
              activeTab === "signup"
                ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Sign Up
          </button>
        </div>
        {/* Show loading if Google script isn't ready */}
        {!googleScriptLoaded && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600 dark:border-sky-400 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Loading authentication...
            </p>
          </div>
        )}
        <div className={!googleScriptLoaded ? "opacity-50" : ""}>
          {activeTab === "signup" ? (
            <SignUpForm
              key="signup-form" // Add unique key
              onSuccess={onSuccess}
              switchToSignIn={() => setActiveTab("signin")}
            />
          ) : (
            <SignInForm
              key="signin-form" // Add unique key
              onSuccess={onSuccess}
              switchToSignUp={() => setActiveTab("signup")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
