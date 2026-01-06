import { Suspense } from "react";
import HomeClient from "./HomeClient";
import { setRequestLocale } from "next-intl/server";

// Generate static params for SSG
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'my' }];
}

export const metadata = {
  title: "Learn DevOps Now | Free DevOps Tutorials, Tools & Labs",
  description:
    "Learn DevOps Now with free tutorials, CI/CD guides, DevOps tools, and practice labs for beginners and professionals.",
  alternates: {
    canonical: "https://www.learndevopsnow-mm.blog/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Learn DevOps Now | Free DevOps Tutorials, Tools & Labs",
    description:
      "Learn DevOps Now with free tutorials, CI/CD guides, DevOps tools, and practice labs for beginners and professionals.",
    url: "https://www.learndevopsnow-mm.blog/",
    siteName: "Learn DevOps Now",
    images: [
      {
        url: "https://www.learndevopsnow-mm.blog/images/mylogo.jpg",
        width: 1200,
        height: 630,
        alt: "Learn DevOps Now - Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn DevOps Now | Free DevOps Tutorials, Tools & Labs",
    description:
      "Learn DevOps Now with free tutorials, CI/CD guides, DevOps tools, and practice labs for beginners and professionals.",
    images: ["https://www.learndevopsnow-mm.blog/images/mylogo.jpg"],
  },
};

interface PageProps {
  params: Promise<{ // <-- IMPORTANT: params is now a Promise
    locale: string;
  }>;
}

export default async function HomePage({ params }: PageProps) { // <-- Make it async
  // Await the params first
  const { locale } = await params; // <-- AWAIT the params
  
  // Set the locale for this request
  setRequestLocale(locale);

  return (
    <Suspense
      fallback={
        <div className="text-center py-10 text-gray-500">Loading page...</div>
      }
    >
      <HomeClient />
    </Suspense>
  );
}