"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  Award,
  Crown,
  Zap,
  Upload,
  User,
  Briefcase,
  LinkIcon,
  FileText,
  Hash,
} from "lucide-react";

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    job_title: "",
    company: "",
    linkedin: "",
    avatar: "",
    slug: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasExistingAvatar, setHasExistingAvatar] = useState(false);
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          setIsLoadingProfile(false);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));

        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/authors/me/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setFormData({
            name: profileData.name || "",
            bio: profileData.bio || "",
            job_title: profileData.job_title || "",
            company: profileData.company || "",
            linkedin: profileData.linkedin || "",
            avatar: profileData.avatar || "",
            slug: profileData.slug || "",
          });

          if (profileData.avatar && profileData.avatar.trim() !== "") {
            setHasExistingAvatar(true);
          }

          if (profileData.profile_complete) {
            setHasCompletedProfile(true);
          }
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/authors/me/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            profile_complete: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const savedProfile = await response.json();

      updateProfile({
        profileComplete: true,
        username: savedProfile.name || user?.username,
        avatar: savedProfile.avatar,
      });

      setSuccess("redirect");

      setTimeout(() => {
        window.location.href = `/admin/author/${formData.slug}`;
      }, 1500);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndStay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !formData.name?.trim() ||
      !formData.bio?.trim() ||
      !formData.job_title?.trim() ||
      !formData.linkedin?.trim() ||
      !formData.avatar?.trim() ||
      !formData.slug?.trim()
    ) {
      setError("Please fill in all required fields before saving.");
      setLoading(false);
      return;
    }

    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/;
    if (!linkedinRegex.test(formData.linkedin)) {
      setError(
        "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/your-profile)"
      );
      setLoading(false);
      return;
    }

    if (formData.avatar && !formData.avatar.startsWith("http")) {
      setError(
        "Please enter a valid avatar URL starting with http:// or https://"
      );
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/authors/me/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            profile_complete: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const savedProfile = await response.json();

      updateProfile({
        profileComplete: true,
        username: savedProfile.name || user?.username,
        avatar: savedProfile.avatar,
      });

      setSuccess("stay");

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      setUploadProgress(30);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload-avatar/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      setUploadProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      setUploadProgress(100);

      setFormData((prev) => ({
        ...prev,
        avatar: data.avatar_url,
      }));

      setHasExistingAvatar(true);

      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
    } catch (error: any) {
      setUploadError(error.message);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const handleSkip = async () => {
    if (hasCompletedProfile) {
      router.back();
      return;
    }

    const allFieldsFilled =
      formData.name?.trim() &&
      formData.bio?.trim() &&
      formData.job_title?.trim() &&
      formData.linkedin?.trim() &&
      formData.avatar?.trim() &&
      formData.slug?.trim();

    if (!allFieldsFilled) {
      setError(
        "Please wait for your profile data to load completely, or fill all the fields before skipping."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/authors/me/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.slug) {
          window.location.href = `/admin/author/${profileData.slug}`;
        } else {
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Failed to get author data:", error);
      window.location.href = "/";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoadingProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-11 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we load your profile data...
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-11 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {success === "stay"
              ? "Happy Reading! 🎉"
              : "Welcome to the Community!"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {success === "stay"
              ? "Your profile is saved. Taking you back to continue reading..."
              : "Your profile has been saved successfully. Redirecting to your dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-11 md:py-7 mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 md:p-8">
        {/* Mobile Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3 md:mb-4 w-fit mx-auto">
            <Zap className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Complete Your Profile</span>
          </div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Tell Us About Yourself
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center text-sm md:text-base">
            Complete your author profile to start writing articles
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Display Name */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
              placeholder="Your Name - eg. John Doe"
            />
          </div>

          {/* Professional Information */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
              Professional Information <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3 md:space-y-0 md:flex md:gap-4 md:items-end">
              <div className="md:flex-1">
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                  placeholder="Job title"
                />
              </div>
              <div className="hidden md:flex items-center h-12 text-gray-500 dark:text-gray-400 font-medium px-2">
                at
              </div>
              <div className="md:flex-1">
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                  placeholder="Company name (optional)"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base resize-none"
              required
              placeholder="Tell us about yourself, your expertise, and experience..."
            />
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
              LinkedIn URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>

          {/* Avatar Section */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
              Profile Photo <span className="text-red-500">*</span>
            </label>

            {formData.avatar && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Current Avatar:
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={formData.avatar}
                    alt="Current avatar"
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Current photo
                  </span>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 md:p-6 text-center hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-300">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 md:w-8 md:h-8 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Click to upload photo
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      JPEG, PNG, GIF, WebP (max 5MB)
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 md:h-2">
                  <div
                    className="bg-sky-600 h-1.5 md:h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {uploadError && (
              <p className="text-red-600 dark:text-red-400 text-xs md:text-sm mt-2">
                {uploadError}
              </p>
            )}

            {hasExistingAvatar && (
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Or use custom URL:
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 md:py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Keep your existing avatar URL or change it
                </p>
              </div>
            )}
          </div>

          {/* Profile Slug */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
              Profile Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
              placeholder="your-unique-profile-slug"
            />
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2">
              Don't change auto-generated slug. This will be used in your
              profile URL (e.g., /authors/your-slug)
            </p>
          </div>

          {error && (
            <div className="p-3 md:p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl text-sm border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={loading || isUploading}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {loading
                ? "Saving Profile..."
                : "Save Profile & Go to Admin Dashboard"}
            </button>

            <button
              type="button"
              onClick={handleSaveAndStay}
              disabled={loading || isUploading}
              className="w-full border-2 border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-gray-800 py-3 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:border-sky-600 dark:hover:border-sky-400 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {loading
                ? "Saving Profile..."
                : "Save Profile & Back to Previous Page"}
            </button>

            {!hasCompletedProfile && (
              <button
                type="button"
                onClick={handleSkip}
                className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2 text-sm md:text-base transition-colors"
              >
                Skip for now →
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}