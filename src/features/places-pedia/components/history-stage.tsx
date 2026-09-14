"use client";
import { PlaceInfoStage, SingleAccordionEntry } from "@/features/shared";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const HistoryStage = ({ stage }: { stage: PlaceInfoStage }) => {
  const [bio, setBio] = useState<{ id: string; title: string; body: string }[]>(
    [],
  );

  const [singleHistory, setSingleHistory] = useState<{
    id: string;
    title: string;
    body: string;
  }>({
    id: "",
    title: "",
    body: "",
  });

  const [editingId, setEditingId] = useState<string>("");

  const handleAddBio = () => {
    if (bio.length >= 10)
      return toast.error("Maximum of 10 biography entries allowed");

    if (!singleHistory.title) return toast.error("Title is required");

    if (!singleHistory.body) return toast.error("Body is required");

    const entry = bio.find((bio) => bio.id === editingId);

    if (entry) {
      setBio((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: singleHistory.title,
                body: singleHistory.body,
              }
            : item,
        ),
      );

      setEditingId("");
      setSingleHistory({ id: "", title: "", body: "" });
      return;
    }

    setBio((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: singleHistory.title,
        body: singleHistory.body,
      },
    ]);

    setSingleHistory({ id: "", title: "", body: "" });
  };

  const handleRemoveBio = (id: string) => {
    setBio(bio.filter((bio) => bio.id !== id));
  };

  const handleEditBio = (id: string) => {
    const entry = bio.find((bio) => bio.id === id);
    if (entry) {
      setEditingId(id);
      setSingleHistory(entry);
    }
  };

  return (
    <>
      {stage === "history" && (
        <div className="dark-box w-full">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-white font-medium text-lg">2. History</h2>

            <div className="flex items-center gap-4">
              <Link
                href={`/guonopedia/figures/add?status=2`}
                className="primary-btn font-medium"
              >
                Done
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full gap-6  mt-8">
            <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
              <div className="flex items-center gap-3 text-base font-medium">
                <div className="h-3 w-3 rounded-full bg-yellow-600" />
                <h2>Historical Entries</h2>
              </div>
              <p className="text-sm mt-2 text-gray-txt-50">
                You may add up to 10 entries. Each entry must have a title (e.g
                Origin & Founding, Early History,etc.) and a body.
              </p>

              <div className="flex flex-col w-full mt-6 gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Enter the biography title"
                    value={singleHistory.title}
                    onChange={(e) =>
                      setSingleHistory({
                        ...singleHistory,
                        title: e.target.value,
                      })
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
                    value={singleHistory.body}
                    onChange={(e) =>
                      setSingleHistory({
                        ...singleHistory,
                        body: e.target.value,
                      })
                    }
                    className="input"
                  />
                </div>

                <button
                  onClick={handleAddBio}
                  className="secondary-btn w-fit mt-5 self-end"
                >
                  Add Entry
                </button>
              </div>
            </div>

            <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full max-h-150 overflow-y-auto">
              <div className="flex items-center gap-3 text-base font-medium">
                <div className="h-3 w-3 rounded-full bg-yellow-600" />
                <h2>Added Entries</h2>
              </div>

              <div className="flex flex-col w-full mt-6 gap-4">
                {bio.length > 0 &&
                  bio.map((item) => (
                    <SingleAccordionEntry
                      key={item.id}
                      entry={item}
                      handleEdit={() => handleEditBio(item.id)}
                      handleDelete={() => handleRemoveBio(item.id)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryStage;
