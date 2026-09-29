"use client";

import { BaseInput, BaseTextArea } from "@/features/shared";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import PlayAudioButton from "@/features/dictionary/word-detail/play-audio";
import { SenseData } from "@/features/dictionary/lib";
import { getPOS } from "@/helpers";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import StagedMediaButton from "./preview/StagedMediaButton";

type SenseCardMetaProps = {
	lang: "urh" | "eng" | "kor";
	data: SenseData;
	setData: React.Dispatch<React.SetStateAction<SenseData>>;
	ota: string;
};

const SenseCardMeta = ({ lang, data, setData, ota }: SenseCardMetaProps) => {
	const { locale } = useLocale();
	const { t } = useTranslation(locale);
	const posDropdownRef = useRef<HTMLDivElement>(null);
	const [showPosOptions, setShowPosOptions] = useState(false);

	useEffect(() => {
		if (!showPosOptions) return;
		const handleOutsideClick = (event: MouseEvent) => {
			if (
				posDropdownRef.current &&
				!posDropdownRef.current.contains(event.target as Node)
			) {
				setShowPosOptions(false);
			}
		};
		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [showPosOptions]);

	const getPos = () => getPOS(lang);

	return (
		<>
			<div className="flex items-center gap-3 text-base font-medium mb-2">
				<h2>
					{lang === "urh"
						? t("common.dictionary.senses", "Urhobo Sense")
						: lang === "kor"
							? t(
									"common.dictionary.wordTranslationLabel",
									"Korean Translation",
								)
							: t(
									"common.dictionary.wordTranslationLabel",
									"English Translation",
								)}
				</h2>
				{lang === "urh" && (
					<span className="rounded-full bg-yellow-500/15 text-yellow-400  px-2 py-0.5 text-xs font-medium">
						{t("common.dictionary.requiredTag", "Sense (required)")}
					</span>
				)}
			</div>

      <div className="flex flex-col w-full gap-5">
        <div className="w-full">
          {lang === "urh" && (
            <p className="input text-gray-txt-50 w-full">{ota}</p>
          )}

          {lang !== "urh" && (
            <BaseInput
              value={data.headWord}
              placeholder={t(
                "common.dictionary.wordTranslationLabel",
                "Enter the word's translation",
              )}
              setValue={(value: string | number) =>
                setData({ ...data, headWord: value as string })
              }
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <StagedMediaButton
            kind="audio"
            label={
              data.audioUrl
                ? t("common.dictionary.updateAudio", "Update Audio")
                : t("common.dictionary.uploadAudio", "Upload Audio")
            }
            onUploaded={(value) => setData({ ...data, audioUrl: value })}
          />

          {data.audioUrl && <PlayAudioButton audioUrl={data.audioUrl} />}
        </div>

        {lang === "urh" && (
          <div className="flex flex-wrap items-center gap-4">
            {!data.imageUrl && (
              <StagedMediaButton
                kind="image"
                label={t("common.dictionary.uploadImage", "Upload Image")}
                onUploaded={(value) => setData({ ...data, imageUrl: value })}
              />
            )}

            {data.imageUrl && (
              <div className="flex items-center gap-3">
                <Image
                  src={data.imageUrl}
                  alt={t("common.dictionary.senseImage", "Sense image")}
                  width={96}
                  height={96}
                  className="rounded-lg object-cover w-24 h-24 shrink-0 ring-1 ring-white/10"
                />
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xs font-medium">
                    {t("common.dictionary.senseImage", "Sense image")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, imageUrl: "" })}
                    className="text-xs text-base-red cursor-pointer"
                    aria-label={t(
                      "common.dictionary.removeImage",
                      "Remove image",
                    )}
                  >
                    {t("common.dictionary.remove", "Remove")}
                  </button>
                  <StagedMediaButton
                    kind="image"
                    label={t("common.dictionary.updateImage", "Update Image")}
                    onUploaded={(value) =>
                      setData({ ...data, imageUrl: value })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}
					{/* Translations do not support images for now.
          Re-enable the block below when they do:
          <StagedMediaButton
            kind="image"
            onUploaded={(value) => setData({ ...data, imageUrl: value })}
          />
          {data.imageUrl && (...)}
          */}
				</div>

				<div
					ref={posDropdownRef}
					role="button"
					tabIndex={0}
					aria-haspopup="listbox"
					aria-expanded={showPosOptions}
					aria-label={t("common.dictionary.partOfSpeech", "Part of speech")}
					onClick={() => setShowPosOptions(!showPosOptions)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							setShowPosOptions(!showPosOptions);
						}
						if (e.key === "Escape") {
							setShowPosOptions(false);
						}
					}}
					className="flex items-center justify-between gap-4 min-w-30 w-full mt-5 relative bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-5 py-3 rounded-lg outline-none cursor-pointer"
				>
					<p className={data.partOfSpeech ? "capitalize" : "text-gray-txt-50"}>
						{data.partOfSpeech ||
							t("common.dictionary.partOfSpeech", "Part of speech")}
					</p>
					<ChevronDown
						className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${showPosOptions ? "rotate-180" : ""}`}
					/>

					{showPosOptions && (
						<div
							role="listbox"
							aria-label={t("common.dictionary.partOfSpeech", "Part of speech")}
							className="absolute top-full left-0 mt-2 w-full min-w-52 max-h-72 overflow-y-auto custom-scrollbar z-20 transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg"
						>
							<button
								type="button"
								role="option"
								aria-selected={!data.partOfSpeech}
								onClick={() => {
									setData({ ...data, partOfSpeech: "" });
									setShowPosOptions(false);
								}}
								className={`w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer text-gray-txt-50 ${!data.partOfSpeech ? "text-foreground-50 font-medium" : ""}`}
							>
								{t("common.dictionary.partOfSpeech", "Part of speech")}
							</button>
							{getPos().map((pos) => (
								<button
									key={pos}
									type="button"
									role="option"
									aria-selected={data.partOfSpeech === pos}
									onClick={() => {
										setData({ ...data, partOfSpeech: pos });
										setShowPosOptions(false);
									}}
									className={`w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer capitalize ${data.partOfSpeech === pos ? "text-foreground-50 font-medium" : ""}`}
								>
									{pos}
								</button>
							))}
						</div>
					)}
				</div>

				<>
					<div className="flex flex-col gap-5 w-full mt-5">
					<div className="flex max-md:flex-col items-stretch md:items-center gap-4">
						<BaseInput
							value={data.pronunciation}
							setValue={(value) =>
								setData({ ...data, pronunciation: value as string })
							}
							placeholder={t(
								"common.dictionary.pronunciation",
								"Pronunciation",
							)}
						/>

						<BaseInput
							value={data.IPA}
							setValue={(value) => setData({ ...data, IPA: value as string })}
							placeholder={t("common.dictionary.ipa", "IPA")}
						/>
					</div>

					<BaseTextArea
						value={data.meaning}
						setValue={(value) => setData({ ...data, meaning: value as string })}
						placeholder={t("common.dictionary.meaning", "Meaning of the word")}
					/>

					<BaseInput
						value={data.scientificName}
						setValue={(value) =>
							setData({ ...data, scientificName: value as string })
						}
						placeholder={t(
							"common.dictionary.scientificName",
							"Scientific Name",
						)}
					/>
					</div>
				</>
		</>
	);
};

export default SenseCardMeta;
