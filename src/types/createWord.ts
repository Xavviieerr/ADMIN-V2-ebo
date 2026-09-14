// Type for related words or synonyms
type RelatedWord = {
    ota: string;
    egba: string;
  };
  
  // Type for media items (audio, images, etc.)
  type MediaItem = {
    type: "photo" | "illustration" | string;
    url: string;
  };
  
  // Type for translations in different languages
  type Translation = {
    ota: string;
    ekerota: string[];
    oto: string;
    idje: string[];
    omra: string[];
    oma: MediaItem[];
    okpo: RelatedWord[];
    upho?: string;
    uphoesio?: string;
    orhan: string[];
    ibuebu: string[];
    ekaeruo: string[];
    odeUfue: string[];
  };
  
  // Type for the main word entry
  type WordEntry = {
    kere: number;
    erevwe: string;
    upho: string;
    ekerota: string[];
    oto: string;
    idje: string[];
    omra: string[];
    oma: MediaItem[];
    uphoesio?: string;
    okpo: RelatedWord[];
    orhan: string[];
    ibuebu: string[];
    ekaeruo: string[];
    odeUfue: string[];
    translations: {
      [languageCode: string]: Translation;
    };
  };
  
  // Root type for the create word request
  export type CreateWordRequest = {
    ota: string;
    oka: number;
    otaOkpopko: string;
    oho: WordEntry[];
  };
  