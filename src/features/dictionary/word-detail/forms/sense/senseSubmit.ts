import { runDictionaryMutation } from "@/features/dictionary/hooks/runDictionaryMutation";
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
}: {
  type: "add" | "edit";
  id: string;
  form: SenseFormInitial;
  createSense: SenseMutationTrigger;
  updateSense: SenseMutationTrigger;
  onClose: () => void;
  router: { refresh: () => void };
}) {
  if (type == "edit") {
    await runDictionaryMutation({
      run: () => updateSense({ wordId: id, senseData: form }).unwrap(),
      successMessage: "Word sense edited successfully!",
      errorMessage: "Failed to edit word sense",
      onSuccess: () => {
        onClose();
        router.refresh();
      },
    });
    return;
  }

  await runDictionaryMutation({
    run: () => createSense({ wordId: id, senseData: form }).unwrap(),
    successMessage: "Word translation added successfully!",
    errorMessage: "Failed to add word sense",
    onSuccess: () => {
      onClose();
      router.refresh();
    },
  });
}
