"use client";

import React, { useRef, useState } from "react";
import TranslationList from "./translation-list";
import Image from "next/image";
import { Loader, Loader2, Pause, StopCircle, Volume2 } from "lucide-react";
import { playAudio } from "@/helpers";
import SensesList from "./senses-list";
import { PayloadData } from "@/features/dictionary/lib";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { useRouter } from "next/navigation";
import { useWordContext } from "./context";

const createWord = async ({
  token,
  word,
}: {
  token: string;
  word: Omit<PayloadData, "image">;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/word`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(word),
    });

    const data = await res.json();

    if (!res.ok) throw data.message;

    return { data };
  } catch (error) {
    const msg =
      (error as Error).message || "An error occured while creating word";
    toast.error(msg);

    return { msg, data: null };
  }
};

const Preview = () => {
  const { data, clearForm } = useWordContext();
  const router = useRouter();

  const [tab, setTab] = useState<"senses" | "translations">("senses");
  const [lang, setLang] = useState<"English" | "Korean">("English");
  const [playing, setPlaying] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const token = getAccessToken();

  const [submitting, setSubmitting] = useState(false);

  const getTranslations = () => {
    const korTrans = data.oho.map((item) => item.translations.kor);
    const engTrans = data.oho.map((item) => item.translations.eng);

    return lang === "Korean" ? korTrans : engTrans;
  };

  const translations = getTranslations();

  const handlePlay = () => {
    playAudio({
      url: data.oho[0].omra[0],
      audioPlayerRef,
      playing,
      setPlaying,
    });
  };

  const handleSubmit = async () => {
    if (!token) return;

    setSubmitting(true);
    const { image, ...rest } = data;
    const res = await createWord({
      token,
      word: { ...rest, creationReason: rest.creationReason || "N/A" },
    });
    setSubmitting(false);

    if (res.data) {
      toast.success("Success");
      router.replace(`/guonopedia/dictionary/${res.data.data.id}`);
    }
  };
  return (
    <div className="flex flex-col dark-box md:px-4 px-0 w-full pb-20">
      <div className="flex items-center justify-between gap-4 max-md:border-b border-gray-txt-50/50 max-md:pb-5">
        <h2 className="text-white font-medium text-lg">Preview Word</h2>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="primary-btn font-medium"
        >
          {submitting ? <Loader className="animate-spin" /> : "Submit Word"}
        </button>
      </div>

      <div className="flex flex-col md:px-8 px-0 md:py-6 md:bg-gray-txt-100 md:my-5 max-md:mb-5 rounded-md w-full">
        <div className="flex flex-col dark-box max-md:px-3 gap-2">
          <div className="flex max-md:flex-col items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                {" "}
                <p className="text-2xl capitalize font-medium">{data.ota}</p>
                {data.oho[0]?.omra[0] && (
                  <button onClick={handlePlay} className="text-foreground-50">
                    {playing ? <StopCircle /> : <Volume2 />}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-gray-txt-50">{data.oho.length} Sense(s)</p>
                <span className="">
                  Dialect:{" "}
                  <span className="text-gray-txt-50 capitalize">
                    {data.erevwe}
                  </span>
                </span>
                {data.otaOkpopko && (
                  <p>
                    Creation Reason:{" "}
                    <span className="text-gray-txt-50">
                      {data.creationReason}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {data.image && (
              <div className="md:w-28 md:h-24 w-full h-40 shrink-0 rounded-md relative">
                <Image
                  src={data.image}
                  alt="word image"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex max-md:flex-col md:items-center justify-between">
            <div className="flex items-center border-b border-gray-txt-50 w-fit my-5">
              {["senses", "translations"].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setTab(item as "senses" | "translations")}
                  className={`px-5 ${tab === item ? "border-b-2 border-foreground-50" : ""} pb-2 cursor-pointer`}
                >
                  <p className="capitalize">{item}</p>
                </button>
              ))}
            </div>

            {tab === "translations" && (
              <select
                value={lang}
                onChange={(e) =>
                  setLang(e.target.value as "English" | "Korean")
                }
                id="dialect"
                className="input h-10 w-fit text-sm capitalize bg-secondary-bg"
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
          </div>

          {tab == "senses" && <SensesList data={data} />}

          {tab === "translations" && (
            <TranslationList translations={translations} lang={lang} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
