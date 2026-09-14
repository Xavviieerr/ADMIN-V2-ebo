"use client";

import React from "react";
import { Tab, useEditFigureContext } from "./context";

const Tabs = () => {
  const { tab, setTab } = useEditFigureContext();

  const handleClick = (v: Tab) => {
    setTab(v);
  };

  return (
    <div className="flex md:w-fit shrink-0 w-full max-w-[95vw] max-md:overflow-x-scroll">
      <div className="flex items-center border-b border-gray-txt-50 w-fit">
        {["personal", "biography", "family", "metadata"].map((item, i) => (
          <button
            key={i}
            onClick={() => handleClick(item as Tab)}
            className={`px-10 ${tab === item ? "border-b-2 border-foreground-50" : ""} pb-2 cursor-pointer`}
          >
            <p className="capitalize">{item}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
