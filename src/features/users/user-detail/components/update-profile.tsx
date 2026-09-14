import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const UpdateProfile = ({
  showModal,
  setShowModal,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  pictureFile,
  setPictureFile,
  isLoading,
  onSubmit,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  pictureFile: File | null;
  setPictureFile: (file: File | null) => void;
  isLoading: boolean;
  onSubmit: () => void;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("common.updateProfile", "Update Profile")}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="single-user-first-name" className="text-sm text-gray-300">
                {t("common.firstNameLabel", "First name")}
              </label>
              <Input
                id="single-user-first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[#1e1e1e] border-white/10 text-white"
                placeholder="First name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="single-user-last-name" className="text-sm text-gray-300">
                {t("common.lastNameLabel", "Last name")}
              </label>
              <Input
                id="single-user-last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#1e1e1e] border-white/10 text-white"
                placeholder="Last name"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="single-user-photo" className="text-sm text-gray-300">
              {t("common.profilePhoto", "Profile photo")}
            </label>
            <Input
              id="single-user-photo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPictureFile(file);
              }}
              className="bg-[#1e1e1e] border-white/10 text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowModal(false)}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-foreground hover:bg-foreground/90 text-[#1e1e1e]"
            >
              {isLoading ? t("common.updating", "Updating...") : t("common.updateProfile", "Update Profile")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfile;
