"use client";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import ProfileForm from "./profile-form";

export default function AuthorProfileFormPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white/95 dark:bg-[#000000] relative">
      <MinimalHeader />
      <main className="flex-grow max-w-7xl mx-auto px-6 md:px-11 w-full">
        <ProfileForm />
      </main>
      <MinimalFooter />
    </div>
  );
}
