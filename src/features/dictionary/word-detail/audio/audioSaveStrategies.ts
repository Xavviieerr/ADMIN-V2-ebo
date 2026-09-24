type SenseAudioArgs = {
  wordId: string;
  senseId: string;
  senseIndex: number;
  url: string;
};

type SenseExampleAudioArgs = SenseAudioArgs & {
  exampleSentenceIndex: number;
};

type TranslationAudioArgs = {
  wordId: string;
  translationId: string;
  translationIndex: number;
  languageType: string;
  url: string;
};

type TranslationExampleAudioArgs = TranslationAudioArgs & {
  exampleSentenceIndex: number;
};

type UnwrapPromise = { unwrap: () => Promise<unknown> };

type AudioSaveMutations = {
  saveSenseAudio: (args: SenseAudioArgs) => UnwrapPromise;
  saveSenseExampleAudio: (args: SenseExampleAudioArgs) => UnwrapPromise;
  saveTranslationAudio: (args: TranslationAudioArgs) => UnwrapPromise;
  saveTranslationExampleAudio: (
    args: TranslationExampleAudioArgs,
  ) => UnwrapPromise;
};

type AudioPayload =
  | { senseId: string; senseIndex: number; exampleSentenceIndex?: number }
  | {
      translationId: string;
      translationIndex: number;
      languageType: string;
      exampleSentenceIndex?: number;
    };

export async function saveUploadedAudio({
  type,
  wordId,
  payload,
  url,
  mutations,
}: {
  type: "sense" | "senseExample" | "translation" | "translationExample";
  wordId: string;
  payload: AudioPayload;
  url: string;
  mutations: AudioSaveMutations;
}): Promise<void> {
  if (type === "sense") {
    const p = payload as { senseId: string; senseIndex: number };
    await mutations
      .saveSenseAudio({
        wordId,
        senseId: p.senseId,
        senseIndex: p.senseIndex,
        url,
      })
      .unwrap();
  }

  if (type === "senseExample") {
    const p = payload as {
      exampleSentenceIndex: number;
      senseId: string;
      senseIndex: number;
    };
    await mutations
      .saveSenseExampleAudio({
        wordId,
        senseId: p.senseId,
        senseIndex: p.senseIndex,
        exampleSentenceIndex: p.exampleSentenceIndex,
        url,
      })
      .unwrap();
  }

  if (type === "translation") {
    const p = payload as {
      translationId: string;
      translationIndex: number;
      languageType: string;
    };
    await mutations
      .saveTranslationAudio({
        wordId,
        translationId: p.translationId,
        translationIndex: p.translationIndex,
        languageType: p.languageType,
        url,
      })
      .unwrap();
  }

  if (type === "translationExample") {
    const p = payload as {
      translationId: string;
      translationIndex: number;
      languageType: string;
      exampleSentenceIndex: number;
    };
    await mutations
      .saveTranslationExampleAudio({
        wordId,
        translationId: p.translationId,
        translationIndex: p.translationIndex,
        languageType: p.languageType,
        exampleSentenceIndex: p.exampleSentenceIndex,
        url,
      })
      .unwrap();
  }
}
