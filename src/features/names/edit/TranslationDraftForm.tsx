import { Loader } from "lucide-react";
import React from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationDraft } from "./TranslationList";

// Draft inputs + add/update/cancel actions for one translation.
function TranslationDraftForm({
  draft,
  onDraftChange,
  busy,
  onAdd,
  onUpdate,
  onCancel,
}: {
  draft: TranslationDraft;
  onDraftChange: (draft: TranslationDraft) => void;
  busy: boolean;
  onAdd: () => void;
  onUpdate: () => void;
  onCancel: () => void;
}) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="translation">{t("names.form.translationLabel", "Translation")}</label>
        <input
          type="text"
          id="translation"
          maxLength={50}
          placeholder={t("names.form.translationPlaceholder", "Enter the english translation of the name")}
          value={draft.translation}
          onChange={(e) =>
            onDraftChange({ ...draft, translation: e.target.value })
          }
          className="input"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="notes">{t("names.form.notesLabel", "Notes (optional)")}</label>
        <textarea
          rows={3}
          id="notes"
          maxLength={500}
          placeholder={t("names.form.notesPlaceholder", "Enter any notes about the translation")}
          value={draft.notes}
          onChange={(e) =>
            onDraftChange({ ...draft, notes: e.target.value })
          }
          className="input"
        />
      </div>

      {draft.id ? (
        <div className="flex w-full gap-4 items-center justify-between">
          <button
            className="secondary-btn flex items-center gap-2 w-fit my-3"
            onClick={onCancel}
            disabled={busy}
          >
            {t("common.cancel", "Cancel")}
          </button>

          <button
            className="secondary-btn flex items-center gap-2 w-fit my-3"
            onClick={onUpdate}
            disabled={busy}
          >
            {busy ? <Loader /> : t("common.dictionary.editTranslation", "Update Translation")}
          </button>
        </div>
      ) : (
        <button
          className="secondary-btn flex items-center gap-2 w-fit my-3"
          onClick={onAdd}
          disabled={busy}
        >
          {busy ? <Loader /> : t("common.addTranslation", "Add Translation")}
        </button>
      )}
    </>
  );
}

export default TranslationDraftForm;
