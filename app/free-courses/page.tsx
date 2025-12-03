"use client";

import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { TopUdemyCourses } from "@/components/TopUdemyCourses";

export default function LearnDevOpsOnUdemyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] overflow-x-hidden relative">
      <MinimalHeader />
      <main className="relative z-10 -mt-12 md:-mt-5">
        <TopUdemyCourses />
      </main>
      <div className="-mt-9 md:-mt-5">
        <MinimalFooter />
      </div>
    </div>
  );
}
