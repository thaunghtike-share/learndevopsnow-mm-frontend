"use client";
import { useState, useEffect } from "react";

interface User {
  username: string;
  email: string;
  avatar?: string;
  id: number;
  profileComplete: boolean;
  slug: string;
  name?: string;
  is_super_user?: boolean;
}

export const useAuthCheck = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
    setIsChecking(false);
  }, []);

  return { isChecking, hasToken };
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getFullAvatarUrl = (avatarUrl: string | undefined | null) => {
    if (!avatarUrl) return "";
    
    // If avatar already has http/https, return as is
    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      return avatarUrl;
    }
    
    // If it's a relative path, prepend the base URL
    if (avatarUrl.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_API_BASE_URL}${avatarUrl}`;
    }
    
    // For Azure blob paths or other formats, try to construct URL
    if (avatarUrl.includes('blob.core.windows.net')) {
      return avatarUrl;
    }
    
    // Default: return empty string
    return "";
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("🚫 No token found");
        setIsLoading(false);
        return;
      }

      console.log(
        "🔐 Checking auth with token:",
        token.substring(0, 10) + "..."
      );

      // Verify token is valid by checking profile
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/authors/me/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        console.log("✅ Profile loaded:", profileData.name);
        console.log("📸 Avatar URL from API:", profileData.avatar);

        // ✅ DEBUG SUPER USER CHECK
        console.log("🔍 Checking super user status...");
        let isSuperUser = false;
        try {
          const superCheckRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/super/stats/`,
            {
              headers: { Authorization: `Token ${token}` },
            }
          );

          console.log(
            "🔍 Super check status:",
            superCheckRes.status,
            superCheckRes.ok
          );
          console.log(
            "🔍 Super check URL:",
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/super/stats/`
          );

          isSuperUser = superCheckRes.ok;
          console.log("🔍 Super user result:", isSuperUser);
        } catch (error) {
          console.log("❌ Super user check failed:", error);
          isSuperUser = false;
        }

        // Get full avatar URL
        const fullAvatarUrl = getFullAvatarUrl(profileData.avatar);
        console.log("🖼️ Full avatar URL:", fullAvatarUrl);

        setUser({
          id: profileData.id,
          username: profileData.name || "Author",
          email: profileData.email || "",
          avatar: fullAvatarUrl,
          profileComplete: profileData.profile_complete || false,
          slug: profileData.slug || "",
          is_super_user: isSuperUser,
        });
        setIsAuthenticated(true);
        console.log("✅ Auth complete - Super user:", isSuperUser);
        console.log("👤 Final user object:", {
          username: profileData.name,
          avatar: fullAvatarUrl,
          hasAvatar: !!fullAvatarUrl
        });
      } else {
        console.log("❌ Profile check failed:", profileRes.status);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("💥 Auth check failed:", error);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("original_token");
    localStorage.removeItem("is_impersonating");
    localStorage.removeItem("impersonated_author");
    setUser(null);
    setIsAuthenticated(false);

    // Just redirect to home page
    window.location.href = "/";
  };

  const updateProfile = (profileData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...profileData } : null));
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuth,
    login,
    logout,
    updateProfile,
  };
}