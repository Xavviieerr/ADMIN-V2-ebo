import { Oho, SenseData } from "../types";

type FormatSense = ({
  index,
  image,
  urh,
  eng,
  kor,
}: {
  index: number;
  image?: string;
  urh: SenseData;
  eng: SenseData;
  kor: SenseData;
}) => Oho;

export const formatSenses: FormatSense = ({ index, image, urh, eng, kor }) => {
  const oho = {
    kere: index,
    ekerota: [urh.partOfSpeech],
    upho: urh.pronunciation,
    oto: urh.meaning,
    otoOmra: "",
    idje: [...urh.examples],
    omra: urh.audioUrl ? [urh.audioUrl] : [],
    oma: image
      ? [
          {
            type: "photo",
            url: image,
          },
        ]
      : [],
    uphoesio: urh.IPA,
    okpo: [...urh.synonyms],
    orhan: [...urh.antonyms],
    ibuebu: [...urh.plurals],
    ekaeruo: [...urh.relatedWords],
    odeUfue: urh.scientificName ? [urh.scientificName] : [],
    translations: {
      eng: {
        ota: eng.headWord,
        ekerota: [eng.partOfSpeech],
        oto: eng.meaning,
        otoOmra: "",
        idje: [...eng.examples],
        omra: eng.audioUrl ? [eng.audioUrl] : [],
        oma: [],
        okpo: [...eng.synonyms],
        uphoesio: eng.IPA,
        upho: eng.pronunciation,
        orhan: [...eng.antonyms],
        ibuebu: [...eng.plurals],
        ekaeruo: [...eng.relatedWords],
        odeUfue: [eng.scientificName],
      },
      kor: kor.headWord
        ? {
            ota: kor.headWord,
            ekerota: [kor.partOfSpeech],
            oto: kor.meaning,
            otoOmra: "",
            idje: [...kor.examples],
            omra: kor.audioUrl ? [kor.audioUrl] : [],
            oma: [],
            okpo: [...kor.synonyms],
            upho: kor.pronunciation,
            uphoesio: kor.IPA,
            orhan: [...kor.antonyms],
            ibuebu: [...kor.plurals],
            ekaeruo: [...kor.relatedWords],
            odeUfue: kor.scientificName ? [kor.scientificName] : [],
          }
        : undefined,
    },
  };

  return oho;
};
