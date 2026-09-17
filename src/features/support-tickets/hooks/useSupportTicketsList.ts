"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useGetSupportTicketsQuery } from "@/slice/requestSlice";
import { SUPPORT_TICKETS_LIST_LIMIT } from "../constants";

export function useSupportTicketsList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const category = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortDir = (searchParams.get("sortDir") || "DESC") as "ASC" | "DESC";

  const { data, isLoading, isFetching, isError, error, refetch } = useGetSupportTicketsQuery({
    page,
    limit: SUPPORT_TICKETS_LIST_LIMIT,
    search,
    status,
    category,
    sortBy: sortBy as "createdAt" | "updatedAt",
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

  const handleSearch = useCallback(
    (newSearch: string) => {
      updateParams({ search: newSearch, page: "1" });
    },
    [updateParams],
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

  const handleSortChange = useCallback(
    (newSortBy: string, newSortDir: string) => {
      updateParams({ sortBy: newSortBy, sortDir: newSortDir, page: "1" });
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
    search,
    status,
    category,
    sortBy,
    sortDir,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    handleSearch,
    handleStatusChange,
    handleCategoryChange,
    handleSortChange,
    handlePageChange,
    handlePrev,
    handleNext,
  };
}
