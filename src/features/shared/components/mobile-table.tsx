import Link from "next/link";
import React from "react";
import StatusCard from "../status-card";
import LocaleWrapper from "../locale-wrapper";
import { boolean } from "zod";

const MobileTable = ({
  link,
  items,
  status,
  showTitles = false,
}: {
  link: string;
  items: { title: string; body: string }[];
  status: string;
  showTitles?: boolean;
}) => {
  return (
    <Link
      href={link}
      className="md:hidden bg-[#1E1E1E] rounded-lg border border-white/10 p-4 space-y-3 cursor-pointer hover:bg-[#2a2a2a]/50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {showTitles && (
            <h3 className="text-sm text-gray-300 truncate capitalize">
              <LocaleWrapper item={items[0].title} />
            </h3>
          )}
          <p className="text-base mt-1">{items[0].body}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2 border-t border-white/10">
        {items.length > 1 && (
          <div className="flex items-center gap-2">
            {showTitles && (
              <span className="text-xs text-gray-400">
                {<LocaleWrapper item={items[1].title} />}:
              </span>
            )}
            <span className="text-xs sm:text-sm text-gray-300 capitalize">
              {items[1].body}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            <LocaleWrapper item="common.statusLabel" />
          </span>

          <StatusCard status={status} />
        </div>
      </div>
    </Link>
  );
};

export default MobileTable;
