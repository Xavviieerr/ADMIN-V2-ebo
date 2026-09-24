"use client";

import React from "react";
import { SingleWord } from "@/features/dictionary/lib";
import { BaseInput } from "@/features/shared";
import { ChevronLeft, Loader2 } from "lucide-react";
import {
  useCreateTranslationMutation,
  useUpdateTranslationMutation,
} from "@/slice/requestSlice";
import { useRouter } from "next/navigation";
import ExampleFields from "./shared/ExampleFields";
import FormMetaFields from "./shared/FormMetaFields";
import { LexicalFields } from "@/features/dictionary/shared";
import { useTranslationForm } from "./translation/useTranslationForm";
import { useTranslationLanguage } from "./translation/translationLanguage";
import { submitTranslationForm } from "./translation/translationSubmit";

const AddTranslationForm = ({
  selected,
  transIndex,
  type = "add",
  onClose,
}: {
  selected?: SingleWord["efaEng"][number];
  type?: "add" | "edit";
  transIndex?: number;
  onClose: () => void;
}) => {
  const router = useRouter();
  const { lang, pos, title, examplesTitle } = useTranslationLanguage();
  const { id, form, setForm } = useTranslationForm({
    type,
    selected,
    transIndex,
    lang,
  });

  const [createTranslation, { isLoading: isCreating }] =
    useCreateTranslationMutation();
  const [updateTranslation, { isLoading: isUpdating }] =
    useUpdateTranslationMutation();
  const loading = isCreating || isUpdating;

  if (type === "edit" && !selected) return null;

  const handleSubmit = async () => {
    await submitTranslationForm({
      type,
      id,
      form,
      createTranslation,
      updateTranslation,
      onClose,
      router,
    });
  };

  return (
    <div className="flex flex-col md:px-4 w-full shrink-0">
      <button
        onClick={onClose}
        className="flex items-center cursor-pointer hover:text-foreground-50 gap-3 text-base font-medium"
      >
        <ChevronLeft />
        <h2 className="capitalize">{title}</h2>
      </button>

      <div className="grid md:grid-cols-2 grid-cols-1 items-end w-full gap-4 mt-4">
        <BaseInput
          placeholder="Word translation"
          value={form.ota}
          setValue={(value) => setForm({ ...form, ota: value as string })}
        />

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
          title={examplesTitle}
          idje={form.idje}
          onChange={(idje) => setForm({ ...form, idje })}
        />
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onClose}
          className="secondary-btn mt-8 md:px-16 px-5 self-center"
          type="button"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="primary-btn mt-8 px-16 self-center"
          type="button"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default AddTranslationForm;
