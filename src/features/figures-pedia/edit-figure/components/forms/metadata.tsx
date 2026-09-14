"use client";

import { Figure } from "@/features/figures-pedia/lib";
import { BaseInput } from "@/features/shared";
import { PenBox, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useEditFigureContext } from "../context";
import { validateMetaData } from "@/features/figures-pedia/add-figures/validate-forms";

const Metadata = () => {
  const { figureData, setFigureData } = useEditFigureContext();

  const sourceAdded = figureData.externalLinks ?? [];

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Figure["externalLinks"][number]>({
    type: "website",
    title: "",
    url: "",
    creator: "",
    source: "",
    date: "",
  });

  const clearData = () => {
    setFormData({
      type: "website",
      title: "",
      url: "",
      creator: "",
      source: "",
      date: "",
    });
  };

  const handleAddSource = () => {
    const errors = validateMetaData(formData);

    if (Object.keys(errors).length > 0) {
      const err =
        errors[Object.keys(errors)[0] as keyof typeof errors] ??
        "Please fill in all required fields";
      // setError(err);
      return toast.error(err);
    }
    // return errorRef.current?.scrollIntoView({ behavior: "smooth" });

    if (editing) {
      const updateSource = sourceAdded.map((source) =>
        source.url === formData.url ? formData : source,
      );

      setFigureData((prev) => ({ ...prev, externalLinks: updateSource }));
      setEditing(false);
    } else {
      setFigureData((prev) => ({
        ...prev,
        externalLinks: [...prev.externalLinks, { ...formData }],
      }));
    }

    clearData();
  };

  const getYear = (date: string) => {
    if (!date) return "n/a";
    return new Date(date).getFullYear();
  };

  const handleEditSource = (url: string) => {
    const source = sourceAdded.find((source) => source.url === url);
    if (source) {
      setEditing(true);
      setFormData(source);
    }
  };

  const handleDeleteSource = (url: string) => {
    const updateSource = sourceAdded.filter((source) => source.url !== url);
    setFigureData((prev) => ({ ...prev, externalLinks: updateSource }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6 mt-8">
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
                  type: e.target.value,
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
            setValue={(e) => setFormData({ ...formData, title: e as string })}
          />

          {formData.type == "website" && (
            <BaseInput
              label="URL"
              placeholder="https://example.com"
              value={formData.url}
              setValue={(e) => setFormData({ ...formData, url: e as string })}
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
              onClick={handleAddSource}
              className="secondary-btn px-14 self-end mt-5"
            >
              {editing ? "Update" : "Add"} Source
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col py-6 h-fit bg-gray-txt-100 rounded-md w-full">
        <div className="flex md:px-8 px-4 items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>Added Sources</h2>
        </div>

        <div className="flex flex-col w-full mt-6">
          <ul className="w-full">
            {sourceAdded.map((source, idx) => {
              if (editing && source.url === formData.url) return null;

              return (
                <li
                  key={idx}
                  className="flex items-center justify-between w-full group py-4 border-b border-gray-txt-50/20 md:px-8 px-4 relative"
                >
                  <p className="flex items-start  gap-3 text-gray-txt-500 italic">
                    <span className="font-medium text-base">{idx + 1}.</span>

                    <span className="break-all">
                      "{source.title}".{" website, "}
                      {source.url}.
                      {/* <span>{" Accessed "}
                      {getYear(source.accessDate)}.
                      </span> */}
                    </span>
                  </p>

                  <div className="absolute right-0 bottom-0 group-hover:flex hidden bg-secondary-bg px-5 py-3 rounded-full gap-6 items-center transition-all duration-300 ease-in-out">
                    <button
                      onClick={() => handleEditSource(source.url)}
                      className="cursor-pointer text-foreground-50"
                    >
                      <PenBox size={22} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => handleDeleteSource(source.url)}
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

export default Metadata;
