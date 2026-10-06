"use client";

import React, { useState } from "react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import type { NameFormDataType } from "../model/types";
import { validateTranslationDraft, VALIDATION_EN } from "../model/validation";
import { addTranslation, removeTranslationUnavailable, updateTranslation } from "../api/translations";
import { getNamesErrorMessage } from "../api/errors";
import TranslationList, { type TranslationDraft } from "./TranslationList";
import TranslationDraftForm from "./TranslationDraftForm";

// Container: translation API orchestration for the edit flow.
// Presentation lives in TranslationList / TranslationDraftForm.
const EditTranslations = ({
  nameId,
  formData,
  setFormData,
}: {
  nameId: string;
  formData: NameFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<NameFormDataType>>;
}) => {
  const [addingTranslation, setAddingTranslation] = useState(false);
  const [updatingTranslation, setUpdatingTranslation] = useState(false);
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [translationForm, setTranslationForm] = useState<TranslationDraft>({
    id: "",
    translation: "",
    notes: "",
  });

  const addNewTranslation = async () => {
    setAddingTranslation(true);
    try {
      // Priority must be unique per targetLanguage (verified 409): use max+1,
      // not length+1, so concurrent/edited lists can't collide.
      const maxPriority = formData.translations.reduce(
        (max, item, index) => Math.max(max, index + 1),
        0,
      );
      const created = await addTranslation(
        nameId,
        {
          targetLanguage: "english",
          equivalentName: "",
          translatedMeaning: translationForm.translation,
          priority: maxPriority + 1,
          isPrimary: formData.translations.length === 0,
          notes: translationForm.notes,
        },
        tokenStorage.getAccessToken(),
      );

      // Adopt the SERVER-returned id — never fabricate one.
      setFormData((prev) => ({
        ...prev,
        translations: [
          ...prev.translations,
          { id: created.id, translation: created.translatedMeaning, notes: created.notes },
        ],
      }));
      toast.success(t("names.translation.addedSuccess", "Translation added successfully"));
      setTranslationForm({ id: "", translation: "", notes: "" });
    } catch (error) {
      toast.error(
        getNamesErrorMessage(error, t("common.anErrorOccurred", "An error occurred")),
      );
    } finally {
      setAddingTranslation(false);
    }
  };

  const updateExistingTranslation = async ({
    id,
    index,
  }: {
    id: string;
    index: number;
  }) => {
    setUpdatingTranslation(true);
    try {
      const updated = await updateTranslation(
        nameId,
        id,
        {
          targetLanguage: "english",
          equivalentName: "",
          translatedMeaning: translationForm.translation,
          priority: index + 1,
          isPrimary: index === 0,
          notes: translationForm.notes,
        },
        tokenStorage.getAccessToken(),
      );

      // Re-sync from the server-returned name: source of truth, not local echo.
      const serverMatch = (updated.translations ?? []).find((t) => t.id === id);
      setFormData((prev) => ({
        ...prev,
        translations: prev.translations.map((item) =>
          item.id === id
            ? {
                ...item,
                translation: serverMatch?.translatedMeaning ?? translationForm.translation,
                notes: serverMatch?.notes ?? translationForm.notes,
              }
            : item,
        ),
      }));
      toast.success(t("common.dictionary.translationEdited", "Translation updated successfully"));
      setTranslationForm({ id: "", translation: "", notes: "" });
    } catch (error) {
      toast.error(
        getNamesErrorMessage(error, t("common.anErrorOccurred", "An error occurred")),
      );
    } finally {
      setUpdatingTranslation(false);
    }
  };

  const handleAddTranslation = () => {
    const error = validateTranslationDraft(translationForm.translation);
    if (error) return toast.error(t(error, VALIDATION_EN[error] ?? error));

    addNewTranslation();
  };

  const handleUpdateTranslation = (id: string) => {
    const match = formData.translations.find((item) => item.id === id);
    const matchIndex = formData.translations.findIndex(
      (item) => item.id === id,
    );
    if (!match) return;

    if (
      translationForm.translation.trim() === match.translation.trim() &&
      translationForm.notes.trim() === match.notes.trim()
    ) {
      toast.info(t("names.moderation.noChangesUpdate", "No changes to update"));
      return setTranslationForm({ id: "", translation: "", notes: "" });
    }

    updateExistingTranslation({ id, index: matchIndex });
  };

  const handleEditTranslation = (id: string) => {
    const match = formData.translations.find((item) => item.id === id);
    if (!match) return;

    setTranslationForm(match);
  };

  const handleDeleteTranslation = () => {
    // No backend DELETE translation endpoint exists (verified on 3 path
    // variants). Never fake persistence: surface the gap explicitly so a
    // future endpoint slots into api/translations.ts without flow changes.
    try {
      removeTranslationUnavailable();
    } catch (error) {
      toast.info(
        getNamesErrorMessage(error, t("names.translation.unavailable", "Translation deletion is not available yet")),
      );
    }
  };

  return (
    <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>
          {translationForm.id
            ? t("common.dictionary.editTranslation", "Edit Translation")
            : t("names.carousel.title", "Translations")}
        </h2>
      </div>

      <div className="flex flex-col my-6 gap-4">
        {!translationForm.id && (
          <TranslationList
            translations={formData.translations}
            onEdit={handleEditTranslation}
            onDelete={handleDeleteTranslation}
          />
        )}

        <TranslationDraftForm
          draft={translationForm}
          onDraftChange={setTranslationForm}
          busy={addingTranslation || updatingTranslation}
          onAdd={handleAddTranslation}
          onUpdate={() => handleUpdateTranslation(translationForm.id)}
          onCancel={() => setTranslationForm({ id: "", translation: "", notes: "" })}
        />
      </div>
    </div>
  );
};

export default EditTranslations;
