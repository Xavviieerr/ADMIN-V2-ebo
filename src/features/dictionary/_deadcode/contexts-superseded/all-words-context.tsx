"use client";

import { createContext, useContext, useState } from "react";

type DefaultValue = {
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
};

const defaultValue: DefaultValue = {
  tab: "all",
  setTab: () => {},
};

const AllWordsContext = createContext(defaultValue);

const AllWordsProvider = ({
  initialTab,
  children,
}: {
  initialTab: string;
  children: React.ReactNode;
}) => {
  const [tab, setTab] = useState(initialTab || "all");

  return (
    <AllWordsContext.Provider value={{ tab, setTab }}>
      {children}
    </AllWordsContext.Provider>
  );
};

export const useAllWordsContext = () => useContext(AllWordsContext);

export default AllWordsProvider;
