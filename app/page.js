import { Suspense } from "react";
import SearchExperience from "@/components/SearchExperience.jsx";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8 text-muted">Loading search…</div>}>
      <SearchExperience />
    </Suspense>
  );
}
