"use client";
import { ChevronLeft, Loader2, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { SingleWord } from "@/features/dictionary/lib";
import { getPOS } from "@/helpers";
import { addSense, editSense } from "@/features/dictionary/lib/api";
import {
  AudioInput,
  BaseInput,
  BaseTextArea,
  MultiInput,
} from "@/features/shared";
import SynonymInput from "../../add/synonym-input";

type Initial = {
  kere?: number;
  ekerota: string[];
  upho: string;
  oto: string;
  idje: {
    sentence: string;
    audioUrl: string;
  }[];
  uphoesio: string;
  okpo: {
    ota: string;
    egba: string;
  }[];
  orhan: string[];
  ibuebu: string[];
  ekaeruo: string[];
  odeUfue: string[];
  erevwe: string;
  senseIndex?: number;
  senseId?: string;
};

const AddEditSense = ({
  type = "add",
  selected,
  senseIndex,
  nextKere,
  onClose,
}: {
  type?: "add" | "edit";
  selected?: SingleWord["oho"][number];
  senseIndex?: number;
  nextKere?: number;
  onClose: () => void;
}) => {
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string) ?? "";
  const token = getAccessToken();

  if (type === "edit" && !selected) return null;

  let initialValue: Initial = {
    kere: nextKere,
    ekerota: [] as string[],
    oto: "",
    idje: [{ sentence: "", audioUrl: "" }],
    upho: "",
    okpo: [] as { ota: string; egba: string }[],
    orhan: [] as string[],
    ibuebu: [] as string[],
    ekaeruo: [] as string[],
    uphoesio: "",
    odeUfue: [""] as string[],
    erevwe: "Abgarho",
  };

  useEffect(() => {
    if (type === "edit" && selected) {
      initialValue = {
        ekerota: selected.ekerota,
        oto: selected.oto ?? "",
        idje: selected.idje ?? [{ sentence: "", audioUrl: "" }],
        okpo: selected.okpo ?? [],
        orhan: selected.orhan ?? [],
        ibuebu: selected.ibuebu ?? [],
        ekaeruo: selected.ekaeruo ?? [],
        upho: selected.upho ?? "",
        uphoesio: selected.uphoesio ?? "",
        odeUfue: selected.odeUfue ?? [],
        erevwe: selected.erevwe ?? "",
        senseIndex: senseIndex,
        senseId: selected.id,
      };
      setForm(initialValue);
    }
  }, [selected, type]);

  const [form, setForm] = useState<typeof initialValue>(initialValue);

  const [loading, setLoading] = useState(false);

  const pos = getPOS("urh");

  const handleSubmit = async () => {
    setLoading(true);
    const payload = JSON.stringify(form);

    if (type == "edit") {
      await editSense({ id, token, payload })
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

    await addSense({ id, token, payload })
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
    <div className="flex flex-col md:px-4  w-full shrink-0">
      <button
        onClick={onClose}
        className="flex items-center cursor-pointer hover:text-foreground-50 gap-3 text-base font-medium"
      >
        <ChevronLeft />
        <h2 className="capitalize">{type} Sense</h2>
      </button>

      <div className="grid md:grid-cols-2 grid-cols-1 items-end w-full gap-4 mt-4">
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
          <h2>Examples</h2>

          <div className="grid grid-col-1 md:grid-cols-2 gap-4">
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

export default AddEditSense;
