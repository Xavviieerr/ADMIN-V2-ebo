"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getAllWordsTab } from "@/features/dictionary/browse/get-browse-tab";

const tabs = [
  { value: "all", key: "common.dictionary.all", fallback: "All" },
  { value: "mine", key: "common.dictionary.mine", fallback: "Mine" },
];

const Tabs = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { locale } = useLocale();
	const { t } = useTranslation(locale);
	const { currentUser } = usePermissions();
	const id = currentUser?.id ?? "";
	const tab = getAllWordsTab({
		createdBy: searchParams.get("createdBy") ?? "",
	});

	const handleClick = (v: string) => {
		const currentParams = new URLSearchParams(searchParams.toString());
		currentParams.delete("page");

		if (v === "mine") {
			currentParams.set("createdBy", id);
		} else {
			currentParams.delete("createdBy");
		}

		const newPath = `/guonopedia/dictionary?${currentParams.toString()}`;
		router.replace(newPath);
	};

	return (
		<div className="flex shrink-0 md:w-fit w-full max-w-[95vw] max-md:overflow-x-scroll no-scrollbar">
			<div className="flex items-center border-b border-gray-txt-50 w-fit">
				{tabs.map((item) => (
					<button
						key={item.value}
						onClick={() => handleClick(item.value)}
						className={`px-10 ${tab === item.value ? "border-b-2 border-foreground-50" : ""} pb-2 cursor-pointer`}
					>
						<p className="capitalize">{t(item.key, item.fallback)}</p>
					</button>
				))}
			</div>
		</div>
	);
};

export default Tabs;
