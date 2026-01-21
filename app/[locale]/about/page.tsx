"use client";

import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Download,
  Server,
  Linkedin,
  Sparkles,
  Rocket,
  CheckCircle2,
  Zap,
  ArrowRight,
  Users,
  Workflow,
  Cloud,
  Terminal,
  Shield,
  Cpu,
  GitBranch,
  MessageSquare,
  ChevronDown,
  ShieldCheck,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const personalInfo = {
  name: "Thaung Htike Oo",
  title: "Senior DevOps Engineer",
  location: "Yangon | Myanmar",
  email: "thaunghtike.tho1234@gmail.com",
  phone: "+959952492359",
  summary:
    "DevOps Engineer with over 5 years of experience designing, automating, and optimizing cloud-native infrastructure in fast-paced, high-availability environments. Skilled in building robust CI/CD pipelines, managing containerized applications with Kubernetes and Docker, and implementing infrastructure as code using Terraform and Ansible. Proficient across major cloud platforms including Azure and AWS, with a strong focus on reliability, scalability, and automation.",
  avatar: "/thaung.jpg?height=150&width=150",
  linkedinUrl: "https://www.linkedin.com/in/thaung-htike-oo-6672781b1",
};

const workExperience = [
  {
    company: "Maharbawga Company Ltd",
    position: "Senior DevOps Engineer",
    duration: "Nov 2024 - Present",
    location: "Yangon, Myanmar",
    responsibilities: [
      "Migrated monolithic applications to microservices architecture",
      "Led the migration of complex Azure infrastructure into Terraform",
      "Managed and maintained AKS clusters with multiple node pools",
      "Built reusable Terraform modules for scalable Kubernetes infrastructure",
      "Implemented CI/CD pipelines using GitHub Actions and ArgoCD",
    ],
    technologies: ["Azure", "AKS", "Terraform", "Kubernetes", "ArgoCD"],
  },
  {
    company: "Dinger Company Ltd",
    position: "Senior DevOps Engineer",
    duration: "Jun 2022 - Aug 2024",
    location: "Yangon, Myanmar",
    responsibilities: [
      "Managed cloud infrastructure using EKS, AKS, GitHub Actions, ArgoCD",
      "Successfully released the MTB Pay wallet in August 2024",
      "Designed and implemented cloud infrastructure from ground up",
      "Managed cloud cost optimization and infrastructure performance tuning",
      "Deployed and maintained Kubernetes clusters using AKS and EKS",
    ],
    technologies: ["AWS", "AKS", "Kubernetes", "Terraform", "Github Actions"],
  },
  {
    company: "OpsZero",
    position: "DevOps Engineer",
    duration: "Dec 2021 - Jun 2023",
    location: "Remote",
    responsibilities: [
      "Developed Python Django models for application performance",
      "Handled container management using Amazon EKS",
      "Wrote Terraform scripts for cloud resource provisioning",
      "Developed CI/CD workflows using GitHub Actions and GitLab CI",
      "Used HashiCorp Vault for secure management of sensitive data",
    ],
    technologies: ["Azure", "AWS", "Terraform", "CI/CD", "Grafana"],
  },
  {
    company: "Frontir Company Ltd",
    position: "SRE Engineer",
    duration: "July 2019 - August 2021",
    location: "Yangon, Myanmar",
    responsibilities: [
      "Handled kubernetes cluster management using kubeadm and rancher",
      "Wrote shell scripts for automation of routine tasks",
      "Developed CI/CD workflows using GitLab CI",
      "Monitored system performance using Prometheus and Grafana"
    ],
    technologies: ["Kubernetes", "AWS", "Linux", "CI/CD", "Grafana"],
  },
];

const education = [
  {
    degree: "B.C.Tech - Communication and Networking",
    institution: "University of Information Technology, Yangon",
    duration: "2015 - 2020",
    details: "Graduated with honors (GPA: 3.8/4.0)",
  },
];

const certifications = [
  {
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    year: "2022",
  },
  {
    name: "Certified Kubernetes Administrator",
    issuer: "Cloud Native Computing Foundation",
    year: "2022",
  },
  {
    name: "Terraform Associate",
    issuer: "HashiCorp",
    year: "2023",
  },
  {
    name: "Azure Fundamentals Az-900",
    issuer: "Microsoft",
    year: "2023",
  },
];

const skills = {
  "Cloud Platforms": ["AWS", "Azure", "Google Cloud Platform"],
  Containerization: ["Docker", "Kubernetes", "OpenShift"],
  "CI/CD Tools": ["GitHub Actions", "ArgoCD", "Jenkins", "Azure DevOps"],
  "Infrastructure as Code": ["Terraform", "Ansible", "Pulumi"],
  Monitoring: ["Prometheus", "Grafana", "ELK Stack", "CloudWatch"],
  Programming: ["Python", "Node.js", "Bash"],
  Databases: ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
};

const projects = [
  {
    name: "Cloud Migration & Microservices",
    description:
      "Led migration of legacy applications to cloud-native microservices architecture with containerization and automated CI/CD pipelines.",
    technologies: ["AWS", "Azure", "Kubernetes", "Terraform", "ArgoCD"],
    impact: "Improved deployment speed by 60%, reduced costs by 45%",
  },
  {
    name: "MTB Pay Wallet Infrastructure",
    description:
      "Designed and implemented the cloud infrastructure for MTB Pay wallet, ensuring high availability and security.",
    technologies: ["AWS", "Kubernetes", "Terraform", "GitHub Actions"],
    impact: "Successful product launch with 99.9% uptime",
  },
  {
    name: "Freelance DevOps Solutions",
    description:
      "Provided infrastructure automation and backend improvements for various clients on Upwork platform.",
    technologies: ["Terraform", "Kubernetes", "AWS", "Python", "Django"],
    impact: "Generated $17K+ in freelance earnings",
  },
];

const stats = [
  { value: "6+", label: "Years Experience", icon: Calendar },
  { value: "50+", label: "Projects", icon: Rocket },
  { value: "99.9%", label: "Uptime", icon: Shield },
  { value: "$17K+", label: "Upwork Earnings", icon: Award },
];

const services = [
  {
    title: "Cloud Infrastructure",
    description: "Design and implementation of scalable cloud solutions",
    icon: Cloud,
  },
  {
    title: "CI/CD Automation",
    description: "End-to-end pipeline setup and optimization",
    icon: GitBranch,
  },
  {
    title: "Container Orchestration",
    description: "Kubernetes cluster management and optimization",
    icon: Cpu,
  },
  {
    title: "Infrastructure as Code",
    description: "Terraform, Ansible for automated provisioning",
    icon: Terminal,
  },
];

export default function AboutPage() {
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEmailClick = () => {
    window.location.href =
      "mailto:thaunghtikeoo.tho1234@gmail.com?subject=DevOps Consultation&body=Hi Thaung, I'm interested in your DevOps services.";
  };

  const handleCaseStudiesClick = () => {
    window.open(
      "https://github.com/thaunghtike-share/DevOps-Projects",
      "_blank"
    );
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsBookingModalOpen(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        current_environment: "",
        project_goals: "",
        preferred_time: "",
      });
    }, 1500);
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
        aria-label="Messenger Support"
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
            Chat Now
          </span>
        </div>
      </a>

      <MinimalHeader />

      <main className="px-4 md:px-11 md:py-8">
        {/* Hero Section with New Title Styling */}
        <section className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Blue/Purple gradient line with "Our Mission" style */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                DevOps & Cloud Specialist
              </span>
            </div>

            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Building Scalable Cloud Infrastructure
            </h1>

            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-3xl text-left">
              I architect and automate cloud-native solutions that scale, with expertise in Kubernetes, Terraform, and CI/CD pipelines across AWS and Azure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-2xl text-gray-900 dark:text-white tracking-tight font-medium">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Services Section */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group"
                    >
                      <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800">
                        <CardContent className="p-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                            <service.icon className="h-6 w-6" />
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                            {service.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {service.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-1">
                        <div className="relative w-full h-full bg-white rounded-full overflow-hidden">
                          <Image
                            src={personalInfo.avatar || "/tho.jpg"}
                            alt={personalInfo.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {personalInfo.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-4">
                      {personalInfo.title}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-3 text-blue-500" />
                      {personalInfo.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="h-4 w-4 mr-3 text-blue-500" />
                      {personalInfo.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="h-4 w-4 mr-3 text-blue-500" />
                      {personalInfo.phone}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <a href="/thaung-cv.pdf" download className="w-full">
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download CV
                      </Button>
                    </a>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 font-semibold"
                        onClick={() =>
                          window.open(personalInfo.linkedinUrl, "_blank")
                        }
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-2 border-cyan-200 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:border-cyan-300 dark:hover:border-cyan-600 font-semibold"
                        onClick={handleEmailClick}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Experience Section with New Title Styling */}
        <section className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Blue/Purple gradient line with "Our Mission" style */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Professional Journey
              </span>
            </div>

            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Work Experience
            </h1>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              5+ years in DevOps engineering with focus on cloud infrastructure and automation
            </p>
          </motion.div>

          <div className="space-y-6">
            {workExperience.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                              {job.position}
                            </h3>
                            <p className="text-blue-600 dark:text-blue-400 font-semibold">
                              {job.company}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <Calendar className="h-4 w-4 mr-2" />
                              {job.duration}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                              <MapPin className="h-4 w-4 mr-2" />
                              {job.location}
                            </div>
                          </div>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {job.responsibilities.slice(0, 3).map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start text-sm text-gray-600 dark:text-gray-300"
                            >
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2">
                          {job.technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0 text-xs px-3 py-1"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Section with New Title Styling */}
        <section className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Blue/Purple gradient line with "Our Mission" style */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Successful Implementations
              </span>
            </div>

            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Key Projects
            </h1>
            <p className="text-lg md:text-xl text-black dark:text-gray-300 mb-4 text-left">
              Real-world implementations showcasing infrastructure automation and cloud solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 h-full bg-white dark:bg-gray-800 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4">
                      <Server className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="text-xs border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                        >
                          +{project.technologies.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Impact:{" "}
                        <span className="font-normal text-gray-600 dark:text-gray-300">
                          {project.impact}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills & Education/Certifications Section */}
        <section className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mb-8"
          >
            {/* Blue/Purple gradient line with "Our Mission" style */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-12 md:w-16 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Technical Expertise
              </span>
            </div>

            <h1 className="text-2xl md:text-6xl text-black dark:text-white mb-4 tracking-tight text-left">
              Skills & Certifications
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skills */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white">
                  <Code className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Technical Skills
                </h3>
              </div>
              <Card className="border-0 shadow-lg rounded-2xl bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {Object.entries(skills).map(([category, skillList]) => (
                      <div key={category}>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          {category}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {skillList.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Education & Certifications */}
            <div className="space-y-8">
              {/* Education */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Education
                  </h3>
                </div>
                <Card className="border-0 shadow-lg rounded-2xl bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    {education.map((edu, index) => (
                      <div key={index}>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                          {edu.degree}
                        </h4>
                        <p className="text-green-600 dark:text-green-400 font-semibold text-sm mb-2">
                          {edu.institution}
                        </p>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {edu.duration}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{edu.details}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Certifications
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certifications.map((cert, index) => (
                    <Card
                      key={index}
                      className="border-0 shadow-lg rounded-2xl bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300"
                    >
                      <CardContent className="p-4">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                          {cert.name}
                        </h4>
                        <p className="text-orange-600 dark:text-orange-400 font-semibold text-xs mb-2">
                          {cert.issuer}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{cert.year}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Updated CTA Section from Services Page */}
        <section className="mb-12 md:mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 border-0 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden">
            <CardContent className="p-6 md:p-12 text-center text-white">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-left md:text-center">
                  Ready to Transform Your Infrastructure?
                </h2>
                <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-6 md:mb-8 leading-relaxed text-left md:text-center">
                  Join dozens of successful companies who've modernized their stack with cloud-native DevOps solutions.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    onClick={() => setIsBookingModalOpen(true)}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 md:px-8 md:py-3 rounded-xl text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                  >
                    <Rocket className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Start Free Consultation
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCaseStudiesClick}
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 md:px-8 md:py-3 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 w-full sm:w-auto"
                  >
                    View Case Studies
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-blue-500">
                  {[
                    {
                      icon: CheckCircle2,
                      label: "30-Day Implementation",
                      desc: "Rapid deployment",
                    },
                    {
                      icon: ShieldCheck,
                      label: "Enterprise Grade",
                      desc: "Production ready",
                    },
                    {
                      icon: Zap,
                      label: "Cost Optimized",
                      desc: "Significant savings",
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

      {/* Booking Modal from Services Page */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
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
                  Schedule Consultation
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

            {/* Desktop Close Button */}
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
              {/* Desktop Header */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-md">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                      Schedule Consultation
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Free 30-minute cloud migration assessment
                    </p>
                  </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name & Email */}
                <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Email Address *
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
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                    placeholder="Optional"
                  />
                </div>

                {/* Current Infrastructure & Preferred Time */}
                <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Current Infrastructure *
                    </label>
                    <div className="relative">
                      <select
                        required
                        name="current_environment"
                        value={formData.current_environment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 appearance-none transition-all duration-300"
                      >
                        <option value="">Select Infra</option>
                        <option value="on-premise">On-premise</option>
                        <option value="aws">AWS</option>
                        <option value="azure">Azure</option>
                        <option value="gcp">Google Cloud</option>
                        <option value="hybrid">Hybrid / Multi-cloud</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <select
                        required
                        name="preferred_time"
                        value={formData.preferred_time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 appearance-none transition-all duration-300"
                      >
                        <option value="">Select time</option>
                        <option value="morning">Weekday Morning</option>
                        <option value="afternoon">Weekday Afternoon</option>
                        <option value="evening">Weekday Evening</option>
                        <option value="flexible">Flexible Schedule</option>
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
                    Migration Goals
                  </label>
                  <textarea
                    rows={3}
                    name="project_goals"
                    value={formData.project_goals}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/70 dark:border-gray-700/70 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 resize-none transition-all duration-300"
                    placeholder="Describe your migration goals or challenges..."
                  />
                </div>

                {/* Submit Button */}
                <div className="sticky md:static bottom-0 bg-white/95 dark:bg-gray-900/95 pt-6 md:pt-0 -mx-4 md:mx-0 px-4 md:px-0 -mb-4 md:mb-0">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="relative z-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                        Schedule Free Session
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Button>

                  {/* Privacy Note */}
                  <div className="pt-6 mt-6 md:mt-6 border-t border-gray-300/30 dark:border-gray-700/30">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>We respect your privacy</span>
                      </div>
                      <div className="hidden sm:block text-gray-400 dark:text-gray-600">•</div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>24-hour response time</span>
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