// Remove this line: "use client"
import { notFound } from "next/navigation";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { ArticleContent } from "@/components/article-content";

interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  published_at: string;
  category: number;
  tags: number[];
  author: number;
  featured: boolean;
  read_count?: number;
  cover_image?: string;
}

interface Author {
  id: number;
  slug: string;
  name: string;
  bio?: string;
  avatar?: string;
  linkedin?: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const SITE_URL = "https://www.learndevopsnow-mm.blog";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Add this to force dynamic rendering and ensure generateMetadata runs
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchJSON<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch {
    return [];
  }
}

async function fetchAuthor(id: number): Promise<Author | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/authors/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const author: Author = await res.json();
    if (!author.slug) {
      author.slug = `author-${author.id}`;
    }
    return author;
  } catch {
    return null;
  }
}

function extractHeadings(
  markdown: string
): { text: string; level: number; id: string }[] {
  const idCounts: Record<string, number> = {};
  return markdown
    .split("\n")
    .map((line) => {
      const match = line.match(/^(#{1,6})\s+(.*)/);
      if (!match) return null;
      const [, hashes, rawText] = match;
      const level = hashes.length;
      let baseId = rawText
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (idCounts[baseId]) {
        idCounts[baseId] += 1;
        baseId = `${baseId}-${idCounts[baseId]}`;
      } else {
        idCounts[baseId] = 1;
      }
      return { text: rawText, level, id: baseId };
    })
    .filter(Boolean) as { text: string; level: number; id: string }[];
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    // Fetch article
    const articleRes = await fetch(`${API_BASE_URL}/articles/${slug}/`);

    if (!articleRes.ok) {
      notFound();
    }

    const article: Article = await articleRes.json();

    // Fetch all related data in parallel
    const [author, allArticles, tags, categories, authors] = await Promise.all([
      fetchAuthor(article.author),
      fetchJSON<Article>(`${API_BASE_URL}/articles/`),
      fetchJSON<Tag>(`${API_BASE_URL}/tags/`),
      fetchJSON<Category>(`${API_BASE_URL}/categories/`),
      fetchJSON<Author>(`${API_BASE_URL}/authors/`),
    ]);

    const headings = extractHeadings(article.content);
    const sorted = allArticles.sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
    const currentIndex = sorted.findIndex((a) => a.id === article.id);
    const prevArticle = sorted[currentIndex + 1] || null;
    const nextArticle = sorted[currentIndex - 1] || null;
    const recentArticles = sorted
      .filter((a) => a.id !== article.id)
      .slice(0, 5);
    const sameCategoryArticles = sorted
      .filter((a) => a.category === article.category && a.id !== article.id)
      .slice(0, 5);

    const publishDate = new Date(article.published_at).toLocaleDateString();
    const categoryName =
      categories.find((c) => c.id === article.category)?.name || "General";
    const tagNames = article.tags
      .map((id) => tags.find((t) => t.id === id)?.name)
      .filter(Boolean) as string[];

    return (
      <>
        <div className="min-h-screen bg-white dark:bg-[#000000] relative transition-colors duration-300 scrollbar-hide">
          <MinimalHeader />

          <div className="md:-mt-1 -mt-5">
            <ArticleContent
              article={article}
              author={author}
              headings={headings}
              prevArticle={prevArticle}
              nextArticle={nextArticle}
              recentArticles={recentArticles}
              sameCategoryArticles={sameCategoryArticles}
              publishDate={publishDate}
              categoryName={categoryName}
              tagNames={tagNames}
              authors={authors}
              categories={categories}
              readCount={article.read_count || 0}
            />
          </div>

          <div className="md:-mt-2 -mt-5">
            <MinimalFooter />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching article data:", error);
    notFound();
  }
}

// Generate metadata for better SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const articleRes = await fetch(`${API_BASE_URL}/articles/${slug}/`, {
      cache: "no-store",
    });

    if (!articleRes.ok) {
      return {
        title: "Article Not Found | Learn DevOps Now - Myanmar",
      };
    }

    const article: Article = await articleRes.json();

    const cleanDescription =
      article.content
        ?.replace(/[#_*>\[\]()`]/g, "")
        .replace(/\n/g, " ")
        .slice(0, 160)
        .trim() + "..." || "Learn DevOps Now - Myanmar";

    // FIXED: Better image URL handling for GitHub raw URLs
    let imageUrl = `${SITE_URL}/og-image.jpg`; // Default fallback

    if (article.cover_image) {
      if (article.cover_image.startsWith("http")) {
        // It's already a full URL (GitHub raw URL)
        imageUrl = article.cover_image;

        // Ensure it's using https
        if (imageUrl.startsWith("http://")) {
          imageUrl = imageUrl.replace("http://", "https://");
        }
      } else {
        // It's a local path, make it absolute
        imageUrl = `${SITE_URL}${
          article.cover_image.startsWith("/") ? "" : "/"
        }${article.cover_image}`;
      }
    }

    const articleUrl = `${SITE_URL}/articles/${slug}`;

    // Debug logging
    console.log("🔍 Article Metadata Debug:");
    console.log("Title:", article.title);
    console.log("Cover Image from DB:", article.cover_image);
    console.log("Processed Image URL:", imageUrl);
    console.log("Article URL:", articleUrl);

    return {
      title: `${article.title} | Learn DevOps Now - Myanmar`,
      description: cleanDescription,
      openGraph: {
        title: article.title,
        description: cleanDescription,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
        url: articleUrl, // CRITICAL: This must be the article URL, not site root
        type: "article",
        publishedTime: article.published_at,
        siteName: "Learn DevOps Now - Myanmar",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: cleanDescription,
        images: [imageUrl],
        creator: "@learndevopsnowmm",
      },
      alternates: {
        canonical: articleUrl,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Learn DevOps Now - Myanmar",
      description: "Learn DevOps Now - Myanmar Blog",
    };
  }
}
