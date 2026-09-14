"use client";

import React from "react";
import { Tab, useEditFigureContext } from "./context";

const TabViewWrapper = ({
  condition,
  children,
}: {
  condition: Tab;
  children: React.ReactNode;
}) => {
  const { tab } = useEditFigureContext();

  if (tab != condition) return null;

  return <>{children}</>;
};

export default TabViewWrapper;
