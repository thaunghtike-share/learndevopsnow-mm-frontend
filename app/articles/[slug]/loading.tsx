import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";

export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300 relative overflow-x-hidden">
      {/* Use actual header */}
      <MinimalHeader />

      {/* Main loading content */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            {/* Spinning ring with gradient */}
            <div className="w-32 h-32 rounded-full border-4 border-blue-200/50 dark:border-blue-800/30 border-t-blue-500 dark:border-t-blue-400 animate-spin">
              {/* Logo in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional skeleton content that matches your article layout */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content area skeleton */}
          <div className="lg:col-span-3 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                style={{
                  width: `${Math.random() * 40 + 60}%`,
                }}
              ></div>
            ))}
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </main>

      {/* Use actual footer */}
      <MinimalFooter />
    </div>
  );
}
