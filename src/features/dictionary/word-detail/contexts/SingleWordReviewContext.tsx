"use client";

import { createContext, useContext, useState } from "react";

type SingleWordReviewContextValue = {
  reviewView: "view" | "add";
  setReviewView: React.Dispatch<React.SetStateAction<"view" | "add">>;
};

const defaultValue: SingleWordReviewContextValue = {
  reviewView: "view",
  setReviewView: () => {},
};

const SingleWordReviewContext = createContext(defaultValue);

export const SingleWordReviewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [reviewView, setReviewView] = useState<"view" | "add">("view");

  return (
    <SingleWordReviewContext.Provider value={{ reviewView, setReviewView }}>
      {children}
    </SingleWordReviewContext.Provider>
  );
};

export const useSingleWordReviewContext = () =>
  useContext(SingleWordReviewContext);
