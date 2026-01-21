"use client";

import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { Rocket } from "lucide-react";

export default function WebsiteDevelopmentPage() {
  return (
    <div className="min-h-screen bg-white/95 dark:bg-[#000000] relative transition-colors duration-300">
      <MinimalHeader />

      <main className="px-6 md:px-11 mb-25 py-25 relative z-10 flex justify-center">
        <div className="w-full max-w-4xl text-center">
          <Rocket className="mx-auto mb-4 w-12 h-12 text-teal-500 animate-bounce" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Website Development Service
          </h1>
          <p className="text-gray-700 text-base">
            This service is temporarily unavailable right now.
            <br />
            Please check back later or contact us for more information.
          </p>
        </div>
      </main>

      <MinimalFooter />
    </div>
  );
}
