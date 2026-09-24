import React from "react";
import { SingleWord } from "@/features/dictionary/lib";
import { KeyValueParagraph } from "@/features/shared";
import PlayAudioButton from "./play-audio";
import AudioUploader from "./audio-uploader";
import SenseImageManager from "./sense-image-manager";
import { DeleteSenseButton, EditSenseButton } from "./buttons";
import PermissionGate from "@/features/shared/permission-gate";

const SensesList = ({ senses }: { senses: SingleWord["oho"] }) => {
  return senses.map((sense, senseIndex) => (
    <div
      key={senseIndex}
      className="input flex flex-col gap-3 py-5 mb-5 font-normal relative"
    >
      <div className="flex max-md:flex-col-reverse items-start justify-between gap-4 md:gap-10">
        {/* <div className="flex items-center gap-3 text-lg md:text-2xl leading-none">
          <p>{sense.kere}</p>
        </div> */}
        <div className="flex max-md:flex-col w-full items-start gap-4 justify-between mt-5">
          <div className="w-full flex flex-col gap-3 ">
            <KeyValueParagraph item="Pronunciation" value={sense.upho} />
            <KeyValueParagraph item="IPA" value={`/ ${sense.uphoesio} /`} />

            <KeyValueParagraph
              item="Part of Speech"
              value={sense.ekerota?.join(", ")}
            />

            {sense.ibuebu?.length > 0 && (
              <KeyValueParagraph
                item="Plurals"
                value={sense.ibuebu.join(", ")}
              />
            )}

            {sense.okpo?.length > 0 && (
              <KeyValueParagraph
                item="Synonyms"
                value={sense.okpo.map((s) => s.ota).join(", ")}
              />
            )}

            {sense.orhan?.length > 0 && (
              <KeyValueParagraph
                item="Antonyms"
                value={sense.orhan.join(", ")}
              />
            )}

            {sense.ekaeruo?.length > 0 && (
              <KeyValueParagraph
                item="Related Words"
                value={sense.ekaeruo.join(", ")}
              />
            )}
            <KeyValueParagraph item="Meaning" value={sense.oto} col />
          </div>

          <div className="flex flex-col max-md:border-t max-md:pt-5 md:border-l md:pl-5  border-gray-txt-50/50 w-full gap-3 max-md:text-sm">
            <p>Examples</p>
            <div className="text-gray-txt-50 ml-4 italic flex flex-col gap-2">
              {(sense.idje ?? []).map((ex, i) => (
                <div
                  className="flex items-center justify-between gap-4"
                  key={i}
                >
                  <p>
                    {i + 1}. {ex.sentence}
                  </p>

                  <div className="flex items-center gap-2">
                    {ex.audioUrl && (
                      <PlayAudioButton audioUrl={ex.audioUrl} size={22} />
                    )}

                    <AudioUploader
                      type="senseExample"
                      payload={{
                        exampleSentenceIndex: i + 1,
                        senseId: sense.id,
                        senseIndex: senseIndex + 1,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 max-md:w-full w-fit pl-5 shrink-0">
          <PermissionGate permission="add_word">
            <div className="flex items-center gap-2 border-b md:w-fit pb-2 border-gray-txt-50/50 w-full justify-end">
              <EditSenseButton
                sense={sense}
                index={senseIndex + 1}
              />

              <DeleteSenseButton
                payload={{
                  senseId: sense.id,
                  senseIndex: senseIndex + 1,
                }}
                size={28}
              />
            </div>
          </PermissionGate>

          <SenseImageManager oho={sense} />
        </div>
      </div>
    </div>
  ));
};

export default SensesList;
