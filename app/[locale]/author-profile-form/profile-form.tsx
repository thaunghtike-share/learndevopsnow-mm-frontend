"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  Zap,
  Upload,
  Mail,
  Globe,
  Building,
  Briefcase as BriefcaseIcon,
  UserCircle,
  Link as LinkIcon,
  Hash,
  Save,
  ArrowLeft,
  CheckCircle,
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
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoadingProfile(false);
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

          // Get email from user data
          if (user?.email) {
            setUserEmail(user.email);
          } else if (profileData.email) {
            setUserEmail(profileData.email);
          }
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]);

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
    setSuccess(null);

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save profile");
      }

      const savedProfile = await response.json();

      updateProfile({
        profileComplete: true,
        username: savedProfile.name || user?.username,
        avatar: savedProfile.avatar,
      });

      setSuccess("stay");

      setTimeout(() => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          router.push("/");
        }
      }, 1500);
    } catch (error: any) {
      setError(error.message || "An error occurred while saving");
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
      <div className="max-w-2xl mx-auto px-4 md:px-11 py-16 mb-40">
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
      <div className="max-w-2xl mx-auto px-4 md:px-11 py-16 mb-40">
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
    <div className="px-4 sm:px-6 md:px-11 ">
      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <div className="h-px w-12 md:w-16 bg-gradient-to-r from-sky-500 to-blue-600"></div>
          <span className="text-xs md:text-sm font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            Complete Your Profile
          </span>
        </div>
        <h1 className="text-3xl md:text-6xl font-light text-black dark:text-white md:mb-6 tracking-tight">
          Tell Us About Yourself
        </h1>
        <p className="text-base md:text-xl text-black dark:text-gray-400">
          Complete your author profile to start writing articles
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
        {/* Email Section - Read Only */}
        {userEmail && (
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-black dark:text-white">
                  Email Address
                </h3>
                <p className="text-sm text-black/60 dark:text-gray-400">
                  Your registered email (cannot be changed)
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-50/80 dark:bg-gray-700/50 border border-slate-200/50 dark:border-gray-600 rounded-xl md:rounded-2xl text-black dark:text-gray-300 font-medium">
                {userEmail}
              </div>
            </div>
          </div>
        )}

        {/* Profile Photo Section */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
              <UserCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-black dark:text-white">
                Profile Photo <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-black/60 dark:text-gray-400">
                Upload a professional photo or enter a URL
              </p>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            {formData.avatar && (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                      <img
                        src={formData.avatar}
                        alt="Current avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-black dark:text-white mb-2">
                    Current Avatar
                  </p>
                  <p className="text-xs md:text-sm text-black/60 dark:text-gray-400">
                    Your current profile photo
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-full border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-xl md:rounded-2xl p-6 md:p-8 text-center hover:border-sky-500 dark:hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-all duration-300">
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-8 h-8 md:w-10 md:h-10 text-slate-400 dark:text-gray-500" />
                    <div>
                      <span className="text-base md:text-lg font-medium text-black dark:text-white">
                        Click to upload photo
                      </span>
                      <p className="text-xs md:text-sm text-black/60 dark:text-gray-400 mt-1">
                        JPEG, PNG, GIF, WebP (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </label>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-black dark:text-gray-300 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {uploadError}
                  </p>
                </div>
              )}

              {hasExistingAvatar && (
                <div className="mt-6">
                  <label className="block mb-3 text-sm font-medium text-black dark:text-white">
                    Or use custom URL:
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-gray-700/50 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 text-black dark:text-white"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  <p className="text-xs text-black/60 dark:text-gray-400 mt-2">
                    Keep your existing avatar URL or change it
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Display Name */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                <UserCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-black dark:text-white">
                  Display Name <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-black/60 dark:text-gray-400">
                  Your name as it will appear publicly
                </p>
              </div>
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-slate-50/80 dark:bg-gray-700/50 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 text-black dark:text-white placeholder-black/40 dark:placeholder-gray-500"
              placeholder="John Doe"
            />
          </div>

          {/* Profile Slug */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                <Hash className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-black dark:text-white">
                  Profile Slug <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-black/60 dark:text-gray-400">
                  Your unique profile URL identifier
                </p>
              </div>
            </div>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-slate-50/80 dark:bg-gray-700/50 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 text-black dark:text-white placeholder-black/40 dark:placeholder-gray-500"
              placeholder="your-unique-slug"
            />
            <p className="text-xs text-black/60 dark:text-gray-400 mt-3">
              Don't change auto-generated slug. This will be used in your
              profile URL
            </p>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
              <BriefcaseIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-black dark:text-white">
                Professional Information
              </h3>
              <p className="text-sm text-black/60 dark:text-gray-400">
                Tell us about your professional background
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <label className="block mb-3 text-sm font-medium text-black dark:text-white">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-50/80 dark:bg-gray-700/50 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 text-black dark:text-white placeholder-black/40 dark:placeholder-gray-500"
                placeholder="Senior DevOps Engineer"
              />
            </div>

            <div>
              <label className="block mb-3 text-sm font-medium text-black dark:text-white">
                Company (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50/80 dark:bg-gray-700/50 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 text-black dark:text-white placeholder-black/40 dark:placeholder-gray-500"
                placeholder="TechCorp Inc."
              />
            </div>
          </div>
        </div>

        {/* LinkedIn URL */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
              <LinkIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-black dark:text-white">
                LinkedIn URL <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-black/60 dark:text-gray-400">
                Connect your professional profile
              </p>
            </div>
          </div>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-slate-50/80 dark:bg-gray-700/50 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 text-black dark:text-white placeholder-black/40 dark:placeholder-gray-500"
            placeholder="https://linkedin.com/in/your-profile"
          />
        </div>

        {/* Bio */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-gray-700 shadow-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-black dark:text-white">
                Bio <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-black/60 dark:text-gray-400">
                Tell the community about yourself, your expertise, and
                experience
              </p>
            </div>
          </div>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 bg-slate-50/80 dark:bg-gray-700/50 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 text-black dark:text-white placeholder-black/40 dark:placeholder-gray-500 resize-none"
            required
            placeholder="I'm a passionate DevOps engineer with 8 years of experience in cloud infrastructure, CI/CD pipelines, and containerization..."
          />
        </div>

        {error && (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
            <p className="text-red-600 dark:text-red-400 text-base font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          <button
            type="submit"
            disabled={loading || isUploading}
            className="w-full px-6 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving Profile...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Profile & Go to Admin Dashboard
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSaveAndStay}
            disabled={loading || isUploading}
            className="w-full px-6 py-4 border-2 border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-gray-800 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/10 hover:border-sky-600 dark:hover:border-sky-400 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-base hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-600"></div>
                Saving Profile...
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5" />
                Save Profile & Back to Previous Page
              </>
            )}
          </button>

          {!hasCompletedProfile && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={handleSkip}
                className="text-black/60 dark:text-gray-400 hover:text-black dark:hover:text-gray-300 py-2 text-base transition-colors font-medium inline-flex items-center gap-2"
              >
                Skip for now
                <span className="text-lg">→</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
