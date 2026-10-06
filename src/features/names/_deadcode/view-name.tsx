import ModalLayout from "@/features/shared/modal-layout";
import { CircleX, PencilLine } from "lucide-react";
import React from "react";

type Name = {
  label: string;
  translations: { translation: string; notes: string }[];
  explanation: string;
  status: "approved" | "pending";
  type: string;
  source?: string;
  composition: string[];
};

const ViewName = ({
  selected,
  onClose,
}: {
  selected: Name | null;
  onClose: () => void;
}) => {
  if (!selected) return null;
  return (
    <ModalLayout size="3xl">
      <div className="w-full flex flex-col text-white">
        <div className="flex justify-between items-center gap-4 mb-4 pb-2 border-b border-gray-txt-50/60">
          <h1 className="text-2xl font-medium">Manage Name</h1>

          <div className="flex items-center gap-5">
            <PencilLine size={32} className="cursor-pointer" />
            <CircleX size={32} className="cursor-pointer" onClick={onClose} />
          </div>
        </div>

        <div className="grid grid-cols-3 max-md:grid-cols-1 items-start gap-4 py-5">
          <div>
            <p className="text-sm">Name:</p>
            <p className="text-lg font-medium capitalize">{selected.label}</p>
          </div>

          <div>
            <p className="text-sm">Type:</p>
            <p className="text-lg font-medium capitalize">{selected.type}</p>
          </div>

          {selected.source && (
            <div>
              <p className="text-sm">Source:</p>
              <p className="text-lg font-medium">{selected.source}</p>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm">Explanation:</p>
          <p className="text-base font-medium">{selected.explanation}</p>
        </div>

        <div className="dark-box w-full mt-2">
          <p className="text-sm">Translation:</p>
          <div>
            <p className="text-lg font-medium">
              {selected.translations[0].translation}
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-5 pt-4 border-t border-gray-txt-50/60">
          {selected.status === "pending" && (
            <button className="primary-btn bg-base-green text-white px-10">
              Approve Name
            </button>
          )}
          <button className="primary-btn bg-base-red text-white px-10">
            Delete Name
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ViewName;
