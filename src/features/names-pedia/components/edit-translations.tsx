"use client";

import React, { useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";
import { NameFormDataType } from "@/features/shared";
import { PenBox, Trash2, Loader } from "lucide-react";

const EditTranslations = ({
  nameId,
  formData,
  setFormData,
}: {
  nameId: string;
  formData: NameFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<NameFormDataType>>;
}) => {
  const [addingTranslation, setAddingTranslation] = useState(false);
  const [updatingTranslation, setUpdatingTranslation] = useState(false);
  const token = getAccessToken();

  const [translationForm, setTranslationForm] = useState({
    id: "",
    translation: "",
    notes: "",
  });

  const addTranslation = async () => {
    setAddingTranslation(true);
    try {
      const url = `${BASE_URL}/names/${nameId}/translations`;
      const payload = {
        targetLanguage: "english",
        equivalentName: "",
        translatedMeaning: translationForm.translation,
        priority: formData.translations.length + 1,
        isPrimary: formData.translations.length === 0 ? true : false,
        notes: translationForm.notes,
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
        return toast.error(data.message ?? "An error occurred");
      }

      setFormData((prev) => ({
        ...prev,
        translations: [
          ...prev.translations,
          { ...translationForm, id: new Date().toISOString() },
        ],
      }));
      toast.success("Translation added successfully");
      setTranslationForm({ id: "", translation: "", notes: "" });
    } catch (error: any) {
      toast.error(error.message ?? "An error occurred");
    } finally {
      setAddingTranslation(false);
    }
  };

  const updateTranslation = async ({
    id,
    index,
  }: {
    id: string;
    index: number;
  }) => {
    setUpdatingTranslation(true);
    try {
      const url = `${BASE_URL}/names/${nameId}/translation/${id}`;
      const payload = {
        targetLanguage: "english",
        equivalentName: "",
        translatedMeaning: translationForm.translation,
        priority: 1,
        isPrimary: index === 0 ? true : false,
        notes: translationForm.notes,
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

      setFormData((prev) => ({
        ...prev,
        translations: prev.translations.map((item) =>
          item.id === translationForm.id
            ? { ...item, ...translationForm }
            : item,
        ),
      }));
      toast.success("Translation updated successfully");
      setTranslationForm({ id: "", translation: "", notes: "" });
    } catch (error: any) {
      toast.error(error.message ?? "An error occurred");
    } finally {
      setUpdatingTranslation(false);
    }
  };

  const handleAddTranslation = () => {
    if (translationForm.translation.trim() === "")
      return toast.error("Translation is required");

    addTranslation();
  };

  const handleUpdateTranslation = (id: string) => {
    const match = formData.translations.find((item) => item.id === id);
    const matchIndex = formData.translations.findIndex(
      (item) => item.id === id,
    );
    if (!match) return;

    if (
      translationForm.translation.trim() === match.translation.trim() &&
      translationForm.notes.trim() === match.notes.trim()
    )
      return setTranslationForm({ id: "", translation: "", notes: "" });

    updateTranslation({ id, index: matchIndex });
  };

  const handleEditTranslation = (id: string) => {
    const match = formData.translations.find((item) => item.id === id);
    if (!match) return;

    setTranslationForm(match);
  };

  const handleDeleteTranslation = (id: string) => {
    const newTranslations = formData.translations.filter(
      (item, idx) => item.id !== id,
    );
    setFormData((prev) => ({ ...prev, translations: newTranslations }));
  };

  return (
    <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>{translationForm.id ? "Edit Translation" : "Translations"}</h2>
      </div>

      <div className="flex flex-col my-6 gap-4">
        {!translationForm.id && formData.translations.length > 0 && (
          <div className="flex lg:flex-col max-md:overflow-x-scroll gap-4 w-full text-sm">
            {formData.translations.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col shrink-0 gap-1 md:px-5 px-3 py-2 w-[90%] md:w-full border border-gray-txt-50/30 relative rounded-md group "
              >
                <span className="line-clamp-1 font-medium">
                  {item.translation}
                </span>
                <span>{item.notes}</span>

                <div className="group-hover:flex hidden gap-6 items-center bg-secondary-bg px-5 py-2 rounded-full absolute right-0 top-0">
                  <button
                    onClick={() => handleEditTranslation(item.id)}
                    className="cursor-pointer"
                  >
                    <PenBox />
                  </button>
                  <button
                    onClick={() => handleDeleteTranslation(item.id)}
                    className="cursor-pointer text-base-red"
                  >
                    {" "}
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="translation">Translation</label>
          <input
            type="text"
            id="translation"
            maxLength={50}
            placeholder="Enter the english translation of the name"
            value={translationForm.translation}
            onChange={(e) =>
              setTranslationForm({
                ...translationForm,
                translation: e.target.value,
              })
            }
            className="input"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            rows={3}
            id="notes"
            maxLength={500}
            placeholder="Enter any notes about the translation"
            value={translationForm.notes}
            onChange={(e) =>
              setTranslationForm({
                ...translationForm,
                notes: e.target.value,
              })
            }
            className="input"
          />
        </div>

        {translationForm.id && (
          <div className="flex w-full gap-4 items-center justify-between">
            <button
              className="secondary-btn flex items-center gap-2 w-fit my-3"
              onClick={() =>
                setTranslationForm({ id: "", translation: "", notes: "" })
              }
              disabled={updatingTranslation}
            >
              Cancel
            </button>

            <button
              className="secondary-btn flex items-center gap-2 w-fit my-3"
              onClick={() => handleUpdateTranslation(translationForm.id)}
              disabled={updatingTranslation}
            >
              {updatingTranslation ? <Loader /> : "Update Translation"}
            </button>
          </div>
        )}

        {!translationForm.id && (
          <button
            className="secondary-btn flex items-center gap-2 w-fit my-3"
            onClick={handleAddTranslation}
            disabled={addingTranslation}
          >
            {addingTranslation ? <Loader /> : "Add Translation"}
          </button>
        )}
      </div>
    </div>
  );
};

export default EditTranslations;
