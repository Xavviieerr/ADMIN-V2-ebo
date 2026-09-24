"use client";

import React from "react";
import { useSingleWordView } from "@/features/dictionary/word-detail/hooks/useSingleWordView";

const TabGate = ({
  condition,
  children,
}: {
  condition: "senses" | "translations" | "reviews";
  children: React.ReactNode;
}) => {
  const { tab } = useSingleWordView();

  if (tab != condition) return null;

  return <>{children}</>;
};

export default TabGate;
