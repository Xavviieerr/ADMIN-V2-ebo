import { PenBox } from "lucide-react";
import React from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

export type TranslationDraft = {
  id: string;
  translation: string;
  notes: string;
};

// Saved translations list for the edit flow.
function TranslationList({
  translations,
  onEdit,
  // Unused while the delete button below stays commented out (no backend
  // DELETE translation endpoint). Kept so re-enabling is uncomment-only.
  onDelete: _onDelete,
}: {
  translations: TranslationDraft[];
  onEdit: (id: string) => void;
  onDelete: () => void;
}) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  if (translations.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full text-sm">
      {translations.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-1 md:px-5 px-3 py-2 w-full border border-gray-txt-50/30 relative rounded-md group "
        >
          <span className="line-clamp-1 font-medium">
            {item.translation}
          </span>
          <span>{item.notes}</span>

          <div className="flex md:hidden md:group-hover:flex gap-6 items-center bg-secondary-bg px-5 py-2 rounded-full absolute right-0 top-0">
            <button
              onClick={() => onEdit(item.id)}
              className="cursor-pointer"
              aria-label={t("names.form.editTranslationAria", "Edit translation")}
            >
              <PenBox />
            </button>
            {/* Translation deletion is unavailable: the backend exposes no
                DELETE translation endpoint (verified). Button kept for when
                the endpoint ships — wire to api/translations.ts. */}
            {/* <button
              onClick={onDelete}
              className="cursor-pointer text-base-red"
              aria-label={t("names.translation.deleteAria", "Delete translation (unavailable)")}
              title={t("names.translation.unavailable", "Translation deletion is not available yet")}
            >
              {" "}
              <Trash2 />
            </button> */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TranslationList;
