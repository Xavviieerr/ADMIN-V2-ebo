import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import type { TranslationFormInitial } from "./useTranslationForm";

type TranslationMutationTrigger = (args: {
  wordId: string;
  translationData: unknown;
}) => { unwrap: () => Promise<unknown> };

export async function submitTranslationForm({
  type,
  id,
  form,
  createTranslation,
  updateTranslation,
  onClose,
  router,
  t,
}: {
  type: "add" | "edit";
  id: string;
  form: TranslationFormInitial;
  createTranslation: TranslationMutationTrigger;
  updateTranslation: TranslationMutationTrigger;
  onClose: () => void;
  router: { refresh: () => void };
  t: (key: string, fallback: string) => string;
}) {
  if (type == "edit") {
    await runDictionaryMutation({
      run: () =>
        updateTranslation({ wordId: id, translationData: form }).unwrap(),
      successMessage: t("common.dictionary.translationEdited", "Word translation edited successfully!"),
      errorMessage: t("common.dictionary.failedToEditTranslation", "Failed to edit translation"),
      onSuccess: () => {
        onClose();
        router.refresh();
      },
    });
    return;
  }

    await runDictionaryMutation({
      run: () =>
        createTranslation({ wordId: id, translationData: form }).unwrap(),
      successMessage: t("common.dictionary.translationAdded", "Word translation added successfully!"),
      errorMessage: t("common.dictionary.failedToAddTranslation", "Failed to add translation"),
    onSuccess: () => {
      onClose();
      router.refresh();
    },
  });
}
