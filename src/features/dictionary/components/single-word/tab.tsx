"use client";

import React from "react";
import { useSingleWordContext } from "./context";
import PermissionGate from "@/features/shared/permission-gate";

const Tabs = () => {
  const { tab, setTab, lang, setLang, setSenseView, setReviewView } =
    useSingleWordContext();

  return (
    <div className="flex max-md:flex-col gap-4 items-center justify-between my-8">
      <div className="flex items-center border-b border-gray-txt-50 w-fit">
        {["senses", "translations", "reviews"].map((item, i) => (
          <button
            key={i}
            onClick={() => setTab(item as "senses" | "translations")}
            className={`px-5 ${tab === item ? "border-b-2 border-foreground-50" : ""} pb-2 cursor-pointer`}
          >
            <p className="capitalize">{item}</p>
          </button>
        ))}
      </div>

      <PermissionGate permission="add_word">
        {tab === "senses" && (
          <button
            onClick={() => setSenseView("add")}
            className="secondary-btn max-md:w-full py-3 text-sm"
          >
            {" "}
            Add Sense
          </button>
        )}
      </PermissionGate>

      {tab === "translations" && (
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as "English" | "Korean")}
          id="dialect"
          className="input h-12 w-fit text-sm capitalize bg-secondary-bg max-md:w-full"
        >
          {["English", "Korean"].map((lang) => (
            <option
              key={lang}
              value={lang}
              className="text-white bg-secondary-bg capitalize"
            >
              {lang}
            </option>
          ))}
        </select>
      )}

      {tab === "reviews" && (
        <button
          onClick={() => setReviewView("add")}
          className="secondary-btn max-md:w-full py-3 text-sm"
        >
          Add Review
        </button>
      )}
    </div>
  );
};

export default Tabs;
