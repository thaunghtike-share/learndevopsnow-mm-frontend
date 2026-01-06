"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./hooks/use-auth";

interface SignInFormProps {
  onSuccess?: () => void;
  switchToSignUp?: () => void;
}

export default function SignInForm({
  onSuccess,
  switchToSignUp,
}: SignInFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [passwordHint, setPasswordHint] = useState("");
  const { login } = useAuth();
  const googleInitialized = useRef(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Initialize Google Sign-In (unchanged)
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (googleInitialized.current) return;

      if (!(window as any).google) {
        console.error("Google Sign-In library not loaded");
        return;
      }

      try {
        (window as any).google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleResponse,
          ux_mode: "popup",
          auto_select: false,
        });

        if (googleButtonRef.current) {
          (window as any).google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              theme: "outline",
              size: "large",
              width: "380", // This will auto-adjust on mobile
              text: "signin_with",
              shape: "pill",
            }
          );
        }

        googleInitialized.current = true;
        console.log("Google Sign-In initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Google Sign-In:", error);
        setError("Failed to initialize Google Sign-In");
      }
    };

    const loadGoogleScript = () => {
      if (
        document.querySelector('script[src*="accounts.google.com/gsi/client"]')
      ) {
        const checkGoogle = setInterval(() => {
          if ((window as any).google) {
            initializeGoogleSignIn();
            clearInterval(checkGoogle);
          }
        }, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Sign-In script loaded");
        setTimeout(initializeGoogleSignIn, 100);
      };
      script.onerror = () => {
        console.error("Failed to load Google Sign-In script");
        setError("Failed to load Google Sign-In. Please refresh the page.");
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();

    return () => {
      googleInitialized.current = false;
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (showHint) {
      setShowHint(false);
      setPasswordHint("");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    setShowHint(false);
    setPasswordHint("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        await fetchPasswordHint(formData.username);
        throw new Error("Invalid username or password");
      }

      const data = await res.json();
      const authToken = data.token;

      login(authToken, {
        id: data.user?.id || data.author?.id || 0,
        slug: data.author?.slug || "",
        username: data.user?.username || formData.username,
        email: data.user?.email || "",
        avatar: data.author?.avatar,
        profileComplete: data.author?.profile_complete || false,
      });

      onSuccess?.();

      if (data.author?.profile_complete) {
        window.location.href = `/admin/author/${data.author.slug}`;
      } else {
        window.location.href = "/author-profile-form";
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const fetchPasswordHint = async (username: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password-hint/${username}/`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.hint) {
          setPasswordHint(data.hint);
          setShowHint(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch password hint");
    }
  };

  const handleGoogleResponse = async (response: any) => {
    setGoogleLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: response.credential }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.details || "Google sign in failed");
      }

      const authToken = data.token;

      login(authToken, {
        id: data.user?.id || data.author?.id || 0,
        slug: data.author?.slug || "",
        username: data.user?.username || data.user?.first_name || "User",
        email: data.user?.email || "",
        avatar: data.author?.avatar || data.user?.avatar,
        profileComplete: data.author?.profile_complete || false,
      });

      if (data.author?.profile_complete && data.author?.slug) {
        window.location.href = `/admin/author/${data.author.slug}`;
      } else {
        window.location.href = "/author-profile-form";
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      setError(error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setError(
      "Forgot password? Please contact our team via Messenger or email for assistance."
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6"> {/* Reduced spacing on mobile */}
      {/* Google Sign In - improved mobile container */}
      <div className="space-y-3">
        <div 
          ref={googleButtonRef} 
          className="flex justify-center google-signin-container"
          style={{ minHeight: '44px' }} // Better touch target
        ></div>
      </div>

      {/* Divider - adjusted spacing */}
      <div className="flex items-center my-3 sm:my-4">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        <span className="mx-3 sm:mx-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      {/* Username/Password Form - improved mobile spacing */}
      <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Username or Email
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter your username or email"
          />
        </div>
        <div>
          <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter your password"
          />

          {/* Password Hint and Forgot Password - improved mobile layout */}
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-0 mt-1 sm:mt-2">
            {/* Password Hint - full width on very small screens */}
            {showHint && passwordHint && (
              <div className="text-xs text-blue-600 dark:text-blue-400 xs:flex-1">
                <span className="font-medium">Hint:</span> "{passwordHint}"
              </div>
            )}
            {/* Forgot Password */}
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium text-xs sm:text-sm text-right xs:text-left"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={formLoading}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2.5 sm:py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {formLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Sign Up Link - adjusted padding and text size */}
      <div className="text-center pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={switchToSignUp}
            className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium text-xs sm:text-sm"
          >
            Sign Up
          </button>
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs sm:text-sm">
          <div className="text-red-700 dark:text-red-400 mb-2">{error}</div>
        </div>
      )}
    </div>
  );
}