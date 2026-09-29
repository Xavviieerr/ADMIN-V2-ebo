import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateWordMutation } from "@/slice/requestSlice";
import { getErrorMessage } from "@/utils/errorHandler";
import { useAddWordWizard } from "../contexts/AddWordWizardContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

type DuplicateInfo = {
  message: string;
  existingWordId?: string;
};

function getDuplicateInfo(error: unknown): DuplicateInfo | null {
  const err = error as {
    status?: number | string;
    data?: { message?: string | string[]; data?: { id?: string } };
  };
  const status = Number(err?.status);
  if (status !== 400 && status !== 409 && status !== 422) return null;

  const rawMessage = Array.isArray(err?.data?.message)
    ? err.data.message.join(", ")
    : (err?.data?.message ?? "");
  if (!/already exist/i.test(rawMessage)) return null;

  const existingWordId =
    typeof err?.data?.data?.id === "string" ? err.data.data.id : undefined;
  return { message: rawMessage, existingWordId };
}

export function useSubmitWord() {
  const { data, clearForm } = useAddWordWizard();
  const router = useRouter();
  const [createWord] = useCreateWordMutation();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [submitting, setSubmitting] = useState(false);
  const [duplicateError, setDuplicateError] = useState<DuplicateInfo | null>(
    null,
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    setDuplicateError(null);
    const { image, audio, ...rest } = data;
    try {
      await createWord({
        ...rest,
        creationReason: rest.creationReason || "N/A",
        omra: audio ? [audio] : [],
        oma: image ? [{ type: "photo", url: image }] : [],
      }).unwrap();
      toast.success(t("common.dictionary.createdSuccess", "Success"));
      clearForm();
      router.replace("/guonopedia/dictionary");
    } catch (error) {
      const duplicate = getDuplicateInfo(error);
      if (duplicate) {
        setDuplicateError({
          message: t(
            "common.dictionary.duplicateWord",
            duplicate.message || "Word already exist",
          ),
          existingWordId: duplicate.existingWordId,
        });
      } else {
        toast.error(
          getErrorMessage(
            error,
            t(
              "common.dictionary.createFailed",
              "An error occured while creating word",
            ),
          ),
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, handleSubmit, duplicateError, clearDuplicateError: () => setDuplicateError(null) };
}
