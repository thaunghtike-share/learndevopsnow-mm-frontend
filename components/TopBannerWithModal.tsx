"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Rocket, X, Calendar, Clock, ShieldCheck, ChevronDown, MessageSquare, Sparkles, Star } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  company: string;
  current_environment: string;
  project_goals: string;
  preferred_time: string;
}

export function TopBannerWithModal() {
  const params = useParams();
  const currentLocale = (params.locale as "en" | "my") || "en";
  
  // Banner state
  const [showTopBanner, setShowTopBanner] = useState(false);
  const [isBannerClosing, setIsBannerClosing] = useState(false);
  
  // Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    current_environment: "",
    project_goals: "",
    preferred_time: "",
  });

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Translation function
  const t = (enText: string, myText: string) => {
    return currentLocale === "en" ? enText : myText;
  };

  // Show banner after 2 seconds - REMOVED LOCAL STORAGE CHECK
  useEffect(() => {
    const timer = setTimeout(() => {
      // Always show banner on page load, regardless of localStorage
      setShowTopBanner(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Handle banner close (X button)
  const handleCloseBanner = () => {
    setIsBannerClosing(true);
    setTimeout(() => {
      setShowTopBanner(false);
      setIsBannerClosing(false);
      // Only save to localStorage when user explicitly closes with X button
      localStorage.setItem("topBannerDismissed", "true");
    }, 300);
  };

  // Handle CTA click from banner
  const handleBannerCTAClick = () => {
    setIsBookingModalOpen(true);
    // Don't save to localStorage when clicking CTA
    setShowTopBanner(false);
  };

  // Form input change handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const response = await fetch(`${apiUrl}/api/consultations/book/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show success message
        setAlertMessage(t(
          "Thank you! Your consultation request has been submitted successfully. We'll contact you within 24 hours.",
          "ကျေးဇူးတင်ပါသည်! သင်၏ ဆွေးနွေးတိုင်ပင်မှု တောင်းဆိုချက်ကို အောင်မြင်စွာ လက်ခံရရှိပါသည်။ ကျွန်ုပ်တို့သည် ၂၄ နာရီအတွင်း သင့်ထံ ဆက်သွယ်ပါမည်။"
        ));
        setAlertType("success");
        setShowAlert(true);

        // Reset form
        setFormData({
          name: "",
          email: "",
          company: "",
          current_environment: "",
          project_goals: "",
          preferred_time: "",
        });

        // Close modal after 2 seconds
        setTimeout(() => {
          setIsBookingModalOpen(false);
          setShowAlert(false);
        }, 2000);
      } else {
        setAlertMessage(t(
          "Failed to submit booking. Please try again.",
          "အာဏာပိုင်သို့ မပေးပို့နိုင်ပါ။ ကျေးဇူးပြု၍ ထပ်မံကြိုးစားကြည့်ပါ။"
        ));
        setAlertType("error");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Booking error:", error);
      setAlertMessage(t(
        "Network error. Please check your connection and try again.",
        "Network error. ကျေးဇူးပြု၍ သင့်ချိတ်ဆက်မှုကို စစ်ဆေးပြီး ထပ်မံကြိုး�စားကြည့်ပါ။"
      ));
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsBookingModalOpen(false);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isBookingModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isBookingModalOpen]);

  return (
    <>
      {/* PREMIUM TOP BANNER */}
      {showTopBanner && (
        <div className="fixed top-0 left-0 right-0 z-[10000]">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 via-blue-900/95 to-cyan-900/95 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 backdrop-blur-md border-b border-white/10 shadow-2xl">
            {/* Animated sparkles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute top-3/4 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-300"></div>
              <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-500"></div>
            </div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          {/* Banner content */}
          <div 
            className={`relative transition-all duration-500 ${
              isBannerClosing ? "opacity-0 h-0 overflow-hidden translate-y-[-100%]" : "opacity-100 h-auto py-4"
            }`}
          >
            <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left section with premium badge */}
              <div className="flex items-center space-x-4">
                {/* Premium badge */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative flex items-center space-x-2 bg-gradient-to-br from-gray-900 to-black px-4 py-2.5 rounded-xl border border-white/10 shadow-xl">
                    <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                      {t("FREE CONSULTATION", "FREE CONSULTATION")}
                    </span>
                  </div>
                </div>
                
                {/* Text content */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm sm:text-base bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                      {t(
                        "🚀 Free Expert DevOps Strategy Session",
                        "🚀 Free Expert DevOps Strategy Session"
                      )}
                    </h3>
                    <div className="hidden sm:flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-400 mt-1.5">
                    {t(
                      "Transform your infrastructure with personalized guidance from industry experts",
                      "ကျွမ်းကျင်သူများ၏ အကူအညီဖြင့် သင်၏ infrastructure ကို ပြောင်းလဲပါ"
                    )}
                  </p>
                </div>
              </div>
              
              {/* Right section with CTA */}
              <div className="flex items-center space-x-3">
                {/* Features pill */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span className="text-xs text-gray-300">{t("30min", "၃၀မိနစ်")}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
                    <ShieldCheck className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-gray-300">{t("Free", "အခမဲ့")}</span>
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-500 group-hover:animate-pulse"></div>
                  <button
                    onClick={handleBannerCTAClick}
                    className="relative px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-semibold text-sm shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 whitespace-nowrap flex items-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{t("Book Free Session", "Book Free Session")}</span>
                  </button>
                </div>
                
                {/* Close button */}
                <button
                  onClick={handleCloseBanner}
                  className="p-2.5 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-black/60 hover:border-white/20 transition-all duration-300 hover:scale-105"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORIGINAL MODAL (Kept exactly as it was) */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div
            className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200/30 dark:border-gray-800/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:scale-105 hover:shadow-md transition-all duration-300"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-md">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                      {t("Schedule Consultation", "Schedule Consultation")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t(
                        "Free 30-minute DevOps consultation",
                        "Free 30-minute DevOps consultation"
                      )}
                    </p>
                  </div>
                </div>

                {/* Success/Error Alert */}
                {showAlert && (
                  <div className={`mb-4 p-3 rounded-xl ${
                    alertType === "success"
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  }`}>
                    <p className={`text-sm ${
                      alertType === "success"
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}>
                      {alertMessage}
                    </p>
                  </div>
                )}

                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t("Full Name", "အမည်")} *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                      placeholder={t("John Doe", "ကျော်ဇေယျာ")}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t("Email Address", "အီးမေးလ်")} *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                      placeholder="email@company.com"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t("Company", "ကုမ္ပဏီ")}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                      placeholder={t("Optional", "မဖြစ်မနေ မဟုတ်")}
                    />
                  </div>

                  {/* Current Infrastructure & Preferred Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t("Current Infrastructure", "လက်ရှိ Infrastructure")} *
                      </label>
                      <div className="relative">
                        <select
                          required
                          name="current_environment"
                          value={formData.current_environment}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 appearance-none transition-all duration-300"
                        >
                          <option value="">
                            {t("Select Infra", "Infra ရွေးချယ်ပါ")}
                          </option>
                          <option value="on-premise">
                            {t("On-premise", "On-premise")}
                          </option>
                          <option value="aws">AWS</option>
                          <option value="azure">Azure</option>
                          <option value="gcp">Google Cloud</option>
                          <option value="hybrid">
                            {t("Hybrid / Multi-cloud", "Hybrid / Multi-cloud")}
                          </option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t("Preferred Time", "နှစ်သက်ရာ အချိန်")} *
                      </label>
                      <div className="relative">
                        <select
                          required
                          name="preferred_time"
                          value={formData.preferred_time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 appearance-none transition-all duration-300"
                        >
                          <option value="">
                            {t("Select time", "အချိန် ရွေးချယ်ပါ")}
                          </option>
                          <option value="morning">
                            {t("Weekday Morning", "Weekday Morning")}
                          </option>
                          <option value="afternoon">
                            {t("Weekday Afternoon", "Weekday Afternoon")}
                          </option>
                          <option value="evening">
                            {t("Weekday Evening", "Weekday Evening")}
                          </option>
                          <option value="flexible">
                            {t("Flexible Schedule", "Flexible Schedule")}
                          </option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Goals */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t("Project Goals", "ရည်မှန်းချက်များ")}
                    </label>
                    <textarea
                      rows={3}
                      name="project_goals"
                      value={formData.project_goals}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 resize-none transition-all duration-300"
                      placeholder={t(
                        "Describe your project goals or challenges...",
                        "သင်၏ ရည်မှန်းချက်များ ကိုရှင်းပြပါ..."
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="relative z-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {t("Submitting...", "ပေးပို့နေသည်...")}
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                        {t(
                          "Schedule Free Session",
                          "Schedule Free Session"
                        )}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>

                  {/* Privacy Note */}
                  <div className="pt-6 border-t border-gray-300/30 dark:border-gray-700/30">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>
                          {t(
                            "We respect your privacy",
                            "သင့်ကိုယ်ရေးကိုယ်တာကို လေးစားပါသည်"
                          )}
                        </span>
                      </div>
                      <div className="hidden sm:block text-gray-400 dark:text-gray-600">
                        •
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {t(
                            "24-hour response time",
                            "၂၄ နာရီအတွင်း တုံ့ပြန်မှု"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }