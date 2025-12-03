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
  Play,
  ExternalLink,
  Users,
  Workflow,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const personalInfo = {
  name: "Thaung Htike Oo",
  title: "Senior DevOps Engineer",
  location: "Yangon | Myanmar",
  email: "thaunghtike.tho1234@gmail.com",
  phone: "+959952492359",
  summary:
    "DevOps Engineer with over 5 years of experience designing, automating, and optimizing cloud-native infrastructure in fast-paced, high-availability environments. Skilled in building robust CI/CD pipelines, managing containerized applications with Kubernetes and Docker, and implementing infrastructure as code using Terraform and Ansible. Proficient across major cloud platforms including Azure and AWS, with a strong focus on reliability, scalability, and automation. Currently expanding into the AI/MLOps space — learning to streamline machine learning workflows, manage model lifecycles, and deploy scalable ML solutions using tools like MLflow, Kubeflow, and Azure Machine Learning. Passionate about bridging the gap between software engineering, data science, and infrastructure through automation and modern DevOps practices.",
  avatar: "/thaung.jpg?height=150&width=150",
  linkedinUrl: "https://www.linkedin.com/in/thaung-htike-oo-6672781b1",
};

const workExperience = [
  {
    company: "Maharbawga Company Ltd",
    position: "Senior DevOps Engineer",
    duration: "November 2024 - Present",
    location: "Yangon, Myanmar",
    responsibilities: [
      "Migrated monolithic applications to microservices architecture",
      "Led the migration of complex Azure infrastructure into Terraform, using dynamic for_each patterns to manage VMs, NSGs, NICs, public IPs, and AKS clusters.",
      "Managed and maintained AKS clusters with multiple node pools, integrated with Azure AD authentication and Azure CNI (overlay) networking.",
      "Built reusable Terraform modules to streamline provisioning of scalable Kubernetes infrastructure and associated cloud components.",
      "Implemented CI/CD pipelines for AKS and VM-based applications using GitHub Actions and ArgoCD, ensuring reliable and automated deployments.",
      "Optimized network configurations and NAT gateway associations to ensure secure and cost-effective cloud infrastructure.",
      "Refactored legacy resources into modular, declarative infrastructure-as-code to enable consistency and version control.",
      "Worked closely with developers and data scientists to align infrastructure with application and machine learning needs.",
    ],
    technologies: [
      "Azure",
      "AKS",
      "Terraform",
      "Kubernetes",
      "ArgoCD",
      "GitHub Actions",
      "Azure CNI",
      "Linux",
      "Prometheus",
      "Grafana",
    ],
  },
  {
    company: "Dinger Company Ltd",
    position: "Senior DevOps Engineer",
    duration: "June 2022 - August 2024",
    location: "Yangon, Myanmar",
    responsibilities: [
      "Managed cloud infrastructure using tools such as EKS, AKS, GitHub Actions, ArgoCD, Grafana, Istio, and Loki",
      "Successfully released the MTB Pay wallet in August 2024.",
      "Designed and implemented cloud infrastructure from ground up, including CI/CD pipelines for deployment on AKS",
      "Managed cloud cost optimization and infrastructure performance tuning for efficiency.",
      "Deployed and maintained Kubernetes clusters using AKS and EKS to manage containerized applications.",
      "Created and managed GitHub Actions and ArgoCD for automated deployments.",
      "Monitored and analyzed system performance using Grafana and Prometheus.",
      "Implemented service mesh (Istio) for better traffic control and security management.",
    ],
    technologies: [
      "AWS",
      "AKS",
      "Kubernetes",
      "Terraform",
      "Github Actions",
      "Python",
    ],
  },
  {
    company: "OpsZero",
    position: "DevOps Engineer",
    duration: "December 2021 - June 2023",
    location: "Remote",
    responsibilities: [
      "Developed Python Django models for improving application performance and functionality.",
      "Handled container management using Amazon EKS for scaling and deployment.",
      "Wrote Terraform scripts as code for automating cloud resource provisioning and management.",
      "Developed CI/CD workflows using GitHub Actions and GitLab CI for deployment processes.",
      "Developed Bash scripts to automate system tasks and simplify manual processes.",
      "Used HashiCorp Vault for secure management of sensitive data and Packer for creating machine images.",
      "Managed infrastructure on AWS with cost-effective scaling and performance improvements.",
    ],
    technologies: ["Azure", "AWS", "Terraform", "CICD", "Grafana", "Django"],
  },
  {
    company: "Frontiir (Myanmar Net)",
    position: "Junior DevOps Engineer",
    duration: "December 2020 - December 2021",
    location: "Yangon, Myanmar",
    responsibilities: [
      "Developed and managed CI/CD pipelines using GitHub and GitLab to automate application deployments",
      "Managed on-premise and cloud-based Kubernetes clusters to support containerized applications",
      "Used Bash scripting to automate tasks and for system management.",
      "Automated infrastructure tasks with Ansible for consistent and fast deployments.",
      "Integrated ArgoCD for GitOps-based continuous delivery, improving deployment speed and reliability.",
      "Monitored application health and performance using Grafana and Elasticsearch, and identified and resolved any issues.",
      "Centralized logging solutions with Loki for log aggregation and analysis across services.",
    ],
    technologies: [
      "Linux",
      "ArgoCD",
      "Git",
      "AWS",
      "Bash",
      "Monitoring",
      "Kubernetes",
      "Grafana",
      "Loki",
    ],
  },
];

const education = [
  {
    degree: "B.C.Tech",
    institution: "University of Information Technology, Yangon",
    duration: "2015 - 2020",
    details:
      "Specialized in Communication and Networking. Graduated with honors.",
    gpa: "3.8/4.0",
  },
];

const certifications = [
  {
    name: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    year: "2022",
    credentialId: "AWS-SAA",
    validUntil: "expired",
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation",
    year: "2022",
    credentialId: "CKA",
    validUntil: "expired",
  },
  {
    name: "HashiCorp Certified: Terraform Associate",
    issuer: "HashiCorp",
    year: "2023",
    credentialId: "HCP-TF",
    validUntil: "expired",
  },
  {
    name: "Azure Fundamentals Az-900",
    issuer: "Microsoft",
    year: "2023",
    credentialId: "Az-900",
    validUntil: "expired",
  },
];

const skills = {
  "Cloud Platforms": ["AWS", "Azure", "Google Cloud Platform"],
  Containerization: ["Docker", "Kubernetes", "OpenShift"],
  "CI/CD Tools": [
    "GitLab CI",
    "GitHub Actions",
    "Azure DevOps",
    "CircleCI",
    "ArgoCD",
    "Jenkins",
  ],
  "Infrastructure as Code": [
    "Terraform",
    "CloudFormation",
    "Ansible",
    "Pulumi",
  ],
  Monitoring: ["Prometheus", "Grafana", "ELK Stack", "CloudWatch", "Datadog"],
  Programming: ["Python", "Node", "Nest JS"],
  Databases: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "DynamoDB"],
  "Operating Systems": ["Linux", "Mac", "Windows Server"],
  "Version Control": ["Git", "GitHub", "GitLab"],
  Security: ["AWS IAM", "Vault", "SSL/TLS", "Security Scanning"],
};

const projects = [
  {
    name: "Monolithic to Cloud-Native Architecture Migration",
    description:
      "Led the end-to-end migration of legacy monolithic applications to modern microservices architecture at both Dinger and Maharbawga Co., Ltd. This included containerization, infrastructure redesign, and implementing CI/CD pipelines.",
    technologies: [
      "AWS",
      "Azure",
      "Kubernetes",
      "Terraform",
      "GitHub Actions",
      "ArgoCD",
    ],
    impact:
      "Improved deployment speed by 60%, enhanced system scalability and fault tolerance, and reduced infrastructure and maintenance costs by over 45%.",
  },
  {
    name: "MTB Pay Wallet Release",
    description:
      "Played a key role in the successful release of the MTB Pay wallet, contributing to infrastructure design, automation, and deployment processes.",
    technologies: [
      "AWS",
      "Azure",
      "Kubernetes",
      "Terraform",
      "GitHub Actions",
      "ArgoCD",
    ],
    impact:
      "Enabled smooth and reliable product launch with improved deployment efficiency and system stability.",
  },
  {
    name: "Freelance DevOps Engineer",
    description:
      "Worked as a freelance DevOps engineer on Upwork, delivering infrastructure automation with Terraform, Kubernetes setup, and backend improvements in Python/Django.",
    technologies: [
      "Terraform",
      "Kubernetes",
      "AWS",
      "Azure",
      "Packer",
      "Grafana",
      "Prometheus",
      "CICD",
    ],
    impact:
      "Helped clients accelerate infrastructure setup and backend delivery through automation and containerization.",
  },
];

const stats = [
  { value: "5+", label: "Years Experience", icon: CheckCircle2 },
  { value: "50+", label: "Projects Completed", icon: ArrowRight },
  { value: "99.9%", label: "Uptime SLA", icon: Zap },
  { value: "$17K+", label: "Freelance Earnings", icon: Users },
];

export default function AboutPage() {
  const handleEmailClick = () => {
    window.location.href =
      "mailto:thaunghtikeoo.tho1234@gmail.com?subject=Consultation - DevOps Services&body=Hi Thaung, I'm interested in learning more about your DevOps services.";
  };

  const handleCaseStudiesClick = () => {
    window.open(
      "https://github.com/thaunghtike-share/DevOps-Projects",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-white/95 dark:bg-[#000000] relative overflow-x-hidden transition-colors duration-300">
      <MinimalHeader />

      <main className="px-6 md:px-11 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Personal Info & Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-2xl rounded-3xl dark:bg-gray-800">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                    <Image
                      src={personalInfo.avatar || "/tho.jpg"}
                      alt={personalInfo.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-1">
                    {personalInfo.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-base">
                    {personalInfo.title}
                  </p>
                </div>
                <div className="space-y-3 text-sm text-black dark:text-gray-300">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-blue-500 dark:text-blue-400" />
                    {personalInfo.location}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-blue-500 dark:text-blue-400" />
                    {personalInfo.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-blue-500 dark:text-blue-400" />
                    {personalInfo.phone}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-black dark:text-gray-300 leading-relaxed text-sm">
                    {personalInfo.summary}
                  </p>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <a
                    href="/thaung-cv.pdf"
                    download
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="lg"
                      className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm py-2 px-3 sm:text-base sm:py-3 sm:px-4"
                    >
                      <Download className="h-4 w-4" />
                      Download CV
                    </Button>
                  </a>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-500 font-semibold transition-all duration-300 bg-transparent text-sm py-2 px-3 sm:text-base sm:py-3 sm:px-4"
                    onClick={() =>
                      window.open(personalInfo.linkedinUrl, "_blank")
                    }
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Technical Skills */}
            <Card className="border-0 shadow-lg rounded-3xl dark:bg-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl font-bold text-black dark:text-white">
                  <Code className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-5">
                  {Object.entries(skills).map(([category, skillList]) => (
                    <div key={category}>
                      <h4 className="text-base font-semibold text-black dark:text-white mb-2">
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillList.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full font-medium border-0"
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

            {/* Freelance Earnings */}
            <Card className="border-0 shadow-lg rounded-3xl dark:bg-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl font-bold text-black dark:text-white">
                  <Briefcase className="h-6 w-6 mr-3 text-green-600 dark:text-green-400" />
                  Freelance Earnings (Upwork)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-black dark:text-gray-300 font-medium">
                    Total Earnings
                  </p>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold px-3 py-1 rounded-full border-0">
                    $17,000+
                  </Badge>
                </div>
                <p className="text-sm text-black dark:text-gray-300 leading-relaxed">
                  Worked long-term as a Kubernetes Engineer providing reliable
                  support and infrastructure automation to global clients.
                </p>

                <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
                  <Image
                    src="/earnings.png"
                    alt="Upwork Earnings"
                    width={800}
                    height={400}
                    className="w-full h-auto object-contain"
                  />
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-2 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-400 dark:hover:border-green-500 font-semibold transition-all duration-300 bg-transparent"
                  onClick={() =>
                    window.open(
                      "https://www.upwork.com/freelancers/~01e9f0a7b2e737ac90",
                      "_blank"
                    )
                  }
                >
                  View Upwork Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Experience, Education, Projects, Certifications */}
          <div className="lg:col-span-2 space-y-10">
            {/* Work Experience */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    Work Experience
                  </h2>
                  <p className="text-black dark:text-gray-300">
                    5+ years of DevOps excellence
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {workExperience.map((job, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-lg rounded-3xl dark:bg-gray-800 hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                        <div>
                          <h4 className="text-xl font-bold text-black dark:text-white mb-2">
                            {job.position}
                          </h4>
                          <p className="text-blue-700 dark:text-blue-400 font-semibold text-lg mb-2">
                            {job.company}
                          </p>
                        </div>
                        <div className="text-right text-black dark:text-gray-300">
                          <div className="flex items-center justify-end mb-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            {job.duration}
                          </div>
                          <div className="flex items-center justify-end">
                            <MapPin className="h-4 w-4 mr-2" />
                            {job.location}
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-3 mb-6 list-disc pl-5">
                        {job.responsibilities.map((responsibility, idx) => (
                          <li
                            key={idx}
                            className="text-black dark:text-gray-300 text-sm leading-relaxed"
                          >
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {job.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-0 px-3 py-1 rounded-full font-medium"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Key Projects */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    Key Projects
                  </h2>
                  <p className="text-black dark:text-gray-300">
                    Successful implementations and migrations
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {projects.map((project, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-lg rounded-3xl dark:bg-gray-800 hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-8">
                      <h4 className="text-xl font-bold text-black dark:text-white mb-4">
                        {project.name}
                      </h4>
                      <p className="text-black dark:text-gray-300 mb-4 text-sm leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full font-medium border-0"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
                        <p className="text-black dark:text-gray-300 text-sm font-semibold">
                          Impact: {project.impact}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Education & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Education */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                      Education
                    </h3>
                  </div>
                </div>

                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <Card
                      key={index}
                      className="border-0 shadow-lg rounded-3xl dark:bg-gray-800 hover:shadow-xl transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <h4 className="text-lg font-bold text-black dark:text-white mb-2">
                          {edu.degree}
                        </h4>
                        <p className="text-green-700 dark:text-green-400 font-semibold text-base mb-2">
                          {edu.institution}
                        </p>
                        <div className="flex items-center text-sm text-black dark:text-gray-300 mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {edu.duration}
                        </div>
                        <p className="text-black dark:text-gray-300 text-sm leading-relaxed">
                          {edu.details}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                      Certifications
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {certifications.map((cert, index) => (
                    <Card
                      key={index}
                      className="border-0 shadow-lg rounded-3xl dark:bg-gray-800 hover:shadow-xl transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <h4 className="font-bold text-black dark:text-white mb-2 text-base">
                          {cert.name}
                        </h4>
                        <p className="text-orange-700 dark:text-orange-400 font-semibold text-sm mb-2">
                          {cert.issuer}
                        </p>
                        <div className="flex items-center justify-between text-sm text-black dark:text-gray-300 mb-2">
                          <span>Issued: {cert.year}</span>
                          <span>Valid until: {cert.validUntil}</span>
                        </div>
                        <p className="text-sm text-black dark:text-gray-300 font-mono">
                          {cert.credentialId}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MinimalFooter />
    </div>
  );
}
