"use client";
import { PenBox, Trash2, Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { NameFormDataType } from "@/features/shared";

const AddTranslations = ({
  formData,
  setFormData,
}: {
  formData: NameFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<NameFormDataType>>;
}) => {
  const [translationForm, setTranslationForm] = useState({
    id: "",
    translation: "",
    notes: "",
  });

  const handleAddTranslation = () => {
    if (translationForm.translation.trim() === "")
      return toast.error("Translation is required");

    if (translationForm.id) {
      setFormData({
        ...formData,
        translations: formData.translations.map((item) =>
          item.id === translationForm.id ? translationForm : item,
        ),
      });
    } else {
      setFormData({
        ...formData,
        translations: [
          ...formData.translations,
          {
            ...translationForm,
            id: Date.now().toString(),
          },
        ],
      });
    }

    setTranslationForm({ id: "", translation: "", notes: "" });
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
    setFormData({ ...formData, translations: newTranslations });
  };
  return (
    <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>Translations</h2>
      </div>

      <div className="flex flex-col my-6 gap-4">
        {!translationForm.id && formData.translations.length > 0 && (
          <div className="flex flex-col gap-4 w-full text-sm">
            {formData.translations.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-1 px-5 py-2 w-full border border-gray-txt-50/30 relative rounded-md group "
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
          <div className="flex w-full gap-4 items-center justify-between mt-3">
            <button
              className="secondary-btn w-fit"
              onClick={() =>
                setTranslationForm({ id: "", translation: "", notes: "" })
              }
            >
              Cancel
            </button>
            <button
              className="secondary-btn w-fit"
              onClick={handleAddTranslation}
            >
              {" "}
              Update Translation
            </button>
          </div>
        )}

        {!translationForm.id && (
          <button
            className="secondary-btn flex items-center gap-2 w-fit my-3"
            onClick={handleAddTranslation}
          >
            <Plus strokeWidth={1.4} /> Add Translation
          </button>
        )}
      </div>
    </div>
  );
};

export default AddTranslations;
