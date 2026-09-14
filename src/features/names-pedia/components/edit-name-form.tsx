"use client";
import React, { useEffect, useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { Loader, PenBox, Plus, Trash2, X } from "lucide-react";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NameFormDataType, SingleName } from "@/features/shared";
import EditNameDetails from "./edit-name-details";
import EditTranslations from "./edit-translations";
import EditNameComposition from "./edit-composition";
import EditOtherDetails from "./edit-other-details";

const payload_extras = {
  meaning: "",
  nameOriginStory: "",
  popularityRank: 0,
  historicalUsage: "",
  modernUsage: "",
  astrologicalAssociations: [],
  commonMisspellings: [],
  linguisticNotes: "",
  culturalNotes: "",
  otherNotes: "",
};

const EditNameForm = ({
  name,
  dialects,
}: {
  name: SingleName;
  dialects: { name: string; id: string }[];
}) => {
  const router = useRouter();
  const token = getAccessToken();

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

  useEffect(() => {
    if (!name) return;

    setFormData({
      nameType: name.nameType,
      name: name.name,
      regionOfUse: name.regionOfUse,
      gender: name.gender,
      culturalSignificance: name.culturalSignificance,
      pronunciation: name.pronunciation,
      syllableCount: name.syllableCount,
      translations: name.translations.map((translation) => {
        return {
          id: translation.id,
          translation: translation.translatedMeaning,
          notes: translation.notes,
        };
      }),

      abbreviations: name.abbreviations,

      notableBearers: name.notableBearers,
      alternativeSpellings: name.alternativeSpellings,
      relatedNames: name.relatedNames,
      nicknames: name.nicknames,
      nameComposition: name.nameComposition,
    });
  }, [name]);

  const [loading, setLoading] = useState(false);

  const updateDetails = async () => {
    setLoading(true);
    const { translations, ...rest } = formData;
    try {
      const url = `${BASE_URL}/names/${name.id}`;
      const payload = {
        ...payload_extras,
        ...rest,
      };
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        return toast.error(data.message ?? "An error occurred");
      }

      toast.success("Name updated successfully");
      router.replace(`/guonopedia/names/${name.id}`);
    } catch (error: any) {
      toast.error(error.message ?? "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (formData.nameType.trim() === "")
      return toast.error("Name type is required");
    if (formData.name.trim() === "") return toast.error("Name is required");
    if (formData.regionOfUse.trim() === "")
      return toast.error("Dialect is required");
    if (formData.gender.trim() === "") return toast.error("Gender is required");
    if (formData.culturalSignificance.trim() === "")
      return toast.error("Description is required");

    if (formData.translations.length === 0)
      return toast.error("Translations are required");
    updateDetails();
  };

  return (
    <div className="dark-box px-4 w-full pb-20">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-white font-medium text-lg">Update Name</h2>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="primary-btn font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" /> : "Submit"}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-6  mt-8">
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
