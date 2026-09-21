"use client";

import React, { useState } from "react";
import { useSingleWordContext } from "../context";
import { SingleWord } from "@/features/dictionary/lib";
import {
  AudioInput,
  BaseInput,
  BaseTextArea,
  MultiInput,
} from "@/features/shared";
import { getPOS } from "@/helpers";
import SynonymInput from "../../add/synonym-input";
import { ChevronLeft, Loader2 } from "lucide-react";
import { addTranslation, editTranslation } from "@/features/dictionary/lib/api";
import { useParams, useRouter } from "next/navigation";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";

type Initial = {
  ota: string;
  ekerota: string[];
  oto: string;
  idje: {
    sentence: string;
    audioUrl: string;
  }[];
  upho: string;
  okpo: {
    ota: string;
    egba: string;
  }[];
  orhan: string[];
  ibuebu: string[];
  ekaeruo: string[];
  uphoesio: string;
  odeUfue: string[];
  languageType: string;

  translationIndex?: number;
  translationId?: string;
};

const AddTranslationForm = ({
  selected,
  transIndex,
  type = "add",
  onClose,
}: {
  selected?: SingleWord["efaEng"][number];
  type?: "add" | "edit";
  transIndex?: number;
  onClose: () => void;
}) => {
  const { lang } = useSingleWordContext();
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string) ?? "";
  const token = getAccessToken();

  const defaultInitialValue: Initial = {
    ota: "",
    ekerota: [] as string[],
    oto: "",
    idje: [{ sentence: "", audioUrl: "" }],
    upho: "",
    okpo: [] as { ota: string; egba: string }[],
    orhan: [] as string[],
    ibuebu: [] as string[],
    ekaeruo: [] as string[],
    uphoesio: "",
    odeUfue: [] as string[],
    languageType: lang.toLowerCase(),
  };

  const [form, setForm] = useState<Initial>(() => {
    if (type === "edit" && selected) {
      const idje = selected.details.idje;
      return {
        ota: selected.otaWord ?? "",
        ekerota: selected.details.ekerota ?? [],
        oto: selected.details.oto ?? "",
        idje: idje && idje.length > 0 ? idje : [{ sentence: "", audioUrl: "" }],
        upho: selected.details.upho ?? "",
        okpo: selected.details.okpo ?? [],
        orhan: selected.details.orhan ?? [],
        ibuebu: selected.details.ibuebu ?? [],
        ekaeruo: selected.details.ekaeruo ?? [],
        uphoesio: selected.details.uphoesio ?? "",
        odeUfue: selected.details.odeUfue ?? [],
        languageType: lang.toLowerCase(),
        translationIndex: transIndex,
        translationId: selected.id,
      };
    }
    return defaultInitialValue;
  });

  const [loading, setLoading] = useState(false);

  if (type === "edit" && !selected) return null;

  const formatLang = () => {
    const lowLang = lang.toLowerCase();
    if (lowLang === "english") return "eng";
    if (lowLang === "korean") return "kor";
    return "urh";
  };

  const pos = getPOS(formatLang());

  const handleSubmit = async () => {
    setLoading(true);
    const payload = JSON.stringify(form);

    if (type == "edit") {
      await editTranslation({ id, token, payload })
        .then((v) => {
          if (v) {
            onClose();
            router.refresh();
          }
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    await addTranslation({ id, token, payload })
      .then((v) => {
        if (v) {
          onClose();
          router.refresh();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col md:px-4 w-full shrink-0">
      <button
        onClick={onClose}
        className="flex items-center cursor-pointer hover:text-foreground-50 gap-3 text-base font-medium"
      >
        <ChevronLeft />
        <h2 className="capitalize">
          {lang.toLowerCase() === "korean"
            ? "Korean Translation"
            : "English Translation"}
        </h2>
      </button>

      <div className="grid md:grid-cols-2 grid-cols-1 items-end w-full gap-4 mt-4">
        <BaseInput
          placeholder="Word translation"
          value={form.ota}
          setValue={(value) => setForm({ ...form, ota: value as string })}
        />

        <select
          value={form.ekerota[0]}
          onChange={(e) => setForm({ ...form, ekerota: [e.target.value] })}
          id="pos"
          className="input h-12 capitalize bg-secondary-bg"
        >
          {pos.map((pos) => (
            <option
              key={pos}
              value={pos}
              className="text-white bg-secondary-bg capitalize"
            >
              {pos}
            </option>
          ))}
        </select>

        <>
          <BaseInput
            placeholder="Pronunciation"
            value={form.upho}
            setValue={(value) => setForm({ ...form, upho: value as string })}
          />

          <BaseInput
            placeholder="IPA"
            value={form.uphoesio}
            setValue={(value) =>
              setForm({ ...form, uphoesio: value as string })
            }
          />

          <BaseInput
            placeholder="Scientific Name"
            value={form.odeUfue[0]}
            setValue={(value) =>
              setForm({ ...form, odeUfue: [value as string] })
            }
          />
        </>

        {/* Plurals, Synonyms, Antonyms, Related Words */}
        <>
          <MultiInput
            placeholder="Plural forms of the word"
            values={form.ibuebu}
            removeValue={(value) =>
              setForm({
                ...form,
                ibuebu: form.ibuebu.filter((t) => t !== value),
              })
            }
            addValue={(value) =>
              setForm({
                ...form,
                ibuebu: [...form.ibuebu, value],
              })
            }
          />

          <SynonymInput
            placeholder="Synonyms of the word"
            values={form.okpo.map((t) => t.ota)}
            removeValue={(value) =>
              setForm({
                ...form,
                okpo: form.okpo.filter((t) => t.ota !== value),
              })
            }
            addValue={(value) =>
              setForm({
                ...form,
                okpo: [...form.okpo, value],
              })
            }
          />

          <MultiInput
            placeholder="Antonyms of the word"
            values={form.orhan}
            removeValue={(value) =>
              setForm({
                ...form,
                orhan: form.orhan.filter((t) => t !== value),
              })
            }
            addValue={(value) =>
              setForm({
                ...form,
                orhan: [...form.orhan, value],
              })
            }
          />

          <MultiInput
            placeholder="Related words"
            values={form.ekaeruo}
            removeValue={(value) =>
              setForm({
                ...form,
                ekaeruo: form.ekaeruo.filter((t) => t !== value),
              })
            }
            addValue={(value) =>
              setForm({
                ...form,
                ekaeruo: [...form.ekaeruo, value],
              })
            }
          />
        </>

        <BaseTextArea
          placeholder="Meaning of the word"
          rows={3}
          value={form.oto}
          setValue={(value) => setForm({ ...form, oto: value })}
          styling="md:col-span-2"
        />

        <hr className="border border-gray-txt-100/50 h-px my-4 md:col-span-2" />

        {/* Examples */}
        <div className="flex flex-col  md:col-span-2 gap-4">
          <h2>
            {lang.toLowerCase() === "korean"
              ? "Korean Examples"
              : "English Examples"}
          </h2>

          <div className="grid grid-col md:grid-cols-2 gap-4">
            {form.idje.map((example, index) => (
              <div key={index} className="flex flex-col w-full">
                <div className="flex items-center gap-4 w-full">
                  <AudioInput
                    placeholder={`Example ${index + 1}`}
                    input={example.sentence}
                    audioUrl={example.audioUrl}
                    showDelete={form.idje.length > 1}
                    setValue={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        idje: prev.idje.map((ex, i) =>
                          i === index ? { ...ex, sentence: value } : ex,
                        ),
                      }))
                    }
                    setAudio={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        idje: prev.idje.map((ex, i) =>
                          i === index ? { ...ex, audioUrl: value } : ex,
                        ),
                      }))
                    }
                    handleDelete={() => {
                      setForm((prev) => ({
                        ...prev,
                        idje: prev.idje.filter((_, i) => i !== index),
                      }));
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setForm((prev) => ({
                ...prev,
                idje: [...prev.idje, { sentence: "", audioUrl: "" }],
              }));
            }}
            className="secondary-btn px-10"
          >
            Add another example
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onClose}
          className="secondary-btn mt-8 md:px-16 px-5 self-center"
          type="button"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="primary-btn mt-8 px-16 self-center"
          type="button"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default AddTranslationForm;
