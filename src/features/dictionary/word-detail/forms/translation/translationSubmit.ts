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
}: {
  type: "add" | "edit";
  id: string;
  form: TranslationFormInitial;
  createTranslation: TranslationMutationTrigger;
  updateTranslation: TranslationMutationTrigger;
  onClose: () => void;
  router: { refresh: () => void };
}) {
  if (type == "edit") {
    await runDictionaryMutation({
      run: () =>
        updateTranslation({ wordId: id, translationData: form }).unwrap(),
      successMessage: "Word translation edited successfully!",
      errorMessage: "Failed to edit translation",
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
    successMessage: "Word translation added successfully!",
    errorMessage: "Failed to add translation",
    onSuccess: () => {
      onClose();
      router.refresh();
    },
  });
}
