"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

type FormData = {
  id: string;
  type: "article" | "book" | "interview" | "oral history" | "website";

  //articles & books
  title: string;
  author: string;
  publishedBy: string;
  publishedOn: string;

  //for websites
  url: string;
  accessDate: string;

  //for interviews & oral history
  speaker: string;
  date: string;

  context: string;
};

const MetadataStage = ({ stage }: { stage: "metadata" | any }) => {
  const [sourceAdded, setSourceAdded] = useState<FormData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    type: "article",

    title: "",
    author: "",
    publishedBy: "",
    publishedOn: "",

    url: "",
    accessDate: "",

    speaker: "",
    date: "",

    context: "",
  });

  const clearData = () => {
    setFormData({
      id: "",
      type: "article",
      title: "",
      author: "",
      publishedBy: "",
      publishedOn: "",
      url: "",
      accessDate: "",
      speaker: "",
      date: "",
      context: "",
    });
  };

  const handleAddSource = () => {
    if (formData.type === "article" || formData.type === "book") {
      if (
        !formData.title ||
        !formData.author ||
        !formData.publishedBy ||
        !formData.publishedOn
      )
        return toast.error("Please fill in all fields for this source");
    }

    if (formData.type === "website") {
      if (!formData.url || !formData.accessDate)
        return toast.error("Please fill in all fields for this source");
    }

    if (formData.type === "interview" || formData.type === "oral history") {
      if (!formData.speaker || !formData.date)
        return toast.error("Please fill in all fields for this source");
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

  const breakAuthors = (author: string) => {
    if (!author) return "";
    const authors = author.split(",").map((author) => author.trim());
    if (authors.length == 1) return authors[0];
    return authors[0] + " et al";
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

  return (
    <>
      {stage === "metadata" && (
        <div className="dark-box w-full">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-white font-medium text-lg">
              3. MetaData & Sources
            </h2>

            <div className="flex items-center gap-4">
              <Link
                href={`/guonopedia/figures/add?status=3`}
                className="primary-btn font-medium"
              >
                Done
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full gap-6 mt-8">
            <div className="flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
              <div className="flex items-center gap-3 text-base font-medium">
                <div className="h-3 w-3 rounded-full bg-yellow-600" />
                <h2>Sources & External Links</h2>
              </div>

              <div className="flex flex-col w-full mt-6 gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="gender">Source Type</label>
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
                    {[
                      "article",
                      "book",
                      "interview",
                      "oral history",
                      "website",
                    ].map((type) => (
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

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Enter the source title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="input"
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="context">Context</label>
                  <input
                    type="text"
                    id="context"
                    placeholder="e.g., the specific parts of the biography that this source is relevant to"
                    value={formData.context}
                    onChange={(e) =>
                      setFormData({ ...formData, context: e.target.value })
                    }
                    className="input"
                  />
                </div>

                {(formData.type === "article" || formData.type === "book") && (
                  <>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="author">Author(s)</label>
                      <input
                        type="text"
                        id="author"
                        placeholder="Enter the author(s) name. If more than one, separate with commas."
                        value={formData.author}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        className="input"
                      />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="publishedBy">Publisher</label>
                      <input
                        type="text"
                        id="publishedBy"
                        placeholder="Enter the publisher name"
                        value={formData.publishedBy}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            publishedBy: e.target.value,
                          })
                        }
                        className="input"
                      />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="publishedOn">Publication Date</label>
                      <input
                        type="date"
                        id="publishedOn"
                        value={formData.publishedOn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            publishedOn: e.target.value,
                          })
                        }
                        className="input"
                      />
                    </div>
                  </>
                )}

                {formData.type === "website" && (
                  <>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="url">URL</label>
                      <input
                        type="text"
                        id="url"
                        placeholder="Enter the url"
                        value={formData.url}
                        onChange={(e) =>
                          setFormData({ ...formData, url: e.target.value })
                        }
                        className="input"
                      />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="accessDate">Access Date</label>
                      <input
                        type="date"
                        id="accessDate"
                        value={formData.accessDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accessDate: e.target.value,
                          })
                        }
                        className="input"
                      />
                    </div>
                  </>
                )}

                {(formData.type === "interview" ||
                  formData.type === "oral history") && (
                  <>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="speaker">
                        {formData.type === "interview"
                          ? "Interviewer's Name"
                          : "Narrator's Name"}
                      </label>
                      <input
                        type="text"
                        id="speaker"
                        placeholder={
                          formData.type === "interview"
                            ? "Enter the Interviewer's name"
                            : "Enter the narrator's name"
                        }
                        value={formData.speaker}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            speaker: e.target.value,
                          })
                        }
                        className="input"
                      />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="date">
                        {formData.type === "interview"
                          ? "Interview Date"
                          : "Narration Date"}
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            date: e.target.value,
                          })
                        }
                        className="input"
                      />
                    </div>
                  </>
                )}

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

            <div className="flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
              <div className="flex items-center gap-3 text-base font-medium">
                <div className="h-3 w-3 rounded-full bg-yellow-600" />
                <h2>Added Sources</h2>
              </div>

              <div className="flex flex-col w-full mt-6 px-1">
                <ul className="w-full">
                  {sourceAdded.map((source, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between w-full hover:border-b border-gray-txt-50/50 group pb-3 relative"
                    >
                      <p className="flex items-start  gap-3 text-gray-txt-500 italic">
                        <span className="font-medium text-base">
                          {idx + 1}.
                        </span>
                        {(source.type === "article" ||
                          source.type === "book") && (
                          <span className="">
                            {breakAuthors(source.author)}. "{source.title}".{" "}
                            {source.publishedBy}, {getYear(source.publishedOn)}.
                          </span>
                        )}
                        {source.type === "website" && (
                          <span className="">
                            "{source.title}".{" website, "}
                            {source.url}.{" Accessed "}
                            {getYear(source.accessDate)}.
                          </span>
                        )}
                        {source.type === "interview" && (
                          <span className="">
                            "{source.title}".{" Interview of "}
                            {source.speaker}.{" Conducted "}
                            {getYear(source.date)}.
                          </span>
                        )}
                        {source.type === "oral history" && (
                          <span className="">
                            "{source.title}".{" Narrated by "}
                            {source.speaker}.{" Narrated "}
                            {getYear(source.date)}.
                          </span>
                        )}
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
                  ))}
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
