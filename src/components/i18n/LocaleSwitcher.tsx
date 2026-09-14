'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

/**
 * Locale Switcher Component
 * 
 * Allows users to switch between English and Urhobo translations
 * Styled to match the topbar theme with flags
 */
export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLanguageToggle = (lang: 'en' | 'urh') => {
    setLocale(lang);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 bg-white/10 rounded-full text-[10px] sm:text-xs font-medium transition-all hover:bg-white/20 text-[#f5f5f5]"
      >
        {locale === "en" ? "ENG" : "URH"}
        <svg
          className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full mt-2 right-0 bg-[#191919] border border-[#23232a] rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
          <button
            onClick={() => handleLanguageToggle("urh")}
            className={clsx(
              "w-full flex items-center gap-2 px-3 py-2 text-[10px] sm:text-xs font-medium transition-all",
              locale === "urh"
                ? "bg-[#23232a] text-[#ffe6b0]"
                : "text-[#f5f5f5] hover:bg-[#23232a] hover:text-[#ffe6b0]"
            )}
          >
            <Image
              src="/urhobo.png"
              alt="Urhobo"
              width={14}
              height={14}
              className="object-contain"
            />
            URH
          </button>
          <button
            onClick={() => handleLanguageToggle("en")}
            className={clsx(
              "w-full flex items-center gap-2 px-3 py-2 text-[10px] sm:text-xs font-medium transition-all",
              locale === "en"
                ? "bg-[#23232a] text-[#ffe6b0]"
                : "text-[#f5f5f5] hover:bg-[#23232a] hover:text-[#ffe6b0]"
            )}
          >
            <Image
              src="/uk-flag.png"
              alt="UK flag"
              width={14}
              height={14}
              className="object-contain rounded-sm"
            />
            ENG
          </button>
        </div>
      )}
    </div>
  );
}
