"use client";

import { BaseInput, BaseTextArea, ErrorWidget, GoBackButton, MultiInput } from "@/features/shared";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import type { PlaceDetail } from "../model/types";
import { PLACE_TYPE_OPTIONS } from "../model/filter-options";
import { PLACE_VALIDATION_EN, validatePlaceRecord } from "../model/validation";
import { fetchSinglePlace, updatePlace } from "../api/places";
import { getPlaceErrorMessage } from "../api/errors";
import ImageField from "../create/image-field";

// Edit workspace for supported place-record fields only.
// Business profiles are read-only here (owner-controlled); nested profile
// fields are never sent through PATCH as an editing mechanism.
const EditPlaceFeature = ({ placeId }: { placeId: string }) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    city: "",
    state: "",
    country: "",
    address: "",
    lat: "",
    long: "",
    tags: [] as string[],
    coverImage: "",
    images: [] as string[],
  });

  useEffect(() => {
    let cancelled = false;
    fetchSinglePlace(tokenStorage.getAccessToken(), placeId)
      .then((data: PlaceDetail) => {
        if (cancelled) return;
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          type: data.type ?? "",
          city: data.location?.city ?? "",
          state: data.location?.state ?? "",
          country: data.location?.country ?? "",
          address: data.location?.address ?? "",
          lat:
            data.location?.latitude === null || data.location?.latitude === undefined
              ? ""
              : String(data.location.latitude),
          long:
            data.location?.longitude === null || data.location?.longitude === undefined
              ? ""
              : String(data.location.longitude),
          tags: data.tags ?? [],
          coverImage: data.coverImage ?? "",
          images: data.images ?? [],
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getPlaceErrorMessage(err, t("places.detail.loadFailed", "Failed to load place")));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [placeId, t]);

  const handleSave = async () => {
    setError("");
    const errors = validatePlaceRecord({
      name: form.name,
      description: form.description,
      type: form.type,
      latitude: form.lat,
      longitude: form.long,
    });
    if (Object.keys(errors).length > 0) {
      const key =
        errors[Object.keys(errors)[0] as keyof typeof errors] ??
        "places.validation.genericRequired";
      const msg = t(key, PLACE_VALIDATION_EN[key] ?? key);
      setError(msg);
      toast.error(msg);
      return;
    }

    setSaving(true);
    try {
      // Only confirmed-supported fields. Location coordinates are sent as
      // numbers; empty optionals are omitted rather than nulled.
      const lat = form.lat.trim() === "" ? undefined : Number(form.lat);
      const long = form.long.trim() === "" ? undefined : Number(form.long);
      await updatePlace(
        placeId,
        {
          name: form.name.trim(),
          description: form.description.trim(),
          type: form.type,
          location: {
            ...(form.city.trim() ? { city: form.city.trim() } : {}),
            ...(form.state.trim() ? { state: form.state.trim() } : {}),
            ...(form.country.trim() ? { country: form.country.trim() } : {}),
            ...(form.address.trim() ? { address: form.address.trim() } : {}),
            ...(lat !== undefined ? { latitude: lat } : {}),
            ...(long !== undefined ? { longitude: long } : {}),
          },
          tags: form.tags,
          coverImage: form.coverImage.trim() || null,
          images: form.images,
        },
        tokenStorage.getAccessToken(),
      );
      toast.success(t("places.form.updatedSuccess", "Place updated successfully"));
      router.replace(`/guonopedia/places/${placeId}`);
    } catch (err) {
      const msg = getPlaceErrorMessage(
        err,
        t("places.form.updateFailed", "Failed to update place"),
      );
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
        <GoBackButton link={`/guonopedia/places/${placeId}`} />
        <div className="dark-box w-full py-16 flex justify-center">
          <Loader className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white pb-20">
      <GoBackButton link={`/guonopedia/places/${placeId}`} />

      <div className="dark-box w-full">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-white font-medium text-lg">
            {t("places.actions.edit", "Edit")} Place
          </h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="primary-btn font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader className="animate-spin" size={16} />}
            {t("places.form.saveChanges", "Save Changes")}
          </button>
        </div>

        <ErrorWidget message={error} action={() => setError("")} />

        <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-6 mt-8">
          <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full gap-4 h-fit">
            <BaseInput
              label={t("places.form.nameLabel", "Name")}
              placeholder={t("places.form.namePh", "Enter the place's name")}
              value={form.name}
              setValue={(v) => setForm({ ...form, name: v as string })}
            />

            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="edit-type">{t("places.form.typeLabel", "Type")}</label>
              <select
                id="edit-type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input h-12 capitalize"
              >
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

            <BaseTextArea
              label={t("places.form.descriptionLabel", "Description")}
              rows={4}
              placeholder={t("places.form.descriptionPh", "Enter a description (minimum 10 characters)")}
              value={form.description}
              setValue={(v) => setForm({ ...form, description: v })}
            />

            <MultiInput
              label={t("places.form.tagsLabel", "Tags")}
              placeholder={t("places.form.tagsPh", "Enter a tag")}
              values={form.tags}
              removeValue={(value) =>
                setForm({ ...form, tags: form.tags.filter((tag) => tag !== value) })
              }
              addValue={(value) =>
                setForm({ ...form, tags: [...form.tags, value] })
              }
            />

            <ImageField
              label={t("places.form.coverLabel", "Cover image")}
              value={form.coverImage}
              onChange={(v) => setForm({ ...form, coverImage: v as string })}
            />

            <ImageField
              label={t("places.form.imagesLabel", "Gallery images")}
              value={form.images}
              multiple
              onChange={(v) => setForm({ ...form, images: v as string[] })}
            />
          </div>

          <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full gap-4 h-fit">
            <div className="flex items-center gap-3 text-base font-medium">
              <div className="h-3 w-3 rounded-full bg-yellow-600" />
              <h2>{t("places.form.locationTitle", "Location Details")}</h2>
            </div>

            <BaseInput
              label={t("places.form.cityLabel", "City")}
              placeholder={t("places.form.cityPh", "Enter the city")}
              value={form.city}
              setValue={(v) => setForm({ ...form, city: v as string })}
            />
            <BaseInput
              label={t("places.form.stateLabel", "State")}
              placeholder={t("places.form.statePh", "Enter the state")}
              value={form.state}
              setValue={(v) => setForm({ ...form, state: v as string })}
            />
            <BaseInput
              label={t("places.form.countryLabel", "Country")}
              placeholder={t("places.form.countryPh", "Enter the country")}
              value={form.country}
              setValue={(v) => setForm({ ...form, country: v as string })}
            />
            <BaseInput
              label={t("places.form.addressLabel", "Address")}
              placeholder={t("places.form.addressPh", "Enter the street address")}
              value={form.address}
              setValue={(v) => setForm({ ...form, address: v as string })}
            />
            <div className="flex items-center gap-4 w-full">
              <BaseInput
                label={t("places.form.longLabel", "Longitude")}
                placeholder={t("places.form.longPh", "Enter longitude")}
                value={form.long}
                setValue={(v) => setForm({ ...form, long: v as string })}
              />
              <BaseInput
                label={t("places.form.latLabel", "Latitude")}
                placeholder={t("places.form.latPh", "Enter latitude")}
                value={form.lat}
                setValue={(v) => setForm({ ...form, lat: v as string })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlaceFeature;
