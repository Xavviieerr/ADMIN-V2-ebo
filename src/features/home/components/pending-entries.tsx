"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import moment from "moment";
import { MapPin } from "lucide-react";
import { WordRecord } from "../types";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

const STATUS_STYLES: Record<string, string> = {
  approved: "border-green-500/40 bg-green-500/10 text-green-400",
  pending: "border-amber-400/40 bg-amber-500/10 text-amber-400",
  rejected: "border-red-500/40 bg-red-500/10 text-red-400",
  inReview: "border-blue-500/40 bg-blue-500/10 text-blue-400",
};

const PendingEntries = ({ data }: { data: WordRecord[] }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const words = useMemo(() => {
    return data.map((raw) => {
      const eng = raw.efaEng?.map((e) => e.otaWord) ?? [];
      const pos = raw.oho?.flatMap((o) => o.ekerota) ?? [];
      const firstSentence =
        raw.oho?.[0]?.idje?.[0]?.sentence ??
        raw.efaEng?.[0]?.details?.idje?.[0]?.sentence ??
        "";
      const avgRating =
        raw.wordRatings && raw.wordRatings.length > 0
          ? (
              raw.wordRatings.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
              raw.wordRatings.filter((r) => r.rating !== null).length
            ).toFixed(1)
          : null;
      const ratingCount =
        raw.wordRatings?.filter((r) => !r.isReply && r.rating !== null)
          .length ?? 0;

      return {
        id: raw.id,
        ota: raw.ota,
        eng,
        pos,
        erevwe: raw.erevwe,
        status: raw.status,
        upho: raw.oho?.[0]?.upho ?? "",
        senses: raw.oho?.length ?? 0,
        firstSentence,
        avgRating,
        ratingCount,
        directQueryCount: raw.directQueryCount ?? 0,
        createdAt: raw.createdAt,
      };
    });
  }, [data]);

  return (
    <section className="w-full min-w-0 overflow-hidden container max-md:px-0">
      <div className="flex items-center justify-between px-5 md:px-6 pb-4 mb-1">
        <h2 className="max-md:text-lg max-md:font-semibold text-xl font-semibold text-white tracking-tight">
          {t("home.pendingEntries")}
        </h2>
        <span className="text-xs font-medium text-gray-txt-50/70 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
          {words.length}
        </span>
      </div>

      {words.length > 0 && (
        <ul className="px-5 md:px-6 mt-5 overflow-y-scroll overflow-x-hidden max-h-100 custom-scrollbar">
          {words.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between py-3 border-b border-[#23232a] last:border-b-0 min-w-0"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="rounded-full w-3 h-3 bg-amber-600 shrink-0" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <Link
                      href={`/guonopedia/dictionary/${entry.id}`}
                      className="text-white font-medium capitalize hover:text-foreground transition-colors truncate"
                    >
                      {entry.ota}
                    </Link>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${STATUS_STYLES[entry.status] || STATUS_STYLES.pending}`}>
                      {entry.status}
                    </span>
                  </div>

                  {entry.eng.length > 0 && (
                    <div className="text-xs text-gray-txt-50 mt-0.5 truncate">
                      {entry.eng.join(" | ")}
                      {entry.pos.length > 0 && <> • {entry.pos[0]}</>}
                      {entry.erevwe && (
                        <span className="inline-flex items-center gap-1 ml-1">
                          • <MapPin className="w-3 h-3 shrink-0" />{entry.erevwe}
                        </span>
                      )}
                      {entry.ratingCount > 0 && (
                        <span className="text-amber-400 ml-1">★ {entry.avgRating}</span>
                      )}
                    </div>
                  )}

                  {entry.firstSentence && (
                    <div className="text-xs text-gray-txt-50/60 mt-0.5 italic truncate">
                      &ldquo;{entry.firstSentence}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end text-xs text-gray-txt-50 shrink-0 ml-3">
                <span className="font-mono">[{entry.upho}]</span>
                <span className="mt-0.5 whitespace-nowrap">{moment(entry.createdAt).fromNow()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {words.length === 0 && (
        <p className="px-5 max-md:pt-4 md:py-9 w-full text-center text-gray-txt-50">
          {t("home.nothingHere")}
        </p>
      )}
    </section>
  );
};

export default PendingEntries;
