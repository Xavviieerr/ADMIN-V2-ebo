"use client";

import { MultiInput } from "@/features/shared";
import React from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useAddPlaceDraft } from "./context";
import ImageField from "./image-field";
import { PLACE_TYPE_OPTIONS } from "../model/filter-options";

const BasicInfoForm = () => {
  const { basic: formData, setBasic: setFormData } = useAddPlaceDraft();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>Place Details</h2>
      </div>

      <div className="flex flex-col w-full mt-6 gap-4">
        {/* Name */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="name">{t("places.form.nameLabel", "Name")}</label>
          <input
            type="text"
            id="name"
            placeholder={t("places.form.namePh", "Enter the place's name")}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
          />
        </div>

        <MultiInput
          label="Alternative Spellings"
          placeholder="Enter alternative spellings of the place"
          values={formData.alternativeNames}
          removeValue={(value) =>
            setFormData({
              ...formData,
              alternativeNames: formData.alternativeNames.filter(
                (t) => t !== value,
              ),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              alternativeNames: [...formData.alternativeNames, value],
            })
          }
        />

        {/* Type — backend enum values are sent verbatim */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="type">{t("places.form.typeLabel", "Type")}</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            id="type"
            className="input h-12 capitalize"
          >
            <option value="" className="text-white bg-secondary-bg">
              {t("places.form.typeLabel", "Type")}
            </option>
            {PLACE_TYPE_OPTIONS.filter((option) => option.value !== "").map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="text-white bg-secondary-bg"
              >
                {t(option.labelKey ?? "", option.label)}
              </option>
            ))}
          </select>
        </div>

        {/* Founded On */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="dod">Founded on:</label>
          <input
            type="date"
            id="dod"
            value={formData.foundedOn}
            onChange={(e) =>
              setFormData({ ...formData, foundedOn: e.target.value })
            }
            className="input"
          />
        </div>

        {/* Founders */}
        <MultiInput
          label="Founders"
          placeholder="Enter the founders of the place"
          values={formData.founders}
          removeValue={(value) =>
            setFormData({
              ...formData,
              founders: formData.founders.filter((t) => t !== value),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              founders: [...formData.founders, value],
            })
          }
        />

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="ruler">Current Ruler</label>
          <input
            type="text"
            id="ruler"
            placeholder="Enter the name & title of the current ruler"
            value={formData.ruler}
            onChange={(e) =>
              setFormData({ ...formData, ruler: e.target.value })
            }
            className="input"
          />
        </div>

        <MultiInput
          label="Notable Figures"
          placeholder="Enter notable figures associated with this place"
          values={formData.figures}
          removeValue={(value) =>
            setFormData({
              ...formData,
              figures: formData.figures.filter((t) => t !== value),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              figures: [...formData.figures, value],
            })
          }
        />

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="summary">{t("places.form.descriptionLabel", "Description")}</label>
          <textarea
            id="summary"
            rows={4}
            placeholder={t("places.form.descriptionPh", "Enter a description (minimum 10 characters)")}
            value={formData.summary}
            onChange={(e) =>
              setFormData({ ...formData, summary: e.target.value })
            }
            className="input"
          />
        </div>

        <MultiInput
          label={t("places.form.tagsLabel", "Tags")}
          placeholder={t("places.form.tagsPh", "Enter a tag")}
          values={formData.tags}
          removeValue={(value) =>
            setFormData({
              ...formData,
              tags: formData.tags.filter((tag) => tag !== value),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              tags: [...formData.tags, value],
            })
          }
        />

        <ImageField
          label={t("places.form.coverLabel", "Cover image")}
          value={formData.coverImage}
          onChange={(value) => setFormData({ ...formData, coverImage: value as string })}
        />

        <ImageField
          label={t("places.form.imagesLabel", "Gallery images")}
          value={formData.images}
          multiple
          onChange={(value) => setFormData({ ...formData, images: value as string[] })}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
