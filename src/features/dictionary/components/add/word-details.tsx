"use client";

import { BASE_URL } from "@/utils/constants";
import { Loader, Plus, X } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { validateWordDetails } from "@/features/dictionary/lib/helpers";
import { useWordContext } from "./context";
import {
  BaseInput,
  BaseTextArea,
  ErrorWidget,
  ImageUploader,
} from "@/features/shared";

const uploadImage = async ({
  token,
  formData,
}: {
  token: string;
  formData: FormData;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/word/image/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    toast.error("Failed to upload image");
    return undefined;
  }
};

const WordDetails = ({
  dialects,
}: {
  dialects: { name: string; id: string }[];
}) => {
  const { data, setData, setPage } = useWordContext();
  const maxFileSize = 3 * 1024 * 1024;
  const [error, setError] = useState<string>("");

  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    const res = validateWordDetails(data);
    if (res) {
      toast.error(res);
      return setError(res);
    }

    setError("");
    return setPage("senses");
  };

  return (
    <div className="flex flex-col dark-box px-4 w-full pb-20">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-white font-medium text-lg">Add Word Details</h2>

        <button
          onClick={handleSubmit}
          className="primary-btn font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>

      <ErrorWidget message={error} action={() => setError("")} />

      <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 my-5 rounded-md w-full">
        <div className="flex items-center gap-3">
          <h2>Word Details</h2>
        </div>

        <div className="flex max-md:flex-col md:items-start gap-10">
          <div className="grid md:grid-cols-2 w-full mt-5 gap-4">
            <BaseInput
              placeholder="Enter the Urhobo Word"
              value={data.ota}
              setValue={(val) => setData({ ...data, ota: val as string })}
            />

            <select
              value={data.erevwe}
              onChange={(e) => setData({ ...data, erevwe: e.target.value })}
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

            {data.otaOkpopko && (
              <BaseTextArea
                placeholder="Enter the explanation for this new word"
                styling="col-span-2"
                value={data.creationReason}
                setValue={(val) => setData({ ...data, creationReason: val })}
              />
            )}

            <div className="flex items-center gap-6 md:justify-self-start">
              <label htmlFor="newlyCoined" className="text-sm">
                Is this a newly coined word?
              </label>

              <input
                type="checkbox"
                name="newlyCoined"
                checked={data.otaOkpopko}
                onChange={(e) =>
                  setData({
                    ...data,
                    otaOkpopko: e.target.checked,
                    creationReason: e.target.checked ? "" : "n/a",
                  })
                }
                id="newlyCoined"
                className="w-5 h-5"
              />
            </div>
          </div>

          <ImageUploader
            url={url}
            setUrl={setUrl}
            maxFileSize={maxFileSize}
            onSuccess={(v) => setData({ ...data, image: v })}
          />
        </div>
      </div>
    </div>
  );
};

export default WordDetails;
