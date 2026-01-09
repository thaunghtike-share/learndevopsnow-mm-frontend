"use client";

import Image from "next/image";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Dock,
  ShieldCheck,
  Cloud,
  Server,
  Activity,
  ExternalLink,
  Code,
  FileText,
  Zap,
  Lock,
  Layers,
  Sparkles,
  Database,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Star,
  GitBranch,
  RefreshCw,
  BellRing,
  MessageSquare,
  Cpu,
  MemoryStick,
  LayoutDashboard,
  Terminal,
  Scale,
  Scan,
  Users,
  BookOpen,
  GitCompare,
  Container,
  Workflow,
  Play,
  ShieldAlert,
  Key,
  Search,
  Eye,
  Calendar,
  Clock,
  ChevronDown,
  GitPullRequest,
  Shield,
  Wifi,
  HardDrive,
  Network,
  Cctv,
  Fingerprint,
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

export default function MonolithicToCloudNativePage() {
  // Get current locale from URL params
  const params = useParams();
  const currentLocale = (params.locale as "en" | "my") || "en";

  const [mounted, setMounted] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    current_environment: "",
    project_goals: "",
    preferred_time: "",
  });

  // Update state declarations
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

  // Translation function - Humanized Myanmar Text
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

  // Update handleSubmit function - remove the alerts and form status messages
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
      icon: Workflow,
      title: "End-to-End DevOps",
      description: t(
        "Complete automation from code to production with GitOps workflows, Infrastructure as Code, and automated security scanning",
        "Code စတင်ရေးချိန်မှစပြီး Production အဆင့်အထိ GitOps workflows, Infrastructure as Code, နှင့် automated security scanning များပါဝင်သော automation စနစ်ဖြင့် ချိတ်ဆက်ဆောင်ရွက်ပေးခြင်း"
      ),
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security",
      description: t(
        "Built-in security at every layer with Zero Trust architecture, RBAC, OPA policies, and automated vulnerability scanning",
        "Infrastructure အလွှာတိုင်းတွင် Zero Trust architecture, RBAC, OPA policies, နှင့် automated vulnerability scanning များပါဝင်သည့် စိတ်ချရသော လုပ်ငန်းသုံးအဆင့် လုံခြုံရေးစနစ်များ ထည့်သွင်းတည်ဆောက်ခြင်း"
      ),
    },
    {
      icon: Scale,
      title: "Auto Scaling",
      description: t(
        "Intelligent resource optimization with Horizontal Pod Autoscaler (HPA), Cluster Autoscaler, and predictive scaling based on metrics",
        "user အသုံးပြုမှုအပေါ် မူတည်ပြီး Horizontal Pod Autoscaler (HPA), Cluster Autoscaler နှင့် metrics-based predictive scaling တို့ဖြင့် application များကို အလိုအလျောက် စီမံခန့်ခွဲပေးခြင်း"
      ),
    },
    {
      icon: Zap,
      title: "High Performance",
      description: t(
        "10x faster deployment cycles with parallel builds, incremental deployments, and intelligent caching strategies",
        "Parallel builds, incremental deployments နှင့် intelligent caching strategies တို့ဖြင့် Deployment Lifecycle ကို ၁၀ ဆ ပိုမိုမြန်ဆန်သွက်လက်စေခြင်း"
      ),
    },
  ];

  const stats = [
    {
      value: "99.9%",
      label: t("Uptime SLA", "application အသုံးပြုနိုင်မှု"),
      icon: CheckCircle2,
    },
    {
      value: "50%",
      label: t("Cost Reduction", "ကုန်ကျစရိတ် လျှော့ချနိုင်မှု"),
      icon: ArrowRight,
    },
    {
      value: "10x",
      label: t("Faster Deployments", "Deployment ပိုမိုမြန်ဆန်မှု"),
      icon: Zap,
    },
    {
      value: "24/7",
      label: t("Monitoring", "အချိန်နှင့်တပြေးညီ စောင့်ကြည့်ပေးခြင်း"),
      icon: Activity,
    },
  ];

  const handleCaseStudiesClick = () => {
    window.open(
      "https://github.com/thaunghtike-share/DevOps-Projects",
      "_blank"
    );
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white/95 dark:bg-[#000000] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white/95 dark:bg-[#000000] relative transition-colors duration-300">
      {/* Messenger Button */}
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
            {t("Chat Now", "စကားပြောရန်")}
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
                Cloud Migration Services
              </span>
            </div>

            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              From Monolithic To Cloud-Native
            </h1>

            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-3xl text-left">
              {t(
                "Transform your legacy applications into scalable, resilient cloud-native systems with our complete DevOps automation platform featuring modern toolchain including Kubernetes, Terraform, ArgoCD, Prometheus, Grafana, and comprehensive security stack.",
                "ကျွန်ုပ်တို့၏ DevOps Automation Platform ကိုအသုံးပြုပြီး Monolithic Application များကို Kubernetes, Terraform, ArgoCD, Prometheus, Grafana နှင့် ခေတ်မီ security stack များပါဝင်သော ခေတ်မီပြီး အလိုအလျောက် စီမံခန့်ခွဲနိုင်သော Cloud-Native စနစ်အဖြစ် အောင်မြင်စွာ ပြောင်းလဲလိုက်ပါ။"
              )}
            </p>

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

            {/* Hero Section CTA Button - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-start items-start">
              <Button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 md:px-8 md:py-3 rounded-xl text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t("Get Free Consultation", "အခမဲ့ ဆွေးနွေးတိုင်ပင်ရန်")}
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

        {/* Architecture Section */}
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
                DevOps Architecture
              </span>
            </div>
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Infrastucture Design For Clients
            </h1>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              {t(
                "Our proven architecture handles everything from infrastructure to monitoring with modern DevOps toolchain including Kubernetes orchestration, GitOps workflows, service mesh, and comprehensive observability stack",
                "Infrastructure စဥ်းစားချိန်မှ စပြီး Monitoring အဆင့် အထိ Kubernetes orchestration, GitOps workflows, service mesh နှင့် ပြည့်စုံသော observability stack များပါဝင်သည့် ခေတ်မီ DevOps toolchain ဖြင့် အရာအားလုံးကို စနစ်တကျ ထည့်သွင်းစဥ်းစားထားသည့် ဥပမာ infrastructure ပုံစံ ဖြစ်ပါသည်။"
              )}
            </p>
          </motion.div>

          <Card className="mb-6 md:mb-8 border-0 shadow-xl md:shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[250px] md:h-[700px] w-full relative bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-50 dark:to-blue-50">
                <Image
                  src="/dinger.png"
                  alt="DevOps Architecture"
                  fill
                  className="object-contain p-4 md:p-8"
                  quality={100}
                  priority
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl mb-6 md:mb-8">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                {t(
                  "Understanding the Architecture",
                  "Understanding the Architecture"
                )}
              </CardTitle>
              <CardDescription className="text-black dark:text-gray-300 text-base md:text-lg text-left">
                {t(
                  "A detailed breakdown of our cloud-native solution with modern DevOps/DevSecOps toolchain",
                  "ကျွန်ုပ်တို့၏ Cloud Native ပုံစံကို ခေတ်မီ DevOps/DevSecOps toolchain များဖြင့် အသေးစိတ် ရှင်းလင်းချက်"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <p className="text-black dark:text-gray-300 leading-relaxed text-base md:text-lg text-left">
                {t(
                  "The diagram above illustrates the end-to-end DevOps architecture we implement for our clients, ensuring a robust, scalable, and secure cloud-native environment with modern tooling including Kubernetes, service mesh (Istio/Linkerd), GitOps (ArgoCD/Flux), monitoring stack (Prometheus/Grafana/Loki), and security toolchain (Trivy/OPA/Falco).",
                  "အထက်ပါပုံသည် ကျွန်ုပ်တို့၏ client တစ်ဦးအတွက် တည်ဆောက်ပေးသော DevOps Architecture ကို Kubernetes, service mesh (Istio/Linkerd), GitOps (ArgoCD/Flux), monitoring stack (Prometheus/Grafana/Loki) နှင့် security toolchain (Trivy/OPA/Falco) အပါအဝင် ခေတ်မီ tooling များဖြင့် လုံခြုံ စိတ်ချရတဲ့ environment တစ်ခုဖြစ်ကြောင်း အာမခံပါသည်။"
                )}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[
                  {
                    icon: GitBranch,
                    title: "Source Control (GitHub/GitLab)",
                    desc: t(
                      "All application code, infrastructure as code (Terraform/Pulumi), Kubernetes manifests, and Helm charts stored in Git repositories with branch protection and automated workflows.",
                      "application code များနှင့် infrastructure setting များ၊ Kubernetes manifests နှင့် Helm charts များကို branch protection နှင့် automated workflows များပါဝင်သော Git repositories တွင် ဗားရှင်းအလိုက် စနစ်တကျ ထိန်းသိမ်းပါသည်။"
                    ),
                    color: "blue",
                  },
                  {
                    icon: Code,
                    title: "Infrastructure as Code",
                    desc: t(
                      "Terraform for declarative cloud infrastructure provisioning across Azure, AWS, GCP with advanced modules, state management, and policy enforcement using OPA/Sentinel.",
                      "Cloud ပေါ်တွင် resource အရင်းအမြစ် များကို advanced modules, state management နှင့် OPA/Sentinel ဖြင့် policy enforcement တို့ပါဝင်သော Terraform ဖြင့် အလိုအလျောက် တည်ဆောက်ပါသည်။"
                    ),
                    color: "green",
                  },
                  {
                    icon: Zap,
                    title: "CI/CD Pipeline",
                    desc: t(
                      "GitHub Actions/GitLab CI for automated build, test, security scanning, and deployment workflows with self-hosted runners, artifact caching, and parallel execution.",
                      "Application တွေအတွက် Build လုပ်ခြင်း၊ စမ်းသပ်ခြင်း၊ လုံခြုံရေးစစ်ဆေးခြင်း နှင့် Deployment အဆင့်များကို self-hosted runners, artifact caching နှင့် parallel execution တို့ဖြင့် GitHub Actions/GitLab CI ဖြင့် အလိုအလျောက် လုပ်ဆောင်ပါသည်။"
                    ),
                    color: "orange",
                  },
                  {
                    icon: Dock,
                    title: "Containerization & Registry",
                    desc: t(
                      "Docker for consistent application packaging and deployment with multi-stage builds, slim images, and secure image registries (ACR/ECR/GCR/Artifactory) with vulnerability scanning.",
                      "Application များကို multi-stage builds, slim images နှင့် vulnerability scanning ပါဝင်သော secure image registries (ACR/ECR/GCR/Artifactory) များဖြင့် Docker ကိုသုံးပြီး မည်သည့် platform တွင်မဆို အလုပ်လုပ်နိုင်ရန် ထုပ်ပိုးပါသည်။"
                    ),
                    color: "purple",
                  },
                  {
                    icon: Server,
                    title: "Kubernetes Orchestration",
                    desc: t(
                      "AKS/EKS/GKE for managed Kubernetes with auto-scaling, RBAC, network policies, and service mesh integration (Istio/Linkerd) for traffic management and observability.",
                      "Kubernetes Cluster များကိုအသုံးပြုပြီး auto-scaling, RBAC, network policies နှင့် service mesh integration (Istio/Linkerd) တို့ဖြင့် traffic management နှင့် observability များအတွက် security, scaling နှင့် application deployment များကို စနစ်တကျ စီမံခန့်ခွဲပါသည်။"
                    ),
                    color: "teal",
                  },
                  {
                    icon: Layers,
                    title: "GitOps (ArgoCD/Flux)",
                    desc: t(
                      "Declarative deployments with automated synchronization, drift detection, health assessment, and rollback capabilities for multi-cluster management.",
                      "Git ထဲရှိ version အလိုက် ပြောင်းလဲမှုများကို automated synchronization, drift detection, health assessment နှင့် rollback capabilities တို့ဖြင့် multi-cluster management အတွက် Kubernetes Cluster တွေဆီသို့ အလိုအလျောက် ချိတ်ဆက်ပေးပါသည်။"
                    ),
                    color: "indigo",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 group"
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

        {/* Infrastructure as Code Section */}
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
                Infrastructure Automation
              </span>
            </div>
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Infrastructure as Code
            </h1>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              {t(
                "Automated cloud infrastructure provisioning with Terraform, Pulumi, and Crossplane for consistent, repeatable deployments across multi-cloud environments",
                "Cloud Infrastructure များကို Terraform, Pulumi, နှင့် Crossplane တို့ဖြင့် multi-cloud environments တွင် တစ်ပုံစံတည်း၊ အချိန်မရွေး ပြန်လည်အသုံးပြုနိုင်သော deployments များအတွက် အလိုအလျောက် တည်ဆောက်ခြင်း"
              )}
            </p>
          </motion.div>

          <div className="space-y-6 md:space-y-8">
            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                  <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  {t(
                    "Why Choose Terraform?",
                    "Terraform ကို ဘာကြောင့် ရွေးချယ်သင့်သလဲ?"
                  )}
                </CardTitle>
                <CardDescription className="text-black dark:text-gray-300 text-base md:text-lg text-left">
                  {t(
                    "The industry standard for Infrastructure as Code with ecosystem of providers and modules",
                    "ခေတ်မီ Infrastructure များအတွက် providers နှင့် modules ecosystem ပါဝင်သော ကမ္ဘာ့အဆင့်မီ စံသတ်မှတ်ချက်"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {[
                    {
                      icon: Code,
                      title: "Infrastructure as Code",
                      desc: t(
                        "Version-controlled, repeatable infrastructure deployments with GitOps workflows, modular design, and policy as code using OPA/Sentinel.",
                        "Infrastructure ပြောင်းလဲမှုများကို Code အဖြစ် ရေးသားပြီး GitOps workflows, modular design နှင့် OPA/Sentinel ဖြင့် policy as code တို့ဖြင့် အချိန်မရွေး တိကျစွာ ပြန်လည်အသုံးပြုနိုင်ပါသည်။"
                      ),
                      color: "green",
                    },
                    {
                      icon: Cloud,
                      title: "Multi-Cloud Excellence",
                      desc: t(
                        "Deploy seamlessly across Azure, AWS, GCP with consistent workflows using Terraform Cloud/Enterprise for collaboration and state management.",
                        "Azure, AWS, GCP စသည့် Cloud platform များပေါ်တွင် collaboration နှင့် state management အတွက် Terraform Cloud/Enterprise ကိုအသုံးပြုပြီး တစ်ပုံစံတည်း ချောမွေ့စွာ အသုံးပြုနိုင်ပါသည်။"
                      ),
                      color: "blue",
                    },
                    {
                      icon: ShieldCheck,
                      title: "State Management",
                      desc: t(
                        "Advanced state management for team collaboration with remote state backends, state locking, and drift detection capabilities.",
                        "အဖွဲ့အလိုက် ဆောင်ရွက်မှုအတွက် remote state backends, state locking နှင့် drift detection capabilities တို့ပါဝင်သော အဆင့်မြင့် State Management စနစ် ပါဝင်ခြင်း။"
                      ),
                      color: "orange",
                    },
                    {
                      icon: Zap,
                      title: "Cost Optimization",
                      desc: t(
                        "Right-size resources and implement auto-scaling with Infracost integration for real-time cost estimation and optimization recommendations.",
                        "resource အရင်းအမြစ်များကို လိုအပ်သလောက်သာ အသုံးပြုပြီး real-time cost estimation နှင့် optimization recommendations များအတွက် Infracost integration ဖြင့် ကုန်ကျစရိတ်ကို အကောင်းဆုံး ထိန်းညှိခြင်း။"
                      ),
                      color: "purple",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                    >
                      <div
                        className={`p-2 md:p-3 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg md:rounded-xl flex-shrink-0`}
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

            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                  <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg md:rounded-xl">
                    <Code className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  Production Terraform Modules
                </CardTitle>
                <CardDescription className="text-black dark:text-gray-300 text-base md:text-lg text-left">
                  {t(
                    "Enterprise-grade infrastructure modules with security best practices",
                    "လုံခြုံရေးအကောင်းဆုံးအလေ့အကျင့်များပါဝင်သော လုပ်ငန်းသုံး အဆင့် Infrastructure Modules များ"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="group p-4 md:p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl md:rounded-2xl border border-blue-200 dark:border-blue-700 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-blue-500 rounded-lg md:rounded-xl shadow-lg">
                        <Cloud className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-black dark:text-white text-lg md:text-xl mb-1 md:mb-2 text-left">
                          Azure Infrastructure Module
                        </h4>
                        <p className="text-black dark:text-gray-300 mb-2 md:mb-3 text-sm md:text-base text-left">
                          {t(
                            "Complete Azure setup with AKS, ACR, VNet, Azure Monitor, and Azure Policy. Production-ready with security best practices including network security groups, private endpoints, and managed identities.",
                            "AKS, ACR, VNet, Azure Monitor နှင့် Azure Policy များပါဝင်သည့် ပြီးပြည့်စုံသော Azure Setup ဖြစ်ပါသည်။ network security groups, private endpoints နှင့် managed identities အပါအဝင် Security အဆင့်မြင့်ဆုံး စနစ်များဖြင့် တည်ဆောက်ထားပါသည်။"
                          )}
                        </p>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0 text-xs">
                            AKS
                          </Badge>
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-0 text-xs">
                            ACR
                          </Badge>
                          <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-0 text-xs">
                            VNet
                          </Badge>
                          <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-0 text-xs">
                            {t("Azure Monitor", "Azure Monitor")}
                          </Badge>
                          <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-0 text-xs">
                            {t("Security", "လုံခြုံရေး")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 hover:scale-105 mt-3 lg:mt-0 w-full lg:w-auto"
                      onClick={() =>
                        window.open(
                          "https://github.com/thaunghtike-share/terraform-azure",
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      View Module
                    </Button>
                  </div>
                </div>

                <div className="group p-4 md:p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl md:rounded-2xl border border-orange-200 dark:border-orange-700 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-orange-500 rounded-lg md:rounded-xl shadow-lg">
                        <Server className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-black dark:text-white text-lg md:text-xl mb-1 md:mb-2 text-left">
                          AWS EKS Spot Instance Module
                        </h4>
                        <p className="text-black dark:text-gray-300 mb-2 md:mb-3 text-sm md:text-base text-left">
                          {t(
                            "Cost-effective EKS cluster with spot instances, auto-scaling (Karpenter), and comprehensive monitoring. Optimized for production workloads with node diversity, pod disruption budgets, and cost allocation tags.",
                            "Spot Instances, auto-scaling (Karpenter) နှင့် ပြည့်စုံသော monitoring တို့ကို အသုံးပြုပြီး node diversity, pod disruption budgets နှင့် cost allocation tags တို့ဖြင့် ကုန်ကျစရိတ် အသက်သာဆုံးနှင့် အထိရောက်ဆုံး ဖြစ်အောင် တည်ဆောက်ထားသော EKS Cluster ဖြစ်ပါသည်။"
                          )}
                        </p>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-0 text-xs">
                            EKS
                          </Badge>
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-0 text-xs">
                            Spot Instances
                          </Badge>
                          <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-0 text-xs">
                            Karpenter
                          </Badge>
                          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0 text-xs">
                            Cost Optimized
                          </Badge>
                          <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-0 text-xs">
                            Monitoring
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 hover:scale-105 mt-3 lg:mt-0 w-full lg:w-auto"
                      onClick={() =>
                        window.open(
                          "https://github.com/thaunghtike-share/terraform-aws-kubespot",
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      View Module
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CI/CD Pipeline Section */}
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
                Continuous Integration & Delivery
              </span>
            </div>
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              CI/CD Pipeline
            </h1>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              {t(
                "Automated build, test, security scanning, and deployment workflows with modern tooling for rapid, reliable software delivery",
                "test, build, security scanning, deploy အဆင့်တိုင်းကို ခေတ်မီ tooling များဖြင့် မြန်ဆန်စိတ်ချရသော software delivery အတွက် အလိုအလျောက် လုပ်ဆောင်ခြင်း"
              )}
            </p>
          </motion.div>

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl mb-6 md:mb-8">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg md:rounded-xl">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                </div>
                {t(
                  "Complete CI/CD Workflow",
                  "ပြီးပြည့်စုံသော CI/CD လုပ်ငန်းစဉ်"
                )}
              </CardTitle>
              <CardDescription className="text-black dark:text-gray-300 text-base md:text-lg text-left">
                {t(
                  "From code commit to production deployment with security and quality gates",
                  "Code ရေးသားမှုမှ Production သို့ ရောက်ရှိသည်အထိ လုံခြုံရေးနှင့် အရည်အသွေး စစ်ဆေးမှုများပါဝင်"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[
                  {
                    step: "1",
                    title: "Code Push & PR",
                    desc: t(
                      "Developer pushes code to Git repository with automated PR checks, code review, and branch protection rules",
                      "Developer က Code ကို automated PR checks, code review နှင့် branch protection rules များပါဝင်သော Git Repository ထဲသို့ ထည့်လိုက်ခြင်း"
                    ),
                    icon: GitPullRequest,
                    color: "blue",
                  },
                  {
                    step: "2",
                    title: "Docker Build & Scan",
                    desc: t(
                      "Multi-platform container builds with vulnerability scanning (Trivy/Grype), SBOM generation, and image signing using Cosign/Sigstore",
                      "platform အမျိုးစားအားလုံးတွင် အလုပ်လုပ်နိုင်သော Container Image များကို vulnerability scanning (Trivy/Grype), SBOM generation နှင့် Cosign/Sigstore ဖြင့် image signing တို့ဖြင့် တည်ဆောက်ခြင်း"
                    ),
                    icon: Dock,
                    color: "indigo",
                  },
                  {
                    step: "3",
                    title: "Push to Registry",
                    desc: t(
                      "Secure image storage with automated tagging, image promotion policies, and registry scanning using Harbor/Quay/Artifactory",
                      "Image များကို automated tagging, image promotion policies နှင့် Harbor/Quay/Artifactory ဖြင့် registry scanning တို့ဖြင့် လုံခြုံစွာ သိမ်းဆည်းပြီး Tagging စနစ်ဖြင့် စီမံခြင်း"
                    ),
                    icon: Database,
                    color: "green",
                  },
                  {
                    step: "4",
                    title: "Security Scanning",
                    desc: t(
                      "Comprehensive security scanning with Trivy for vulnerabilities, Grype for SBOM analysis, and Snyk/Checkov for IaC security",
                      "Trivy ဖြင့် vulnerabilities, Grype ဖြင့် SBOM analysis နှင့် Snyk/Checkov ဖြင့် IaC security တို့အတွက် ပြည့်စုံသော လုံခြုံရေးစစ်ဆေးခြင်း"
                    ),
                    icon: ShieldCheck,
                    color: "red",
                  },
                  {
                    step: "5",
                    title: "ArgoCD Deploy",
                    desc: t(
                      "GitOps-based deployment with automated sync, health assessment, rollback capabilities, and multi-cluster management using ApplicationSets",
                      "GitOps စနစ်ဖြင့် automated sync, health assessment, rollback capabilities နှင့် ApplicationSets ဖြင့် multi-cluster management တို့ပါဝင်သော Code ပြောင်းလဲမှုများကို Kubernetes Cluster ပေါ်သို့ အလိုအလျောက် ပို့ဆောင်ပေးခြင်း"
                    ),
                    icon: Rocket,
                    color: "purple",
                  },
                  {
                    step: "6",
                    title: "Health Verification",
                    desc: t(
                      "Automated verification with smoke tests, integration tests, performance testing, and SLO validation using Litmus/Chaos Engineering",
                      "application ကို smoke tests, integration tests, performance testing နှင့် Litmus/Chaos Engineering ဖြင့် SLO validation တို့ဖြင့် အလိုအလျောက် အတည်ပြုခြင်းနှင့် လိုအပ်ပါက အရင် version တွေသို့ ပြန်ပြောင်းနိုင်ခြင်း"
                    ),
                    icon: CheckCircle2,
                    color: "orange",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
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

          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                  <Terminal className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                Self-hosted Runners in CI/CD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  {
                    icon: Zap,
                    title: "Faster Builds & Security",
                    desc: t(
                      "Utilize powerful machines for build cycles with custom hardware, GPU acceleration, and keep sensitive data within your private network with air-gapped deployments.",
                      "ပိုကောင်းသော server များကို custom hardware, GPU acceleration တို့ဖြင့် အသုံးပြုပြီး build လုပ်ချိန်ကို သိသိသာသာ လျှော့ချခြင်းနှင့် air-gapped deployments ဖြင့် ဒေတာများကို မိမိတို့ private network အတွင်း၌သာ လုံခြုံစွာ ထိန်းသိမ်းထားခြင်း။"
                    ),
                    color: "blue",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Compliance & Cost Control",
                    desc: t(
                      "Meet regulatory requirements with controlled environments and reduce cloud compute costs by 60-80% with on-premise or colocated runners for large-scale builds.",
                      "ထိန်းချုပ်ထားသော environment များဖြင့် စည်းမျဉ်းစည်းကမ်းလိုအပ်ချက်များကို ဖြည့်ဆည်းခြင်းနှင့် large-scale builds များအတွက် on-premise သို့မဟုတ် colocated runners များဖြင့် cloud compute ကုန်ကျစရိတ်ကို ၆၀-၈၀% အထိ လျှော့ချခြင်း။"
                    ),
                    color: "orange",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700"
                  >
                    <div
                      className={`p-2 md:p-3 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg md:rounded-xl flex-shrink-0`}
                    >
                      <item.icon
                        className={`w-4 h-4 md:w-6 md:h-6 text-${item.color}-600 dark:text-${item.color}-400`}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-black dark:text-white mb-1 text-base md:text-lg text-left">
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

        {/* GitOps Section */}
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
                Declarative Deployments
              </span>
            </div>
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              GitOps with ArgoCD
            </h1>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              {t(
                "Declarative, automated deployments to Kubernetes with GitOps workflows and progressive delivery for consistent, auditable infrastructure management",
                "Code ပြောင်းလဲမှုကို အခြေခံပြီး GitOps workflows နှင့် progressive delivery တို့ဖြင့် တစ်ပုံစံတည်း၊ audit လုပ်နိုင်သော infrastructure management အတွက် Kubernetes Cluster ပေါ်သို့ အလိုအလျောက် ပို့ဆောင်ပေးသော စနစ်"
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                  <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg md:rounded-xl">
                    <GitBranch className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  What is GitOps?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black dark:text-gray-300 leading-relaxed text-base md:text-lg text-left">
                  {t(
                    "GitOps uses Git repositories as the single source of truth for infrastructure and applications. ArgoCD ensures that your cluster always matches the state defined in Git with automated synchronization, drift detection, and self-healing capabilities. It enables declarative continuous delivery with audit trails, rollback capabilities, and multi-environment management.",
                    "GitOps ဆိုတာ git repository ထဲမှာ သိမ်းထားတဲ့ code ပြောင်းလဲမှုရှိတာနဲ့ automated synchronization, drift detection, နှင့် self-healing capabilities တို့ဖြင့် kubernetes cluster ပေါ်မှာ application ကို အလိုအလျောက် update လုပ်ပေးပါတယ်။ code ထဲမှာ ရေးထားတဲ့အတိုင်း application တွေကို audit trails, rollback capabilities, နှင့် multi-environment management တို့ဖြင့် cluster ပေါ်မှာ declarative continuous delivery လုပ်စေပါတယ်။"
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black dark:text-white">
                  <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                    <Layers className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  How ArgoCD Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {[
                    {
                      icon: CheckCircle2,
                      title: "Declarative State Management",
                      desc: t(
                        "Ensures cluster matches Git definition with desired state reconciliation, configuration drift prevention, and automated remediation.",
                        "Cluster ၏ အခြေအနေသည် desired state reconciliation, configuration drift prevention, နှင့် automated remediation တို့ဖြင့် Git ထဲရှိ setting နှင့် အမြဲ တူညီနေစေခြင်း။"
                      ),
                      color: "blue",
                    },
                    {
                      icon: RefreshCw,
                      title: "Automated Sync & Health Checks",
                      desc: t(
                        "Continuously monitors and syncs changes with health assessments, resource hooks, and sync waves for ordered deployments.",
                        "Git ထဲရှိ ပြောင်းလဲမှုများကို health assessments, resource hooks, နှင့် ordered deployments အတွက် sync waves တို့ဖြင့် စောင့်ကြည့်ပြီး အလိုအလျောက် Update လုပ်ခြင်း။"
                      ),
                      color: "green",
                    },
                    {
                      icon: ArrowRight,
                      title: "Progressive Delivery & Rollback",
                      desc: t(
                        "Roll back to any version instantly with canary deployments, blue-green deployments, and analysis-based promotion using Argo Rollouts.",
                        "Argo Rollouts ကိုအသုံးပြုပြီး canary deployments, blue-green deployments, နှင့် analysis-based promotion တို့ဖြင့် ယခင် Version များသို့ ချက်ချင်း ပြန်ပြောင်းနိုင်ခြင်း။"
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

        {/* Security & Compliance Section */}
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
                Enterprise Security
              </span>
            </div>
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Security & Compliance
            </h1>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              {t(
                "DevSecOps at every stage of the lifecycle with modern security toolchain for comprehensive protection and regulatory compliance",
                "အဆင့်တိုင်းတွင် ခေတ်မီ security toolchain များဖြင့် ပြည့်စုံသော ကာကွယ်မှုနှင့် စည်းမျဉ်းစည်းကမ်းလိုက်နာမှုအတွက် Security ကို ထည့်သွင်းစဥ်းစားခြင်း"
              )}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl bg-white dark:bg-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold">
                  <div className="p-2 md:p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                  </div>
                  DevSecOps Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black dark:text-gray-300 mb-6 leading-relaxed text-left">
                  {t(
                    "Security is baked into the pipeline, not added as an afterthought. We implement automated vulnerability scanning at every stage with SAST, DAST, SCA, and IaC security scanning integrated into CI/CD workflows.",
                    "လုံခြုံရေး ကို နောက်မှထည့်သွင်းခြင်းမျိုးမဟုတ်ဘဲ SAST, DAST, SCA, နှင့် IaC security scanning တို့ဖြင့် CI/CD workflows ထဲသို့ ပေါင်းစပ်ထည့်သွင်းပြီး Pipeline တစ်ခုလုံး၏ အဆင့်တိုင်းတွင် အလိုအလျောက် စစ်ဆေးနိုင်ရန် တည်ဆောက်ထားပါသည်။"
                  )}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm md:text-base">
                      Container Scanning (Trivy/Grype/Clair)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm md:text-base">
                      Static Analysis (SonarQube/Semgrep/Checkmarx)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm md:text-base">
                      Runtime Security (Falco/Polaris/Kyverno)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl bg-white dark:bg-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold">
                  <div className="p-2 md:p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                    <Key className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                  </div>
                  Identity & Access Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black dark:text-gray-300 mb-6 leading-relaxed text-left">
                  {t(
                    "Zero Trust architecture with fine-grained access control using Kubernetes RBAC, OPA/Gatekeeper policies, and secure secret management with HashiCorp Vault/AWS Secrets Manager/Azure Key Vault integration.",
                    "Zero Trust ပုံစံကို အခြေခံပြီး Kubernetes RBAC, OPA/Gatekeeper policies နှင့် HashiCorp Vault/AWS Secrets Manager/Azure Key Vault integration ဖြင့် လုံခြုံသော Secret Management စနစ်များဖြင့် fine-grained access control ဖြင့် ဒေတာများကို ကာကွယ်ထားပါသည်။"
                  )}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm md:text-base">
                      RBAC & OPA/Gatekeeper Enforcement
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm md:text-base">
                      Cloud Secret Store Integration
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm md:text-base">
                      Service Mesh mTLS (Istio/Linkerd)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Logging & Observability Section */}
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
                Full Stack Observability
              </span>
            </div>
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Logging & Observability
            </h1>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              {t(
                "Total visibility into your modern infrastructure with comprehensive observability stack for proactive monitoring and rapid troubleshooting",
                "ခေတ်မီ Infrastructure များအတွက် proactive monitoring နှင့် rapid troubleshooting အတွက် ပြည့်စုံသော observability stack ဖြင့် အပြည့်အဝ ခြေရာခံ စောင့်ကြည့်နိုင်မှု"
              )}
            </p>
          </motion.div>
          <Card className="border-0 shadow-lg rounded-2xl md:rounded-3xl bg-white dark:bg-gray-800 p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              <div className="space-y-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-left">Metrics Monitoring</h4>
                <p className="text-sm md:text-base text-black dark:text-gray-400 leading-relaxed text-left">
                  {t(
                    "Real-time performance tracking with Prometheus and Grafana dashboards, custom metrics collection, and alerting with Alertmanager/PagerDuty integration for SLO/SLA monitoring.",
                    "Prometheus နှင့် Grafana dashboards, custom metrics collection, နှင့် SLO/SLA monitoring အတွက် Alertmanager/PagerDuty integration တို့ဖြင့် cluster တွေ application တွေရဲ့ လုပ်ဆောင်ချက်များကို Real-time မျက်ခြေမပြတ် စောင့်ကြည့်နိုင်ပါသည်။"
                  )}
                </p>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl w-fit">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-bold text-left">Centralized Logging</h4>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed text-left">
                  {t(
                    "Consolidate logs from all microservices into one place for rapid debugging with Grafana Loki, ELK Stack (Elasticsearch, Logstash, Kibana), or OpenSearch with structured logging and log retention policies.",
                    "ပြဿနာများကို မြန်မြန်ဆန်ဆန် ဖြေရှင်းနိုင်ရန် structured logging နှင့် log retention policies တို့ဖြင့် Grafana Loki, ELK Stack (Elasticsearch, Logstash, Kibana) သို့မဟုတ် OpenSearch ကို အသုံးပြုထားသော Logging System ဖြစ်ပါသည်။"
                  )}
                </p>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl w-fit">
                  <Eye className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="text-xl font-bold text-left">Distributed Tracing</h4>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed text-left">
                  {t(
                    "Track requests across microservices to identify bottlenecks instantly with Jaeger, Zipkin, or OpenTelemetry for end-to-end visibility, latency analysis, and dependency mapping in complex microservices architectures.",
                    "Service တစ်ခုနှင့်တစ်ခုကြား ချိတ်ဆက်မှုများကို Jaeger, Zipkin, သို့မဟုတ် OpenTelemetry ဖြင့် end-to-end visibility, latency analysis, နှင့် dependency mapping တို့ဖြင့် ခြေရာခံပြီး complex microservices architectures တွင် issue ဖြစ်ခဲ့လျှင် ချက်ချင်း ပြင်ဆင်နိုင်ပါသည်။"
                  )}
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Final CTA Section - Mobile Optimized */}
        <section className="mb-12 md:mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 border-0 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden">
            <CardContent className="p-6 md:p-12 text-center text-white">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-left md:text-center">
                  {t(
                    "Ready to Transform Your Infrastructure?",
                    "Ready to Transform Your Infrastructure?"
                  )}
                </h2>
                <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-6 md:mb-8 leading-relaxed text-left md:text-center">
                  {t(
                    "Join dozens of successful companies who've modernized their stack with our cloud-native platform featuring complete DevOps/DevSecOps toolchain.",
                    "ကျွန်ုပ်တို့၏ Cloud-Native Platform ကို ပြည့်စုံသော DevOps/DevSecOps toolchain များဖြင့် အသုံးပြုပြီး သင်တို့ လုပ်ငန်းအတွက် လုံခြုံစိတ်ချရတဲ့ ခေတ်မီ tech stack များကိုအသုံးပြုလိုက်ပါ။"
                  )}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
                  {/* Final CTA Button - Mobile Optimized */}
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
                        "30-Day Implementation",
                        "ရက် ၃၀ အတွင်း အကောင်အထည်ဖော်ခြင်း"
                      ),
                      desc: t("Rapid deployment", "မြန်ဆန်သော ပြင်ဆင်မှု"),
                    },
                    {
                      icon: ShieldCheck,
                      label: t("Enterprise Grade", "လုပ်ငန်းသုံးအဆင့်"),
                      desc: t(
                        "Production ready",
                        "Production အတွက် အသင့်ဖြစ်မှု"
                      ),
                    },
                    {
                      icon: Zap,
                      label: t("Cost Optimized", "ကုန်ကျစရိတ် အသက်သာဆုံး"),
                      desc: t(
                        "Significant savings",
                        "ကုန်ကျစရိတ် သိသာစွာ လျှော့ချမှု"
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
                        "Free 30-minute cloud migration assessment",
                        "Cloud Migration အကဲဖြတ်ခြင်း (၃၀ မိနစ်)"
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

                {/* Migration Goals */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t("Migration Goals", "Migration ရည်မှန်းချက်များ")}
                  </label>
                  <textarea
                    rows={3}
                    name="project_goals"
                    value={formData.project_goals}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 resize-none transition-all duration-300"
                    placeholder={t(
                      "Describe your migration goals or challenges...",
                      "သင်၏ migration ရည်မှန်းချက်များ သို့မဟုတ် စိန်ခေါ်မှုများကို ရှင်းပြပါ..."
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