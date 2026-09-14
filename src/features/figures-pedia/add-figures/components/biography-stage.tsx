"use client";
import { ErrorWidget, FigureInfoStage, ImageUploads } from "@/features/shared";
import React, { useState } from "react";
import { toast } from "sonner";
import BioEntry from "./bio-entry";
import { useAddFigureCTX } from "./context";
import { useRouter } from "next/navigation";

const BiographyStage = ({ stage }: { stage: FigureInfoStage }) => {
  const { basicInfo, setBasicInfo, saveToLocal } = useAddFigureCTX();
  const router = useRouter();
  const [bio, setBio] = useState<
    {
      order: number;
      title: string;
      content: string;
      photos: string[];
    }[]
  >(basicInfo.biography[0]?.entries || []);

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
  const [error, setError] = useState("");

  const handleAddBio = () => {
    setError("");
    if (bio.length >= 10) {
      setError("Maximum of 10 biography entries allowed");
      return;
    }

    if (!singleBio.title) {
      setError("Title is required");
      return;
    }

    if (!singleBio.content) return toast.error("Body is required");

    const entry = bio.find((bio) => bio.order === editingId);

    if (entry) {
      setBio((prev) =>
        prev.map((item) =>
          item.order === editingId
            ? {
                ...item,
                title: singleBio.title,
                content: singleBio.content,
              }
            : item,
        ),
      );

      setEditingId(0);
      setSingleBio({ order: 0, title: "", content: "", photos: [] });
      return;
    }

    setBio((prev) => [
      ...prev,
      {
        order: bio.length + 1,
        title: singleBio.title,
        content: singleBio.content,
        photos: singleBio.photos,
      },
    ]);

    setSingleBio({ order: 0, title: "", content: "", photos: [] });
  };

  const handleRemoveBio = (id: number) => {
    setBio(bio.filter((bio) => bio.order !== id));
  };

  const handleEditBio = (id: number) => {
    setError("");
    const entry = bio.find((bio) => bio.order === id);
    if (entry) {
      setEditingId(id);
      setSingleBio(entry);
    }
  };

  const handleSubmit = () => {
    setError("");

    if (bio.length < 1) {
      setError("You must add atleast one biography entry to continue");
      return;
    }

    const newBasicInfo = {
      ...basicInfo,
      biography: [
        {
          title: "biography",
          overview: "n/a",
          order: 1,
          entries: bio,
        },
      ],
    };

    setBasicInfo((prev) => newBasicInfo);

    saveToLocal(newBasicInfo);
    router.replace(`/guonopedia/figures/add`);
  };

  return (
    <>
      {stage === "biography" && (
        <div className="dark-box max-md:px-0 w-full">
          <div className="flex items-center justify-between gap-4 max-md:px-3">
            <h2 className="text-white font-medium text-lg">2. Biography</h2>

            {bio.length > 0 && (
              <div className="flex items-center gap-4">
                <button onClick={handleSubmit} className="primary-btn py-2">
                  Done
                </button>
              </div>
            )}
          </div>

          <ErrorWidget message={error} action={() => setError("")} />

          <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-6 mt-8">
            <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full">
              <div className="flex items-center gap-3 text-base font-medium">
                <div className="h-3 w-3 rounded-full bg-yellow-600" />
                <h2>Biography Entries</h2>
              </div>
              <p className="text-sm mt-2 text-gray-txt-50">
                You may add up to 10 entries. Each entry must have a title (e.g
                Early Life, Career, Achievements, etc.) and content. Photos are
                optional.
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

            <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full max-h-150 overflow-y-auto">
              <div className="flex items-center gap-3 text-base font-medium">
                <div className="h-3 w-3 rounded-full bg-yellow-600" />
                <h2>Added Biographies</h2>
              </div>

              <div className="flex flex-col w-full mt-6 gap-4">
                {bio.length > 0 &&
                  bio.map((item) => {
                    if (item.order == editingId) return null;
                    return (
                      <BioEntry
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
        </div>
      )}
    </>
  );
};

export default BiographyStage;
