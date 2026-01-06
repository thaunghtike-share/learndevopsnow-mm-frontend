"use client";

import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
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

  // Fix Hydration Error: Ensure component only renders after mounting on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (enText: string, myText: string) => {
    return currentLocale === "en" ? enText : myText;
  };

  const features = [
    {
      icon: Scale,
      title: t("Flexible Engagement", "Flexible ဖြစ်တဲ့ ဝန်ဆောင်မှု"),
      description: t("Custom support hours tailored to your needs", "သင့်လုပ်ငန်းလိုအပ်ချက်နှင့်အညီ အချိန်ကို ညှိနှိုင်းဆောင်ရွက်ပေးခြင်း"),
    },
    {
      icon: Zap,
      title: t("Cost-Effective", "ကုန်ကျစရိတ် သက်သာခြင်း"),
      description: t("No full-time salary expenses", "လစာအပြည့်ပေးရန်မလိုဘဲ အသုံးပြုသလောက်သာ ကျသင့်ခြင်း"),
    },
    {
      icon: ShieldCheck,
      title: t("Expert Support", "ကျွမ်းကျင်ပညာရှင်များ၏ အကူအညီ"),
      description: t("Senior DevOps professionals on demand", "လိုအပ်သည့်အချိန်တိုင်း Senior DevOps များထံမှ အကြံဉာဏ်ရယူနိုင်ခြင်း"),
    },
    {
      icon: RefreshCw,
      title: t("Continuous Improvement", "တိုးတက်ကောင်းမွန်စေခြင်း"),
      description: t("Ongoing optimization and maintenance", "system ကို အမြဲတမ်း အကောင်းဆုံးဖြစ်အောင် ပြုပြင်ထိန်းသိမ်းပေးခြင်း"),
    },
  ];

  const stats = [
    { value: "50%", label: t("Cost Savings", "ကုန်ကျစရိတ် လျှော့ချနိုင်မှု"), icon: ArrowRight },
    { value: "24/7", label: t("Support Available", "အမြဲတမ်း support ပေးနိုင်မှု"), icon: Activity },
    { value: "10x", label: t("Faster Resolution", "ပိုမိုမြန်ဆန်သော deployment"), icon: Zap },
    { value: "99.9%", label: t("Uptime Guarantee", "သင့်လုပ်ငန်း အမြဲတမ်း အလုပ်လုပ်နိုင်မှု"), icon: CheckCircle2 },
  ];

  const handleEmailClick = () => {
    const subject = t("Part-Time DevOps Support Consultation", "Part-Time DevOps ဝန်ဆောင်မှုအတွက် ဆွေးနွေးတိုင်ပင်ရန်");
    const body = t("Hi, I'm interested in learning more about your part-time DevOps support services.", "မင်္ဂလာပါ၊ သင်တို့၏ Part-Time DevOps support ဝန်ဆောင်မှုများအကြောင်း သိရှိလိုပါသည်။");
    window.location.href = `mailto:thaunghtikeoo.tho1234@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

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

      <main className="px-6 md:px-11 md:py-8">
        {/* Hero Section - Left Aligned */}
        <section className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Underline */}
            <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-4 md:mb-6"></div>

            {/* Main Title - Left Aligned */}
            <h1 className="text-3xl md:text-6xl font-bold text-black dark:text-white mb-4 md:mb-6 leading-tight text-left">
              Part-Time
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                DevOps Support
              </span>
            </h1>

            {/* Description - Left Aligned */}
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-3xl text-left">
              {t(
                "Get expert DevOps assistance when you need it without the expense of full-time hires. Flexible, cost-effective support tailored to your specific requirements.",
                "Full-time ဝန်ထမ်းခန့်ရန် မလိုအပ်ဘဲ ကျွမ်းကျင် DevOps သမားများ၏ အကူအညီကို လိုအပ်သည့်အချိန်တိုင်း ရယူလိုက်ပါ။ ကုန်ကျစရိတ် သက်သာစေမည့်အပြင် သင့်လုပ်ငန်းနှင့် အကိုက်ညီဆုံး ဝန်ဆောင်မှုကို ပေးဆောင်သွားမှာ ဖြစ်ပါသည်။"
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
                  <h3 className="font-semibold text-black dark:text-white mb-1 md:mb-2 text-base md:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-black dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-start items-start">
              <Button
                onClick={handleEmailClick}
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
          <div className="text-left mb-8 md:mb-12">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                ?
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
                  {t("What is Part-Time DevOps Support?", "What is Part-Time DevOps Support?")}
                </h2>
                <p className="text-lg md:text-xl text-black dark:text-gray-300 mt-1 md:mt-2">
                  {t("Expert DevOps assistance whenever you need it", "ကျွမ်းကျင် DevOps Engineer များ၏ အကူအညီကို လိုအပ်ချိန်တိုင်း ရယူနိုင်ခြင်း")}
                </p>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl dark:bg-gray-800">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                {t("Flexible DevOps Expertise", "Flexible DevOps Expertise")}
              </CardTitle>
              <CardDescription className="text-black dark:text-gray-300 text-base md:text-lg">
                {t("Access senior DevOps professionals on your terms", "Access senior DevOps professionals on your terms")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <p className="text-black dark:text-gray-300 leading-relaxed text-base md:text-lg">
                {t(
                  "Part-time DevOps support connects your organization with skilled DevOps engineers on a flexible, as-needed basis. Perfect for projects requiring specialized expertise, temporary resource gaps, or ongoing maintenance without the cost of full-time staff.",
                  "Part-time DevOps Support ဆိုသည်မှာ သင့်လုပ်ငန်းအတွက် ကျွမ်းကျင် DevOps Engineer များကို လိုအပ်သည့်အချိန်နှင့် ပမာဏအလိုက် ချိတ်ဆက်လုပ်ဆောင်ပေးသည့် ဝန်ဆောင်မှု ဖြစ်ပါသည်။ ဝန်ထမ်းအင်အား မလုံလောက်မှုများ သို့မဟုတ် Full-time ခန့်အပ်ရန် အခက်အခဲရှိသော လုပ်ငန်းများအတွက် အသင့်တော်ဆုံး ဖြစ်ပါသည်။"
                )}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  {
                    icon: Users,
                    title: t("On-Demand Expertise", "On-Demand Expertise"),
                    desc: t("Access experienced DevOps professionals exactly when you need them.", "အတွေ့အကြုံရှိ DevOps Engineer များကို သင်လိုအပ်သော အချိန်တွင် ရယူနိုင်ပါသည်။"),
                    color: "blue",
                  },
                  {
                    icon: Scale,
                    title: t("Cost-Effective", "Cost-Effective"),
                    desc: t("Only pay for the support you need, avoiding full-time salary expenses.", "လစာအပြည့်ပေးရန်မလိုဘဲ လိုအပ်သော ဝန်ဆောင်မှုအတွက်သာ ပေးချေရသဖြင့် ပိုမိုသက်သာပါသည်။"),
                    color: "green",
                  },
                  {
                    icon: RefreshCw,
                    title: t("Flexible Engagement", "Flexible Engagement"),
                    desc: t("Customize support hours and project scopes to your specific needs.", "အလုပ်လုပ်မည့် နာရီနှင့် ပမာဏကို သင့်စိတ်ကြိုက် သတ်မှတ်နိုင်ပါသည်။"),
                    color: "orange",
                  },
                  {
                    icon: BookOpen,
                    title: t("Strategic Guidance", "Strategic Guidance"),
                    desc: t("Receive expert advice to improve your DevOps maturity and cloud strategy.", "သင့်လုပ်ငန်း၏ Cloud နှင့် DevOps စနစ်များ ပိုမိုကောင်းမွန်လာစေရန် မှန်ကန်တဲ့ အကြံပေးမှုများကို ပြုလုပ်ပေးပါမည်။"),
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
                      <h4 className="font-bold text-black dark:text-white mb-1 md:mb-2 text-base md:text-lg">
                        {item.title}
                      </h4>
                      <p className="text-black dark:text-gray-300 leading-relaxed text-sm md:text-base">
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
          <div className="text-left mb-8 md:mb-12">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                !
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
                  {t("Why Choose Part-Time DevOps Support?", "Why Choose Part-Time DevOps Support?")}
                </h2>
                <p className="text-lg md:text-xl text-black dark:text-gray-300 mt-1 md:mt-2">
                  {t("Save costs and boost efficiency with expert, flexible support", "Save costs and boost efficiency with expert, flexible support")}
                </p>
              </div>
            </div>
          </div>

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
                      desc: t("Lower operational expenses compared to hiring full-time DevOps staff.", "Full-time ဝန်ထမ်းခန့်ခြင်းထက် လုပ်ငန်းလည်ပတ်မှု ကုန်ကျစရိတ်ကို သိသိသာသာ လျှော့ချနိုင်ပါသည်။"),
                      color: "green",
                    },
                    {
                      icon: Target,
                      title: t("Focus on Core Business", "အဓိကလုပ်ငန်းအပေါ် အာရုံစိုက်နိုင်ခြင်း"),
                      desc: t("Let your internal teams focus on product development while we handle DevOps.", "DevOps အပိုင်းကို ကျွန်ုပ်တို့ကို လွှဲထားပြီး သင့်ဝန်ထမ်းများက Product Development အပေါ် ပိုမိုအာရုံစိုက်နိုင်ပါသည်။"),
                      color: "blue",
                    },
                    {
                      icon: Zap,
                      title: t("Increased Agility", "မြန်ဆန်သွက်လက်လာခြင်း"),
                      desc: t("Adapt quickly to changing project demands with on-demand support.", "လိုအပ်ချက်အပြောင်းအလဲများကို အချိန်နှင့်တပြေးညီ လိုက်လျောညီထွေ ဆောင်ရွက်နိုင်ပါသည်။"),
                      color: "orange",
                    },
                    {
                      icon: ShieldCheck,
                      title: t("Reduced Overhead", "အလုပ်ရှုပ်သက်သာခြင်း"),
                      desc: t("Avoid recruitment, onboarding, and benefits costs of permanent hires.", "ဝန်ထမ်းရှာဖွေခြင်း၊ လေ့ကျင့်ပေးခြင်းနှင့် အခြားဝန်ထမ်းစရိတ်များကို သက်သာစေပါသည်။"),
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
                        <h4 className="font-semibold text-black dark:text-white mb-1 text-sm md:text-base">
                          {item.title}
                        </h4>
                        <p className="text-black dark:text-gray-300 text-xs md:text-sm">
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
                      title: t("Access to Top Talent", "ထိပ်တန်းကျွမ်းကျင်သူများ၏ အကြံဉာဏ်"),
                      desc: t("Work with highly skilled professionals who stay current on industry trends.", "ခေတ်မီနည်းပညာများကို အမြဲလေ့လာနေသော ကျွမ်းကျင်ပညာရှင်များနှင့် လက်တွဲလုပ်ဆောင်ခွင့် ရမည်။"),
                      color: "blue",
                    },
                    {
                      icon: BellRing,
                      title: t("Proactive Problem Solving", "ပြဿနာများကို ကြိုတင်ကာကွယ်ခြင်း"),
                      desc: t("Prevent costly outages with proactive monitoring and issue resolution.", "စနစ်ပြတ်တောက်မှုများ မဖြစ်အောင် ကြိုတင်စောင့်ကြည့်ပြီး ဖြေရှင်းပေးပါသည်။"),
                      color: "teal",
                    },
                    {
                      icon: Workflow,
                      title: t("Best Practices", "နိုင်ငံတကာစံနှုန်းများ"),
                      desc: t("Implement industry-standard DevOps practices and tools.", "အဆင့်မြင့် DevOps စံနှုန်းများနှင့် Tool များကို သင့်လုပ်ငန်းတွင် အကောင်အထည်ဖော်ပေးပါသည်။"),
                      color: "green",
                    },
                    {
                      icon: RefreshCw,
                      title: t("Continuous Improvement", "အမြဲမပြတ် တိုးတက်မှု"),
                      desc: t("Ongoing optimization of your infrastructure and processes.", "သင့်လုပ်ငန်း၏ နည်းပညာစနစ်များကို အမြဲမပြတ် အဆင့်မြှင့်တင်ပေးပါသည်။"),
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
                        <h4 className="font-semibold text-black dark:text-white mb-1 text-sm md:text-base">
                          {item.title}
                        </h4>
                        <p className="text-black dark:text-gray-300 text-xs md:text-sm">
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
          <div className="text-left mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-3 md:mb-4">
              {t("Comprehensive DevOps Services", "Comprehensive DevOps Services")}
            </h2>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 max-w-2xl">
              {t("End-to-end support across your entire DevOps lifecycle", "End-to-end support across your entire DevOps lifecycle")}
            </p>
          </div>

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl dark:bg-gray-800">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg md:rounded-xl">
                  <Workflow className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                {t("Key Services Offered", "Key Services Offered")}
              </CardTitle>
              <CardDescription className="text-black dark:text-gray-300 text-base md:text-lg">
                {t("Everything you need to optimize your DevOps operations", "Everything you need to optimize your DevOps operations")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[
                  {
                    icon: Zap,
                    title: "CI/CD Pipeline Optimization",
                    desc: t("Streamline and automate build, test, and deployment workflows for faster releases.", "build, test, deploy အဆင့်တိုင်းကို ပိုမိုမြန်ဆန်အောင် အလိုအလျောက်စနစ်ဖြင့် တည်ဆောက်ခြင်း။"),
                    color: "blue",
                  },
                  {
                    icon: Code,
                    title: "Infrastructure Automation",
                    desc: t("Implement Infrastructure as Code using tools like Terraform, Ansible, or Pulumi.", "Terraform နှင့် Ansible စသည့် Tool များဖြင့် Infrastructure ကို Code အဖြစ် အလိုအလျောက် စီမံခြင်း။"),
                    color: "green",
                  },
                  {
                    icon: Scale,
                    title: "Cloud Cost Optimization",
                    desc: t("Analyze and reduce your AWS, Azure, or GCP cloud spending to save money.", "သင့်လုပ်ငန်း၏ Cloud ကုန်ကျစရိတ်များကို သေချာတွက်ချက်ပြီး လျှော့ချပေးခြင်း။"),
                    color: "purple",
                  },
                  {
                    icon: Activity,
                    title: "Monitoring & Alerting",
                    desc: t("Deploy monitoring solutions and configure alerts for proactive management.", "အမြဲစောင့်ကြည့်ပြီး ပြဿနာရှိပါက ချက်ချင်းသတင်းပို့ပေးမည့် စနစ်များ ထည့်သွင်းခြင်း။"),
                    color: "orange",
                  },
                  {
                    icon: Dock,
                    title: "Kubernetes Management",
                    desc: t("Assist with deployment, scaling, and troubleshooting of Kubernetes clusters.", "Kubernetes Cluster များကို စနစ်တကျ ပြင်ဆင်ခြင်းနှင့် စီမံခန့်ခွဲပေးခြင်း။"),
                    color: "teal",
                  },
                  {
                    icon: Database,
                    title: "Database & Storage Support",
                    desc: t("Manage cloud databases, backups, and storage for performance and reliability.", "Database များနှင့် Backups များကို ယုံကြည်စိတ်ချရစေရန် စီမံခန့်ခွဲပေးခြင်း။"),
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
          <div className="text-left mb-8 md:mb-12">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                1
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
                  {t("How It Works", "How It Works")}
                </h2>
                <p className="text-lg md:text-xl text-black dark:text-gray-300 mt-1 md:mt-2">
                  {t("Simple 4-step process to get expert DevOps support", "Simple 4-step process to get expert DevOps support")}
                </p>
              </div>
            </div>
          </div>

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
                    desc: t("Discuss your current challenges, project goals, and desired outcomes.", "သင့်လုပ်ငန်း၏ အခက်အခဲများနှင့် ရည်မှန်းချက်များကို ဆွေးနွေးခြင်း။"),
                    icon: Users,
                    color: "blue",
                  },
                  {
                    step: "2",
                    title: t("Scope Definition", "အလုပ်ပမာဏ သတ်မှတ်ခြင်း"),
                    desc: t("Work together to define the project scope, deliverables, and timeline.", "ဆောင်ရွက်မည့် အပိုင်းများနှင့် ကြာချိန်ကို သတ်မှတ်ခြင်း။"),
                    icon: BookOpen,
                    color: "green",
                  },
                  {
                    step: "3",
                    title: t("Execution & Reporting", "ဆောင်ရွက်ခြင်း"),
                    desc: t("Our experts perform the work, providing regular progress updates and detailed reports.", "အလုပ်များကို ဆောင်ရွက်ပြီး ပုံမှန် reports များ တင်ပြခြင်း။"),
                    icon: Code,
                    color: "purple",
                  },
                  {
                    step: "4",
                    title: t("Ongoing Support", "အမြဲတမ်း အကူအညီပေးခြင်း"),
                    desc: t("Continuous assistance, maintenance, and optimization as your needs evolve.", "လိုအပ်ချက်နှင့်အညီ ဆက်လက် ပြုပြင်ထိန်းသိမ်းပေးခြင်း။"),
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
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                  {t("Ready to Enhance Your DevOps Capability?", "Ready to Enhance Your DevOps Capability?")}
                </h2>
                <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-6 md:mb-8 leading-relaxed">
                  {t(
                    "Contact us today for a personalized consultation and a flexible support plan tailored to your business needs.",
                    "သင့်လုပ်ငန်းလိုအပ်ချက်နှင့် အကိုက်ညီဆုံး ဝန်ဆောင်မှုကို ရယူနိုင်ရန် ဒီနေ့ပဲ ကျွန်ုပ်တို့နှင့် ဆွေးနွေးတိုင်ပင်လိုက်ပါ။"
                  )}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    onClick={handleEmailClick}
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
                      label: t("Flexible Plans", "Flexible ဖြစ်တဲ့ အစီအစဉ်များ"),
                      desc: t("Tailored to your needs", "လိုအပ်ချက်နှင့်အညီ"),
                    },
                    {
                      icon: ShieldCheck,
                      label: t("Expert Team", "ကျွမ်းကျင်သော devops များ"),
                      desc: t("Senior DevOps professionals", "စီနီယာ ပညာရှင်များ"),
                    },
                    {
                      icon: Zap,
                      label: t("Rapid Start", "ချက်ချင်း စတင်နိုင်မှု"),
                      desc: t("Get started in days", "ရက်ပိုင်းအတွင်း စတင်နိုင်ခြင်း"),
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
    </div>
  );
}