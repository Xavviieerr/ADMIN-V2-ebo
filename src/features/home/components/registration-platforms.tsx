"use client";

import React from "react";
import { HomeStats } from "../types";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

const RegistrationByPlatform = ({
  data,
}: {
  data: HomeStats["registrationByPlatform"] | undefined;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <div className="md:w-1/2 w-full container px-0 h-fit">
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-txt-50/30 px-5">
        <h2 className="max-md:text-lg max-md:font-medium text-xl font-semibold text-white">
          {t("home.registrationByPlatform")}
        </h2>
      </div>

      {data && data.length > 0 && (
        <ul className="space-y-4 px-5 mt-5 overflow-y-scroll max-h-100 custom-scrollbar">
          {data.map((item, index) => (
            <li
              key={index}
              className={`flex items-center justify-between py-3 border-b border-[#23232a] last:border-b-0  px-5 rounded-md`}
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-full  w-3 h-3 bg-amber-600`} aria-label="Platform indicator" />

                <span className="text-white font-normal capitalize">
                  {item.platform || "Unrecognised Platform"}
                </span>
              </div>

              <div className="flex flex-col items-end  text-gray-txt-50">
                <p>{item.total}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {(!data || data.length === 0) && (
        <p className="px-5 max-md:pt-4 md:py-9 w-full text-center text-gray-txt-50">
          {t("home.nothingHere")}
        </p>
      )}
    </div>
  );
};

export default RegistrationByPlatform;
