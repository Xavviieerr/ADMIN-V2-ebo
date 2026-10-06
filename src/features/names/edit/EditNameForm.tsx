"use client";
import React, { useEffect, useRef, useState } from "react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { NameFormDataType, SingleName } from "../model/types";
import { validateNameForm, VALIDATION_EN } from "../model/validation";
import { buildUpdatePayload } from "../model/payloads";
import { updateName } from "../api/names";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getNamesErrorMessage } from "../api/errors";
import EditNameDetails from "./edit-name-details";
import EditTranslations from "./edit-translations";
import EditNameComposition from "./edit-composition";
import EditOtherDetails from "./edit-other-details";

const EditNameForm = ({
  name,
  dialects,
}: {
  name: SingleName;
  dialects: { name: string; id: string }[];
}) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [formData, setFormData] = useState<NameFormDataType>({
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

  // Snapshot of the last hydrated/saved state: avoids sending empty or
  // unchanged PATCH bodies (verified 200 no-op server-side).
  const savedSnapshot = useRef<string>("");

  useEffect(() => {
    if (!name) return;

    const hydrated: NameFormDataType = {
      nameType: name.nameType,
      name: name.name,
      regionOfUse: name.regionOfUse,
      gender: name.gender,
      culturalSignificance: name.culturalSignificance,
      pronunciation: name.pronunciation,
      syllableCount: name.syllableCount,
      translations: (name.translations ?? []).map((translation) => {
        return {
          id: translation.id,
          translation: translation.translatedMeaning,
          notes: translation.notes,
        };
      }),

      abbreviations: name.abbreviations ?? [],

      notableBearers: name.notableBearers ?? [],
      alternativeSpellings: name.alternativeSpellings ?? [],
      relatedNames: name.relatedNames ?? [],
      nicknames: name.nicknames ?? [],
      nameComposition: name.nameComposition ?? [],
    };
    setFormData(hydrated);
    savedSnapshot.current = JSON.stringify({ ...hydrated, translations: [] });
  }, [name]);

  const [loading, setLoading] = useState(false);

  const updateDetails = async () => {
    // Main PATCH must never carry translations (verified 400) — enforced by
    // buildUpdatePayload's UpdateNameInput type.
    const payload = buildUpdatePayload(formData, name);
    if (JSON.stringify({ ...formData, translations: [] }) === savedSnapshot.current) {
      return toast.info(t("names.moderation.noChanges", "No changes to save"));
    }
    setLoading(true);
    try {
      const updated = await updateName(name.id, payload, tokenStorage.getAccessToken());
      savedSnapshot.current = JSON.stringify({ ...formData, translations: [] });
      toast.success(t("names.moderation.updatedSuccess", "Name updated successfully"));
      router.replace(`/guonopedia/names/${updated.id}`);
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
    updateDetails();
  };

  return (
    <div className="dark-box px-4 w-full pb-20">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-white font-medium text-lg">
          {t("names.form.editTitle", "Edit Name")}
        </h2>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.replace(`/guonopedia/names/${name.id}`)}
            disabled={loading}
            className="secondary-btn font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="primary-btn font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" /> : t("common.dictionary.saveChanges", "Save Changes")}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-6 mt-8">
        <div className="flex flex-col w-full gap-5">
          <EditNameDetails
            formData={formData}
            setFormData={setFormData}
            dialects={dialects}
          />

          <EditNameComposition formData={formData} setFormData={setFormData} />
        </div>

        <div className="flex flex-col w-full gap-5">
          <EditTranslations
            nameId={name.id}
            formData={formData}
            setFormData={setFormData}
          />

          <EditOtherDetails formData={formData} setFormData={setFormData} />
        </div>
      </div>
    </div>
  );
};

export default EditNameForm;
