"use client";

import { MultiInput } from "@/features/shared";
import React, { useState } from "react";

const BasicInfoForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    alternativeNames: [] as string[],
    type: "",
    foundedOn: "",
    founders: [] as string[],
    figures: [] as string[],
    ruler: "",
    summary: "",
  });

  return (
    <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>Place Details</h2>
      </div>

      <div className="flex flex-col w-full mt-6 gap-4">
        {/* Name */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter the place's name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
          />
        </div>

        <MultiInput
          label="Alternative Spellings"
          placeholder="Enter alternative spellings of the place"
          values={formData.alternativeNames}
          removeValue={(value) =>
            setFormData({
              ...formData,
              alternativeNames: formData.alternativeNames.filter(
                (t) => t !== value,
              ),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              alternativeNames: [...formData.alternativeNames, value],
            })
          }
        />

        {/* Type */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="type">Type</label>
          <select
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            id="type"
            className="input h-12"
          >
            {["Town", "Village", "Kingdom", "Landmark"].map((type) => (
              <option
                key={type}
                value={type}
                className="text-white bg-secondary-bg"
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Founded On */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="dod">Founded on:</label>
          <input
            type="date"
            id="dod"
            value={formData.foundedOn}
            onChange={(e) =>
              setFormData({ ...formData, foundedOn: e.target.value })
            }
            className="input"
          />
        </div>

        {/* Founders */}
        <MultiInput
          label="Founders"
          placeholder="Enter the founders of the place"
          values={formData.founders}
          removeValue={(value) =>
            setFormData({
              ...formData,
              founders: formData.founders.filter((t) => t !== value),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              founders: [...formData.founders, value],
            })
          }
        />

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="ruler">Current Ruler</label>
          <input
            type="text"
            id="ruler"
            placeholder="Enter the name & title of the current ruler"
            value={formData.ruler}
            onChange={(e) =>
              setFormData({ ...formData, ruler: e.target.value })
            }
            className="input"
          />
        </div>

        <MultiInput
          label="Notable Figures"
          placeholder="Enter notable figures associated with this place"
          values={formData.figures}
          removeValue={(value) =>
            setFormData({
              ...formData,
              figures: formData.figures.filter((t) => t !== value),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              figures: [...formData.figures, value],
            })
          }
        />

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            rows={4}
            placeholder="Enter a summary of the figure"
            value={formData.summary}
            onChange={(e) =>
              setFormData({ ...formData, summary: e.target.value })
            }
            className="input"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
