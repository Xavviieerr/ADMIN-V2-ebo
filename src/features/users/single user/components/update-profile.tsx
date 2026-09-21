import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/utils/errorHandler";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import React from "react";
import { toast } from "sonner";

const UpdateProfile = ({
  showProfileUpdateModal,
  setShowProfileUpdateModal,
  profileFirstName,
  setProfileFirstName,
  profileLastName,
  setProfileLastName,
  profilePictureFile,
  setProfilePictureFile,
  t,
  updateProfile,
  isUpdatingProfile,
}: {
  showProfileUpdateModal: boolean;
  setShowProfileUpdateModal: (show: boolean) => void;
  profileFirstName: string;
  setProfileFirstName: (firstName: string) => void;
  profileLastName: string;
  setProfileLastName: (lastName: string) => void;
  profilePictureFile: File | null;
  setProfilePictureFile: (file: File | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProfile: any;
  isUpdatingProfile: boolean;
}) => {
  return (
    <Dialog
      open={showProfileUpdateModal}
      onOpenChange={setShowProfileUpdateModal}
    >
      <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("common.update", "Update")} {t("sidebar.profile", "Profile")}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await updateProfile({
                firstName: profileFirstName || undefined,
                lastName: profileLastName || undefined,
                profilePicture: profilePictureFile || undefined,
              }).unwrap();
              toast.success("Profile updated successfully");
              setShowProfileUpdateModal(false);
              window.location.reload();
            } catch (error) {
              toast.error(getErrorMessage(error, "Failed to update profile"));
            }
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={profileFirstName}
              onChange={(e) => setProfileFirstName(e.target.value)}
              className="bg-[#1e1e1e] border-white/10 text-white"
              placeholder="First name"
            />
            <Input
              value={profileLastName}
              onChange={(e) => setProfileLastName(e.target.value)}
              className="bg-[#1e1e1e] border-white/10 text-white"
              placeholder="Last name"
            />
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setProfilePictureFile(file);
              }
            }}
            className="bg-[#1e1e1e] border-white/10 text-white"
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowProfileUpdateModal(false)}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isUpdatingProfile}
              className="bg-foreground hover:bg-foreground/90 text-[#1e1e1e]"
            >
              {isUpdatingProfile
                ? t("common.updating", "Updating...")
                : t("common.update", "Update") +
                  " " +
                  t("sidebar.profile", "Profile")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfile;
