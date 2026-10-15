"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { GoBackButton, LocaleWrapper, PermissionGate } from "@/features/shared";
import { createFigure } from "../api/figures";
import { getFigureErrorMessage } from "../api/errors";
import { buildFigureCreatePayload } from "../model/payload";
import { validateFigureBasic } from "../model/validation";
import { FIGURE_GENDER_OPTIONS, FIGURE_OCCUPATION_OPTIONS } from "../model/filter-options";
import StagedImageField from "./StagedImageField";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `local-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

type BioEntry = { id: string; title: string; content: string };
type FamilyEntry = { id: string; name: string; relationship: string };
type LinkEntry = { id: string; title: string; type: string; url: string };

const DRAFT_KEY = "figure_create_draft_v1";

function loadDraft(): Record<string, string> {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return parsed as Record<string, string>;
    return {};
  } catch {
    return {};
  }
}

const AddFigureFeature: React.FC = () => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [draft] = useState<Record<string, string>>(() =>
    typeof window === "undefined" ? {} : loadDraft(),
  );
  const [fullName, setFullName] = useState(draft.fullName ?? "");
  const [shortBio, setShortBio] = useState(draft.shortBio ?? "");
  const [introBio, setIntroBio] = useState(draft.introBio ?? "");
  const [occupation, setOccupation] = useState(draft.occupation ?? "");
  const [gender, setGender] = useState(draft.gender ?? "male");
  const [dateOfBirth, setDateOfBirth] = useState(draft.dateOfBirth ?? "");
  const [dateOfDeath, setDateOfDeath] = useState(draft.dateOfDeath ?? "");
  const [nationality, setNationality] = useState(draft.nationality ?? "");
  const [ethnicity, setEthnicity] = useState(draft.ethnicity ?? "");
  const [placeOfBirth, setPlaceOfBirth] = useState(draft.placeOfBirth ?? "");
  const [profilePhoto, setProfilePhoto] = useState(draft.profilePhoto ?? "");
  const [bioEntries, setBioEntries] = useState<BioEntry[]>([]);
  const [family, setFamily] = useState<FamilyEntry[]>([]);
  const [links, setLinks] = useState<LinkEntry[]>([]);
  const [saving, setSaving] = useState(false);

  const persistDraft = (patch: Record<string, string>) => {
    try {
      const current = loadDraft();
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...current, ...patch }));
    } catch {
      // storage full/blocked — form state still holds values
    }
  };

  const submit = async () => {
    const errors = validateFigureBasic({ fullName, shortBio, introBio, occupation, gender, dateOfBirth, dateOfDeath });
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error(t(firstError, "Please fill in all required fields"));
      return;
    }
    if (bioEntries.length === 0) {
      toast.error(t("figures.validation.bioRequired", "Add at least one biography entry"));
      return;
    }
    setSaving(true);
    try {
      const payload = buildFigureCreatePayload({
        fullName,
        shortBio,
        introBio,
        occupation,
        gender,
        nationality,
        ethnicity,
        placeOfBirth,
        dateOfBirth: dateOfBirth || null,
        dateOfDeath: dateOfDeath || null,
        profilePhoto,
      });
      if (bioEntries.length > 0) {
        payload.biography = [
          {
            title: "biography",
            overview: "n/a",
            order: 1,
            entries: bioEntries.map((e, i) => ({ title: e.title, content: e.content, order: i + 1 })),
          },
        ];
      }
      if (family.length > 0) {
        payload.family = family.map((f) => ({ name: f.name, relationship: f.relationship }));
      }
      if (links.length > 0) {
        payload.externalLinks = links.map((l) => ({ title: l.title, type: l.type, url: l.url || null }));
      }
      const created = await createFigure(payload, tokenStorage.getAccessToken());
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      toast.success(t("figures.form.addedSuccess", "Figure created successfully!"));
      router.push(`/guonopedia/figures/${created.id}`);
    } catch (error) {
      toast.error(getFigureErrorMessage(error, t("figures.form.addFailed", "Failed to create figure")));
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "input w-full";
  const labelCls = "text-sm font-medium flex items-center gap-1";

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white pb-20 font-plus-sans">
      <GoBackButton link="/guonopedia/figures" />
      <div className="dark-box px-4 w-full space-y-6 pb-10 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-semibold">
            <LocaleWrapper item="figures.newFigureTitle" fallback="New Figure" />
          </h1>
          <p className="text-sm text-gray-400">
            <LocaleWrapper item="figures.manageFigures" fallback="Manage important figures on the platform." />
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="fig-fullname" className={labelCls}>
              {t("figures.form.fullNameLabel", "Full name")} <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <input
              id="fig-fullname"
              className={inputCls}
              placeholder={t("figures.form.fullNamePh", "Enter the figure's full name")}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                persistDraft({ fullName: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fig-occupation" className={labelCls}>
              {t("figures.form.occupationLabel", "Occupation")} <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <select
              id="fig-occupation"
              className={inputCls}
              value={occupation}
              onChange={(e) => {
                setOccupation(e.target.value);
                persistDraft({ occupation: e.target.value });
              }}
            >
              <option value="">—</option>
              {FIGURE_OCCUPATION_OPTIONS.filter((o) => o.value).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.labelKey ? t(o.labelKey, o.label) : o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="fig-shortbio" className={labelCls}>
              {t("figures.form.shortBioLabel", "Short bio")} <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <textarea
              id="fig-shortbio"
              className={`${inputCls} min-h-20 custom-scrollbar`}
              placeholder={t("figures.form.shortBioPh", "Enter a short bio")}
              value={shortBio}
              onChange={(e) => {
                setShortBio(e.target.value);
                persistDraft({ shortBio: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="fig-intro" className={labelCls}>
              {t("figures.form.introBioLabel", "Introduction")} <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <textarea
              id="fig-intro"
              className={`${inputCls} min-h-24 custom-scrollbar`}
              placeholder={t("figures.form.introBioPh", "Enter an introduction")}
              value={introBio}
              onChange={(e) => {
                setIntroBio(e.target.value);
                persistDraft({ introBio: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fig-gender" className={labelCls}>
              {t("figures.form.genderLabel", "Gender")}
            </label>
            <select
              id="fig-gender"
              className={inputCls}
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                persistDraft({ gender: e.target.value });
              }}
            >
              {FIGURE_GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fig-dob" className={labelCls}>
              {t("figures.form.dobLabel", "Date of birth")}
            </label>
            <input
              id="fig-dob"
              className={inputCls}
              placeholder={t("figures.form.dobPh", "YYYY-MM-DD or BC date")}
              value={dateOfBirth}
              onChange={(e) => {
                setDateOfBirth(e.target.value);
                persistDraft({ dateOfBirth: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fig-dod" className={labelCls}>
              {t("figures.form.dodLabel", "Date of death")}
            </label>
            <input
              id="fig-dod"
              className={inputCls}
              placeholder={t("figures.form.dobPh", "YYYY-MM-DD or BC date")}
              value={dateOfDeath}
              onChange={(e) => setDateOfDeath(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fig-pob" className={labelCls}>
              {t("figures.form.pobLabel", "Place of birth")}
            </label>
            <input
              id="fig-pob"
              className={inputCls}
              placeholder={t("figures.form.pobPh", "Enter place of birth")}
              value={placeOfBirth}
              onChange={(e) => setPlaceOfBirth(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fig-nationality" className={labelCls}>
              {t("figures.form.nationalityLabel", "Nationality")}
            </label>
            <input
              id="fig-nationality"
              className={inputCls}
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fig-ethnicity" className={labelCls}>
              {t("figures.form.ethnicityLabel", "Ethnicity")}
            </label>
            <input
              id="fig-ethnicity"
              className={inputCls}
              value={ethnicity}
              onChange={(e) => setEthnicity(e.target.value)}
            />
          </div>
        </div>

        <StagedImageField label={t("figures.form.photoLabel", "Profile photo")} value={profilePhoto} onChange={(url) => { setProfilePhoto(url); persistDraft({ profilePhoto: url }); }} />

        <BioEditor entries={bioEntries} onChange={setBioEntries} />
        <FamilyEditor entries={family} onChange={setFamily} />
        <LinksEditor entries={links} onChange={setLinks} />

        <PermissionGate permission="create_figure">
          <div className="flex max-sm:flex-col gap-4">
            <button type="button" onClick={() => router.back()} className="secondary-btn">
              {t("common.cancel", "Cancel")}
            </button>
            <button type="button" onClick={submit} disabled={saving} className="primary-btn flex-1 flex justify-center">
              {saving ? t("common.saving", "Saving…") : t("figures.form.submitFigure", "Submit Figure")}
            </button>
          </div>
        </PermissionGate>
      </div>
    </div>
  );
};

function BioEditor({ entries, onChange }: { entries: BioEntry[]; onChange: (v: BioEntry[]) => void }) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  return (
    <div className="flex flex-col gap-3 bg-gray-txt-100 rounded-md p-4">
      <h2 className="font-medium">{t("figures.form.biographyTitle", "Biography entries")}</h2>
      {entries.map((e) => (
        <div key={e.id} className="flex flex-col gap-1 border border-white/10 rounded-md p-3">
          <p className="font-medium text-sm">{e.title}</p>
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{e.content}</p>
          <button type="button" className="secondary-btn w-fit" onClick={() => onChange(entries.filter((x) => x.id !== e.id))}>
            {t("common.remove", "Remove")}
          </button>
        </div>
      ))}
      <input className="input" placeholder={t("figures.form.bioEntryTitlePh", "Entry title")} value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Biography entry title" />
      <textarea className="input min-h-20 custom-scrollbar" placeholder={t("figures.form.bioEntryContentPh", "Entry content")} value={content} onChange={(e) => setContent(e.target.value)} aria-label="Biography entry content" />
      <button
        type="button"
        className="secondary-btn w-fit"
        onClick={() => {
          if (!title.trim() || !content.trim()) {
            toast.error("Add a title and content");
            return;
          }
          onChange([...entries, { id: newId(), title: title.trim(), content: content.trim() }]);
          setTitle("");
          setContent("");
        }}
      >
        {t("common.add", "Add")}
      </button>
    </div>
  );
}

function FamilyEditor({ entries, onChange }: { entries: FamilyEntry[]; onChange: (v: FamilyEntry[]) => void }) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("parent");
  return (
    <div className="flex flex-col gap-3 bg-gray-txt-100 rounded-md p-4">
      <h2 className="font-medium">{t("figures.form.familyTitle", "Family members")}</h2>
      {entries.map((e) => (
        <div key={e.id} className="flex items-center justify-between border border-white/10 rounded-md p-3">
          <p className="text-sm capitalize">{e.name} — {e.relationship}</p>
          <button type="button" className="secondary-btn" onClick={() => onChange(entries.filter((x) => x.id !== e.id))}>
            {t("common.remove", "Remove")}
          </button>
        </div>
      ))}
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Family member name" />
        <select className="input" value={relationship} onChange={(e) => setRelationship(e.target.value)} aria-label="Relationship">
          <option value="parent">Parent</option>
          <option value="spouse">Spouse</option>
          <option value="ex_spouse">Ex-spouse</option>
          <option value="child">Child</option>
          <option value="sibling">Sibling</option>
          <option value="relative">Relative</option>
          <option value="other">Other</option>
        </select>
      </div>
      <button
        type="button"
        className="secondary-btn w-fit"
        onClick={() => {
          if (!name.trim()) return;
          onChange([...entries, { id: newId(), name: name.trim(), relationship }]);
          setName("");
        }}
      >
        {t("common.add", "Add")}
      </button>
    </div>
  );
}

function LinksEditor({ entries, onChange }: { entries: LinkEntry[]; onChange: (v: LinkEntry[]) => void }) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  return (
    <div className="flex flex-col gap-3 bg-gray-txt-100 rounded-md p-4">
      <h2 className="font-medium">{t("figures.form.linksTitle", "External links")}</h2>
      {entries.map((e) => (
        <div key={e.id} className="flex items-center justify-between border border-white/10 rounded-md p-3">
          <p className="text-sm">{e.title}</p>
          <button type="button" className="secondary-btn" onClick={() => onChange(entries.filter((x) => x.id !== e.id))}>
            {t("common.remove", "Remove")}
          </button>
        </div>
      ))}
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Link title" />
        <input className="input" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Link URL" />
      </div>
      <button
        type="button"
        className="secondary-btn w-fit"
        onClick={() => {
          if (!title.trim()) return;
          onChange([...entries, { id: newId(), title: title.trim(), type: "website", url: url.trim() }]);
          setTitle("");
          setUrl("");
        }}
      >
        {t("common.add", "Add")}
      </button>
    </div>
  );
}

export default AddFigureFeature;
