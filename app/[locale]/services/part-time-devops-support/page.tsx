"use client";

import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Users,
  Lightbulb,
  Scale,
  Zap,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Target,
  BellRing,
  Workflow,
  Code,
  Activity,
  Dock,
  Database,
  RefreshCw,
  Handshake,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Play,
  ExternalLink,
  MessageSquare,
  Calendar,
  Clock,
  ChevronDown,
  Cloud,
  Server,
  GitBranch,
  Layers,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PartTimeDevOpsSupportPage() {
  const params = useParams();
  const currentLocale = (params?.locale as "en" | "my") || "en";
  const [mounted, setMounted] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    current_environment: "",
    project_goals: "",
    preferred_time: "",
  });

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  // Fix Hydration Error: Ensure component only renders after mounting on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (enText: string, myText: string) => {
    return currentLocale === "en" ? enText : myText;
  };

  // Handle form input changes
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Submitting form data:", formData);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      console.log("API URL:", `${apiUrl}/api/consultations/book/`);

      const response = await fetch(`${apiUrl}/api/consultations/book/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (response.ok) {
        // Show success alert
        setAlertState({
          isOpen: true,
          title: t("Success", "အောင်မြင်ပါသည်"),
          message: t(
            "Thank you! Your consultation request has been submitted successfully. We'll contact you within 24 hours.",
            "ကျေးဇူးတင်ပါသည်! သင်၏ ဆွေးနွေးတိုင်ပင်မှု တောင်းဆိုချက်ကို အောင်မြင်စွာ လက်ခံရရှိပါသည်။ ကျွန်ုပ်တို့သည် ၂၄ နာရီအတွင်း သင့်ထံ ဆက်သွယ်ပါမည်။"
          ),
          type: "success",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          company: "",
          current_environment: "",
          project_goals: "",
          preferred_time: "",
        });

        // Close modal after 1 second
        setTimeout(() => {
          setIsBookingModalOpen(false);
        }, 1000);
      } else {
        // Show error alert
        setAlertState({
          isOpen: true,
          title: t("Error", "အမှား"),
          message: t(
            "Failed to submit booking. Please try again or contact us directly.",
            "အာဏာပိုင်သို့ မပေးပို့နိုင်ပါ။ ကျေးဇူးပြု၍ ထပ်မံကြိုးစားကြည့်ပါ သို့မဟုတ် တိုက်ရိုက်ဆက်သွယ်ပါ။"
          ),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      setAlertState({
        isOpen: true,
        title: t("Network Error", "Network အမှား"),
        message: t(
          "Network error. Please check your connection and try again.",
          "Network error. ကျေးဇူးပြု၍ သင့်ချိတ်ဆက်မှုကို စစ်ဆေးပြီး ထပ်မံကြိုးစားကြည့်ပါ။"
        ),
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Scale,
      title: t("Flexible Engagement", "Flexible ဖြစ်တဲ့ ဝန်ဆောင်မှု"),
      description: t(
        "Custom support hours tailored to your needs from 10-40 hours per week, scalable as your business grows",
        "သင့်လုပ်ငန်းလိုအပ်ချက်နှင့်အညီ အပတ်စဉ် ၁၀ နာရီမှ ၄၀ နာရီအထိ အချိန်ကို ညှိနှိုင်းဆောင်ရွက်ပေးခြင်း"
      ),
    },
    {
      icon: Zap,
      title: t("Cost-Effective", "ကုန်ကျစရိတ် သက်သာခြင်း"),
      description: t(
        "Save 50-70% on operational costs compared to full-time hires with no recruitment, benefits, or training expenses",
        "လစာအပြည့်ပေးရန်မလိုဘဲ အသုံးပြုသလောက်သာ ကျသင့်ခြင်း၊ ဝန်ထမ်းခန့်ခြင်း၊ လေ့ကျင့်ပေးခြင်းနှင့် အခြားစရိတ်များ မရှိခြင်း"
      ),
    },
    {
      icon: ShieldCheck,
      title: t("Expert Support", "ကျွမ်းကျင်ပညာရှင်များ၏ အကူအညီ"),
      description: t(
        "Access senior DevOps professionals with 5+ years experience in Kubernetes, Terraform, AWS/Azure/GCP, and modern CI/CD tooling",
        "အတွေ့အကြုံ ၅ နှစ်အထက်ရှိ Kubernetes, Terraform, AWS/Azure/GCP နှင့် ခေတ်မီ CI/CD tooling တွင်ကျွမ်းကျင်သော Senior DevOps များထံမှ အကြံဉာဏ်ရယူနိုင်ခြင်း"
      ),
    },
    {
      icon: RefreshCw,
      title: t("Continuous Improvement", "တိုးတက်ကောင်းမွန်စေခြင်း"),
      description: t(
        "Ongoing optimization, security updates, performance monitoring, and proactive maintenance of your infrastructure",
        "system ကို အမြဲတမ်း အကောင်းဆုံးဖြစ်အောင် လုံခြုံရေးအပ်ဒိတ်များ၊ စွမ်းဆောင်ရည်စောင့်ကြည့်ခြင်းနှင့် ကြိုတင်ပြင်ဆင်ထိန်းသိမ်းခြင်းများ ပြုလုပ်ပေးခြင်း"
      ),
    },
  ];

  const stats = [
    {
      value: "50-70%",
      label: t("Cost Savings", "ကုန်ကျစရိတ် လျှော့ချနိုင်မှု"),
      icon: ArrowRight,
    },
    {
      value: "24/7",
      label: t("Support Available", "အမြဲတမ်း support ပေးနိုင်မှု"),
      icon: Activity,
    },
    {
      value: "10x",
      label: t("Faster Resolution", "ပိုမိုမြန်ဆန်သော deployment"),
      icon: Zap,
    },
    {
      value: "99.9%",
      label: t("Uptime Guarantee", "သင့်လုပ်ငန်း အမြဲတမ်း အလုပ်လုပ်နိုင်မှု"),
      icon: CheckCircle2,
    },
  ];

  const handleCaseStudiesClick = () => {
    window.open(
      "https://github.com/thaunghtike-share/DevOps-Projects",
      "_blank"
    );
  };

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white/95 dark:bg-[#000000] relative transition-colors duration-300">
      {/* Messenger Button - Hidden on mobile */}
      <a
        href="https://m.me/learndevopsnowbytho"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("Messenger Support", "Messenger အကူအညီ")}
        className="hidden md:flex fixed top-[70%] right-4 z-50 group"
      >
        <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg rounded-full px-4 py-3 cursor-pointer transition-all duration-400 hover:scale-105 hover:shadow-xl">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="text-sm font-medium text-black dark:text-white">
            {t("Chat Now", "ချက်ချင်းစကားပြောရန်")}
          </span>
        </div>
      </a>

      <MinimalHeader />

      <main className="px-4 md:px-11 md:py-8">
        {/* Hero Section */}
        <section className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Blue/Purple gradient line with "Our Mission" style */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                DevOps Support Services
              </span>
            </div>
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Part-Time DevOps Support
            </h1>

            {/* Description - Left Aligned */}
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-3xl text-left">
              {t(
                "Get expert DevOps assistance when you need it without the expense of full-time hires. Flexible, cost-effective support tailored to your specific requirements with modern tooling including Kubernetes, Terraform, CI/CD pipelines, and cloud infrastructure management.",
                "Full-time ဝန်ထမ်းခန့်ရန် မလိုအပ်ဘဲ Kubernetes, Terraform, CI/CD pipelines, နှင့် cloud infrastructure management အပါအဝင် ခေတ်မီ tooling များဖြင့် ကျွမ်းကျင် DevOps သမားများ၏ အကူအညီကို လိုအပ်သည့်အချိန်တိုင်း ရယူလိုက်ပါ။ ကုန်ကျစရိတ် သက်သာစေမည့်အပြင် သင့်လုပ်ငန်းနှင့် အကိုက်ညီဆုံး ဝန်ဆောင်မှုကို ပေးဆောင်သွားမှာ ဖြစ်ပါသည်။"
              )}
            </p>

            {/* Feature Grid - Stack on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-left group p-4 md:p-0"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-3 md:mb-4 group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-black dark:text-white mb-1 md:mb-2 text-base md:text-lg text-left">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-black dark:text-gray-300 leading-relaxed text-left">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-start items-start">
              <Button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 md:px-8 md:py-3 rounded-xl text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t("Start Free Consultation", "အခမဲ့ ဆွေးနွေးတိုင်ပင်ရန်")}
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="mb-16 md:mb-20">
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <stat.icon className="w-5 h-5 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-xl md:text-3xl font-bold text-black dark:text-white mb-1 md:mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-black dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What is Part-Time DevOps Support */}
        <section className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Blue/Purple gradient line with "Our Mission" style */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Flexible DevOps Solutions
              </span>
            </div>
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              What is Part-Time DevOps Support?
            </h1>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              {t(
                "Expert DevOps assistance whenever you need it with flexible engagement models and comprehensive coverage across your infrastructure lifecycle",
                "ကျွမ်းကျင် DevOps Engineer များ၏ အကူအညီကို flexible engagement models ဖြင့် လိုအပ်ချိန်တိုင်း ရယူနိုင်ခြင်းနှင့် သင့် infrastructure lifecycle တစ်ခုလုံးကို ပြည့်စုံစွာ ဖုံးလွှမ်းထားခြင်း"
              )}
            </p>
          </motion.div>

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl dark:bg-gray-800">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                {t("Flexible DevOps Expertise", "Flexible DevOps Expertise")}
              </CardTitle>
              <CardDescription className="text-black dark:text-gray-300 text-base md:text-lg text-left">
                {t(
                  "Access senior DevOps professionals on your terms with scalable support models",
                  "Access senior DevOps professionals on your terms with scalable support models"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <p className="text-black dark:text-gray-300 leading-relaxed text-base md:text-lg text-left">
                {t(
                  "Part-time DevOps support connects your organization with skilled DevOps engineers on a flexible, as-needed basis. Perfect for projects requiring specialized expertise, temporary resource gaps, or ongoing maintenance without the cost of full-time staff. Our engineers are proficient in modern toolchains including Kubernetes, Docker, Terraform, CI/CD pipelines, monitoring solutions, and cloud platforms (AWS, Azure, GCP).",
                  "Part-time DevOps Support ဆိုသည်မှာ သင့်လုပ်ငန်းအတွက် Kubernetes, Docker, Terraform, CI/CD pipelines, monitoring solutions နှင့် cloud platforms (AWS, Azure, GCP) တို့တွင် ကျွမ်းကျင်သော DevOps Engineer များကို လိုအပ်သည့်အချိန်နှင့် ပမာဏအလိုက် ချိတ်ဆက်လုပ်ဆောင်ပေးသည့် ဝန်ဆောင်မှု ဖြစ်ပါသည်။ ဝန်ထမ်းအင်အား မလုံလောက်မှုများ သို့မဟုတ် Full-time ခန့်အပ်ရန် အခက်အခဲရှိသော လုပ်ငန်းများအတွက် အသင့်တော်ဆုံး ဖြစ်ပါသည်။"
                )}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  {
                    icon: Users,
                    title: t("On-Demand Expertise", "On-Demand Expertise"),
                    desc: t(
                      "Access experienced DevOps professionals exactly when you need them for Kubernetes troubleshooting, CI/CD pipeline optimization, or infrastructure scaling.",
                      "Kubernetes troubleshooting, CI/CD pipeline optimization, သို့မဟုတ် infrastructure scaling အတွက် အတွေ့အကြုံရှိ DevOps Engineer များကို သင်လိုအပ်သော အချိန်တွင် ရယူနိုင်ပါသည်။"
                    ),
                    color: "blue",
                  },
                  {
                    icon: Scale,
                    title: t("Cost-Effective", "Cost-Effective"),
                    desc: t(
                      "Only pay for the support you need, avoiding full-time salary expenses, benefits packages, recruitment costs, and training overhead.",
                      "လစာအပြည့်ပေးရန်မလိုဘဲ လိုအပ်သော ဝန်ဆောင်မှုအတွက်သာ ပေးချေရသဖြင့် ဝန်ထမ်းခန့်ခြင်း၊ လေ့ကျင့်ပေးခြင်းနှင့် အခြားစရိတ်များ မရှိခြင်း။"
                    ),
                    color: "green",
                  },
                  {
                    icon: RefreshCw,
                    title: t("Flexible Engagement", "Flexible Engagement"),
                    desc: t(
                      "Customize support hours and project scopes to your specific needs with weekly, monthly, or on-call arrangements tailored to your business cycles.",
                      "အလုပ်လုပ်မည့် နာရီနှင့် ပမာဏကို အပတ်စဉ်၊ လစဉ် သို့မဟုတ် လိုအပ်သည့်အချိန်မှ ခေါ်ယူသည့် စနစ်ဖြင့် သင့်စိတ်ကြိုက် သတ်မှတ်နိုင်ပါသည်။"
                    ),
                    color: "orange",
                  },
                  {
                    icon: BookOpen,
                    title: t("Strategic Guidance", "Strategic Guidance"),
                    desc: t(
                      "Receive expert advice to improve your DevOps maturity, cloud strategy, security posture, and operational excellence with modern best practices.",
                      "သင့်လုပ်ငန်း၏ Cloud နှင့် DevOps စနစ်များ၊ လုံခြုံရေးအခြေအနေ နှင့် လုပ်ငန်းလည်ပတ်မှု စွမ်းဆောင်ရည်များ ပိုမိုကောင်းမွန်လာစေရန် ခေတ်မီ best practices များဖြင့် မှန်ကန်တဲ့ အကြံပေးမှုများကို ပြုလုပ်ပေးပါမည်။"
                    ),
                    color: "purple",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white dark:bg-gray-700 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300 group"
                  >
                    <div
                      className={`p-2 md:p-3 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg md:rounded-xl flex-shrink-0 group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon
                        className={`w-5 h-5 md:w-6 md:h-6 text-${item.color}-600 dark:text-${item.color}-400`}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-black dark:text-white mb-1 md:mb-2 text-base md:text-lg text-left">
                        {item.title}
                      </h4>
                      <p className="text-black dark:text-gray-300 leading-relaxed text-sm md:text-base text-left">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Benefits Section */}
        <section className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Blue/Purple gradient line with "Our Mission" style */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Business Advantages
              </span>
            </div>
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Why Choose Part-Time DevOps?
            </h1>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              {t(
                "Save costs and boost efficiency with expert, flexible support while maintaining operational excellence and technical innovation",
                "Save costs and boost efficiency with expert, flexible support while maintaining operational excellence and technical innovation"
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl dark:bg-gray-800">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                  <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg md:rounded-xl">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  {t("Business Benefits", "လုပ်ငန်းဆိုင်ရာ အကျိုးကျေးဇူးများ")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {[
                    {
                      icon: Scale,
                      title: t("Cost Savings", "ကုန်ကျစရိတ် သက်သာခြင်း"),
                      desc: t(
                        "Lower operational expenses by 50-70% compared to hiring full-time DevOps staff with all associated overhead costs eliminated.",
                        "Full-time ဝန်ထမ်းခန့်ခြင်းထက် လုပ်ငန်းလည်ပတ်မှု ကုန်ကျစရိတ်ကို ၅၀-၇၀% အထိ သိသိသာသာ လျှော့ချနိုင်ပါသည်။"
                      ),
                      color: "green",
                    },
                    {
                      icon: Target,
                      title: t(
                        "Focus on Core Business",
                        "အဓိကလုပ်ငန်းအပေါ် အာရုံစိုက်နိုင်ခြင်း"
                      ),
                      desc: t(
                        "Let your internal teams focus on product development, customer experience, and business growth while we handle the complex DevOps infrastructure and operations.",
                        "DevOps အပိုင်းကို ကျွန်ုပ်တို့ကို လွှဲထားပြီး သင့်ဝန်ထမ်းများက Product Development, Customer Experience နှင့် Business Growth အပေါ် ပိုမိုအာရုံစိုက်နိုင်ပါသည်။"
                      ),
                      color: "blue",
                    },
                    {
                      icon: Zap,
                      title: t("Increased Agility", "မြန်ဆန်သွက်လက်လာခြင်း"),
                      desc: t(
                        "Adapt quickly to changing project demands, seasonal workloads, and business opportunities with on-demand DevOps expertise and scalable support.",
                        "လိုအပ်ချက်အပြောင်းအလဲများ၊ ရာသီအလိုက် အလုပ်ဝန်ပိုများနှင့် business opportunities များကို on-demand DevOps expertise နှင့် scalable support ဖြင့် အချိန်နှင့်တပြေးညီ လိုက်လျောညီထွေ ဆောင်ရွက်နိုင်ပါသည်။"
                      ),
                      color: "orange",
                    },
                    {
                      icon: ShieldCheck,
                      title: t("Reduced Overhead", "အလုပ်ရှုပ်သက်သာခြင်း"),
                      desc: t(
                        "Avoid recruitment, onboarding, benefits, training, and management costs associated with permanent hires while maintaining high-quality DevOps services.",
                        "ဝန်ထမ်းရှာဖွေခြင်း၊ လေ့ကျင့်ပေးခြင်း၊ စီမံခန့်ခွဲခြင်းနှင့် အခြားဝန်ထမ်းစရိတ်များကို သက်သာစေပြီး အရည်အသွေးမြင့် DevOps services ကို ရရှိနိုင်ပါသည်။"
                      ),
                      color: "purple",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 md:gap-3"
                    >
                      <div
                        className={`p-1 md:p-2 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded md:rounded-lg flex-shrink-0 mt-1`}
                      >
                        <item.icon
                          className={`w-3 h-3 md:w-4 md:h-4 text-${item.color}-600 dark:text-${item.color}-400`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black dark:text-white mb-1 text-sm md:text-base text-left">
                          {item.title}
                        </h4>
                        <p className="text-black dark:text-gray-300 text-xs md:text-sm text-left">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl dark:bg-gray-800">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                  <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  {t("Technical Benefits", "နည်းပညာဆိုင်ရာ အကျိုးကျေးဇူးများ")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {[
                    {
                      icon: Lightbulb,
                      title: t(
                        "Access to Top Talent",
                        "ထိပ်တန်းကျွမ်းကျင်သူများ၏ အကြံဉာဏ်"
                      ),
                      desc: t(
                        "Work with highly skilled professionals who stay current on industry trends, security best practices, and emerging technologies in cloud-native ecosystems.",
                        "ခေတ်မီနည်းပညာများ၊ လုံခြုံရေး best practices နှင့် cloud-native ecosystems တွင် emerging technologies များကို အမြဲလေ့လာနေသော ကျွမ်းကျင်ပညာရှင်များနှင့် လက်တွဲလုပ်ဆောင်ခွင့် ရမည်။"
                      ),
                      color: "blue",
                    },
                    {
                      icon: BellRing,
                      title: t(
                        "Proactive Problem Solving",
                        "ပြဿနာများကို ကြိုတင်ကာကွယ်ခြင်း"
                      ),
                      desc: t(
                        "Prevent costly outages, security breaches, and performance degradation with proactive monitoring, automated alerts, and issue resolution before they impact your business.",
                        "စနစ်ပြတ်တောက်မှုများ၊ လုံခြုံရေးချိုးဖောက်မှုများ နှင့် စွမ်းဆောင်ရည်ကျဆင်းမှုများ မဖြစ်အောင် ကြိုတင်စောင့်ကြည့်ပြီး automated alerts နှင့် ဖြေရှင်းပေးပါသည်။"
                      ),
                      color: "teal",
                    },
                    {
                      icon: Workflow,
                      title: t("Best Practices", "နိုင်ငံတကာစံနှုန်းများ"),
                      desc: t(
                        "Implement industry-standard DevOps practices, GitOps workflows, Infrastructure as Code, and modern tooling that follows enterprise-grade security and compliance standards.",
                        "အဆင့်မြင့် DevOps စံနှုန်းများ၊ GitOps workflows, Infrastructure as Code နှင့် enterprise-grade security and compliance standards များကို လိုက်နာသော Tool များကို သင့်လုပ်ငန်းတွင် အကောင်အထည်ဖော်ပေးပါသည်။"
                      ),
                      color: "green",
                    },
                    {
                      icon: RefreshCw,
                      title: t(
                        "Continuous Improvement",
                        "အမြဲမပြတ် တိုးတက်မှု"
                      ),
                      desc: t(
                        "Ongoing optimization of your infrastructure, processes, security posture, and cost efficiency with regular reviews, performance tuning, and technology updates.",
                        "သင့်လုပ်ငန်း၏ နည်းပညာစနစ်များ၊ လုပ်ငန်းစဉ်များ၊ လုံခြုံရေးအခြေအနေ နှင့် ကုန်ကျစရိတ် ထိရောက်မှုများကို အမြဲမပြတ် အဆင့်မြှင့်တင်ပေးပါသည်။"
                      ),
                      color: "orange",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 md:gap-3"
                    >
                      <div
                        className={`p-1 md:p-2 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded md:rounded-lg flex-shrink-0 mt-1`}
                      >
                        <item.icon
                          className={`w-3 h-3 md:w-4 md:h-4 text-${item.color}-600 dark:text-${item.color}-400`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black dark:text-white mb-1 text-sm md:text-base text-left">
                          {item.title}
                        </h4>
                        <p className="text-black dark:text-gray-300 text-xs md:text-sm text-left">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Blue/Purple gradient line with "Our Mission" style */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Comprehensive Coverage
              </span>
            </div>
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Comprehensive DevOps Services
            </h1>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              {t(
                "End-to-end support across your entire DevOps lifecycle with modern toolchains and enterprise-grade solutions",
                "End-to-end support across your entire DevOps lifecycle with modern toolchains and enterprise-grade solutions"
              )}
            </p>
          </motion.div>

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl dark:bg-gray-800">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg md:rounded-xl">
                  <Workflow className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                {t("Key Services Offered", "Key Services Offered")}
              </CardTitle>
              <CardDescription className="text-black dark:text-gray-300 text-base md:text-lg text-left">
                {t(
                  "Everything you need to optimize your DevOps operations across cloud platforms, Kubernetes, CI/CD, monitoring, and security",
                  "Everything you need to optimize your DevOps operations across cloud platforms, Kubernetes, CI/CD, monitoring, and security"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[
                  {
                    icon: Zap,
                    title: "CI/CD Pipeline Optimization",
                    desc: t(
                      "Streamline and automate build, test, and deployment workflows for faster releases using GitHub Actions, GitLab CI, Jenkins, ArgoCD, and modern deployment strategies.",
                      "build, test, deploy အဆင့်တိုင်းကို GitHub Actions, GitLab CI, Jenkins, ArgoCD နှင့် modern deployment strategies တို့ဖြင့် ပိုမိုမြန်ဆန်အောင် အလိုအလျောက်စနစ်ဖြင့် တည်ဆောက်ခြင်း။"
                    ),
                    color: "blue",
                  },
                  {
                    icon: Code,
                    title: "Infrastructure Automation",
                    desc: t(
                      "Implement Infrastructure as Code using tools like Terraform, Pulumi, Ansible, and Crossplane for consistent, repeatable cloud infrastructure across AWS, Azure, and GCP.",
                      "Terraform, Pulumi, Ansible, နှင့် Crossplane စသည့် Tool များဖြင့် AWS, Azure, GCP ပေါ်ရှိ Infrastructure ကို တစ်ပုံစံတည်း၊ အချိန်မရွေး ပြန်လည်အသုံးပြုနိုင်သော Code အဖြစ် အလိုအလျောက် စီမံခြင်း။"
                    ),
                    color: "green",
                  },
                  {
                    icon: Scale,
                    title: "Cloud Cost Optimization",
                    desc: t(
                      "Analyze and reduce your AWS, Azure, or GCP cloud spending by 30-60% with rightsizing recommendations, reserved instances, spot instance strategies, and waste elimination.",
                      "သင့်လုပ်ငန်း၏ Cloud ကုန်ကျစရိတ်များကို rightsizing recommendations, reserved instances, spot instance strategies နှင့် waste elimination တို့ဖြင့် ၃၀-၆၀% အထိ လျှော့ချပေးခြင်း။"
                    ),
                    color: "purple",
                  },
                  {
                    icon: Activity,
                    title: "Monitoring & Alerting",
                    desc: t(
                      "Deploy comprehensive monitoring solutions with Prometheus, Grafana, ELK Stack, and configure automated alerts for proactive management of applications and infrastructure.",
                      "အမြဲစောင့်ကြည့်ပြီး Prometheus, Grafana, ELK Stack တို့ဖြင့် ပြဿနာရှိပါက ချက်ချင်းသတင်းပို့ပေးမည့် စနစ်များ ထည့်သွင်းခြင်း။"
                    ),
                    color: "orange",
                  },
                  {
                    icon: Dock,
                    title: "Kubernetes Management",
                    desc: t(
                      "Assist with deployment, scaling, security, and troubleshooting of Kubernetes clusters (EKS, AKS, GKE) including Helm charts, operators, and service mesh configurations.",
                      "Kubernetes Cluster များ (EKS, AKS, GKE) ကို Helm charts, operators, နှင့် service mesh configurations အပါအဝင် စနစ်တကျ ပြင်ဆင်ခြင်းနှင့် စီမံခန့်ခွဲပေးခြင်း။"
                    ),
                    color: "teal",
                  },
                  {
                    icon: Database,
                    title: "Database & Storage Support",
                    desc: t(
                      "Manage cloud databases (RDS, CosmosDB, Cloud SQL), backups, disaster recovery, and storage solutions for optimal performance, security, and reliability.",
                      "Database များ (RDS, CosmosDB, Cloud SQL), Backups, Disaster Recovery နှင့် Storage Solutions များကို အကောင်းဆုံး စွမ်းဆောင်ရည်၊ လုံခြုံရေးနှင့် ယုံကြည်စိတ်ချရစေရန် စီမံခန့်ခွဲပေးခြင်း။"
                    ),
                    color: "red",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-4 md:p-6 bg-white dark:bg-gray-700 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
                  >
                    <div
                      className={`p-2 md:p-3 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg md:rounded-xl mb-3 md:mb-4 mx-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center`}
                    >
                      <item.icon
                        className={`w-4 h-4 md:w-6 md:h-6 text-${item.color}-600 dark:text-${item.color}-400`}
                      />
                    </div>
                    <h4 className="font-bold text-black dark:text-white mb-1 md:mb-2 text-base md:text-lg">
                      {item.title}
                    </h4>
                    <p className="text-black dark:text-gray-300 text-xs md:text-sm">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Blue/Purple gradient line with "Our Mission" style */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Engagement Process
              </span>
            </div>
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              How It Works
            </h1>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              {t(
                "Simple 4-step process to get expert DevOps support with clear communication, defined outcomes, and ongoing collaboration",
                "Simple 4-step process to get expert DevOps support with clear communication, defined outcomes, and ongoing collaboration"
              )}
            </p>
          </motion.div>

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl dark:bg-gray-800">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                  <Handshake className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                {t("Simple Engagement Process", "Simple Engagement Process")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  {
                    step: "1",
                    title: t("Initial Consultation", "ပထမဆုံး ဆွေးနွေးခြင်း"),
                    desc: t(
                      "Discuss your current challenges, project goals, technical requirements, and desired outcomes with our DevOps experts.",
                      "သင့်လုပ်ငန်း၏ အခက်အခဲများ၊ နည်းပညာလိုအပ်ချက်များနှင့် ရည်မှန်းချက်များကို ကျွန်ုပ်တို့၏ DevOps experts များနှင့် ဆွေးနွေးခြင်း။"
                    ),
                    icon: Users,
                    color: "blue",
                  },
                  {
                    step: "2",
                    title: t("Scope Definition", "အလုပ်ပမာဏ သတ်မှတ်ခြင်း"),
                    desc: t(
                      "Work together to define the project scope, deliverables, timeline, success metrics, and communication protocols for transparent collaboration.",
                      "ဆောင်ရွက်မည့် အပိုင်းများ၊ ရလဒ်များ၊ ကြာချိန်၊ အောင်မြင်မှုအတိုင်းအတာများနှင့် ဆက်သွယ်ရေးစနစ်များကို သတ်မှတ်ခြင်း။"
                    ),
                    icon: BookOpen,
                    color: "green",
                  },
                  {
                    step: "3",
                    title: t("Execution & Reporting", "ဆောင်ရွက်ခြင်း"),
                    desc: t(
                      "Our experts perform the work using modern DevOps tooling, providing regular progress updates, detailed reports, and transparent communication throughout.",
                      "အလုပ်များကို ခေတ်မီ DevOps tooling များဖြင့် ဆောင်ရွက်ပြီး ပုံမှန် progress updates, detailed reports နှင့် transparent communication များ တင်ပြခြင်း။"
                    ),
                    icon: Code,
                    color: "purple",
                  },
                  {
                    step: "4",
                    title: t("Ongoing Support", "အမြဲတမ်း အကူအညီပေးခြင်း"),
                    desc: t(
                      "Continuous assistance, maintenance, optimization, and strategic guidance as your business evolves, with flexible scaling based on your changing needs.",
                      "လိုအပ်ချက်နှင့်အညီ flexible scaling ဖြင့် ဆက်လက် ပြုပြင်ထိန်းသိမ်းပေးခြင်း၊ အကောင်းဆုံးဖြစ်အောင်ပြင်ဆင်ပေးခြင်းနှင့် မဟာဗျူဟာမြောက် အကြံဉာဏ်များ ပေးခြင်း။"
                    ),
                    icon: RefreshCw,
                    color: "orange",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-4 md:p-6 bg-white dark:bg-gray-700 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
                  >
                    <div
                      className={`p-2 md:p-3 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg md:rounded-xl mb-3 md:mb-4 mx-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center`}
                    >
                      <item.icon
                        className={`w-4 h-4 md:w-6 md:h-6 text-${item.color}-600 dark:text-${item.color}-400`}
                      />
                    </div>
                    <h4 className="font-bold text-black dark:text-white mb-1 md:mb-2 text-base md:text-lg">
                      {item.title}
                    </h4>
                    <p className="text-black dark:text-gray-300 text-xs md:text-sm">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="mb-12 md:mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 border-0 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden">
            <CardContent className="p-6 md:p-12 text-center text-white">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-left md:text-center">
                  {t(
                    "Ready to Enhance Your DevOps Capability?",
                    "Ready to Enhance Your DevOps Capability?"
                  )}
                </h2>
                <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-6 md:mb-8 leading-relaxed text-left md:text-center">
                  {t(
                    "Contact us today for a personalized consultation and a flexible support plan tailored to your business needs with modern DevOps tooling and expert guidance.",
                    "သင့်လုပ်ငန်းလိုအပ်ချက်နှင့် အကိုက်ညီဆုံး ဝန်ဆောင်မှုကို ခေတ်မီ DevOps tooling နှင့် ကျွမ်းကျင်အကြံဉာဏ်များဖြင့် ရယူနိုင်ရန် ဒီနေ့ပဲ ကျွန်ုပ်တို့နှင့် ဆွေးနွေးတိုင်ပင်လိုက်ပါ။"
                  )}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    onClick={() => setIsBookingModalOpen(true)}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 md:px-8 md:py-3 rounded-xl text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                  >
                    <Rocket className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {t("Start Free Consultation", "အခမဲ့ ဆွေးနွေးတိုင်ပင်ရန်")}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCaseStudiesClick}
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 md:px-8 md:py-3 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 w-full sm:w-auto"
                  >
                    {t("View Case Studies", "မှတ်တမ်းများ ကြည့်ရန်")}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-blue-500">
                  {[
                    {
                      icon: CheckCircle2,
                      label: t(
                        "Flexible Plans",
                        "Flexible ဖြစ်တဲ့ အစီအစဉ်များ"
                      ),
                      desc: t("Tailored to your needs", "လိုအပ်ချက်နှင့်အညီ"),
                    },
                    {
                      icon: ShieldCheck,
                      label: t("Expert Team", "ကျွမ်းကျင်သော devops များ"),
                      desc: t(
                        "Senior DevOps professionals",
                        "စီနီယာ ပညာရှင်များ"
                      ),
                    },
                    {
                      icon: Zap,
                      label: t("Rapid Start", "ချက်ချင်း စတင်နိုင်မှု"),
                      desc: t(
                        "Get started in days",
                        "ရက်ပိုင်းအတွင်း စတင်နိုင်ခြင်း"
                      ),
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <item.icon className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 text-white" />
                      <h4 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">
                        {item.label}
                      </h4>
                      <p className="text-blue-200 dark:text-blue-300 text-xs md:text-sm">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <MinimalFooter />

      {/* Modern Alert Dialog */}
      <AlertDialog
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        duration={5000}
      />

      {/* Premium Booking Modal - Optimized for Mobile */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          {/* Mobile: Bottom sheet style, Desktop: Centered modal (original design preserved) */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg md:rounded-3xl shadow-2xl w-full md:max-w-md h-[90vh] md:h-auto md:max-h-[85vh] overflow-hidden border border-gray-200/30 dark:border-gray-800/30 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header with Drag Handle */}
            <div className="md:hidden pt-4 px-4">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  {t("Schedule Consultation", "ဆွေးနွေးပွဲ ချိန်းဆိုရန်")}
                </h3>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
              </div>
            </div>

            {/* Desktop Close Button - EXACTLY AS BEFORE */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
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

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              {/* Desktop Header - EXACTLY AS BEFORE */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-md">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                      {t("Schedule Consultation", "ဆွေးနွေးပွဲ ချိန်းဆိုရန်")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t(
                        "Free 30-minute DevOps support assessment",
                        "DevOps Support အကဲဖြတ်ခြင်း (၃၀ မိနစ်)"
                      )}
                    </p>
                  </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name & Email - Mobile: Stack vertically, Desktop: Grid */}
                <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
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

                {/* Current Infrastructure & Preferred Time - Mobile: Stack vertically, Desktop: Grid */}
                <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
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
                          {t("Weekday Morning", "အလုပ်ရက် မနက်ပိုင်း")}
                        </option>
                        <option value="afternoon">
                          {t("Weekday Afternoon", "အလုပ်ရက် နေ့လယ်ပိုင်း")}
                        </option>
                        <option value="evening">
                          {t("Weekday Evening", "အလုပ်ရက် ညနေပိုင်း")}
                        </option>
                        <option value="flexible">
                          {t("Flexible Schedule", "လိုက်လျောညီထွေ")}
                        </option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* DevOps Support Needs */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t("Support Requirements", "Support လိုအပ်ချက်များ")}
                  </label>
                  <textarea
                    rows={3}
                    name="project_goals"
                    value={formData.project_goals}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 resize-none transition-all duration-300"
                    placeholder={t(
                      "Describe your DevOps support needs, challenges, or project goals...",
                      "သင်၏ DevOps support လိုအပ်ချက်များ၊ အခက်အခဲများ သို့မဟုတ် စီမံကိန်း ရည်မှန်းချက်များကို ရှင်းပြပါ..."
                    )}
                  />
                </div>

                {/* Submit Button - Mobile: Sticky at bottom, Desktop: Normal */}
                <div className="sticky md:static bottom-0 bg-white/95 dark:bg-gray-900/95 pt-6 md:pt-0 -mx-4 md:mx-0 px-4 md:px-0 -mb-4 md:mb-0">
                  <Button
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
                          "အခမဲ့ ဆွေးနွေးပွဲ ချိန်းဆိုမည်"
                        )}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Button>

                  {/* Privacy Note - Mobile: Smaller spacing */}
                  <div className="pt-6 mt-6 md:mt-6 border-t border-gray-300/30 dark:border-gray-700/30">
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
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}