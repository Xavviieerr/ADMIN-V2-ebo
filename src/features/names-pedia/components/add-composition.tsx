"use client";

import React from "react";
import { MultiInput, NameFormDataType } from "@/features/shared";

const AddNameComposition = ({
  formData,
  setFormData,
}: {
  formData: NameFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<NameFormDataType>>;
}) => {
  return (
    <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
      <div className="flex items-center gap-3 text-base font-medium mb-6">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>Name Composition</h2>
      </div>

      <MultiInput
        placeholder="Type a word to add to the name's composition"
        values={formData.nameComposition}
        removeValue={(value) =>
          setFormData({
            ...formData,
            nameComposition: formData.nameComposition.filter(
              (t) => t !== value,
            ),
          })
        }
        addValue={(value) =>
          setFormData({
            ...formData,
            nameComposition: [...formData.nameComposition, value],
          })
        }
      />
    </div>
  );
};

export default AddNameComposition;
