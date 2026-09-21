import AddAdmin from "@/components/addAdmin/addAdmin";
import { LocaleWrapper } from "@/features/shared";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import React from "react";

const AddAdminModal = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
}) => {
  if (!show) return null;

  return (
    <dialog className="flex justify-center items-center backdrop-blur-sm z-200 overflow-auto no-scrollbar fixed top-0 left-0 w-screen h-screen bg-black/20">
      <Dialog open={true} onOpenChange={setShow}>
        <DialogContent className="text-white  w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col items-center max-w-2xl w-full bg-gray-txt-100 rounded-lg p-10 gap-2 text-white">
            <h1 className="font-semibold text-2xl">
              <LocaleWrapper item="common.addAdmin" />
            </h1>

            <p className="font-medium mb-6">
              Create an admin account to control access.
            </p>
            <AddAdmin onSuccess={() => setShow(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </dialog>
  );
};

export default AddAdminModal;
