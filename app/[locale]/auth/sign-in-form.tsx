"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./hooks/use-auth";
import GitHubLoginButton from "./github-login-button";

interface SignInFormProps {
  onSuccess?: () => void;
  switchToSignUp?: () => void;
}

export default function SignInForm({
  onSuccess,
  switchToSignUp,
}: SignInFormProps) {
  const [formData, setFormData] = useState({
    login_user: "", // Different field name
    login_pass: "", // Different field name
  });
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [passwordHint, setPasswordHint] = useState("");
  const { login } = useAuth();
  const googleInitialized = useRef(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // ONLY THIS ONE useEffect - clears form on mount
  useEffect(() => {
    // Force clear form data
    setFormData({
      login_user: "",
      login_pass: "",
    });
    setError(null);
    setShowHint(false);
    setPasswordHint("");

    // Also clear any localStorage flags
    localStorage.removeItem("force_clear_forms");
  }, []);

  // Window resize handler for Google button
  useEffect(() => {
    const handleResize = () => {
      if (googleButtonRef.current && googleInitialized.current) {
        googleButtonRef.current.innerHTML = "";
        (window as any).google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: "outline",
            size: "large",
            width: googleButtonRef.current.clientWidth,
            text: "signin_with",
            shape: "pill",
            logo_alignment: "center",
          }
        );
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize Google Sign-In
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
              width: googleButtonRef.current.clientWidth,
              text: "signin_with",
              shape: "pill",
              logo_alignment: "center",
            }
          );
        }

        googleInitialized.current = true;
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
        setTimeout(initializeGoogleSignIn, 100);
      };
      script.onerror = () => {
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
          body: JSON.stringify({
            username: formData.login_user, // Map to backend field
            password: formData.login_pass, // Map to backend field
          }),
        }
      );

      if (!res.ok) {
        await fetchPasswordHint(formData.login_user);
        throw new Error("Invalid username or password");
      }

      const data = await res.json();
      const authToken = data.token;

      login(authToken, {
        id: data.user?.id || data.author?.id || 0,
        slug: data.author?.slug || "",
        username: data.user?.username || formData.login_user,
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
    setError("Please contact us to reset your password.");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Fake hidden fields to trick browser autofill */}
      <div style={{ display: "none" }}>
        <input type="text" name="username" autoComplete="username" />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
        />
      </div>

      <div className="space-y-3">
        {/* Add this style tag to hide Google focus border */}
        <style jsx>{`
          .hide-google-focus :global([role="button"]) {
            border-color: #d1d5db !important;
          }
          .hide-google-focus :global([role="button"]:focus),
          .hide-google-focus :global([role="button"]:focus-within),
          .hide-google-focus :global([role="button"]:focus-visible) {
            outline: none !important;
            box-shadow: none !important;
            border-color: #d1d5db !important;
          }
        `}</style>

        {/* Google Button with focus fix */}
        <div
          ref={googleButtonRef}
          className="hide-google-focus w-full overflow-hidden rounded-xl py-2"
          style={{ minHeight: "44px" }}
        ></div>

        {/* GitHub Button with adjusted spacing */}
        <div className="mt-1">
          <GitHubLoginButton
            onSuccess={onSuccess}
            onError={(error) => setError(error)}
          />
        </div>

        {googleLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-600 mx-auto mb-1"></div>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Signing in with Google...
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center my-3 sm:my-4">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        <span className="mx-3 sm:mx-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          OR
        </span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Username or Email
          </label>
          <input
            type="text"
            name="login_user"
            value={formData.login_user}
            onChange={handleInputChange}
            required
            autoComplete="off"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter your username or email"
          />
        </div>
        <div>
          <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="login_pass"
            value={formData.login_pass}
            onChange={handleInputChange}
            required
            autoComplete="new-password"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter your password"
          />

          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-0 mt-1 sm:mt-2">
            {showHint && passwordHint && (
              <div className="text-xs text-blue-600 dark:text-blue-400 xs:flex-1">
                <span className="font-medium">Hint:</span> "{passwordHint}"
              </div>
            )}
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
