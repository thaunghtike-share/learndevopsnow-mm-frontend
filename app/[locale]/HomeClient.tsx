"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { MinimalHeader } from "@/components/minimal-header";
import DevOpsCyclingHero from "@/components/devops-cycling-hero";
import { MinimalFooter } from "@/components/minimal-footer";
import { CertificationRoadmap } from "@/components/CertificationRoadmap";
import { SuccessStoriesSection } from "@/components/SuccessStoriesSection";
import { YouTubePlaylists } from "@/components/YouTubePlaylists";
import { FreeLabs } from "@/components/FreeLabs";
import { MinimalDevopsRoadmap } from "@/components/devops-roadmap";
import { ProgrammingLanguagesRoadmap } from "@/components/programming-languages-roadmap";
import { TopBannerWithModal } from "@/components/TopBannerWithModal";

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;

  const initialTag = searchParams.get("tag") || null;
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [mounted, setMounted] = useState(false);
  // REMOVE the isMobile state and useEffect for checking screen size

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
            <MinimalDevopsRoadmap locale={locale} />
          </section>

          <section id="" className="bg-white dark:bg-[#000000]">
            <ProgrammingLanguagesRoadmap locale={locale} />
          </section>

          <section
            id="youtube"
            className="bg-white dark:bg-[#000000] -mt-10 md:-mt-10"
          >
            <YouTubePlaylists locale={locale} />
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
            <CertificationRoadmap locale={locale} />
          </div>

          <div className="bg-white dark:bg-[#000000] md:-mt-30">
            <SuccessStoriesSection />
          </div>
        </main>

        <div id="faqs" className="bg-white dark:bg-[#000000] ">
          <MinimalFooter />
        </div>
      </div>
    </div>
  );
}
