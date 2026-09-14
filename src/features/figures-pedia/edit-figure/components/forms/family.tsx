"use client";

import { Figure } from "@/features/figures-pedia/lib";
import React, { useRef, useState } from "react";
import { useEditFigureContext } from "../context";
import {
  BaseInput,
  BaseTextArea,
  ErrorWidget,
  ImageUploader,
} from "@/features/shared";
import moment from "moment";
import { PenBox, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { relations } from "@/features/figures-pedia/lib/relations-list";
import { validateFamilyForm } from "@/features/figures-pedia/add-figures/validate-forms";

const defaultValue = {
  id: "",
  name: "",
  relationship: "parent",
  occupation: "",
  bio: "",
  photo: "",
  photos: [],
  dateOfBirth: null,
  dateOfDeath: null,
  marriageYear: null,
  divorceYear: null,
  linkedFigureId: null,
};

const FamilyForm = () => {
  const { figureData, setFigureData } = useEditFigureContext();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] =
    useState<Figure["family"][number]>(defaultValue);

  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);

  const familyAdded = figureData.family;

  const clearData = () => {
    setFormData(defaultValue);
  };

  const handleAdd = () => {
    setError("");
    const errors = validateFamilyForm(formData);

    if (Object.keys(errors).length > 0) {
      const err =
        errors[Object.keys(errors)[0] as keyof typeof errors] ??
        "Please fill in all required fields";
      setError(err);
      toast.error(err);
      return errorRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (editing) {
      const newFam = familyAdded.map((fam) =>
        fam.name === formData.name ? formData : fam,
      );
      setFigureData((prev) => ({
        ...prev,
        family: newFam,
      }));
      setEditing(false);
    } else {
      setFigureData((prev) => ({
        ...prev,
        family: [...prev.family, { ...formData, id: Date.now().toString() }],
      }));
    }

    clearData();
    return;
  };

  const handleEdit = (name: string) => {
    setError("");
    const family = familyAdded.find((f) => f.name === name);
    if (family) {
      setFormData(family);
      setEditing(true);
    }
  };

  const handleDelete = (name: string) => {
    setFigureData((prev) => ({
      ...prev,
      family: prev.family.filter((f) => f.name !== name),
    }));
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6 mt-8">
      <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full">
        <div ref={errorRef} className="w-full">
          <ErrorWidget message={error} action={() => setError("")} />
        </div>

        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>Family Members</h2>
        </div>

        <div className="flex flex-col w-full mt-6 gap-4">
          <ImageUploader
            url={formData.photo}
            type="figures"
            setUrl={(v) => {
              setFormData({ ...formData, photo: v });
            }}
            maxFileSize={3 * 1024 * 1024}
            onSuccess={(v) => {
              setFormData({ ...formData, photo: v });
            }}
          />
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="type">Relationship</label>
            <select
              value={formData.relationship}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  relationship: e.target.value,
                })
              }
              id="type"
              className="input h-12 capitalize"
            >
              {relations.map((type) => (
                <option
                  key={type}
                  value={type}
                  className="text-white bg-secondary-bg capitalize"
                >
                  {type}
                </option>
              ))}
            </select>
          </div>

          <BaseInput
            label="Name"
            placeholder="Enter the name of the family member"
            value={formData.name}
            setValue={(e) => setFormData({ ...formData, name: e as string })}
          />

          <BaseInput
            label="Occupation"
            placeholder="Enter the occupation of the family member"
            value={formData.occupation}
            setValue={(e) =>
              setFormData({ ...formData, occupation: e as string })
            }
          />

          <div className="flex items-center gap-4">
            <BaseInput
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth || ""}
              setValue={(e) =>
                setFormData({ ...formData, dateOfBirth: e as string })
              }
            />
            <BaseInput
              label="Date of Death"
              type="date"
              value={formData.dateOfDeath || ""}
              setValue={(e) =>
                setFormData({ ...formData, dateOfDeath: e as string })
              }
            />
          </div>

          <div className="flex w-full items-center gap-4">
            {(formData.relationship === "spouse" ||
              formData.relationship === "ex_spouse") && (
              <BaseInput
                label="Marriage Year"
                value={formData.marriageYear || ""}
                setValue={(e) =>
                  setFormData({
                    ...formData,
                    marriageYear: (e as string).replace(/\D/g, ""),
                  })
                }
              />
            )}

            {formData.relationship === "ex_spouse" && (
              <div className="flex  items-center gap-4">
                <BaseInput
                  label="Divorce Year"
                  value={formData.divorceYear || ""}
                  setValue={(e) =>
                    setFormData({
                      ...formData,
                      divorceYear: (e as string).replace(/\D/g, ""),
                    })
                  }
                />
              </div>
            )}
          </div>
          {/* 
          {formData.relationship === "ex_spouse" && (
            <div className="flex  items-center gap-4">
              <BaseInput
                label="Marriage Date"
                type="date"
                value={formData.marriageYear || ""}
                setValue={(e) =>
                  setFormData({
                    ...formData,
                    marriageYear: e as string,
                  })
                }
              />
              <BaseInput
                label="Divorce Date"
                type="date"
                value={formData.divorceYear || ""}
                setValue={(e) =>
                  setFormData({
                    ...formData,
                    divorceYear: e as string,
                  })
                }
              />
            </div>
          )} */}

          <BaseTextArea
            label="Short Bio"
            rows={3}
            maxLength={400}
            placeholder={"Enter a short bio"}
            value={formData.bio}
            setValue={(e) => setFormData({ ...formData, bio: e })}
          />

          <div className="flex w-full justify-between">
            {editing ? (
              <button
                onClick={clearData}
                className="secondary-btn hover:bg-white hover:text-base-red px-10 self-end mt-5"
              >
                Cancel
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleAdd}
              className="secondary-btn px-14 self-end mt-5"
            >
              {editing ? "Update" : "Add"} Source
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:px-8 px-4 h-fit py-6 bg-gray-txt-100 rounded-md w-full">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>Added Family Members</h2>
        </div>

        <div className="flex flex-col w-full mt-6 px-1">
          <ul className="w-full space-y-4">
            {familyAdded.map((family, idx) => {
              if (family.name === formData.name) return null;

              return (
                <li
                  key={idx}
                  className="flex items-center justify-between w-full border-b  border-gray-txt-50/50 group pb-3 relative"
                >
                  <div className="flex flex-col gap-2w-full capitalize">
                    <div className="flex items-center gap-4">
                      <p className="text-base">
                        {family.name} ({family.relationship})
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm mt-2 text-gray-txt-50">
                      {family.occupation && (
                        <p className="">{family.occupation}</p>
                      )}
                      {family.dateOfBirth && (
                        <p>
                          Born:{" "}
                          <span className="text-gray-txt-50">
                            {moment(family.dateOfBirth).format("DD/MMM/yyyy")}
                          </span>
                        </p>
                      )}

                      {family.dateOfDeath && (
                        <p>
                          Died:{" "}
                          <span className="text-gray-txt-50">
                            {moment(family.dateOfDeath).format("DD/MMM/yyyy")}
                          </span>
                        </p>
                      )}
                    </div>

                    {family.bio && (
                      <p className="text-gray-txt-50 text-sm mt-2 line-clamp-1 whitespace-pre-wrap">
                        {family.bio}
                      </p>
                    )}
                  </div>

                  <div className="absolute right-0 top-0 group-hover:flex hidden bg-secondary-bg px-5 py-3 rounded-full gap-6 items-center transition-all duration-300 ease-in-out">
                    <button
                      onClick={() => handleEdit(family.name)}
                      className="cursor-pointer"
                    >
                      <PenBox size={22} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => handleDelete(family.name)}
                      className="text-base-red cursor-pointer"
                    >
                      <Trash2 size={22} strokeWidth={1.5} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FamilyForm;
