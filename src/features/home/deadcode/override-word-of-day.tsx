"use client";

import { BASE_URL } from "@/utils/constants";
import { ChevronLeft, Loader, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { toast } from "sonner";
import moment from "moment";
import { SimpleRecord, WordRecord } from "../types";

const OverrideWordOfTheDay = () => {
  const [word, setWord] = useState("");
  const [selected, setSelected] = useState<SimpleRecord>();
  const [searchResult, setSearchResult] = useState<WordRecord[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [suggestions, setSuggestions] = useState<SimpleRecord[]>([]);

  const token = getAccessToken();

  const fetchWord = async () => {
    setFetching(true);
    try {
      const res = await fetch(
        `${BASE_URL}/search?q=${word}&mode=partial&lang=urhobo&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch word");
      }
      const { data } = await res.json();
      const results: WordRecord[] = data.results.map((item: any) => item.word);
      setSearchResult(results);
      getSuggestions(results);
    } catch (error) {
      console.error(error);
      return undefined;
    } finally {
      setFetching(false);
    }
  };

  const setWordOfTheDay = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/admin/word-of-the-day/${selected?.id}/override`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        return toast.error("Error", {
          description: `Failed to override word of the day`,
        });
      }
      toast.success("Success", {
        description: `Word of the day overridden successfully`,
      });
      setSelected(undefined);
      setWord("");
      setSearchResult([]);
      setSuggestions([]);
      return;
    } catch (error) {
      toast.error("Error", {
        description: `Failed to override word of the day`,
      });
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!word.trim() || selected?.ota === word) return;

    fetchWord();
  }, [word]);

  const handleSetWord = () => {
    if (!selected || loading) return;

    setWordOfTheDay();
  };

  const getSuggestions = (results: WordRecord[]) => {
    let suggestions: SimpleRecord[] = [];
    for (let i = 0; i < results.length; i++) {
      const singleResult = results[i];
      let eng: string[] = [];
      let pos: string[] = [];
      let oto: string[] = [];
      let idje: string[] = [];
      singleResult.efaEng.map((item) => {
        eng = [...eng, item.otaWord];
        pos = [...pos, ...item.details.ekerota];
        oto = [...oto, item.details.oto];
        idje = [...idje, ...item.details.idje.map((item) => item.sentence)];
      });

      suggestions.push({
        id: singleResult.id,
        ota: singleResult.ota,
        efaEng: eng,
        oho: singleResult.oho,
        pos,
        oto,
        idje,
        createdAt: moment(singleResult.createdAt).format("YYYY-MM-DD"),
        status: singleResult.status,
      });
    }

    return setSuggestions(suggestions);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-0 md:p-6 lg:p-8 space-y-10">
      <div className="container py-10 md:px-10 px-4 max-md:-mt-5 max-md:flex-1 flex flex-col gap-5 max-w-5xl w-full">
        <div className="flex items-start gap-6 mb-3 ">
          <Link href={"/home"} className="mt-1 cursor-pointer">
            <ChevronLeft size={28} />
          </Link>

          <div>
            <h2 className="text-xl md:text-2xl font-medium">
              Override Word of The Day
            </h2>
            <p className="text-gray-txt-50 mt-1 max-md:hidden">
              Choose a dictionary word to feature today.
            </p>
          </div>
        </div>
        <p className="text-gray-txt-50 mb-5 md:hidden">
          Choose a dictionary word to feature today.
        </p>

        <div className="flex flex-col items-start gap-2 relative">
          <label htmlFor="word" className="text-sm text-white">
            Select Word
          </label>
          <input
            id="word"
            type="text"
            placeholder="Search for a word..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="input"
          />

          <div className="absolute right-4 top-1/2 cursor-pointer">
            {fetching ? <Loader /> : <Search />}
          </div>
        </div>

        {searchResult.length > 0 && (
          <div className="w-full max-h-40 mt-2 bg-gray-txt-100 rounded-lg overflow-y-auto">
            {suggestions.map((word) => (
              <div
                key={word.ota}
                onClick={() => {
                  setSelected(word);
                  setWord(word.ota);
                  setSearchResult([]);
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
              Word Preview
            </h2>

            <div className="flex items-start justify-between p-5 border-2 transition-colors duration-300 border-[#dbdcde] text-white rounded-2xl bg-primary-bg ">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start w-full">
                  <div className="flex max-md:flex-col md:items-center gap-4">
                    <h3 className="font-semibold text-2xl">{selected.ota}</h3>
                    {selected?.oho?.length > 0 && (
                      <span className="text-gray-txt-50 text-sm capitalize">
                        {selected.oho.length} sense(s) | {selected.status}
                      </span>
                    )}
                  </div>

                  {selected?.oho?.length > 0 &&
                    selected.oho[0].oma.length > 0 && (
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
                  <span>Pronunciation: [{selected.oho[0].upho}]</span>
                  <span>IPA: /{selected.oho[0].uphoesio}/</span>
                </div>

                <div className="flex flex-col">
                  <span className="">Submitted: {selected.createdAt}</span>
                </div>

                {selected.idje && selected.idje.length > 0 && (
                  <div className="flex flex-col">
                    <span className="">Example Sentence:</span>
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
            Cancel
          </Link>
          <button
            className="primary-btn"
            disabled={loading}
            onClick={handleSetWord}
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              "Set Word of the Day"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverrideWordOfTheDay;
