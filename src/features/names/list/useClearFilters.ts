"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// Shared empty-state logic for the desktop table row and the mobile cards:
// whether any search/filter is active, plus a reset back to page 1.
export function useClearFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasActiveFilter =
    (searchParams.get("search") ?? "").trim() !== "" ||
    (searchParams.get("nameType") ?? "") !== "" ||
    (searchParams.get("status") ?? "") !== "";

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("nameType");
    params.delete("status");
    params.delete("type");
    params.set("page", "1");
    router.replace(`/guonopedia/names?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return { hasActiveFilter, clearAll };
}
