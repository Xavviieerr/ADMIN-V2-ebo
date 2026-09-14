"use client";

import React from "react";
import { useAllWordsContext } from "./context";
import { useRouter, useSearchParams } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";

const Tabs = () => {
  const { tab, setTab } = useAllWordsContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser } = usePermissions();
  const id = currentUser?.id ?? "";

  const handleClick = (v: string) => {
    setTab(v);
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("page");

    // if (v === "approved") {
    //   currentParams.delete("createdBy");
    //   currentParams.set("status", "approved");
    // } else

    if (v === "mine") {
      currentParams.delete("status");
      currentParams.set("createdBy", id);
    } else {
      currentParams.delete("status");
      currentParams.delete("createdBy");
    }
    //  else if (v === "moderate") {
    //   currentParams.delete("createdBy");
    //   currentParams.set("status", "in-review");
    // }

    const newPath = `/guonopedia/dictionary?${currentParams.toString()}`;
    router.replace(newPath);
  };

  return (
    <div className="flex shrink-0 md:w-fit w-full max-w-[95vw] max-md:overflow-x-scroll">
      <div className="flex items-center border-b border-gray-txt-50 w-fit">
        {["all", "mine"].map((item, i) => (
          <button
            key={i}
            onClick={() => handleClick(item)}
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
