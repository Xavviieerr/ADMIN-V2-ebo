"use client";
import React, { useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { Loader } from "lucide-react";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AddOtherDetails from "./add-other-details";
import AddNameDetails from "./add-name-details";
import AddTranslations from "./add-translations";
import { NameFormDataType } from "@/features/shared";
import AddNameComposition from "./add-composition";

const payload_extras = {
  pronunciation: "",
  meaning: "",
  syllableCount: 0,
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

const AddNameForm = ({
  dialects,
}: {
  dialects: { name: string; id: string }[];
}) => {
  const router = useRouter();

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

  const [loading, setLoading] = useState(false);
  const token = getAccessToken();

  const submitName = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/names`;

      const payload = {
        ...payload_extras,
        ...formData,
        translations:
          formData.translations.length > 0
            ? formData.translations.map((item, index) => {
                return {
                  targetLanguage: "english",
                  equivalentName: "",
                  translatedMeaning: item.translation,
                  priority: 1,
                  isPrimary: index == 0 ? true : false,
                  notes: item.notes,
                };
              })
            : [],
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        return toast.error(data.message);
      }

      setFormData({
        nameType: "",
        name: "",
        regionOfUse: "",
        gender: "",
        culturalSignificance: "",
        pronunciation: "",
        syllableCount: 0,
        translations: [],

        abbreviations: [],

        notableBearers: [],
        alternativeSpellings: [],
        relatedNames: [],
        nicknames: [],
        nameComposition: [],
      });
      toast.success("Name added successfully");
      const data = await res.json();
      router.push(`/guonopedia/names/${data.data.id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (formData.gender.trim() === "") return toast.error("Gender is required");
    if (formData.culturalSignificance.trim() === "")
      return toast.error("Description is required");
    if (formData.regionOfUse.trim() === "")
      return toast.error("Dialect is required");
    if (formData.nameComposition.length === 0)
      return toast.error("Composition is required");

    if (formData.translations.length === 0)
      return toast.error("Translations are required");
    submitName();
  };

  return (
    <div className="dark-box px-4 w-full pb-20">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-white font-medium text-lg">Add a New Name</h2>

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
