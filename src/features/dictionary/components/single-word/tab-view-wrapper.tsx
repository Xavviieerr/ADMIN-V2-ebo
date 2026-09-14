"use client";

import React from "react";
import { useSingleWordContext } from "./context";

const TabViewWrapper = ({
  condition,
  children,
}: {
  condition: "senses" | "translations" | "reviews";
  children: React.ReactNode;
}) => {
  const { tab } = useSingleWordContext();

  if (tab != condition) return null;

  return <>{children}</>;
};

export default TabViewWrapper;
