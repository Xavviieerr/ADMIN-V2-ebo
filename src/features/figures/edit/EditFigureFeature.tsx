"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { GoBackButton, LocaleWrapper } from "@/features/shared";
import type { FigureDetail } from "../model/types";
import { updateFigure } from "../api/figures";
import { getFigureErrorMessage } from "../api/errors";
import { validateFigureBasic } from "../model/validation";
import { FIGURE_GENDER_OPTIONS, FIGURE_OCCUPATION_OPTIONS } from "../model/filter-options";
import StagedImageField from "../create/StagedImageField";

const EditFigureFeature: React.FC<{ initial: FigureDetail }> = ({ initial }) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [fullName, setFullName] = useState(initial.fullName ?? "");
  const [shortBio, setShortBio] = useState(initial.shortBio ?? "");
  const [introBio, setIntroBio] = useState(initial.introBio ?? "");
  const [occupation, setOccupation] = useState(initial.occupation ?? "");
  const [gender, setGender] = useState(initial.gender ?? "male");
  const [dateOfBirth, setDateOfBirth] = useState(initial.dateOfBirth ?? "");
  const [dateOfDeath, setDateOfDeath] = useState(initial.dateOfDeath ?? "");
  const [nationality, setNationality] = useState(initial.nationality ?? "");
  const [ethnicity, setEthnicity] = useState(initial.ethnicity ?? "");
  const [placeOfBirth, setPlaceOfBirth] = useState(initial.placeOfBirth ?? "");
  const [profilePhoto, setProfilePhoto] = useState(initial.profilePhoto ?? "");
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(() => {
    return (
      fullName !== (initial.fullName ?? "") ||
      shortBio !== (initial.shortBio ?? "") ||
      introBio !== (initial.introBio ?? "") ||
      occupation !== (initial.occupation ?? "") ||
      gender !== (initial.gender ?? "male") ||
      (dateOfBirth || "") !== (initial.dateOfBirth ?? "") ||
      (dateOfDeath || "") !== (initial.dateOfDeath ?? "") ||
      nationality !== (initial.nationality ?? "") ||
      ethnicity !== (initial.ethnicity ?? "") ||
      placeOfBirth !== (initial.placeOfBirth ?? "") ||
      profilePhoto !== (initial.profilePhoto ?? "")
    );
  }, [fullName, shortBio, introBio, occupation, gender, dateOfBirth, dateOfDeath, nationality, ethnicity, placeOfBirth, profilePhoto, initial]);

  const save = async () => {
    const errors = validateFigureBasic({ fullName, shortBio, introBio, occupation, gender, dateOfBirth, dateOfDeath });
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error(t(firstError, "Please fill in all required fields"));
      return;
    }
    if (!dirty) {
      toast.success(t("figures.form.updatedSuccess", "Figure updated successfully"));
      router.push(`/guonopedia/figures/${initial.id}`);
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, string | null> = {
        fullName: fullName.trim(),
        shortBio: shortBio.trim(),
        introBio: introBio.trim(),
        occupation: occupation.trim(),
      };
      if (gender) payload.gender = gender;
      if (dateOfBirth.trim()) payload.dateOfBirth = dateOfBirth.trim();
      if (dateOfDeath.trim()) payload.dateOfDeath = dateOfDeath.trim();
      if (nationality.trim()) payload.nationality = nationality.trim();
      if (ethnicity.trim()) payload.ethnicity = ethnicity.trim();
      if (placeOfBirth.trim()) payload.placeOfBirth = placeOfBirth.trim();
      if (profilePhoto.trim()) payload.profilePhoto = profilePhoto.trim();
      await updateFigure(initial.id, payload, tokenStorage.getAccessToken());
      toast.success(t("figures.form.updatedSuccess", "Figure updated successfully"));
      router.push(`/guonopedia/figures/${initial.id}`);
      router.refresh();
    } catch (error) {
      toast.error(getFigureErrorMessage(error, t("figures.form.updateFailed", "Failed to update figure")));
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "input w-full";
  const labelCls = "text-sm font-medium";

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white pb-20 font-plus-sans">
      <GoBackButton link={`/guonopedia/figures/${initial.id}`} />
      <div className="dark-box px-4 w-full space-y-6 pb-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold">
          <LocaleWrapper item="figures.form.basicInfoTitle" fallback="Figure Details" />
        </h1>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-fullname" className={labelCls}>{t("figures.form.fullNameLabel", "Full name")}</label>
            <input id="edit-fullname" className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-occupation" className={labelCls}>{t("figures.form.occupationLabel", "Occupation")}</label>
            <select id="edit-occupation" className={inputCls} value={occupation} onChange={(e) => setOccupation(e.target.value)}>
              <option value="">—</option>
              {FIGURE_OCCUPATION_OPTIONS.filter((o) => o.value).map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="edit-shortbio" className={labelCls}>{t("figures.form.shortBioLabel", "Short bio")}</label>
            <textarea id="edit-shortbio" className={`${inputCls} min-h-20 custom-scrollbar`} value={shortBio} onChange={(e) => setShortBio(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="edit-intro" className={labelCls}>{t("figures.form.introBioLabel", "Introduction")}</label>
            <textarea id="edit-intro" className={`${inputCls} min-h-24 custom-scrollbar`} value={introBio} onChange={(e) => setIntroBio(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-gender" className={labelCls}>{t("figures.form.genderLabel", "Gender")}</label>
            <select id="edit-gender" className={inputCls} value={gender} onChange={(e) => setGender(e.target.value)}>
              {FIGURE_GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-dob" className={labelCls}>{t("figures.form.dobLabel", "Date of birth")}</label>
            <input id="edit-dob" className={inputCls} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-dod" className={labelCls}>{t("figures.form.dodLabel", "Date of death")}</label>
            <input id="edit-dod" className={inputCls} value={dateOfDeath} onChange={(e) => setDateOfDeath(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-pob" className={labelCls}>{t("figures.form.pobLabel", "Place of birth")}</label>
            <input id="edit-pob" className={inputCls} value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-nationality" className={labelCls}>{t("figures.form.nationalityLabel", "Nationality")}</label>
            <input id="edit-nationality" className={inputCls} value={nationality} onChange={(e) => setNationality(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-ethnicity" className={labelCls}>{t("figures.form.ethnicityLabel", "Ethnicity")}</label>
            <input id="edit-ethnicity" className={inputCls} value={ethnicity} onChange={(e) => setEthnicity(e.target.value)} />
          </div>
        </div>

        <StagedImageField label={t("figures.form.photoLabel", "Profile photo")} value={profilePhoto} onChange={setProfilePhoto} />

        <div className="flex max-sm:flex-col gap-4">
          <button type="button" onClick={() => router.back()} className="secondary-btn">
            {t("common.cancel", "Cancel")}
          </button>
          <button type="button" onClick={save} disabled={saving} className="primary-btn flex-1 flex justify-center">
            {saving ? t("common.saving", "Saving…") : t("figures.form.saveChanges", "Save Changes")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFigureFeature;
