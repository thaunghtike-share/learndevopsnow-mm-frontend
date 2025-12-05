"use client";
import { useState } from "react";
import { useAuth } from "./hooks/use-auth";

interface SignUpFormProps {
  onSuccess?: () => void;
  switchToSignIn: () => void;
}

export default function SignUpForm({
  onSuccess,
  switchToSignIn,
}: SignUpFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    password_hint: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.username || !formData.password1 || !formData.password2) {
      setError("Username and password are required");
      return false;
    }

    // ✅ ADD EMAIL VALIDATION
    if (!formData.email || !formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password1 !== formData.password2) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password1.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) return;
    setLoading(true);

    try {
      console.log("📤 Checking email availability...");

      if (formData.email && formData.email.trim() !== "") {
        const emailCheckResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/check-email/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          }
        );

        if (!emailCheckResponse.ok) {
          const emailError = await emailCheckResponse.json();
          throw new Error(emailError.error || "Email already exists");
        }
      }

      console.log("📤 Attempting registration...");

      const registerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/registration/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email ? formData.email.trim() : "",
            password1: formData.password1,
            password2: formData.password2,
          }),
        }
      );

      console.log("📥 Registration response status:", registerResponse.status);

      if (registerResponse.status === 201) {
        console.log("✅ Account created successfully");

        if (formData.password_hint) {
          try {
            const saveHintResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/save-password-hint/`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  username: formData.username,
                  password_hint: formData.password_hint,
                }),
              }
            );

            if (saveHintResponse.ok) {
              console.log("✅ Password hint saved successfully");
            } else {
              console.log("⚠️ Password hint not saved, but account created");
            }
          } catch (hintError) {
            console.error("❌ Failed to save password hint:", hintError);
          }
        }

        setSuccess(true);
      } else if (registerResponse.status === 400) {
        const errorData = await registerResponse.json();
        console.log("❌ Validation errors:", errorData);

        const errorMessage = errorData.email?.[0]?.includes("already exists")
          ? "This email is already registered. Please use a different email."
          : errorData.email?.[0]?.includes("required") ||
            errorData.email?.[0]?.includes("blank")
          ? "Email is required. Please enter your email address."
          : errorData.username?.[0]
          ? `Username error: ${errorData.username[0]}`
          : errorData.password1?.[0]
          ? `Password error: ${errorData.password1[0]}`
          : errorData.password2?.[0]
          ? `Password confirmation error: ${errorData.password2[0]}`
          : errorData.non_field_errors?.[0]
          ? errorData.non_field_errors[0]
          : "Please check your information and try again.";

        throw new Error(errorMessage);
      } else {
        const errorText = await registerResponse.text();
        console.error("❌ Server error:", registerResponse.status, errorText);
        throw new Error(
          "Registration service is temporarily unavailable. Please try again later."
        );
      }
    } catch (error: any) {
      console.error("💥 Registration error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Success message - improved mobile sizing
  if (success) {
    return (
      <div className="text-center py-6 sm:py-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Account Created Successfully!
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
          Your account has been created. You can now sign in to start writing
          articles.
        </p>
        <div className="space-y-2 sm:space-y-3">
          <button
            onClick={switchToSignIn}
            className="w-full bg-sky-600 dark:bg-sky-500 text-white py-2.5 sm:py-3 rounded-xl hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors font-medium text-sm sm:text-base"
          >
            Sign In Now
          </button>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                username: "",
                email: "",
                password1: "",
                password2: "",
                password_hint: "",
              });
            }}
            className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 sm:py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
          >
            Create Another Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      {" "}
      {/* Reduced mobile spacing */}
      <div>
        <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Username *
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Choose a username"
          minLength={3}
          disabled={loading}
        />
      </div>
      <div>
        <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Address * {/* ADD ASTERISK */}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Enter your email (required)"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Required for notifications
        </p>
      </div>
      {/* Password fields - stack on mobile, side-by-side on larger screens */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Password *
          </label>
          <input
            type="password"
            name="password1"
            value={formData.password1}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Create password"
            minLength={8}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password *
          </label>
          <input
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Confirm password"
            minLength={8}
            disabled={loading}
          />
        </div>
      </div>
      {/* Password Hint Field - OPTIONAL */}
      <div>
        <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Password Hint{" "}
          <span className="text-xs text-gray-500">(optional)</span>
        </label>
        <input
          type="text"
          name="password_hint"
          value={formData.password_hint}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="e.g., name + date of birth (optional)"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Optional: Helps you remember your password if you forget it
        </p>
      </div>
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2.5 sm:py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
      {/* Sign In Link - adjusted mobile spacing */}
      <div className="text-center pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={switchToSignIn}
            className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium disabled:opacity-50 text-xs sm:text-sm"
            disabled={loading}
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
}
