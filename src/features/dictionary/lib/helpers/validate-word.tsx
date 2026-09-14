import { PayloadData, Senses } from "@/features/dictionary/lib";

export const validateWordDetails = (data: PayloadData) => {
  if (!data.ota) return "Please enter the Urhobo word";
  if (!data.erevwe) return "Please select a dialect";
  // if (!data.image) return "Please upload an image";
  if (data.otaOkpopko && !data.creationReason)
    return "Please enter the explanation for this new word";
  return;
};

export const validateSenseDetails = (sense: Senses) => {
  //Urh Validations
  if (!sense.urhData.headWord.trim()) return "Please enter the Urhobo word";

  if (!sense.urhData.partOfSpeech)
    return "Please enter the Urhobo part of speech";

  if (!sense.urhData.meaning) return "Please enter the Urhobo meaning";

  if (!sense.urhData.pronunciation)
    return "Please enter the Urhobo pronunciation";

  if (!sense.urhData.IPA) return "Please enter the Urhobo IPA";

  if (!sense.urhData.examples || !sense.urhData.examples[0].sentence.trim())
    return "Please enter the Urhobo examples";

  //Eng Validations
  if (!sense.engData.headWord.trim()) return "Please enter the English word";

  if (!sense.engData.partOfSpeech)
    return "Please enter the English part of speech";

  if (!sense.engData.meaning) return "Please enter the English meaning";

  if (!sense.engData.pronunciation)
    return "Please enter the English pronunciation";

  if (!sense.engData.IPA) return "Please enter the English IPA";

  if (!sense.engData.examples || !sense.engData.examples[0].sentence.trim())
    return "Please enter the English examples";

  //Kor Validations
  if (sense.korData.headWord.trim()) {
    if (!sense.korData.partOfSpeech)
      return "Please enter the Korean part of speech";

    if (!sense.korData.meaning) return "Please enter the Korean meaning";

    if (!sense.korData.pronunciation)
      return "Please enter the Korean pronunciation";

    if (!sense.korData.IPA) return "Please enter the Korean IPA";

    if (!sense.korData.examples || !sense.korData.examples[0].sentence.trim())
      return "Please enter the Korean examples";
  }

  if (sense.urhData.examples.length !== sense.engData.examples.length)
    return "Please enter the same number of examples for urhobo and english";

  if (
    sense.korData.headWord.trim() &&
    sense.korData.examples.length !== sense.urhData.examples.length
  )
    return "Please enter the same number of examples for urhobo and korean";

  return;
};
