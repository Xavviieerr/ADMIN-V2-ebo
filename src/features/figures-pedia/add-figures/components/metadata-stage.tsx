"use client";

import { BaseInput, ErrorWidget, FigureInfoStage } from "@/features/shared";
import { Pencil, Trash2 } from "lucide-react";
import React, { useRef, useState } from "react";
import { useAddFigureCTX } from "./context";
import { useRouter } from "next/navigation";
import { validateMetaData } from "../validate-forms";
import { toast } from "sonner";

type FormData = {
  id: string;
  type: string;
  title: string;
  url: string;
  source: string;
  creator: string;
  date: string;
};

const MetadataStage = ({ stage }: { stage: FigureInfoStage }) => {
  const { basicInfo, setBasicInfo, saveToLocal } = useAddFigureCTX();
  const router = useRouter();

  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);

  const [sourceAdded, setSourceAdded] = useState<FormData[]>(
    basicInfo.externalLinks as FormData[],
  );
  const [formData, setFormData] = useState<FormData>({
    id: "",
    type: "website",
    title: "",
    url: "",
    source: "",
    creator: "",
    date: "",
  });

  const clearData = () => {
    setFormData({
      id: "",
      type: "website",
      title: "",
      url: "",
      source: "",
      creator: "",
      date: "",
    });
  };

  const handleAddSource = () => {
    setError("");

    const errors = validateMetaData(formData);

    if (Object.keys(errors).length > 0) {
      const err =
        errors[Object.keys(errors)[0] as keyof typeof errors] ??
        "Please fill in all required fields";
      setError(err);
      toast.error(err);
      return errorRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (formData.id) {
      const updateSource = sourceAdded.map((source) =>
        source.id === formData.id ? formData : source,
      );
      setSourceAdded(updateSource);
    } else {
      setSourceAdded((prev) => [
        ...prev,
        { ...formData, id: Date.now().toString() },
      ]);
    }

    clearData();
  };

  const getYear = (date: string) => {
    if (!date) return "n/a";
    return new Date(date).getFullYear();
  };

  const handleEditSource = (id: string) => {
    const source = sourceAdded.find((source) => source.id === id);
    if (source) {
      setFormData(source);
    }
  };

  const handleDeleteSource = (id: string) => {
    const updateSource = sourceAdded.filter((source) => source.id !== id);
    setSourceAdded(updateSource);
  };

  const handleSubmit = () => {
    setError("");
    const newBasicInfo = {
      ...basicInfo,
      externalLinks: sourceAdded,
    };

    setBasicInfo(newBasicInfo);

    saveToLocal(newBasicInfo);
    router.replace(`/guonopedia/figures/add`);
  };
  return (
    <>
      {stage === "metadata" && (
        <div className="dark-box max-md:px-0 w-full">
          <div className="flex items-center justify-between gap-4 max-md:px-3">
            <h2 className="text-white font-medium text-lg">
              4. MetaData & Sources
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
                <h2>External Links</h2>
              </div>

              <div className="flex flex-col w-full mt-6 gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="type">Source Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as FormData["type"],
                      })
                    }
                    id="type"
                    className="input h-12 capitalize"
                  >
                    {["website", "oral history"].map((type) => (
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
                  label="Title"
                  placeholder="Enter the title of the source article, website etc"
                  value={formData.title}
                  setValue={(e) =>
                    setFormData({ ...formData, title: e as string })
                  }
                />

                {formData.type === "website" && (
                  <BaseInput
                    label="URL"
                    placeholder="https://example.com"
                    value={formData.url ?? ""}
                    setValue={(e) =>
                      setFormData({ ...formData, url: e as string })
                    }
                  />
                )}

                {formData.type != "website" && (
                  <>
                    <BaseInput
                      label="Creator"
                      placeholder="Enter the creator of the information"
                      value={formData.creator}
                      setValue={(e) =>
                        setFormData({ ...formData, creator: e as string })
                      }
                    />
                    <BaseInput
                      label="Source"
                      placeholder="Enter the source of the information"
                      value={formData.source}
                      setValue={(e) =>
                        setFormData({ ...formData, source: e as string })
                      }
                    />
                  </>
                )}

                <BaseInput
                  label="Date"
                  type="date"
                  value={formData.date}
                  setValue={(e) =>
                    setFormData({
                      ...formData,
                      date: e as string,
                    })
                  }
                />

                <div className="flex w-full justify-between">
                  {formData.id ? (
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
                    onClick={handleAddSource}
                    className="secondary-btn px-14 self-end mt-5"
                  >
                    {formData.id ? "Update" : "Add"} Source
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full">
              <div className="flex items-center gap-3 text-base font-medium">
                <div className="h-3 w-3 rounded-full bg-yellow-600" />
                <h2>Added Sources</h2>
              </div>

              <div className="flex flex-col w-full mt-6 px-1">
                <ul className="w-full">
                  {sourceAdded.map((source, idx) => {
                    if (source.id === formData.id) return null;
                    return (
                      <li
                        key={idx}
                        className="flex items-center justify-between w-full hover:border-b border-gray-txt-50/50 group pb-3 relative"
                      >
                        <p className="flex items-start  gap-3 text-gray-txt-500 italic">
                          <span className="font-medium text-base">
                            {idx + 1}.
                          </span>

                          <span className="">
                            &quot;{source.title}&quot;. {source.type}, {source.url}.
                            {" Accessed "}
                            {getYear(source.date)}.
                          </span>
                        </p>

                        <div className="absolute right-0 top-0 group-hover:flex hidden bg-secondary-bg px-5 py-3 rounded-full gap-6 items-center transition-all duration-300 ease-in-out">
                          <button
                            onClick={() => handleEditSource(source.id)}
                            className="cursor-pointer"
                          >
                            <Pencil size={22} strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => handleDeleteSource(source.id)}
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

export default MetadataStage;
