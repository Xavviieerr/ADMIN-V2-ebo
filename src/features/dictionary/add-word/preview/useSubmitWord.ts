import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateWordMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import { useAddWordWizard } from "../contexts/AddWordWizardContext";

export function useSubmitWord() {
  const { data, clearForm } = useAddWordWizard();
  const router = useRouter();
  const [createWord] = useCreateWordMutation();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const { image: _image, ...rest } = data;
    await runDictionaryMutation({
      run: async () => {
        const res = await createWord({
          ...rest,
          creationReason: rest.creationReason || "N/A",
        }).unwrap();
        clearForm();
        router.replace(`/guonopedia/dictionary/${res.data.data.id}`);
      },
      successMessage: "Success",
      errorMessage: "An error occured while creating word",
    });
    setSubmitting(false);
  };

  return { submitting, handleSubmit };
}
