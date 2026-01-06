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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("🚫 No token found");
        setIsLoading(false);
        return;
      }

      console.log("🔐 Checking auth with token:", token.substring(0, 10) + "...");

      // Verify token is valid by checking profile
      const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/authors/me/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        console.log("✅ Profile loaded:", profileData.name);
        
        // ✅ DEBUG SUPER USER CHECK
        console.log("🔍 Checking super user status...");
        let isSuperUser = false;
        try {
          const superCheckRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/super/stats/`, {
            headers: { Authorization: `Token ${token}` },
          });
          
          console.log("🔍 Super check status:", superCheckRes.status, superCheckRes.ok);
          console.log("🔍 Super check URL:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/super/stats/`);
          
          isSuperUser = superCheckRes.ok;
          console.log("🔍 Super user result:", isSuperUser);
          
        } catch (error) {
          console.log("❌ Super user check failed:", error);
          isSuperUser = false;
        }

        setUser({
          id: profileData.id,
          username: profileData.name || "Author",
          email: profileData.email || "",
          avatar: profileData.avatar,
          profileComplete: profileData.profile_complete || false,
          slug: profileData.slug || "",
          is_super_user: isSuperUser,
        });
        setIsAuthenticated(true);
        console.log("✅ Auth complete - Super user:", isSuperUser);
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
  };

  const updateProfile = (profileData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...profileData } : null);
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