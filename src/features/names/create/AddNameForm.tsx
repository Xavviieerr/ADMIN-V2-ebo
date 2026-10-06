"use client";
import React, { useState } from "react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AddOtherDetails from "./add-other-details";
import AddNameDetails from "./add-name-details";
import AddTranslations from "./add-translations";
import AddNameComposition from "./add-composition";
import { createName } from "../api/names";
import { getNamesErrorMessage } from "../api/errors";
import { validateNameForm, VALIDATION_EN } from "../model/validation";
import { buildCreatePayload } from "../model/payloads";
import type { NameFormDataType } from "../model/types";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const emptyForm = (): NameFormDataType => ({
  nameType: "given name",
  name: "",
  regionOfUse: "Agbarho",
  gender: "male",
  culturalSignificance: "",
  pronunciation: "",
  syllableCount: 1,
  nameComposition: [] as string[],
  translations: [] as {
    id: string;
    translation: string;
    notes: string;
  }[],
  abbreviations: [] as string[],
  notableBearers: [],
  alternativeSpellings: [],
  relatedNames: [],
  nicknames: [],
});

const AddNameForm = ({
  dialects,
}: {
  dialects: { name: string; id: string }[];
}) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [formData, setFormData] = useState<NameFormDataType>(emptyForm());

  const [loading, setLoading] = useState(false);

  const submitName = async () => {
    setLoading(true);
    try {
      // (targetLanguage + priority) must be unique (verified 409): priorities
      // are assigned in buildCreatePayload, never priority=1 for every row.
      const created = await createName(
        buildCreatePayload(formData),
        tokenStorage.getAccessToken(),
      );

      setFormData(emptyForm());
      toast.success(t("names.moderation.createdSuccess", "Name added successfully"));
      router.push(`/guonopedia/names/${created.id}`);
    } catch (error) {
      toast.error(
        getNamesErrorMessage(error, t("common.anErrorOccurred", "An error occurred")),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    const errors = validateNameForm(formData);
    if (errors.length > 0)
      return toast.error(t(errors[0], VALIDATION_EN[errors[0]] ?? errors[0]));
    submitName();
  };

  return (
    <div className="dark-box px-4 w-full pb-20">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-white font-medium text-lg">
          {t("names.form.addTitle", "Add a New Name")}
        </h2>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="primary-btn font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" /> : t("common.dictionary.submit", "Submit")}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-6 mt-8">
        <div className="flex flex-col w-full gap-5">
          <AddNameDetails
            formData={formData}
            setFormData={setFormData}
            dialects={dialects}
          />

          <AddNameComposition formData={formData} setFormData={setFormData} />
        </div>

        <div className="flex flex-col w-full gap-5">
          <AddTranslations formData={formData} setFormData={setFormData} />

          <AddOtherDetails formData={formData} setFormData={setFormData} />
        </div>
      </div>
    </div>
  );
};

export default AddNameForm;
