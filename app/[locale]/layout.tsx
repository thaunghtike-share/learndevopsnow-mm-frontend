import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = 'https://www.learndevopsnow-mm.blog';

export const metadata: Metadata = {
  title: {
    default: "Learn DevOps Now - Myanmar | Free DevOps Tutorials & Labs",
    template: "%s | Learn DevOps Now - Myanmar"
  },
  description: "Free DevOps tutorials, tools, and hands-on labs specifically for Myanmar developers and students. Learn Docker, Kubernetes, AWS, Terraform, CI/CD in Burmese and English.",
  keywords: [
    "devops myanmar",
    "myanmar developers",
    "docker myanmar",
    "kubernetes myanmar", 
    "aws myanmar",
    "terraform myanmar",
    "ci/cd myanmar",
    "devops tutorials burmese",
    "cloud computing myanmar",
    "devops labs myanmar",
    "learn devops myanmar",
    "learn devops now myanmar",
    "learndevopsnow-mm blog",
    "myanmar tech community",
    "containerization myanmar",
    "infrastructure as code myanmar",
    "cloud infrastructure myanmar",
    "burmese devops tutorials",
    "myanmar software development"
  ],
  authors: [{ name: "Learn DevOps Now - Myanmar" }],
  creator: "Learn DevOps Now - Myanmar",
  publisher: "Learn DevOps Now - Myanmar",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL, // No trailing slash
    siteName: "Learn DevOps Now - Myanmar",
    title: "Learn DevOps Now - Myanmar | Free DevOps Tutorials & Labs",
    description: "Free DevOps tutorials, tools, and hands-on labs specifically for Myanmar developers and students.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`, // FIXED: Absolute URL
        width: 1200,
        height: 630,
        alt: "Learn DevOps Now - Myanmar - Free DevOps Tutorials and Labs for Myanmar Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn DevOps Now - Myanmar | Free DevOps Tutorials & Labs",
    description: "Free DevOps tutorials, tools, and hands-on labs specifically for Myanmar developers and students.",
    images: [`${SITE_URL}/og-image.jpg`], // FIXED: Absolute URL
    creator: "@learndevopsnowmm",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

const locales = ["en", "my"];

export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default async function RootLayout({
  children,
  params
}: RootLayoutProps) {
  const { locale } = await params;
  
  if (!locales.includes(locale)) {
    notFound();
  }

  // FIXED: From app/[locale]/layout.tsx, go up 2 levels to messages folder
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to English if messages file not found
    messages = (await import(`../../messages/en.json`)).default;
  }

  return (
    <html lang={locale} className="h-full">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data for SEO with Myanmar focus */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Learn DevOps Now - Myanmar",
              "description": "Free DevOps tutorials, tools, and hands-on labs specifically for Myanmar developers and students",
              "url": SITE_URL,
              "logo": `${SITE_URL}/logo.png`,
              "sameAs": [],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "hello@learndevopsnow-mm.blog",
                "contactType": "customer service"
              },
              "areaServed": {
                "@type": "Country",
                "name": "Myanmar"
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Developers, Students, Engineers in Myanmar"
              },
              "availableLanguage": ["en", "my"],
              "keywords": "DevOps Myanmar, Docker Myanmar, Kubernetes Myanmar, AWS Myanmar, Terraform Myanmar, CI/CD Myanmar, Burmese DevOps Tutorials, Myanmar Tech Community"
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-background`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <GoogleAnalytics gaId="G-1XGYJMR2B7" />
      </body>
    </html>
  );
}