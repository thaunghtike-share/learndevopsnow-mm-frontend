"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MinimalHeader } from "@/components/minimal-header";
import DevOpsCyclingHero from "@/components/devops-cycling-hero";
import { MinimalFooter } from "@/components/minimal-footer";
import { CertificationRoadmap } from "@/components/CertificationRoadmap";
import { SuccessStoriesSection } from "@/components/SuccessStoriesSection";
import { YouTubePlaylists } from "@/components/YouTubePlaylists";
import { FreeLabs } from "@/components/FreeLabs";
import {
  Server,
  Container,
  GitBranch,
  Terminal,
  Zap,
  Cloud,
  Box,
  Code,
  MessageSquare,
} from "lucide-react";
import { MinimalDevopsRoadmap } from "@/components/devops-roadmap";
import { ProgrammingLanguagesRoadmap } from "@/components/programming-languages-roadmap";

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag") || null;
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [mounted, setMounted] = useState(false);

  const floatingIconPositions = [
    { left: 5, top: 10 },
    { left: 85, top: 15 },
    { left: 25, top: 25 },
    { left: 70, top: 35 },
    { left: 10, top: 50 },
    { left: 90, top: 45 },
    { left: 40, top: 60 },
    { left: 60, top: 75 },
    { left: 15, top: 80 },
    { left: 80, top: 85 },
    { left: 30, top: 90 },
    { left: 55, top: 20 },
    { left: 20, top: 40 },
    { left: 75, top: 55 },
    { left: 45, top: 30 },
    { left: 65, top: 65 },
    { left: 35, top: 70 },
    { left: 95, top: 25 },
  ];

  const floatingDotPositions = [
    { left: 8, top: 12 },
    { left: 92, top: 18 },
    { left: 22, top: 28 },
    { left: 78, top: 32 },
    { left: 12, top: 48 },
    { left: 88, top: 52 },
    { left: 35, top: 65 },
    { left: 65, top: 72 },
    { left: 18, top: 85 },
    { left: 82, top: 88 },
    { left: 28, top: 95 },
    { left: 58, top: 22 },
    { left: 38, top: 38 },
    { left: 72, top: 58 },
    { left: 48, top: 78 },
    { left: 15, top: 35 },
    { left: 85, top: 42 },
    { left: 32, top: 15 },
    { left: 68, top: 25 },
    { left: 52, top: 45 },
    { left: 25, top: 68 },
    { left: 75, top: 82 },
    { left: 42, top: 92 },
    { left: 62, top: 8 },
    { left: 95, top: 65 },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Add this to your existing useEffects in HomeClient
  useEffect(() => {
    // Load saved theme or detect system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Handle initial load scroll
  useEffect(() => {
    if (isInitialLoad) {
      window.scrollTo(0, 0);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  // Scroll to top when home is selected (tag is cleared)
  useEffect(() => {
    if (!selectedTag && !isInitialLoad) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedTag, isInitialLoad]);

  // Update URL when tag changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedTag) {
      params.set("tag", selectedTag);
    } else {
      params.delete("tag");
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl);
  }, [selectedTag, router]);

  const updateTagFilter = (tagSlug: string | null) => {
    setSelectedTag(tagSlug);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] relative overflow-x-hidden transition-colors duration-300">
      {/* Remove the fixed background div - it's causing the issue */}

      <div className="relative z-10">
        <MinimalHeader />

        <main className="relative z-10">
          {/* Add explicit background to each section */}
          <section className="bg-white dark:bg-[#000000]">
            <DevOpsCyclingHero />
          </section>

          <section id="roadmap" className="bg-white dark:bg-[#000000]">
            <MinimalDevopsRoadmap />
          </section>

          <section id="" className="bg-white dark:bg-[#000000]">
            <ProgrammingLanguagesRoadmap />
          </section>

          <section
            id="youtube"
            className="bg-white dark:bg-[#000000] -mt-10 md:-mt-10"
          >
            <YouTubePlaylists />
          </section>

          <section
            id="playgrounds"
            className="bg-white dark:bg-[#000000] md:-mt-18 hidden md:block"
          >
            <FreeLabs />
          </section>

          <div
            id="cert"
            className="bg-white dark:bg-[#000000] -mt-18 md:-mt-18"
          >
            <CertificationRoadmap />
          </div>

          <div className="bg-white dark:bg-[#000000] md:-mt-30">
            <SuccessStoriesSection />
          </div>
        </main>

        <div id="faqs" className="bg-white dark:bg-[#000000] ">
          <MinimalFooter />
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(-10px) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) translateX(5px) rotate(270deg);
          }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        /* Force background colors to prevent white flash */
        html,
        body {
          background: white;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .dark html,
        .dark body {
          background: #0a0a0a;
        }

        /* Ensure all sections have proper backgrounds */
        section,
        main,
        div[class*="section"] {
          background-color: inherit !important;
        }

        /* Fix for modal positioning - scroll to top when modal opens */
        body.modal-open {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
