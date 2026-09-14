"use client";

import {
  BaseInput,
  BaseTextArea,
  DropSearchInput,
  ImageUploader,
  MultiInput,
} from "@/features/shared";
import React from "react";
import { useEditFigureContext } from "../context";
import { categories } from "@/features/figures-pedia/lib/category-list";

const PersonalForm = () => {
  const { figureData: formData, setFigureData: setFormData } =
    useEditFigureContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6  mt-8">
      <div className=" flex flex-col md:px-8 px-4  py-6 bg-gray-txt-100 rounded-md w-full h-fit">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>Personal Details</h2>
        </div>

        <div className="flex flex-col w-full mt-6 gap-4">
          <BaseInput
            label="Full Name"
            value={formData.fullName ?? ""}
            placeholder="Enter the figure's full name"
            setValue={(e) => {
              setFormData({ ...formData, fullName: e as string });
            }}
          />

          <MultiInput
            label="Other Names"
            placeholder="Enter other names of the figure"
            values={formData.otherNames}
            removeValue={(value) =>
              setFormData({
                ...formData,
                otherNames: formData.otherNames.filter((t) => t !== value),
              })
            }
            addValue={(value) =>
              setFormData({
                ...formData,
                otherNames: [...formData.otherNames, value],
              })
            }
          />

          <BaseInput
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            placeholder="Enter the figure's date of birth"
            setValue={(e) => {
              setFormData({ ...formData, dateOfBirth: e as string });
            }}
          />

          <BaseInput
            label="Place of Birth"
            value={formData.placeOfBirth}
            placeholder="Enter the figure's place of birth"
            setValue={(e) => {
              setFormData({ ...formData, placeOfBirth: e as string });
            }}
          />

          {/* Gender */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="gender">Gender</label>
            <select
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              id="gender"
              className="input h-12"
            >
              {["Male", "Female"].map((gender) => (
                <option
                  key={gender}
                  value={gender}
                  className="text-white bg-secondary-bg"
                >
                  {gender}
                </option>
              ))}
            </select>
          </div>

          <BaseInput
            label="Date of Death"
            type="date"
            value={formData.dateOfDeath ?? ""}
            placeholder="Enter the figure's date of death"
            setValue={(e) => {
              setFormData({ ...formData, dateOfDeath: e as string });
            }}
          />

          {/* <BaseInput
            label="Cause of Death"
            value={""}
            placeholder="Enter the figure's cause of death"
            setValue={(e) => {
              // setFormData({ ...formData, causeOfDeath: e.target.value });
            }}
          />

          <BaseInput
            label="Place of Death"
            value={""}
            placeholder="Enter the figure's place of death"
            setValue={(e) => {
              // setFormData({ ...formData, placeOfDeath: e.target.value });
            }}
          /> */}

          <div className="flex flex-col gap-2 w-full">
            <BaseTextArea
              label="Summary"
              rows={4}
              placeholder="Enter a summary of the figure"
              value={formData.introBio}
              setValue={(e) => {
                setFormData({ ...formData, introBio: e as string });
              }}
            />
          </div>
        </div>
      </div>

      <div className=" flex flex-col md:px-8 px-4  py-6 bg-gray-txt-100 rounded-md w-full h-fit">
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
            label="Occupation"
            options={categories}
            value={formData.occupation}
            setValue={(v) => setFormData({ ...formData, occupation: v })}
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
            setValue={(e) =>
              setFormData({ ...formData, ethnicity: e as string })
            }
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
            setValue={(e) =>
              setFormData({ ...formData, religion: e as string })
            }
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
    </div>
  );
};

export default PersonalForm;
