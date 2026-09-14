"use client";
import React from "react";
import SenseCard from "./sense-card";
import { SenseData } from "@/features/dictionary/lib";

const SensesSection = ({
  urhData,
  engData,
  korData,
  setUrhData,
  setEngData,
  setKorData,
}: {
  urhData: SenseData;
  engData: SenseData;
  korData: SenseData;
  setUrhData: React.Dispatch<React.SetStateAction<SenseData>>;
  setEngData: React.Dispatch<React.SetStateAction<SenseData>>;
  setKorData: React.Dispatch<React.SetStateAction<SenseData>>;
}) => {
  return (
    <div className="flex flex-col md:px-8 px-2 md:py-6 py-2 bg-gray-txt-100 md:my-5 max-md:mb-5 md:rounded-md w-full relative">
      <div className="flex max-md:flex-col max-md:gap-6 max-w-full overflow-x-scroll gap-4 md:mt-6">
        <SenseCard data={urhData} setData={setUrhData} />
        <SenseCard
          data={engData}
          lang="eng"
          setData={setEngData}
          urhExamples={urhData.examples}
        />
        <SenseCard
          data={korData}
          lang="kor"
          setData={setKorData}
          urhExamples={urhData.examples}
        />
      </div>
    </div>
  );
};

export default SensesSection;
