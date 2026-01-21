import CategoryPageClient from "./CategoryPageClient";

// Define the proper types for params
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  // Await the params since it's a Promise in Next.js 15
  const { slug } = await params;

  return <CategoryPageClient slug={slug} />;
}