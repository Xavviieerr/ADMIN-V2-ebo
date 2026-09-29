import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import type { SenseFormInitial } from "./useSenseForm";

type SenseMutationTrigger = (args: {
  wordId: string;
  senseData: unknown;
}) => { unwrap: () => Promise<unknown> };

export async function submitSenseForm({
  type,
  id,
  form,
  createSense,
  updateSense,
  onClose,
  router,
  t,
}: {
  type: "add" | "edit";
  id: string;
  form: SenseFormInitial;
  createSense: SenseMutationTrigger;
  updateSense: SenseMutationTrigger;
  onClose: () => void;
  router: { refresh: () => void };
  t: (key: string, fallback: string) => string;
}) {
  if (type == "edit") {
    await runDictionaryMutation({
      run: () => updateSense({ wordId: id, senseData: form }).unwrap(),
      successMessage: t("common.dictionary.senseEdited", "Word sense edited successfully!"),
      errorMessage: t("common.dictionary.failedToEditSense", "Failed to edit word sense"),
      onSuccess: () => {
        onClose();
        router.refresh();
      },
    });
    return;
  }

  await runDictionaryMutation({
    run: () => createSense({ wordId: id, senseData: form }).unwrap(),
    successMessage: t("common.dictionary.translationAdded", "Word translation added successfully!"),
    errorMessage: t("common.dictionary.failedToAddSense", "Failed to add word sense"),
    onSuccess: () => {
      onClose();
      router.refresh();
    },
  });
}
