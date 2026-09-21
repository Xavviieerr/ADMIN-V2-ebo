"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useGetSupportTicketsQuery } from "@/slice/requestSlice";
import { SUPPORT_TICKETS_LIST_LIMIT } from "../constants";

export function useSupportTicketsList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "all";
  const category = searchParams.get("category") || "all";
  const sortDir = (searchParams.get("sortDir") || "DESC") as "ASC" | "DESC";

  const { data, isLoading, isFetching, isError, error, refetch } = useGetSupportTicketsQuery({
    page,
    limit: SUPPORT_TICKETS_LIST_LIMIT,
    status,
    category,
    sortDir,
  });

  const tickets = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/support?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleStatusChange = useCallback(
    (newStatus: string) => {
      updateParams({ status: newStatus, page: "1" });
    },
    [updateParams],
  );

  const handleCategoryChange = useCallback(
    (newCategory: string) => {
      updateParams({ category: newCategory, page: "1" });
    },
    [updateParams],
  );

  const handleSortDirChange = useCallback(
    (newSortDir: string) => {
      updateParams({ sortDir: newSortDir, page: "1" });
    },
    [updateParams],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParams({ page: String(newPage) });
    },
    [updateParams],
  );

  const handlePrev = useCallback(
    () => handlePageChange(Math.max(1, page - 1)),
    [handlePageChange, page],
  );

  const handleNext = useCallback(
    () => handlePageChange(Math.min(totalPages, page + 1)),
    [handlePageChange, page, totalPages],
  );

  return {
    tickets,
    total,
    totalPages,
    page,
    status,
    category,
    sortDir,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    handleStatusChange,
    handleCategoryChange,
    handleSortDirChange,
    handlePageChange,
    handlePrev,
    handleNext,
  };
}
