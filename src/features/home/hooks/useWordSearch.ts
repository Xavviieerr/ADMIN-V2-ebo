"use client";

import { useState, useMemo, useEffect } from "react";
import { useLazySearchWordsQuery } from "@/slice/requestSlice";
import { useDebounce } from "@/hooks/use-debounce";
import { SimpleRecord, WordRecord } from "../types";
import { transformWordRecords } from "../utils/transformWordRecord";

interface SearchResultItem {
  word: WordRecord;
}

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

export function useWordSearch() {
  const [word, setWord] = useState("");
  const [selected, setSelected] = useState<SimpleRecord>();

  const debouncedWord = useDebounce(word, DEBOUNCE_MS);

  const [trigger, { data, isFetching, error }] = useLazySearchWordsQuery();

  const searchResult: WordRecord[] = useMemo(() => {
    if (!data?.data?.results) return [];
    return data.data.results.map((item: SearchResultItem) => item.word);
  }, [data]);

  const suggestions: SimpleRecord[] = useMemo(() => {
    return transformWordRecords(searchResult);
  }, [searchResult]);

  const shouldSearch = debouncedWord.trim().length >= MIN_QUERY_LENGTH && selected?.ota !== debouncedWord;

  useEffect(() => {
    if (shouldSearch) {
      trigger({ q: debouncedWord });
    }
  }, [shouldSearch, debouncedWord, trigger]);

  const clearSearch = () => {
    setSelected(undefined);
    setWord("");
  };

  return {
    word,
    setWord,
    selected,
    setSelected,
    searchResult,
    suggestions,
    fetching: isFetching,
    error,
    clearSearch,
  };
}
