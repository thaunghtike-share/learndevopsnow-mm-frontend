"use client";

import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { YouTubePlaylists } from "@/components/YouTubePlaylists";

export default function LearnDevOpsOnUdemyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] relative">
      <MinimalHeader />
      <main className="relative z-10 -mt-7 md:-mt-7">
        <YouTubePlaylists />
      </main>
      <div className="-mt-20 md:-mt-15">
        <MinimalFooter />
      </div>
    </div>
  );
}
