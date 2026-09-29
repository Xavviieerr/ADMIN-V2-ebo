"use client";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SingleWord } from "@/features/dictionary/lib";
import {
  useCreateSenseMutation,
  useUpdateSenseMutation,
} from "@/slice/requestSlice";
import ExampleFields from "./shared/ExampleFields";
import FormMetaFields from "./shared/FormMetaFields";
import { LexicalFields } from "@/features/dictionary/shared";
import { useSenseForm } from "./sense/useSenseForm";
import { submitSenseForm } from "./sense/senseSubmit";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const AddEditSense = ({
  type = "add",
  selected,
  senseIndex,
  nextKere,
  onClose,
}: {
  type?: "add" | "edit";
  selected?: SingleWord["oho"][number];
  senseIndex?: number;
  nextKere?: number;
  onClose: () => void;
}) => {
  const router = useRouter();
  const { id, form, setForm, pos } = useSenseForm({
    type,
    selected,
    senseIndex,
    nextKere,
  });

  const [createSense, { isLoading: isCreating }] = useCreateSenseMutation();
  const [updateSense, { isLoading: isUpdating }] = useUpdateSenseMutation();
  const loading = isCreating || isUpdating;
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  if (type === "edit" && !selected) return null;

  const handleSubmit = async () => {
    await submitSenseForm({
      type,
      id,
      form,
      t,
      createSense,
      updateSense,
      onClose,
      router,
    });
  };

  return (
    <div className="flex flex-col md:px-4  w-full shrink-0">
      <button
        onClick={onClose}
        className="flex items-center cursor-pointer hover:text-foreground-50 gap-3 text-base font-medium"
      >
        <ChevronLeft />
        <h2 className="capitalize">{t(`common.dictionary.${type}Sense`, `${type} Sense`)}</h2>
      </button>

      <div className="grid md:grid-cols-2 grid-cols-1 items-end w-full gap-4 mt-4">
        <FormMetaFields
          values={form}
          onChange={(patch) => setForm({ ...form, ...patch })}
          posOptions={pos}
        />

        {/* Plurals, Synonyms, Antonyms, Related Words */}
        <LexicalFields
          values={form}
          onChange={(patch) => setForm({ ...form, ...patch })}
        />

        <hr className="border border-gray-txt-100/50 h-px my-4 md:col-span-2" />

        {/* Examples */}
        <ExampleFields
          title={t("common.dictionary.examples", "Examples")}
          idje={form.idje}
          onChange={(idje) => setForm({ ...form, idje })}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onClose}
          className="secondary-btn mt-8 md:px-16 px-5 self-center"
          type="button"
        >
          {t("common.cancel", "Cancel")}
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="primary-btn mt-8 px-8 md:px-16 self-center"
          type="button"
        >
          {loading ? <Loader2 className="animate-spin" /> : t("common.dictionary.saveChanges", "Save Changes")}
        </button>
      </div>
    </div>
  );
};

export default AddEditSense;
