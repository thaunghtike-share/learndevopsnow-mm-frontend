import { Suspense } from "react";
import ArticlesClient from "./ArticlesClient";

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div>Loading articles...</div>}>
      <ArticlesClient />
    </Suspense>
  );
}