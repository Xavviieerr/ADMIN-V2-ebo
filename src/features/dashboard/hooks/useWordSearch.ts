"use client";

import { useState, useEffect, useCallback } from "react";
import { BASE_URL } from "@/utils/constants";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { WordRecord, SimpleRecord } from "../types";
import { transformWordRecords } from "../utils/transformWordRecord";
import { DASHBOARD_API, WORD_SEARCH_PARAMS } from "../constants";

export function useWordSearch() {
  const [word, setWord] = useState("");
  const [selected, setSelected] = useState<SimpleRecord>();
  const [searchResult, setSearchResult] = useState<WordRecord[]>([]);
  const [suggestions, setSuggestions] = useState<SimpleRecord[]>([]);
  const [fetching, setFetching] = useState(false);

  const token = getAccessToken();

  const fetchWord = useCallback(async () => {
    if (!word.trim()) return;
    setFetching(true);
    try {
      const res = await fetch(
        `${BASE_URL}${DASHBOARD_API.SEARCH}?q=${word}&mode=${WORD_SEARCH_PARAMS.MODE}&lang=${WORD_SEARCH_PARAMS.LANG}&limit=${WORD_SEARCH_PARAMS.LIMIT}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch word");
      const { data } = await res.json();
      const results: WordRecord[] = data.results.map((item: any) => item.word);
      setSearchResult(results);
      setSuggestions(transformWordRecords(results));
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  }, [word, token]);

  useEffect(() => {
    if (!word.trim() || selected?.ota === word) return;
    fetchWord();
  }, [word, fetchWord]);

  const clearSearch = () => {
    setSelected(undefined);
    setWord("");
    setSearchResult([]);
    setSuggestions([]);
  };

  return {
    word,
    setWord,
    selected,
    setSelected,
    searchResult,
    suggestions,
    fetching,
    clearSearch,
  };
}
