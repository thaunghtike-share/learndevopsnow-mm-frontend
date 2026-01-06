// app/not-found.tsx
"use client";

import Link from 'next/link';
import { MinimalHeader } from '@/components/minimal-header';
import { MinimalFooter } from '@/components/minimal-footer';
import { Home, ArrowLeft, FileText } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MinimalHeader />
      
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <FileText className="w-8 h-8 text-white" />
          </div>

          {/* Message */}
          <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-slate-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-300 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </main>

      <MinimalFooter />
    </div>
  );
}