"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import { useUpdateAdminProfileMutation } from "@/slice/requestSlice";

export function useProfileEditor() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [updateProfile, { isLoading }] = useUpdateAdminProfileMutation();

  const openEditor = (currentFirstName: string, currentLastName: string) => {
    setFirstName(currentFirstName);
    setLastName(currentLastName);
    setPictureFile(null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      await updateProfile({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        profilePicture: pictureFile || undefined,
      }).unwrap();
      toast.success("Profile updated successfully");
      setShowModal(false);
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update profile"));
    }
  };

  return {
    showModal,
    setShowModal,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    pictureFile,
    setPictureFile,
    isLoading,
    openEditor,
    handleSubmit,
  };
}
