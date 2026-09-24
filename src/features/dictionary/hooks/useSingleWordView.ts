"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type SingleWordTab = "senses" | "translations" | "reviews";
export type SingleWordLang = "English" | "Korean";

const VALID_TABS: SingleWordTab[] = ["senses", "translations", "reviews"];
const VALID_LANGS: SingleWordLang[] = ["English", "Korean"];

function readParam(
  searchParams: URLSearchParams,
  key: string,
  valid: string[],
  fallback: string,
): string {
  const value = searchParams.get(key);
  return value && valid.includes(value) ? value : fallback;
}

export function useSingleWordView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = readParam(searchParams, "tab", VALID_TABS, "senses");
  const lang = readParam(searchParams, "lang", VALID_LANGS, "English");

  const updateParams = (updates: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      current.set(key, value);
    }
    router.replace(`${pathname}?${current.toString()}`);
  };

  const setTab = (next: SingleWordTab) => updateParams({ tab: next });
  const setLang = (next: SingleWordLang) => updateParams({ lang: next });

  return {
    tab: tab as SingleWordTab,
    lang: lang as SingleWordLang,
    setTab,
    setLang,
  };
}
