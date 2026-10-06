"use client";
import React from "react";
import { MultiInput } from "@/features/shared";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import type { NameFormDataType } from "../model/types";

const AddNameDetails = ({
  formData,
  setFormData,
  dialects,
}: {
  formData: NameFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<NameFormDataType>>;
  dialects: { name: string; id: string }[];
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  return (
    <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>{t("names.form.detailsHeading", "Name Details")}</h2>
      </div>

      <div className="flex flex-col w-full mt-6 gap-4">
        {/* Type */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="nameType">{t("names.form.typeLabel", "Type of name")}</label>
          <select
            value={formData.nameType}
            onChange={(e) =>
              setFormData({ ...formData, nameType: e.target.value })
            }
            id="nameType"
            className="input h-12 capitalize"
          >
            {[
              { key: "names.filter.firstNames", label: "given name", value: "given name" },
              { key: "names.filter.lastNames", label: "surname", value: "surname" },
              { key: "names.filter.nicknames", label: "nickname", value: "nickname" },
              { key: "names.form.otherOption", label: "other", value: "other" },
            ].map((nameType) => (
              <option
                key={nameType.value}
                value={nameType.value}
                className="text-white bg-secondary-bg capitalize"
              >
                {t(nameType.key, nameType.label)}
              </option>
            ))}
          </select>
        </div>

        {/*  Name */}
        <div className="flex flex-col gap-2 w-full my-2">
          <label htmlFor="firstName">{t("common.name", "Name")}</label>
          <input
            type="text"
            id="firstName"
            placeholder={t("names.form.namePlaceholder", "Enter the name in Urhobo")}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
          />
        </div>

        {/* Abbreviations */}
        <MultiInput
          label={t("names.form.abbreviationsLabel", "Abbreviations (optional)")}
          placeholder={t("names.form.abbreviationsPlaceholder", "Type an abbreviation to add to the name")}
          values={formData.abbreviations}
          removeValue={(value) =>
            setFormData({
              ...formData,
              abbreviations: formData.abbreviations.filter((t) => t !== value),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              abbreviations: [...formData.abbreviations, value],
            })
          }
        />

        {/* Dialect & Gender */}
        <div className="flex max-sm:flex-col sm:items-center gap-4 w-full">
          <div className="flex flex-col gap-2 w-full my-2">
            <label htmlFor="dialect">{t("common.dialect", "Dialect")}</label>
            <select
              value={formData.regionOfUse}
              onChange={(e) =>
                setFormData({ ...formData, regionOfUse: e.target.value })
              }
              id="dialect"
              className="input h-12 capitalize"
            >
              {dialects.map((dialect) => (
                <option
                  key={dialect.id}
                  value={dialect.name}
                  className="text-white bg-secondary-bg capitalize"
                >
                  {dialect.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="gender">{t("common.gender", "Gender")}</label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              id="gender"
              className="input h-12 capitalize"
            >
              {[
                { key: "common.male", label: "male", value: "male" },
                { key: "common.female", label: "female", value: "female" },
                { key: "names.form.neutralOption", label: "neutral", value: "neutral" },
              ].map((gender) => (
                <option
                  key={gender.value}
                  value={gender.value}
                  className="text-white bg-secondary-bg capitalize"
                >
                  {t(gender.key, gender.label)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Syllable & Pronunciation */}
        <div className="flex max-sm:flex-col sm:items-center gap-4 w-full">
          <div className="flex flex-col gap-2 w-full sm:w-2/3 my-2">
            <label htmlFor="pronunciation">
              {t("names.detail.pronunciationLabel", "Pronunciation")}
            </label>
            <input
              type="text"
              id="pronunciation"
              placeholder={t("names.form.pronunciationPlaceholder", "Enter the pronunciation")}
              value={formData.pronunciation}
              onChange={(e) =>
                setFormData({ ...formData, pronunciation: e.target.value })
              }
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-1/3 my-2">
            <label htmlFor="syllableCount">
              {t("names.detail.syllableCount", "Syllable")}{" "}
              <span className="max-md:hidden">{t("names.form.countSuffix", "Count")}</span>
            </label>
            <input
              type="number"
              id="syllableCount"
              min={0}
              placeholder={t("names.form.syllablePlaceholder", "Enter the syllable count")}
              value={formData.syllableCount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  syllableCount: Number(e.target.value),
                })
              }
              className="input"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="description">{t("names.form.descriptionLabel", "Description")}</label>
          <textarea
            rows={4}
            id="description"
            placeholder={t("names.form.descriptionPlaceholder", "Enter the description of the name")}
            value={formData.culturalSignificance}
            onChange={(e) =>
              setFormData({ ...formData, culturalSignificance: e.target.value })
            }
            className="input"
          />
        </div>
      </div>
    </div>
  );
};

export default AddNameDetails;
