"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
	STATUS_OPTIONS,
	CATEGORY_OPTIONS,
} from "../constants";

interface SupportTicketFiltersProps {
	status: string;
	category: string;
	onStatusChange: (status: string) => void;
	onCategoryChange: (category: string) => void;
}

export default function SupportTicketFilters({
	status,
	category,
	onStatusChange,
	onCategoryChange,
}: SupportTicketFiltersProps) {
	const { locale } = useLocale();
	const { t } = useTranslation(locale);
	const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
	const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
	const statusDropdownRef = useRef<HTMLDivElement>(null);
	const categoryDropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				statusDropdownRef.current &&
				!statusDropdownRef.current.contains(e.target as Node)
			) {
				setStatusDropdownOpen(false);
			}
			if (
				categoryDropdownRef.current &&
				!categoryDropdownRef.current.contains(e.target as Node)
			) {
				setCategoryDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const currentStatusLabel = STATUS_OPTIONS.find((o) => o.value === status);
	const displayStatusLabel = currentStatusLabel
		? t(currentStatusLabel.labelKey)
		: status;

	const currentCategoryLabel = CATEGORY_OPTIONS.find(
		(o) => o.value === category,
	);
	const displayCategoryLabel = currentCategoryLabel
		? t(currentCategoryLabel.labelKey)
		: category;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
			<div className="relative" ref={statusDropdownRef}>
				<button
					type="button"
					onClick={() => {
						setStatusDropdownOpen(!statusDropdownOpen);
						setCategoryDropdownOpen(false);
					}}
					className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border border-[#23232a] bg-[#1E1E1E] text-[#f5f5f5] hover:bg-[#23232a] transition-colors"
				>
					<span className="text-sm truncate">{displayStatusLabel}</span>
					<ChevronDown
						className={`h-4 w-4 shrink-0 transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`}
					/>
				</button>
				{statusDropdownOpen && (
					<div className="absolute left-0 sm:right-0 top-full mt-1 w-full sm:w-40 bg-[#1E1E1E] border border-[#23232a] rounded-lg shadow-lg py-1 z-50">
						{STATUS_OPTIONS.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => {
									onStatusChange(option.value);
									setStatusDropdownOpen(false);
								}}
								className={`w-full text-left px-4 py-2 text-sm transition-colors ${
									status === option.value
										? "bg-[#23232a] text-[#ffe6b0]"
										: "text-gray-400 hover:bg-[#23232a] hover:text-[#f5f5f5]"
								}`}
							>
								{t(option.labelKey)}
							</button>
						))}
					</div>
				)}
			</div>

			<div className="relative" ref={categoryDropdownRef}>
				<button
					type="button"
					onClick={() => {
						setCategoryDropdownOpen(!categoryDropdownOpen);
						setStatusDropdownOpen(false);
					}}
					className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border border-[#23232a] bg-[#1E1E1E] text-[#f5f5f5] hover:bg-[#23232a] transition-colors"
				>
					<span className="text-sm truncate">{displayCategoryLabel}</span>
					<ChevronDown
						className={`h-4 w-4 shrink-0 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}
					/>
				</button>
				{categoryDropdownOpen && (
					<div className="absolute left-0 sm:right-0 top-full mt-1 w-full sm:w-40 bg-[#1E1E1E] border border-[#23232a] rounded-lg shadow-lg py-1 z-50">
						{CATEGORY_OPTIONS.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => {
									onCategoryChange(option.value);
									setCategoryDropdownOpen(false);
								}}
								className={`w-full text-left px-4 py-2 text-sm transition-colors ${
									category === option.value
										? "bg-[#23232a] text-[#ffe6b0]"
										: "text-gray-400 hover:bg-[#23232a] hover:text-[#f5f5f5]"
								}`}
							>
								{t(option.labelKey)}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
