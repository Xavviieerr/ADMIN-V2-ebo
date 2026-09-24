export type PayloadData = {
  ota: string;
  oka: number;
  otaOkpopko: boolean;
  creationReason: string;
  erevwe: string;
  image: string;
  oho: Oho[];
};

export type Senses = {
  urhData: SenseData;
  engData: SenseData;
  korData: SenseData;
};

export type SenseData = {
  headWord: string;
  audioUrl: string;
  partOfSpeech: string;
  meaning: string;
  pronunciation: string;
  IPA: string;
  scientificName: string;
  plurals: string[];
  synonyms: { ota: string; egba: string }[];
  antonyms: string[];
  relatedWords: string[];
  examples: {
    sentence: string;
    audioUrl: string;
  }[];
};

export type Oho = {
  kere: number;
  ekerota: string[];
  upho: string;
  oto: string;
  otoOmra: string;
  idje: {
    sentence: string;
    audioUrl: string;
  }[];
  omra: string[];
  oma: {
    type: string;
    url: string;
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
  translations: {
    eng: {
      ota: string;
      ekerota: string[];
      oto: string;
      otoOmra: string;
      idje: {
        sentence: string;
        audioUrl: string;
      }[];
      omra: string[];
      oma: {
        type: string;
        url: string;
      }[];
      okpo: {
        ota: string;
        egba: string;
      }[];
      uphoesio: string;
      upho: string;
      orhan: string[];
      ibuebu: string[];
      ekaeruo: string[];
      odeUfue: string[];
    };
    kor?: {
      ota: string;
      ekerota: string[];
      oto: string;
      otoOmra: string;
      idje: {
        sentence: string;
        audioUrl: string;
      }[];
      omra: string[];
      oma: {
        type: string;
        url: string;
      }[];
      okpo: {
        ota: string;
        egba: string;
      }[];
      upho: string;
      uphoesio: string;
      orhan: string[];
      ibuebu: string[];
      ekaeruo: string[];
      odeUfue: string[];
    };
  };
};

export type SingleWord = {
  id: string;
  ota: string;
  erevwe: string;
  status: string;

  creationReason: string;
  approvedBy: string | null;
  rejectionReason: string | null;
  rejectedBy: string | null;
  reviewedBy: string | null;

  otaOkpopko: boolean;
  oka: number;
  rowVersion: number;

  createdAt: string;
  updatedAt: string;

  createdBy: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };

  directQueryCount: number;
  lastAccessed: string;

  metadata: Metadata[];

  oho: {
    id: string;
    otaId: string;
    kere: number;
    erevwe: string;

    ekerota: string[];
    oto: string;
    otoOmra: string;

    idje: {
      sentence: string;
      audioUrl: string;
    }[];

    upho: string;

    okpo: {
      ota: string;
      egba: string;
    }[];
    ibuebu: string[];
    orhan: string[];
    ekaeruo: string[];

    oma: {
      type: string;
      url: string;
    }[];
    omra: string[];

    odeUfue: string[];

    uphoesio: string;

    createdAt: string;
    updatedAt: string;
    rowVersion: number;
  }[];

  efaEng: Translation[];

  efaKor: Translation[];

  wordRatings: WordRating[];

  totalRatings: number;
  totalReviews: number;
  averageRating: number;
};

type Metadata = {
  id: string;
  query_count: number;
  last_accessed: string;
  otaId: string;
};

type Translation = {
  id: string;
  otaId: string;
  kere: number;

  otaWord: string;

  details: Details;

  isApproved: boolean | null;
  isRejected: boolean | null;
  moderatorComments: string | null;

  createdAt: string;
  updatedAt: string;

  rowVersion: number;
};

type Details = {
  id: string;
  efaEngId: string;

  ekerota: string[];

  oto: string;
  otoOmra: string;

  idje: {
    sentence: string;
    audioUrl: string;
  }[];

  okpo: { ota: string; egba: string }[];
  ibuebu: string[];
  orhan: string[];
  ekaeruo: string[];

  upho: string;

  oma: string | null;
  omra: string[];

  odeUfue: string[];

  uphoesio: string;

  createdAt: string;
  updatedAt: string;

  rowVersion: number;
};

type WordRating = {
  id: string;

  user: { username: string; firstName: string; lastName: string };
  userId: string;

  wordId: string;
  parentId: string | null;

  rating: number;
  review: string;

  isReply: boolean;

  createdAt: string;
  updatedAt: string;
};
export type WordPagination = {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  statusCounts: {
    approved: number;
    pending: number;
    rejected: number;
    "in-review": number;
  };
};

export type DeleteSenseImagePayload = {
  senseId: string;
  senseIndex: number;
  url: string;
  imageType: string;
};

export type DeleteSenseAudioPayload = {
  senseId: string;
  senseIndex: number;
  url: string;
};

export type DeleteTranslationAudioPayload = {
  translationId: string;
  translationIndex: number;
  languageType: string;
  removeUrl: string;
};
