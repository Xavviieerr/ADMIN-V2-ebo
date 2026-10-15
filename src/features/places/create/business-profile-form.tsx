"use client";

import { BaseInput } from "@/features/shared";
import React from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useAddPlaceDraft, type PlaceProfileDraft } from "./context";
import ImageField from "./image-field";
import { BUSINESS_CATEGORY_OPTIONS, WEEK_DAYS } from "../model/filter-options";

const emptyProfile = (): PlaceProfileDraft => ({
  phoneNumber: "",
  email: "",
  website: "",
  category: "",
  logo: "",
  openingHours: {},
});

// Optional business-profile block. Rendered only for type === "business".
// Profiles start unclaimed; claiming happens through ownership claims, never
// as part of creation. Empty email/website are omitted at submit time
// because the backend rejects empty strings for them.
const BusinessProfileForm = () => {
  const { basic, profile, setProfile } = useAddPlaceDraft();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  if (basic.type !== "business") return null;

  if (!profile) {
    return (
      <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>{t("places.form.profileTitle", "Business Profile (optional)")}</h2>
        </div>
        <p className="text-sm mt-2 text-gray-txt-50">
          {t(
            "places.form.profileHint",
            "Only for business places. The profile starts unclaimed; claiming happens through ownership claims.",
          )}
        </p>
        <button
          type="button"
          onClick={() => setProfile(emptyProfile())}
          className="secondary-btn w-fit mt-5"
        >
          {t("places.form.profileTitle", "Business Profile (optional)")}
        </button>
      </div>
    );
  }

  const set = (patch: Partial<PlaceProfileDraft>) =>
    setProfile((prev) => (prev ? { ...prev, ...patch } : prev));

  const setDay = (day: string, patch: { open?: string; close?: string; closed?: boolean }) =>
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        openingHours: { ...prev.openingHours, [day]: { ...prev.openingHours[day], ...patch } },
      };
    });

  const clearDay = (day: string) =>
    setProfile((prev) => {
      if (!prev) return prev;
      const openingHours = { ...prev.openingHours };
      delete openingHours[day];
      return { ...prev, openingHours };
    });

  return (
    <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>{t("places.form.profileTitle", "Business Profile (optional)")}</h2>
        </div>
        <button
          type="button"
          onClick={() => setProfile(null)}
          className="text-xs text-gray-400 hover:text-gray-200 underline cursor-pointer"
        >
          {t("common.remove", "Remove")}
        </button>
      </div>

      <div className="flex flex-col w-full mt-6 gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="profile-category">{t("places.form.categoryLabel", "Category")} *</label>
          <select
            id="profile-category"
            value={profile.category}
            onChange={(e) => set({ category: e.target.value })}
            className="input h-12"
          >
            <option value="" className="text-white bg-secondary-bg">
              {t("places.form.categoryLabel", "Category")}
            </option>
            {BUSINESS_CATEGORY_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="text-white bg-secondary-bg"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <BaseInput
          label={t("places.form.phoneLabel", "Phone number")}
          placeholder={t("places.form.phonePh", "Enter the phone number")}
          value={profile.phoneNumber}
          setValue={(v) => set({ phoneNumber: v as string })}
        />

        <BaseInput
          label={t("places.form.emailLabel", "Email")}
          placeholder={t("places.form.emailPh", "Enter the business email")}
          value={profile.email}
          setValue={(v) => set({ email: v as string })}
        />

        <BaseInput
          label={t("places.form.websiteLabel", "Website")}
          placeholder={t("places.form.websitePh", "https://example.com")}
          value={profile.website}
          setValue={(v) => set({ website: v as string })}
        />

        <ImageField
          label={t("places.form.logoLabel", "Logo")}
          value={profile.logo}
          onChange={(v) => set({ logo: v as string })}
        />

        <div className="flex flex-col gap-3 w-full">
          <p className="text-sm font-medium">{t("places.form.hoursTitle", "Opening hours")}</p>
          {WEEK_DAYS.map((day) => {
            const hours = profile.openingHours[day];
            const isClosed = hours?.closed === true;
            return (
              <div key={day} className="flex max-md:flex-col md:items-center gap-2 w-full">
                <p className="capitalize w-24 shrink-0 text-sm">{day}</p>
                <label className="flex items-center gap-2 text-xs whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={isClosed}
                    onChange={(e) => setDay(day, { closed: e.target.checked })}
                    className="w-4 h-4"
                  />
                  {t("places.form.dayClosed", "Closed")}
                </label>
                {!isClosed && (
                  <>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={t("places.form.openPh", "09:00")}
                      value={hours?.open ?? ""}
                      onChange={(e) => setDay(day, { open: e.target.value })}
                      className="input py-2"
                      aria-label={`${day} opening time`}
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={t("places.form.closePh", "17:00")}
                      value={hours?.close ?? ""}
                      onChange={(e) => setDay(day, { close: e.target.value })}
                      className="input py-2"
                      aria-label={`${day} closing time`}
                    />
                    {(hours?.open || hours?.close) && (
                      <button
                        type="button"
                        onClick={() => clearDay(day)}
                        className="text-xs text-gray-400 hover:text-gray-200 underline shrink-0 cursor-pointer"
                      >
                        {t("common.clear", "Clear")}
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileForm;
