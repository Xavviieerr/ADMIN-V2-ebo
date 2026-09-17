"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type SortDropdownProps = {
	label: string;
	options: { value: string; label: string }[];
	value: string;
	onChange: (value: string) => void;
};

export default function SortDropdown({
	label,
	options,
	value,
	onChange,
}: SortDropdownProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);

	return (
		<div
			ref={ref}
			role="button"
			tabIndex={0}
			aria-haspopup="listbox"
			aria-expanded={open}
			onClick={() => setOpen(!open)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					setOpen(!open);
				} else if (e.key === "Escape") {
					setOpen(false);
				}
			}}
			className="flex items-center justify-between gap-4 min-w-30 relative bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-5 py-3 rounded-lg outline-none cursor-pointer"
		>
			<p>
				<span className="text-gray-400 mr-2">Order:</span>
				{options.find((o) => o.value === value)?.label || label}
			</p>
			<ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />

			{open && (
				<div
					role="listbox"
					className="absolute top-full left-0 mt-2 w-full transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg z-10"
				>
					{options.map((item) => (
						<button
							key={item.value}
							role="option"
							aria-selected={item.value === value}
							onClick={() => {
								onChange(item.value);
								setOpen(false);
							}}
							className="w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer"
						>
							{item.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
