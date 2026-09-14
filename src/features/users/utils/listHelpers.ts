import {
  GetUsersResponse,
  GetUsersResponseSearch,
  User,
} from "@/types/userTypes";

type UsersPageData =
  | GetUsersResponse["data"]
  | GetUsersResponseSearch["data"];

/**
 * Extracts the user array from either list response envelope
 * ({ data: { items } } or { data: { users } }).
 */
export function getUserList(data: UsersPageData | undefined): User[] {
  if (!data) return [];
  if ("items" in data && Array.isArray(data.items)) return data.items;
  if ("users" in data && Array.isArray(data.users)) return data.users;
  return [];
}

/**
 * Builds the pagination window: first page, a sliding window around
 * the current page, last page, with "..." gaps.
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | string)[] {
  const pages: (number | string)[] = [];
  const maxVisible = 4; // Maximum number of page buttons to show

  if (totalPages <= maxVisible) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage <= 3) {
      // Near the beginning
      for (let i = 2; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages;
}

/**
 * Clamps a page number into the valid range for the given total.
 */
export function clampPage(page: number, totalPages: number): number {
  if (totalPages < 1) return 1;
  return Math.min(Math.max(page, 1), totalPages);
}
