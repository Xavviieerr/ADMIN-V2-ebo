"use client";

import { useEffect, useRef, useState } from "react";

export type StagedMediaFile = {
  file: File;
  url: string;
};

/**
 * Stages a user-picked file as a revocable object URL so it can be
 * previewed (accept/reject) before upload. Shared by all dictionary
 * media upload entry points.
 */
export function useStagedMediaFile() {
  const [staged, setStaged] = useState<StagedMediaFile | null>(null);
  const stagedRef = useRef<StagedMediaFile | null>(null);

  useEffect(() => {
    return () => {
      if (stagedRef.current) URL.revokeObjectURL(stagedRef.current.url);
    };
  }, []);

  const stage = (file: File) => {
    if (stagedRef.current) URL.revokeObjectURL(stagedRef.current.url);
    const next = { file, url: URL.createObjectURL(file) };
    stagedRef.current = next;
    setStaged(next);
  };

  const clear = () => {
    if (stagedRef.current) URL.revokeObjectURL(stagedRef.current.url);
    stagedRef.current = null;
    setStaged(null);
  };

  return { staged, stage, clear };
}
