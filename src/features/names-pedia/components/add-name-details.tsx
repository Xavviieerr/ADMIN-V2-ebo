"use client";
import React from "react";
import { MultiInput, NameFormDataType } from "@/features/shared";

const AddNameDetails = ({
  formData,
  setFormData,
  dialects,
}: {
  formData: NameFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<NameFormDataType>>;
  dialects: { name: string; id: string }[];
}) => {
  return (
    <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>Name Details</h2>
      </div>

      <div className="flex flex-col w-full mt-6 gap-4">
        {/* Type */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="nameType">Type of name</label>
          <select
            value={formData.nameType}
            onChange={(e) =>
              setFormData({ ...formData, nameType: e.target.value })
            }
            id="nameType"
            className="input h-12 capitalize"
          >
            {[
              { label: "first name", value: "given name" },
              { label: "last name", value: "surname" },
            ].map((nameType) => (
              <option
                key={nameType.value}
                value={nameType.value}
                className="text-white bg-secondary-bg capitalize"
              >
                {nameType.label}
              </option>
            ))}
          </select>
        </div>

        {/*  Name */}
        <div className="flex flex-col gap-2 w-full my-2">
          <label htmlFor="firstName">Name</label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter the name in Urhobo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
          />
        </div>

        {/* Abbreviations */}
        <MultiInput
          label="Abbreviations (optional)"
          placeholder="Type an abbreviation to add to the name"
          values={formData.abbreviations}
          removeValue={(value) =>
            setFormData({
              ...formData,
              abbreviations: formData.abbreviations.filter((t) => t !== value),
            })
          }
          addValue={(value) =>
            setFormData({
              ...formData,
              abbreviations: [...formData.abbreviations, value],
            })
          }
        />

        {/* Dialect & Gender */}
        <div className="flex items-center gap-4 w-full">
          <div className="flex flex-col gap-2 w-full my-2">
            <label htmlFor="dialect">Dialect</label>
            <select
              value={formData.regionOfUse}
              onChange={(e) =>
                setFormData({ ...formData, regionOfUse: e.target.value })
              }
              id="dialect"
              className="input h-12 capitalize"
            >
              {dialects.map((dialect) => (
                <option
                  key={dialect.id}
                  value={dialect.name}
                  className="text-white bg-secondary-bg capitalize"
                >
                  {dialect.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="gender">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              id="gender"
              className="input h-12 capitalize"
            >
              {["male", "female", "neutral"].map((gender) => (
                <option
                  key={gender}
                  value={gender}
                  className="text-white bg-secondary-bg capitalize"
                >
                  {gender}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Syllable & Pronunciation */}
        <div className="flex items-center gap-4 w-full">
          <div className="flex flex-col gap-2 w-2/3 my-2">
            <label htmlFor="pronunciation">Pronunciation</label>
            <input
              type="text"
              id="pronunciation"
              placeholder="Enter the pronunciation"
              value={formData.pronunciation}
              onChange={(e) =>
                setFormData({ ...formData, pronunciation: e.target.value })
              }
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2 w-1/3 my-2">
            <label htmlFor="syllableCount">
              Syllable <span className="max-md:hidden">Count</span>
            </label>
            <input
              type="number"
              id="syllableCount"
              placeholder="Enter the syllable count"
              value={formData.syllableCount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  syllableCount: Number(e.target.value),
                })
              }
              className="input"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="description">Description</label>
          <textarea
            rows={4}
            id="email"
            placeholder="Enter the description of the name"
            value={formData.culturalSignificance}
            onChange={(e) =>
              setFormData({ ...formData, culturalSignificance: e.target.value })
            }
            className="input"
          />
        </div>
      </div>
    </div>
  );
};

export default AddNameDetails;
