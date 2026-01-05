"use client";

import React from "react";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { YouTubePlaylists } from "@/components/YouTubePlaylists";
import { useRouter, useSearchParams, useParams } from "next/navigation"; // Add useParams

export default function LearnDevOpsOnUdemyPage() {
  const locale = useParams().locale as string; // Get locale from params

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] relative">
      <MinimalHeader />
      <main className="relative z-10 -mt-7 md:-mt-7">
        <YouTubePlaylists locale={locale} />
      </main>
      <div className="-mt-20 md:-mt-15">
        <MinimalFooter />
      </div>
    </div>
  );
}
