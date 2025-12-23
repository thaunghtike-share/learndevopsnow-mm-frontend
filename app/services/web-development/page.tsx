"use client";

import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { Rocket } from "lucide-react";

export default function WebsiteDevelopmentPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM12 34v-4h-2v4H6v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4H6v2h4v4h2v-4h4v-2h-4zM36 10v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM12 10v-4h-2v4H6v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4H6v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <MinimalHeader />

      <main className="-mt-9 md:-mt-1 max-w-7xl mx-auto px-6 py-20 relative z-10 flex justify-center">
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
