import CategoryPageClient from "./CategoryPageClient";

export default async function CategoryPage({ params }: any) {
  const { slug } = await params;

  return <CategoryPageClient slug={slug} />;
}
