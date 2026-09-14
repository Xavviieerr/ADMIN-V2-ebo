import { MultiInput, NameFormDataType } from "@/features/shared";
import React from "react";

const AddOtherDetails = ({
  formData,
  setFormData,
}: {
  formData: NameFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<NameFormDataType>>;
}) => {
  return (
    <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>Other Details (optional)</h2>
      </div>

      <div className="flex flex-col w-full mt-4 gap-4">
        <MultiInput
          label="Alternative Spellings"
          placeholder="Type an alternative spelling to add to the name"
          values={formData.alternativeSpellings}
          removeValue={(value) =>
            setFormData({
              ...formData,
              alternativeSpellings: formData.alternativeSpellings.filter(
                (t) => t !== value,
              ),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              alternativeSpellings: [...formData.alternativeSpellings, value],
            })
          }
        />

        <MultiInput
          label="Nick names"
          placeholder="Type a nickname to add to the name"
          values={formData.nicknames}
          removeValue={(value) =>
            setFormData({
              ...formData,
              nicknames: formData.nicknames.filter((t) => t !== value),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              nicknames: [...formData.nicknames, value],
            })
          }
        />

        <MultiInput
          label="Notable Bearers"
          placeholder="Type a notable bearer to add to the name"
          values={formData.notableBearers}
          removeValue={(value) =>
            setFormData({
              ...formData,
              notableBearers: formData.notableBearers.filter(
                (t) => t !== value,
              ),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              notableBearers: [...formData.notableBearers, value],
            })
          }
        />

        <MultiInput
          label="Related Names"
          placeholder="Type a related name to add to the name"
          values={formData.relatedNames}
          removeValue={(value) =>
            setFormData({
              ...formData,
              relatedNames: formData.relatedNames.filter((t) => t !== value),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              relatedNames: [...formData.relatedNames, value],
            })
          }
        />
      </div>
    </div>
  );
};

export default AddOtherDetails;
