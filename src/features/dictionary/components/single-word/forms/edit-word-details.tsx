"use client";

import { SingleWord } from "@/features/dictionary/lib";
import { editWord } from "@/features/dictionary/lib/api/update-word";
import { BaseInput, BaseTextArea, ErrorWidget } from "@/features/shared";
import ModalLayout from "@/features/shared/modal-layout";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";

const EditWordDetails = ({
  word,
  dialects,
  onClose,
}: {
  word: SingleWord;
  dialects: { id: string; name: string }[];
  onClose: () => void;
}) => {
  const [data, setData] = useState({
    ota: word.ota,
    erevwe: word.erevwe,
    otaOkpopko: word.otaOkpopko,
    creationReason: word.creationReason,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = getAccessToken();

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    await editWord({ id: word.id, token, payload: data })
      .then((v) => {
        if (v) {
          onClose();
          router.refresh();
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <ModalLayout size="3xl">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-white font-medium text-base">
            Edit Word Details
          </h2>
        </div>

        <ErrorWidget message={error} action={() => setError("")} />

        <div className="flex flex-col  bg-gray-txt-100 rounded-md w-full">
          <div className="flex max-md:flex-col md:items-start gap-10">
            <div className="grid md:grid-cols-2 grid-cols-1 w-full mt-5 gap-4">
              <BaseInput
                placeholder="Enter the Urhobo Word"
                value={data.ota}
                setValue={(value) => setData({ ...data, ota: value as string })}
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
                  value={data.creationReason}
                  setValue={(value) =>
                    setData({ ...data, creationReason: value })
                  }
                  styling="md:col-span-2"
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
          </div>

          <div className="flex items-center gap-4 mt-5 justify-center">
            <button
              disabled={loading}
              onClick={onClose}
              className="secondary-btn"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleSubmit}
              className="primary-btn px-16"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </ModalLayout>
  );
};

export default EditWordDetails;
