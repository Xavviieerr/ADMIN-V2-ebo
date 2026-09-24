"use client";

import { useRouter } from "next/navigation";
import AddNewWord from "@/components/dictionary/addNewWord";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

export default function DictionaryPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <div className="min-h-screen px-2 py-4 lg:p-8 bg-[#18191f] text-white relative">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#F5DEB3] hover:text-white transition-colors mb-5"
      >
        <ArrowLeft size={18} />
        <span>{t('common.back', 'Back')}</span>
      </button>

      <p className="text-lg mb-5 text-[#F5DEB3]">{t('common.addNewWord', 'Add a new word')}</p>
      <AddNewWord />
    </div>
  );
}