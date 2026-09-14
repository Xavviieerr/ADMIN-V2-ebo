"use client";

import React, { useState } from "react";
import { useEditFigureContext } from "../context";
import { toast } from "sonner";
import SingleBio from "./single-bio";
import { ImageUploads } from "@/features/shared";

const BiographyForm = () => {
  const { figureData: formData, setFigureData: setFormData } =
    useEditFigureContext();

  const bio =
    formData.biography.length > 0
      ? [...formData.biography[0].entries].sort((a, b) => a.order - b.order)
      : [];

  const [singleBio, setSingleBio] = useState<{
    order: number;
    title: string;
    content: string;
    photos: string[];
  }>({
    order: 0,
    title: "",
    content: "",
    photos: [],
  });

  const [editingId, setEditingId] = useState<number>(0);

  const handleAddBio = () => {
    if (bio.length >= 10)
      return toast.error("Maximum of 10 biography entries allowed");

    if (!singleBio.title) return toast.error("Title is required");

    if (!singleBio.content) return toast.error("Body is required");

    const entry = bio.find((bio) => bio.order === editingId);

    if (entry) {
      const newBio = bio.map((item) =>
        item.order === editingId
          ? {
              ...item,
              title: singleBio.title,
              content: singleBio.content,
            }
          : item,
      );

      setFormData((prev) => ({
        ...prev,
        biography: [
          {
            title: "biography",
            overview: "n/a",
            order: 1,
            entries: newBio,
          },
        ],
      }));

      setEditingId(0);
    } else {
      setFormData((prev) => ({
        ...prev,
        biography: [
          {
            title: "biography",
            overview: "n/a",
            order: 1,
            entries: [
              ...bio,
              {
                order: bio.length + 1,
                title: singleBio.title,
                content: singleBio.content,
                photos: singleBio.photos,
              },
            ],
          },
        ],
      }));
    }

    setSingleBio({ order: 0, title: "", content: "", photos: [] });
    return;
  };

  const handleRemoveBio = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      biography: [
        {
          title: "biography",
          overview: "n/a",
          order: 1,
          entries: bio.filter((bio) => bio.order !== id),
        },
      ],
    }));
  };

  const handleEditBio = (id: number) => {
    const entry = bio.find((bio) => bio.order === id);
    if (entry) {
      setEditingId(id);
      setSingleBio(entry);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6  mt-8">
      <div className=" flex flex-col md:px-8 px-4  py-6 bg-gray-txt-100 rounded-md w-full">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>Biography Entries</h2>
        </div>
        <p className="text-sm mt-2 text-gray-txt-50">
          You may add up to 10 entries. Each entry must have a title (e.g Early
          Life, Career, Achievements, etc.) and content. Photos are optional.
        </p>

        <div className="flex flex-col w-full mt-6 gap-4">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter the biography title"
              value={singleBio.title}
              onChange={(e) =>
                setSingleBio({ ...singleBio, title: e.target.value })
              }
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="body">Body</label>
            <textarea
              id="body"
              rows={6}
              placeholder="Enter the biography body"
              value={singleBio.content}
              onChange={(e) =>
                setSingleBio({ ...singleBio, content: e.target.value })
              }
              className="input"
            />
          </div>

          <ImageUploads
            urls={singleBio.photos}
            type="figures"
            onSuccess={(image) => {
              setSingleBio((prev) => ({
                ...prev,
                photos: [...prev.photos, image],
              }));
            }}
          />

          <button
            onClick={handleAddBio}
            className="secondary-btn w-fit mt-5 self-end"
          >
            {editingId ? "Update" : "Add"} Entry
          </button>
        </div>
      </div>

      <div className=" flex flex-col md:px-8 px-4  py-6 bg-gray-txt-100 rounded-md w-full md:max-h-180 overflow-y-auto">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>Added Biographies</h2>
        </div>

        <div className="flex flex-col w-full mt-6 gap-4">
          {bio.length > 0 &&
            bio.map((item) => {
              if (item.order == editingId) return null;
              return (
                <SingleBio
                  key={item.order}
                  entry={item}
                  handleEdit={() => handleEditBio(item.order)}
                  handleDelete={() => handleRemoveBio(item.order)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default BiographyForm;
