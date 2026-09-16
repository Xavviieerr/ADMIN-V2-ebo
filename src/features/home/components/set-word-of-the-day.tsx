"use client";

import { ChevronLeft, Loader, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { useWordSearch } from "../hooks/useWordSearch";
import { useSetWordOfDayMutation } from "@/slice/requestSlice";
import { SCHEDULE_MAX_DAYS } from "../constants";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

const SetWordOfTheDay = () => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const {
    word,
    setWord,
    selected,
    setSelected,
    searchResult,
    suggestions,
    fetching,
    clearSearch,
  } = useWordSearch();

  const [scheduledDate, setScheduledDate] = React.useState(
    new Date().toISOString().split("T")[0],
  );

  const [setWordOfDay, { isLoading }] = useSetWordOfDayMutation();

  const handleSetWord = async () => {
    if (!selected || !scheduledDate || isLoading) return;

    try {
      await setWordOfDay({
        wordId: selected.id,
        scheduledDate,
        culturalNote: "word of the day",
      }).unwrap();

      toast.success(t("common.success"), {
        description: `${t("home.scheduleSuccess")} ${scheduledDate}`,
      });
      clearSearch();
    } catch {
      toast.error(t("common.error"), {
        description: `${t("home.scheduleFailed")} ${scheduledDate}`,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-0 md:p-6 lg:p-8 space-y-10">
      <div className="container py-10 md:px-10 px-4 max-md:-mt-5 max-md:flex-1 flex flex-col gap-5 max-w-5xl w-full">
        <div className="flex items-start gap-6 md:mb-3 ">
          <Link href={"/home"} className=" cursor-pointer">
            <ChevronLeft size={28} />
          </Link>

          <div>
            <h2 className="text-xl md:text-2xl font-medium">
              {t("home.scheduleWord")}
            </h2>
            <p className="text-gray-txt-50 mt-1 max-md:hidden">
              {t("home.chooseWordDate")}
            </p>
          </div>
        </div>
        <p className="text-gray-txt-50 mb-0 md:hidden text-center">
          {t("home.chooseWordDate")}
        </p>

        <div className="flex flex-col items-start gap-2">
          <label htmlFor="day" className="text-sm text-white">
            {t("home.selectDay")}
          </label>
          <input
            id="day"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            max={
              new Date(Date.now() + SCHEDULE_MAX_DAYS * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            }
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="input"
          />
        </div>

        <div className="flex flex-col items-start gap-2 relative">
          <label htmlFor="word" className="text-sm text-white">
            {t("home.selectWord")}
          </label>
          <input
            id="word"
            type="text"
            placeholder={t("home.searchWords")}
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="input"
          />

          <div className="absolute right-4 top-1/2 cursor-pointer">
            {fetching ? <Loader /> : <Search />}
          </div>
        </div>

        {searchResult.length > 0 && (
          <div className="w-full max-h-40 mt-2 bg-gray-txt-100 rounded-lg overflow-y-auto" role="listbox">
            {suggestions.map((word) => (
              <div
                key={word.ota}
                role="option"
                aria-selected={selected?.ota === word.ota}
                onClick={() => {
                  setSelected(word);
                  setWord(word.ota);
                }}
                className="px-5 py-3 cursor-pointer hover:bg-gray-txt-50/40 gap-2 capitalize"
              >
                <span className="">{word.ota}</span> -{" "}
                {word.efaEng.map((eng, i) => (
                  <span key={eng}>
                    {eng}
                    {i < word.efaEng.length - 1 ? " | " : ""}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="mt-5">
            <h2 className="text-xl font-semibold text-white mb-5">
              {t("home.wordPreview")}
            </h2>

            <div className="flex items-start justify-between p-5 border-2 transition-colors duration-300 border-[#dbdcde] text-white rounded-2xl bg-primary-bg ">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start w-full">
                  <div className="flex max-md:flex-col md:items-center gap-4">
                    <h3 className="font-semibold text-2xl">{selected.ota}</h3>
                    <span className="text-gray-txt-50 text-sm capitalize">
                      {selected.oho.length} sense(s) | {selected.status}
                    </span>
                  </div>

                  {selected.oho[0]?.oma && selected.oho[0].oma.length > 0 && (
                    <Image
                      src={selected.oho[0].oma[0].url}
                      width={80}
                      height={60}
                      alt="word image"
                      className="rounded-lg max-w-40 md:hidden"
                    />
                  )}
                </div>

                <div className="flex gap-4 font-normal">
                  <span>{t("common.upho")}: [{selected.oho[0].upho}]</span>
                  <span>{t("common.uphoesio")}: /{selected.oho[0].uphoesio}/</span>
                </div>

                <div className="flex flex-col">
                  <span className="">{t("common.created")}: {selected.createdAt}</span>
                </div>

                {selected.idje && selected.idje.length > 0 && (
                  <div className="flex flex-col">
                    <span className="">{t("common.sentence")}:</span>
                    <span>{selected.idje[0]}</span>
                  </div>
                )}
              </div>

              {selected.oho[0].oma && selected.oho[0].oma.length > 0 && (
                <div className="flex flex-col items-end gap-6 max-md:hidden">
                  <Image
                    src={selected.oho[0].oma[0].url}
                    width={160}
                    height={120}
                    alt="word image"
                    className="rounded-lg max-w-40"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-10 self-end mt-10">
          <Link href={"/home"} className="text-white cursor-pointer">
            {t("common.cancel")}
          </Link>
          <button
            className="primary-btn"
            disabled={isLoading || !selected}
            onClick={handleSetWord}
          >
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              t("home.setWord")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetWordOfTheDay;
