"use client";

import {
  BaseInput,
  BaseTextArea,
  ErrorWidget,
  FigureInfoStage,
  ImageUploader,
} from "@/features/shared";
import React, { useRef, useState } from "react";
import { useAddFigureCTX } from "./context";
import { useRouter } from "next/navigation";
import { FigurePayload } from "../../lib";
import { PenBox, Trash2 } from "lucide-react";
import moment from "moment";
import { toast } from "sonner";
import { validateFamilyForm } from "../validate-forms";
import { relations } from "../../lib/relations-list";

const defaultValue = {
  id: "",
  name: "",
  relationship: "ọsẹ",
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

const FamilyMembersStage = ({ stage }: { stage: FigureInfoStage }) => {
  const router = useRouter();
  const { basicInfo, setBasicInfo, saveToLocal } = useAddFigureCTX();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] =
    useState<FigurePayload["family"][number]>(defaultValue);

  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);

  const [familyAdded, setFamilyAdded] = useState<
    FigurePayload["family"][number][]
  >(basicInfo.family);

  const clearData = () => {
    setFormData(defaultValue);
  };

  const handleAdd = () => {
    const errors = validateFamilyForm(formData);

    if (Object.keys(errors).length > 0) {
      const err =
        errors[Object.keys(errors)[0] as keyof typeof errors] ??
        "Please fill in all required fields";
      setError(err);
      toast.error(err);
      return errorRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    setFamilyAdded((prev) => {
      if (editing) {
        return prev.map((s) => (s.name === formData.name ? formData : s));
      }
      return [...prev, { ...formData, id: Date.now().toString() }];
    });
    setEditing(false);
    clearData();
  };

  const handleEdit = (name: string) => {
    const family = familyAdded.find((f) => f.name === name);
    if (family) {
      setFormData(family);
      setEditing(true);
    }
  };

  const handleDelete = (name: string) => {
    setFamilyAdded((prev) => prev.filter((f) => f.name !== name));
  };

  const handleSubmit = () => {
    setError("");

    const newBasicInfo = {
      ...basicInfo,
      family: familyAdded,
    };
    setBasicInfo(newBasicInfo);

    clearData();
    saveToLocal(newBasicInfo);
    router.replace(`/guonopedia/figures/add`);
  };
  return (
    <>
      {stage === "familyMembers" && (
        <div className="dark-box max-md:px-0 w-full">
          <div className="flex items-center justify-between gap-4 max-md:px-3">
            <h2 className="text-white font-medium text-lg">
              3. Family Relationships
            </h2>

            <div className="flex items-center gap-4">
              <button onClick={handleSubmit} className="primary-btn py-2">
                Done
              </button>
            </div>
          </div>

          <div ref={errorRef} className="w-full">
            <ErrorWidget message={error} action={() => setError("")} />
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-6 mt-8">
            <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full">
              <div className="flex items-center gap-3 text-base font-medium">
                <div className="h-3 w-3 rounded-full bg-yellow-600" />
                <h2>Family Members</h2>
              </div>

              <div className="flex flex-col w-full mt-6 gap-4">
                <ImageUploader
                  url={formData.photo}
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
                  setValue={(e) =>
                    setFormData({ ...formData, name: e as string })
                  }
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
                    value={formData.dateOfBirth ?? ""}
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

                <BaseTextArea
                  label="Short Bio"
                  rows={3}
                  maxLength={400}
                  placeholder={"Enter a short bio"}
                  value={formData.bio}
                  setValue={(v) => setFormData({ ...formData, bio: v })}
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
                    {editing ? "Update" : "Add"} Family
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full">
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
                            <p className="">{family.occupation}</p>
                            {family.dateOfBirth && (
                              <p>
                                Born:{" "}
                                <span className="text-gray-txt-50">
                                  {moment(family.dateOfBirth).format(
                                    "DD/MMM/yyyy",
                                  )}
                                </span>
                              </p>
                            )}

                            {family.dateOfDeath && (
                              <p>
                                Died:{" "}
                                <span className="text-gray-txt-50">
                                  {moment(family.dateOfDeath).format(
                                    "DD/MMM/yyyy",
                                  )}
                                </span>
                              </p>
                            )}
                          </div>

                          {family.bio && (
                            <p className="text-gray-txt-50 text-sm mt-2 line-clamp-1">
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
        </div>
      )}
    </>
  );
};

export default FamilyMembersStage;
