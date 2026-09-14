"use client";

import {
  BaseInput,
  DropSearchInput,
  ImageUploader,
  MultiInput,
} from "@/features/shared";
import React from "react";
import { useAddFigureCTX } from "./context";
import { categories } from "../../lib/category-list";

const OtherDetailsForm = () => {
  const { basicInfo: formData, setBasicInfo: setFormData } = useAddFigureCTX();

  return (
    <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>Other Details</h2>
      </div>

      <div className="flex flex-col w-full mt-6 gap-4">
        <ImageUploader
          url={formData.profilePhoto}
          setUrl={(v) => {
            setFormData({ ...formData, profilePhoto: v });
          }}
          maxFileSize={3 * 1024 * 1024}
          onSuccess={(v) => {
            setFormData({ ...formData, profilePhoto: v });
          }}
        />

        <DropSearchInput
          options={categories}
          label="Occupation"
          value={formData.occupation}
          setValue={(e) => setFormData({ ...formData, occupation: e })}
        />

        <BaseInput
          label="Nationality"
          value={formData.nationality}
          setValue={(e) =>
            setFormData({ ...formData, nationality: e as string })
          }
          placeholder="Enter the figure's nationality"
        />

        <BaseInput
          label="Region"
          value={formData.region}
          setValue={(e) => setFormData({ ...formData, region: e as string })}
          placeholder="Enter the figure's region"
        />

        <BaseInput
          label="Era"
          value={formData.era}
          setValue={(e) => setFormData({ ...formData, era: e as string })}
          placeholder="Enter the figure's era"
        />

        <BaseInput
          label="Ethnicity"
          value={formData.ethnicity}
          setValue={(e) => setFormData({ ...formData, ethnicity: e as string })}
          placeholder="Enter the figure's ethnicity"
        />

        {/* <BaseInput
          label="Occupation"
          value={formData.occupation}
          setValue={(e) =>
            setFormData({ ...formData, occupation: e as string })
          }
          placeholder="Enter the figure's occupation"
        /> */}

        <BaseInput
          label="Religion"
          value={formData.religion}
          setValue={(e) => setFormData({ ...formData, religion: e as string })}
          placeholder="Enter the figure's religion"
        />

        <MultiInput
          label="Tag(s)"
          placeholder="Enter a tag"
          values={formData.tags}
          removeValue={(value) =>
            setFormData({
              ...formData,
              tags: formData.tags.filter((t) => t !== value),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              tags: [...formData.tags, value],
            })
          }
        />

        <MultiInput
          label="Notable Achievements"
          placeholder="Enter a notable achievement"
          values={formData.notableAchievements}
          removeValue={(value) =>
            setFormData({
              ...formData,
              notableAchievements: formData.notableAchievements.filter(
                (t) => t !== value,
              ),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              notableAchievements: [...formData.notableAchievements, value],
            })
          }
        />
      </div>
    </div>
  );
};

export default OtherDetailsForm;
