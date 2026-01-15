"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../hooks/use-auth";

function GitHubCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        console.error("GitHub OAuth error:", error);
        router.push(
          "/?error=github_auth_failed&message=" + encodeURIComponent(error)
        );
        return;
      }

      if (!code) {
        console.error("No code received from GitHub");
        router.push("/?error=no_authorization_code");
        return;
      }

      try {
        // Exchange code for token
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/github/login/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "GitHub authentication failed");
        }

        const data = await response.json();

        // Login user
        login(data.token, {
          id: data.user?.id || data.author?.id || 0,
          slug: data.author?.slug || "",
          username:
            data.user?.username || data.user?.first_name || "GitHub User",
          email: data.user?.email || "",
          avatar: data.author?.avatar || data.user?.avatar,
          profileComplete: data.author?.profile_complete || false,
        });

        // Redirect based on profile completion
        if (data.author?.profile_complete && data.author?.slug) {
          window.location.href = `/admin/author/${data.author.slug}`;
        } else {
          window.location.href = "/author-profile-form";
        }
      } catch (error: any) {
        console.error("GitHub callback error:", error);
        router.push(`/?error=${encodeURIComponent(error.message)}`);
      }
    };

    handleCallback();
  }, [searchParams, router, login]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Completing GitHub Login
        </h2>
        <p className="text-gray-600">
          Please wait while we authenticate you...
        </p>
      </div>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading GitHub authentication...</p>
          </div>
        </div>
      }
    >
      <GitHubCallbackContent />
    </Suspense>
  );
}
