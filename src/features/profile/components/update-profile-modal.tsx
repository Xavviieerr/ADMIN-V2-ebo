"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  useGetAllProvinceNoPaginationQuery,
  useGetTownsByProvinceIdQuery,
  useUpdateUserProfileMutation,
  useUpdateUsernameMutation,
  useUploadUserImageMutation,
} from "@/slice/requestSlice";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { updateCurrentUser } from "@/features/auth/store/authSlice";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import FormDropdown from "./form-dropdown";

const editProfileSchema = z.object({
  firstName: z.string().max(50).optional().or(z.literal("")),
  lastName: z.string().max(50).optional().or(z.literal("")),
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only")
    .min(3)
    .max(30)
    .optional()
    .or(z.literal("")),
  gender: z.string().optional(),
  province: z.string().optional(),
  town: z.string().optional(),
  DOB: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
    .optional()
    .or(z.literal("")),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export interface EditProfileInitial {
  firstName?: string;
  lastName?: string;
  username?: string;
  gender?: string;
  province?: string;
  town?: string;
  DOB?: string | null;
  profilePictureUrl?: string | null;
}

interface UpdateProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: EditProfileInitial;
  onUpdated: () => void;
}

export default function UpdateProfileModal({
  open,
  onOpenChange,
  initial,
  onUpdated,
}: UpdateProfileModalProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const dispatch = useAppDispatch();

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wasOpen = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: initial.firstName ?? "",
      lastName: initial.lastName ?? "",
      username: initial.username ?? "",
      gender: initial.gender ?? "",
      province: initial.province ?? "",
      town: initial.town ?? "",
      DOB: initial.DOB ?? "",
    },
  });

  // Reset only on closed → open transitions so background re-renders
  // (RTK fetching flags, locale load, refetch) can never wipe typing.
  useEffect(() => {
    const justOpened = open && !wasOpen.current;
    wasOpen.current = open;
    if (justOpened) {
      reset({
        firstName: initial.firstName ?? "",
        lastName: initial.lastName ?? "",
        username: initial.username ?? "",
        gender: initial.gender ?? "",
        province: initial.province ?? "",
        town: initial.town ?? "",
        DOB: initial.DOB ?? "",
      });
      setPhotoFile(null);
      setPhotoPreview(null);
      setError(null);
    }
  }, [open, initial, reset]);

  useEffect(() => {
    if (!photoFile) return;
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const { data: provincesData } = useGetAllProvinceNoPaginationQuery(
    undefined,
    { skip: !open },
  );
  const provinces = useMemo(
    () => provincesData?.data ?? [],
    [provincesData],
  );

  const watchedProvince = watch("province");
  const selectedProvinceId = useMemo(
    () => provinces.find((p) => p.name === watchedProvince)?.id,
    [provinces, watchedProvince],
  );

  const { data: townsData, isLoading: isLoadingTowns } =
    useGetTownsByProvinceIdQuery(
      { provinceId: selectedProvinceId ?? "" },
      { skip: !open || !selectedProvinceId },
    );
  const towns = useMemo(() => townsData?.data ?? [], [townsData]);

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const [updateUsername, { isLoading: isUpdatingUsername }] =
    useUpdateUsernameMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadUserImageMutation();

  const saving = isUpdating || isUpdatingUsername || isUploading;

  const handleProvinceChange = (name: string) => {
    setValue("province", name, { shouldDirty: true });
    setValue("town", "");
  };

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      setError(null);

      let profilePictureUrl: string | undefined;
      if (photoFile) {
        const formData = new FormData();
        formData.append("imageFile", photoFile);
        formData.append("preferredFormat", "webp");
        formData.append("quality", "80");
        const uploadResult = await uploadImage(formData).unwrap();
        profilePictureUrl = uploadResult.medium || uploadResult.original;
      }

      await updateProfile({
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        gender: data.gender || undefined,
        province: data.province || undefined,
        town: data.town || undefined,
        DOB: data.DOB || undefined,
        profilePictureUrl,
      }).unwrap();

      if (data.username && data.username !== initial.username) {
        await updateUsername({ username: data.username }).unwrap();
      }

      dispatch(
        updateCurrentUser({
          firstName: data.firstName || undefined,
          lastName: data.lastName || undefined,
          username: data.username || undefined,
          gender: data.gender || undefined,
          province: data.province || undefined,
          town: data.town || undefined,
          DOB: data.DOB || undefined,
          ...(profilePictureUrl ? { profilePictureUrl } : {}),
        }),
      );

      toast.success(t("common.updatedSuccessfully", "Profile updated successfully"));
      onOpenChange(false);
      onUpdated();
    } catch (err) {
      setError(getErrorMessage(err, t("common.error")));
    }
  };

  const genderOptions = [
    { value: "male", label: t("common.male", "Male") },
    { value: "female", label: t("common.female", "Female") },
    { value: "other", label: t("common.other", "Other") },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("profile.updateProfile", "Update Profile")}</DialogTitle>
        </DialogHeader>

        {error && (
          <ErrorMessage
            message={error}
            className="mb-2"
            onRetry={() => setError(null)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-start gap-2">
              <span className="text-sm text-gray-400">
                {t("profile.firstName", "First name")}
              </span>
              <Input
                {...register("firstName")}
                className="bg-[#1e1e1e] border-white/10 text-white"
                placeholder={t("profile.firstName", "First name")}
              />
              {errors.firstName && (
                <p className="text-sm text-red-400">{errors.firstName.message}</p>
              )}
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="text-sm text-gray-400">
                {t("profile.lastName", "Last name")}
              </span>
              <Input
                {...register("lastName")}
                className="bg-[#1e1e1e] border-white/10 text-white"
                placeholder={t("profile.lastName", "Last name")}
              />
              {errors.lastName && (
                <p className="text-sm text-red-400">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="text-sm text-gray-400">
              {t("profile.username", "Username")}
            </span>
            <Input
              {...register("username")}
              className="bg-[#1e1e1e] border-white/10 text-white"
              placeholder={t("profile.username", "Username")}
            />
            {errors.username && (
              <p className="text-sm text-red-400">{errors.username.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormDropdown
                  label={t("profile.gender", "Gender")}
                  value={field.value ?? ""}
                  options={genderOptions}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="province"
              control={control}
              render={({ field }) => (
                <FormDropdown
                  label={t("profile.province", "Province")}
                  value={field.value ?? ""}
                  options={provinces.map((p) => ({ value: p.name, label: p.name }))}
                  onChange={handleProvinceChange}
                />
              )}
            />
            <Controller
              name="town"
              control={control}
              render={({ field }) => (
                <FormDropdown
                  label={t("profile.town", "Town")}
                  value={field.value ?? ""}
                  options={towns.map((townItem) => ({
                    value: townItem.name,
                    label: townItem.name,
                  }))}
                  disabled={!selectedProvinceId}
                  loading={isLoadingTowns}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="text-sm text-gray-400">
              {t("profile.dob", "Date of Birth")}
            </span>
            <Input
              {...register("DOB")}
              type="date"
              className="bg-[#1e1e1e] border-white/10 text-white"
            />
            {errors.DOB && (
              <p className="text-sm text-red-400">{errors.DOB.message}</p>
            )}
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="text-sm text-gray-400">
              {t("profile.photoLabel", "Profile photo")}
            </span>
            {(photoPreview || initial.profilePictureUrl) && (
              <img
                src={photoPreview || initial.profilePictureUrl || ""}
                alt=""
                className="h-20 w-20 rounded-full object-cover border border-white/10"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPhotoFile(file);
              }}
              className="bg-[#1e1e1e] border-white/10 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              {t("profile.cancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-foreground hover:bg-foreground/90 text-[#1e1e1e]"
            >
              {saving
                ? t("profile.saving", "Saving...")
                : t("profile.saveChanges", "Save changes")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
