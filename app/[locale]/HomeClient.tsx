"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation"; // Add useParams
import { MinimalHeader } from "@/components/minimal-header";
import DevOpsCyclingHero from "@/components/devops-cycling-hero";
import { MinimalFooter } from "@/components/minimal-footer";
import { CertificationRoadmap } from "@/components/CertificationRoadmap";
import { SuccessStoriesSection } from "@/components/SuccessStoriesSection";
import { YouTubePlaylists } from "@/components/YouTubePlaylists";
import { FreeLabs } from "@/components/FreeLabs";
import { MinimalDevopsRoadmap } from "@/components/devops-roadmap";
import { ProgrammingLanguagesRoadmap } from "@/components/programming-languages-roadmap";

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams(); // Add this line
  const locale = params.locale as string; // Get locale from params
  
  const initialTag = searchParams.get("tag") || null;
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    if (!mounted) return;
    
    const params = new URLSearchParams(window.location.search);
    if (selectedTag) {
      params.set("tag", selectedTag);
    } else {
      params.delete("tag");
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl);
  }, [selectedTag, router, mounted]);

  const updateTagFilter = (tagSlug: string | null) => {
    setSelectedTag(tagSlug);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] relative transition-colors duration-300">
      <div className="relative z-10">
        <MinimalHeader />

        <main className="relative z-10">
          <section className="bg-white dark:bg-[#000000]">
            <DevOpsCyclingHero />
          </section>

          <section id="roadmap" className="bg-white dark:bg-[#000000]">
            <MinimalDevopsRoadmap locale={locale} /> {/* Pass locale here */}
          </section>

          <section id="" className="bg-white dark:bg-[#000000]">
            <ProgrammingLanguagesRoadmap locale={locale} />
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