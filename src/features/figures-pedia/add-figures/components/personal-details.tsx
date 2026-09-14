"use client";

import { BaseInput, BaseTextArea, MultiInput } from "@/features/shared";
import React from "react";
import { useAddFigureCTX } from "./context";

const PersonalForm = () => {
  const { basicInfo: formData, setBasicInfo: setFormData } = useAddFigureCTX();

  return (
    <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>Personal Details</h2>
      </div>

      <div className="flex flex-col w-full mt-6 gap-4">
        <BaseInput
          label="Full Name"
          value={formData.fullName}
          placeholder="Enter the figure's full name"
          setValue={(e) => {
            setFormData({ ...formData, fullName: e as string });
          }}
        />

        {/* <BaseInput
          label="Other Name"
          value={formData.otherNames}
          placeholder="Enter other names of the figure"
          setValue={(e) => {
            setFormData({ ...formData, otherNames: e as string });
          }}
        /> */}

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
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            id="gender"
            className="input h-12"
          >
            {["male", "female"].map((gender) => (
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
  );
};

export default PersonalForm;
