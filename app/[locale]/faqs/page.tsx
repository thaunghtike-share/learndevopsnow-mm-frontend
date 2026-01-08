"use client";

import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Minus,
  MessageCircleQuestion,
  ChevronLeft,
  ChevronRight,
  Zap,
  Users,
  Workflow,
  Cloud,
  Briefcase,
  BookOpen,
  Sparkles,
  Filter,
  ArrowRight,
  Mail,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

type FAQ = {
  id: number;
  question: string;
  answer: string;
  category: "devops" | "career" | "cloud" | "general" | "services";
  popularity: number;
};

const faqsData: FAQ[] = [
  // DevOps Questions
  {
    id: 1,
    question: "What exactly is DevOps and why is it important?",
    answer:
      "DevOps is a cultural and professional movement that stresses communication, collaboration, integration, and automation between software developers and IT operations. It's important because it enables organizations to deliver applications and services at high velocity, improves deployment frequency for faster time to market, and reduces failure rate of new releases with better collaboration and automation.",
    category: "devops",
    popularity: 95,
  },
  {
    id: 2,
    question: "What are the core principles of DevOps?",
    answer:
      "The core principles include: Infrastructure as Code (IaC), Continuous Integration and Continuous Deployment (CI/CD), Monitoring and Logging, Communication and Collaboration, Microservices Architecture, and Automation. These principles help teams deliver software faster, more reliably, and with better quality.",
    category: "devops",
    popularity: 88,
  },
  {
    id: 3,
    question: "What tools are essential in a DevOps pipeline?",
    answer:
      "Essential DevOps tools include: Version Control (Git), CI/CD (Jenkins, GitHub Actions, GitLab CI), Configuration Management (Ansible, Chef, Puppet), Containerization (Docker), Orchestration (Kubernetes), Infrastructure as Code (Terraform, CloudFormation), Monitoring (Prometheus, Grafana), and Collaboration (Slack, Jira).",
    category: "devops",
    popularity: 92,
  },
  {
    id: 4,
    question: "How does DevOps improve software quality?",
    answer:
      "DevOps improves software quality through continuous testing, automated deployments, faster feedback loops, consistent environments, and proactive monitoring. By catching issues early in the development cycle and maintaining consistent deployment processes, teams can significantly reduce bugs and improve overall software reliability.",
    category: "devops",
    popularity: 85,
  },

  // Career Questions
  {
    id: 5,
    question: "What skills are required to become a DevOps Engineer?",
    answer:
      "To become a DevOps Engineer, you need a combination of technical and soft skills. Technical skills include programming languages (Python, Go, Bash), automation tools, containerization, cloud platforms (AWS, Azure, GCP), CI/CD pipelines, Infrastructure as Code, configuration management, and monitoring tools. Soft skills include communication, collaboration, problem-solving, and adaptability.",
    category: "career",
    popularity: 96,
  },
  {
    id: 6,
    question: "Does a DevOps Engineer need to know how to code?",
    answer:
      "Yes, DevOps Engineers typically have strong coding skills. They write infrastructure-as-code using tools like Terraform, build CI/CD pipelines with scripting languages, automate system configurations, and often contribute to application code. Proficiency in at least one programming language is essential for automation and tool development.",
    category: "career",
    popularity: 90,
  },
  {
    id: 7,
    question: "What's the career growth path for a DevOps Engineer?",
    answer:
      "The typical career path progresses from Junior DevOps Engineer → DevOps Engineer → Senior DevOps Engineer → DevOps Architect → DevOps Manager/Lead. With experience, professionals can move into Site Reliability Engineering (SRE), Cloud Architecture, or technical leadership roles. Continuous learning and certification in cloud platforms and new technologies are key for advancement.",
    category: "career",
    popularity: 87,
  },
  {
    id: 8,
    question: "What certifications are valuable for DevOps careers?",
    answer:
      "Valuable certifications include: AWS Certified DevOps Engineer, Azure DevOps Engineer Expert, Google Cloud Professional DevOps Engineer, Docker Certified Associate, Certified Kubernetes Administrator (CKA), Terraform Associate, and Linux Foundation certifications. These validate your skills and can significantly boost career opportunities.",
    category: "career",
    popularity: 89,
  },

  // Cloud Questions
  {
    id: 9,
    question: "Which cloud platform is best for DevOps - AWS, Azure, or GCP?",
    answer:
      "Each platform has strengths: AWS has the largest market share and most comprehensive services, Azure integrates well with Microsoft ecosystems, and GCP excels in data analytics and machine learning. The 'best' depends on your organization's needs, existing infrastructure, and specific use cases. Many companies use multi-cloud strategies to leverage the strengths of each platform.",
    category: "cloud",
    popularity: 91,
  },
  {
    id: 10,
    question: "How does cloud computing enhance DevOps practices?",
    answer:
      "Cloud computing enhances DevOps by providing scalable infrastructure, managed services, automation capabilities, and pay-as-you-go pricing. It enables teams to quickly provision resources, implement auto-scaling, use serverless architectures, and leverage cloud-native tools for monitoring, security, and deployment automation.",
    category: "cloud",
    popularity: 84,
  },
  {
    id: 11,
    question:
      "What are the key cloud services every DevOps engineer should know?",
    answer:
      "Key services include: Compute (EC2, Azure VMs, GCE), Storage (S3, Blob Storage, Cloud Storage), Networking (VPC, Load Balancers, CDN), Database (RDS, Cosmos DB, Cloud SQL), Container Services (EKS, AKS, GKE), Serverless (Lambda, Functions, Cloud Functions), and Monitoring (CloudWatch, Monitor, Stackdriver).",
    category: "cloud",
    popularity: 86,
  },
  {
    id: 12,
    question: "How do you ensure security in cloud DevOps environments?",
    answer:
      "Cloud security in DevOps involves: Implementing Identity and Access Management (IAM), Using security groups and network ACLs, Encrypting data at rest and in transit, Regular security scanning and patching, Implementing security in CI/CD pipelines, Using infrastructure as code for consistent security configurations, and Continuous monitoring for threats and vulnerabilities.",
    category: "cloud",
    popularity: 93,
  },

  // Services Questions
  {
    id: 13,
    question: "Do you offer professional DevOps services?",
    answer:
      "Yes! We offer comprehensive DevOps services including Cloud Migration, Infrastructure Automation, CI/CD pipeline setup, Kubernetes management, containerization, and cloud-native application deployment. Our services help teams accelerate development, improve deployment reliability, and optimize infrastructure costs while maintaining security and compliance standards.",
    category: "services",
    popularity: 88,
  },
  {
    id: 14,
    question: "How can I request a consultation for DevOps services?",
    answer:
      "You can request a consultation through multiple channels: Use the chat feature on our website, fill out the contact form on our Contact page, reach out via LinkedIn for professional inquiries, or email us directly. We'll schedule a discovery call to understand your requirements and propose tailored solutions for your DevOps transformation.",
    category: "services",
    popularity: 82,
  },
  {
    id: 15,
    question: "What types of projects do you typically work on?",
    answer:
      "We work on a variety of projects including: Cloud infrastructure setup and migration, CI/CD pipeline implementation, Kubernetes cluster management, Infrastructure as Code development, Monitoring and logging solutions, Security hardening, Performance optimization, and Team training and mentoring. Our expertise spans startups to enterprise-level organizations.",
    category: "services",
    popularity: 85,
  },
  {
    id: 16,
    question: "Do you provide ongoing support and maintenance?",
    answer:
      "Yes, we offer flexible support models including ongoing maintenance, 24/7 monitoring, regular health checks, performance optimization, and security updates. We can tailor support packages to match your specific needs, from basic monitoring to comprehensive managed services with SLAs.",
    category: "services",
    popularity: 80,
  },

  // General Questions
  {
    id: 17,
    question: "How are DevOps Engineers different from traditional developers?",
    answer:
      "While both roles involve coding, DevOps Engineers focus on the entire software delivery lifecycle including infrastructure, deployment, monitoring, and operations. They bridge the gap between development and operations, ensuring that software runs reliably in production environments and that deployment processes are automated and efficient.",
    category: "general",
    popularity: 83,
  },
  {
    id: 18,
    question: "What is the difference between SRE and DevOps?",
    answer:
      "DevOps focuses on improving software delivery and infrastructure automation, bridging development and operations. Site Reliability Engineering (SRE) applies software engineering principles to operations, focusing specifically on system reliability, performance, and scalability. SRE is often considered an implementation of DevOps principles with a stronger focus on reliability metrics and engineering practices.",
    category: "general",
    popularity: 87,
  },
];

const categories = [
  { id: "all", name: "All Questions", count: faqsData.length, icon: BookOpen },
  {
    id: "devops",
    name: "DevOps",
    count: faqsData.filter((f) => f.category === "devops").length,
    icon: Workflow,
  },
  {
    id: "career",
    name: "Career",
    count: faqsData.filter((f) => f.category === "career").length,
    icon: Briefcase,
  },
  {
    id: "cloud",
    name: "Cloud",
    count: faqsData.filter((f) => f.category === "cloud").length,
    icon: Cloud,
  },
  {
    id: "services",
    name: "Services",
    count: faqsData.filter((f) => f.category === "services").length,
    icon: Users,
  },
  {
    id: "general",
    name: "General",
    count: faqsData.filter((f) => f.category === "general").length,
    icon: MessageCircleQuestion,
  },
];

const stats = [
  { value: "18+", label: "FAQ Questions", icon: MessageCircleQuestion },
  { value: "5", label: "Categories", icon: Filter },
  { value: "95%", label: "Satisfaction Rate", icon: Sparkles },
  { value: "24/7", label: "Support Available", icon: Zap },
];

export default function FAQPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const filteredFaqs = faqsData.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const nextFAQ = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredFaqs.length);
  };

  const prevFAQ = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + filteredFaqs.length) % filteredFaqs.length
    );
  };

  const goToFAQ = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleExpand = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentFAQ = filteredFaqs[currentIndex];

  return (
    <div className="min-h-screen bg-white/95 dark:bg-[#000000] relative transition-colors duration-300">
      <MinimalHeader />

      <main className="px-11 sm:px-6 md:px-11 py-8">
        {/* Header Section */}
        <div className="mb-16">
          <div className="max-w-3xl">
            {/* Blue/Purple gradient line with "Our Mission" style */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                FAQS
              </span>
            </div>
            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight">
              Frequently Asked Questions
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-black-700 dark:text-gray-300 leading-relaxed"
            >
              Get answers to common questions about DevOps, career paths, cloud
              technologies, and our services. Real-world experience, practical
              knowledge, and proven methodologies.
            </motion.p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="border-0 shadow-lg rounded-3xl dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-black-700 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-black-600 dark:text-gray-400 text-sm font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Search & Categories */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories Card */}
            <Card className="border-0 shadow-lg rounded-3xl dark:bg-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl font-bold text-black-700 dark:text-white">
                  <Filter className="h-6 w-6 mr-3 text-sky-600 dark:text-sky-400" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                          selectedCategory === category.id
                            ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg"
                            : "bg-gray-50 dark:bg-gray-700 text-black-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 mr-3" />
                          <span className="font-semibold">{category.name}</span>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${
                            selectedCategory === category.id
                              ? "bg-white/20 text-white border-0"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-0"
                          }`}
                        >
                          {category.count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="border-0 shadow-lg rounded-3xl dark:bg-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl font-bold text-black-700 dark:text-white">
                  <Zap className="h-6 w-6 mr-3 text-amber-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <Button
                  className="w-full justify-start bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                  onClick={() =>
                    window.open("https://m.me/learndevopsnowbytho", "_blank")
                  }
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask on Messenger
                </Button>
                <Button
                  className="w-full justify-start bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                  onClick={() =>
                    window.open(
                      "mailto:thaunghtikeoo.tho1234@gmail.com?subject=DevOps Consultation&body=Hi Thaung, I would like to schedule a consultation about DevOps services.",
                      "_blank"
                    )
                  }
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Consultation
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - FAQ Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Question Carousel */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl flex items-center justify-center text-white">
                  <MessageCircleQuestion className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black-700 dark:text-white">
                    Featured Questions
                  </h2>
                  <p className="text-black-600 dark:text-gray-400">
                    Browse through important questions ({filteredFaqs.length}{" "}
                    found)
                  </p>
                </div>
              </div>

              {/* Carousel Card */}
              {filteredFaqs.length > 0 ? (
                <Card className="border-0 shadow-xl rounded-3xl dark:bg-gray-800 relative">
                  <CardContent className="p-8">
                    {/* Navigation Buttons */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 z-20">
                      <motion.button
                        onClick={prevFAQ}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-700 text-sky-600 dark:text-sky-400 rounded-full shadow-lg border border-gray-300 dark:border-gray-600 hover:border-sky-400 transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </motion.button>
                    </div>

                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 z-20">
                      <motion.button
                        onClick={nextFAQ}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-700 text-sky-600 dark:text-sky-400 rounded-full shadow-lg border border-gray-300 dark:border-gray-600 hover:border-sky-400 transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </motion.button>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentFAQ.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="text-center px-4"
                      >
                        {/* Category Badge */}
                        <Badge className="bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300 border-0 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                          {currentFAQ.category.toUpperCase()}
                        </Badge>

                        {/* Question */}
                        <h3 className="text-2xl font-bold text-black-700 dark:text-white mb-6 leading-tight">
                          {currentFAQ.question}
                        </h3>

                        {/* Answer */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="text-black-700 dark:text-gray-300 text-lg leading-relaxed text-left"
                        >
                          {currentFAQ.answer}
                        </motion.div>

                        {/* Popularity Indicator */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-black-500 dark:text-gray-400">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          {currentFAQ.popularity}% of users found this helpful
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-xl rounded-3xl dark:bg-gray-800">
                  <CardContent className="p-12 text-center">
                    <MessageCircleQuestion className="w-16 h-16 text-black-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-black-700 dark:text-white mb-2">
                      No questions found
                    </h3>
                    <p className="text-black-600 dark:text-gray-400">
                      Try adjusting your search or filter criteria
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Carousel Navigation Dots */}
              {filteredFaqs.length > 0 && (
                <div className="flex justify-center space-x-3 mt-6">
                  {filteredFaqs.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => goToFAQ(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-gradient-to-r from-sky-500 to-blue-500 shadow-lg"
                          : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* All Questions List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-black-700 dark:text-white">
                    All Questions
                  </h2>
                  <p className="text-black-600 dark:text-gray-400">
                    {filteredFaqs.length} questions in{" "}
                    {selectedCategory === "all"
                      ? "all categories"
                      : categories
                          .find((c) => c.id === selectedCategory)
                          ?.name?.toLowerCase()}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                >
                  {filteredFaqs.length} results
                </Badge>
              </div>

              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-lg rounded-3xl dark:bg-gray-800 transition-all duration-300">
                      <CardContent className="p-6">
                        <button
                          onClick={() => toggleExpand(faq.id)}
                          className="w-full text-left flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className="bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300 border-0 text-xs">
                                {faq.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-black-500 dark:text-gray-400">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                {faq.popularity}%
                              </div>
                            </div>
                            <h4 className="font-semibold text-black-700 dark:text-white text-lg leading-tight pr-8">
                              {faq.question}
                            </h4>
                          </div>
                          {expandedItems.includes(faq.id) ? (
                            <Minus className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-1" />
                          ) : (
                            <Plus className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-1" />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedItems.includes(faq.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4"
                            >
                              <p className="text-black-700 dark:text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <MinimalFooter />
    </div>
  );
}
