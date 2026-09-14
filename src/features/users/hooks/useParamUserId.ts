"use client";

import { useParams } from "next/navigation";

/**
 * Reads the `userId` route param safely. Client `useParams()` returns
 * `string | string[] | undefined`; non-string shapes fall back to ""
 * and each caller already guards empty ids via its own empty states.
 */
export function useParamUserId(): string {
  const params = useParams();
  const userId = params.userId;
  return typeof userId === "string" ? userId : "";
}
