"use client";
import { PenBox, Trash2, Plus } from "lucide-react";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import type { NameFormDataType } from "../model/types";
import { validateTranslationDraft, VALIDATION_EN } from "../model/validation";

const AddTranslations = ({
  formData,
  setFormData,
}: {
  formData: NameFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<NameFormDataType>>;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [translationForm, setTranslationForm] = useState({
    id: "",
    translation: "",
    notes: "",
  });

  const handleAddTranslation = () => {
    const error = validateTranslationDraft(translationForm.translation);
    if (error) return toast.error(t(error, VALIDATION_EN[error] ?? error));

    if (translationForm.id) {
      setFormData({
        ...formData,
        translations: formData.translations.map((item) =>
          item.id === translationForm.id ? translationForm : item,
        ),
      });
    } else {
      setFormData({
        ...formData,
        translations: [
          ...formData.translations,
          {
            ...translationForm,
            id: Date.now().toString(),
          },
        ],
      });
    }

    setTranslationForm({ id: "", translation: "", notes: "" });
  };

  const handleEditTranslation = (id: string) => {
    const match = formData.translations.find((item) => item.id === id);
    if (!match) return;

    setTranslationForm(match);
  };

  const handleDeleteTranslation = (id: string) => {
    const newTranslations = formData.translations.filter(
      (item) => item.id !== id,
    );
    setFormData({ ...formData, translations: newTranslations });
  };
  return (
    <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>{t("names.carousel.title", "Translations")}</h2>
      </div>

      <div className="flex flex-col my-6 gap-4">
        {!translationForm.id && formData.translations.length > 0 && (
          <div className="flex flex-col gap-4 w-full text-sm">
            {formData.translations.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-1 px-5 py-2 w-full border border-gray-txt-50/30 relative rounded-md group "
              >
                <span className="line-clamp-1 font-medium">
                  {item.translation}
                </span>
                <span>{item.notes}</span>

                <div className="flex md:hidden md:group-hover:flex gap-6 items-center bg-secondary-bg px-5 py-2 rounded-full absolute right-0 top-0">
                  <button
                    onClick={() => handleEditTranslation(item.id)}
                    className="cursor-pointer"
                    aria-label={t("names.form.editTranslationAria", "Edit translation")}
                  >
                    <PenBox />
                  </button>
                  <button
                    onClick={() => handleDeleteTranslation(item.id)}
                    className="cursor-pointer text-base-red"
                    aria-label={t("names.form.removeTranslationAria", "Remove translation")}
                  >
                    {" "}
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="translation">{t("names.form.translationLabel", "Translation")}</label>
          <input
            type="text"
            id="translation"
            placeholder={t("names.form.translationPlaceholder", "Enter the english translation of the name")}
            value={translationForm.translation}
            onChange={(e) =>
              setTranslationForm({
                ...translationForm,
                translation: e.target.value,
              })
            }
            className="input"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="notes">{t("names.form.notesLabel", "Notes (optional)")}</label>
          <textarea
            rows={3}
            id="notes"
            placeholder={t("names.form.notesPlaceholder", "Enter any notes about the translation")}
            value={translationForm.notes}
            onChange={(e) =>
              setTranslationForm({
                ...translationForm,
                notes: e.target.value,
              })
            }
            className="input"
          />
        </div>

        {translationForm.id && (
          <div className="flex w-full gap-4 items-center justify-between mt-3">
            <button
              className="secondary-btn w-fit"
              onClick={() =>
                setTranslationForm({ id: "", translation: "", notes: "" })
              }
            >
              {t("common.cancel", "Cancel")}
            </button>
            <button
              className="secondary-btn w-fit"
              onClick={handleAddTranslation}
            >
              {" "}
              {t("common.dictionary.editTranslation", "Update Translation")}
            </button>
          </div>
        )}

        {!translationForm.id && (
          <button
            className="secondary-btn flex items-center gap-2 w-fit my-3"
            onClick={handleAddTranslation}
          >
            <Plus strokeWidth={1.4} /> {t("common.addTranslation", "Add Translation")}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddTranslations;
