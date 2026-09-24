import React from "react";
import { PayloadData } from "@/features/dictionary/lib";
import { KeyValueParagraph } from "@/features/shared";

const SensesList = ({ data }: { data: PayloadData }) => {
  return data.oho.map((sense, i) => (
    <div key={i} className="input flex max-md:flex-col gap-3 py-7 font-normal">
      {/* <p>{sense.kere}</p> */}

      <div className="md:w-1/2 w-full flex flex-col gap-3 md:pr-5">
        <KeyValueParagraph item="Pronunciation" value={sense.upho} />

        <KeyValueParagraph item="IPA" value={sense.uphoesio} />

        <KeyValueParagraph item="Meaning" value={sense.oto} col />

        <KeyValueParagraph
          item="Part of Speech"
          value={sense.ekerota.join(", ")}
        />

        {sense.ibuebu.length > 0 && (
          <KeyValueParagraph item="Plurals" value={sense.ibuebu.join(", ")} />
        )}

        {sense.okpo.length > 0 && (
          <KeyValueParagraph
            item="Synonyms"
            value={sense.okpo.map((item) => item.ota).join(", ")}
          />
        )}

        {sense.orhan.length > 0 && (
          <KeyValueParagraph item="Antonyms" value={sense.orhan.join(", ")} />
        )}

        {sense.ekaeruo.length > 0 && (
          <KeyValueParagraph
            item="Related Words"
            value={sense.ekaeruo.join(", ")}
          />
        )}
      </div>

      <div className="flex flex-col md:pl-5 md:border-l max-md:border-t max-md:pt-5 border-gray-txt-50 md:w-1/2 w-full gap-3 max-md:text-sm">
        <p>Examples</p>
        <ul className="text-gray-txt-50 ml-4 italic flex flex-col gap-2">
          {sense.idje.map((ex, i) => (
            <li key={i}>
              {i + 1}. {ex.sentence}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ));
};

export default SensesList;
