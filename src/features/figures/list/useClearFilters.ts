"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useClearFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasActiveFilter =
    (searchParams.get("search") ?? "").trim() !== "" ||
    (searchParams.get("occupation") ?? "") !== "" ||
    (searchParams.get("category") ?? "") !== "" ||
    (searchParams.get("status") ?? "") !== "";

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("occupation");
    params.delete("category");
    params.delete("status");
    params.set("page", "1");
    router.replace(`/guonopedia/figures?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return { hasActiveFilter, clearAll };
}
