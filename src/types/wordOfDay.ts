// ─────────────────────────────────────────────
// Root Response
// ─────────────────────────────────────────────
export interface WordOfDayResponse {
  data: {
    wordOfTheday: WordOfTheDay;
    metadata: WordMetadata;
  };
  message: string;
}

// ─────────────────────────────────────────────
// Word of the Day Object
// ─────────────────────────────────────────────
export interface WordOfTheDay {
  id: string;
  ota: string;
  erevwe: string;
  status: string;
  creationReason: string | null;
  approvedBy: string | null;
  rejectionReason: string | null;
  rejectedBy: string | null;
  reviewedBy: string | null;
  otaOkpopko: boolean;
  oka: number;
  rowVersion: number;
  createdAt: string;
  updatedAt: string;
  directQueryCount: number;
  lastAccessed: string | null;
  oho: OhoEntry[];
}

// ─────────────────────────────────────────────
// Oho Entry
// ─────────────────────────────────────────────
export interface OhoEntry {
  id: string;
  otaId: string;
  kere: number;
  erevwe: string;
  ekerota: string[];
  oto: string;
  otoOmra: string;
  idje: SentenceEntry[];
  upho: string;
  okpo: string | null;
  ibuebu: string[];
  orhan: string | null;
  ekaeruo: string | null;
  oma: string | null;
  omra: string | null;
  odeUfue: string | null;
  uphoesio: string;
  createdAt: string;
  updatedAt: string;
  rowVersion: number;
}

export interface SentenceEntry {
  sentence: string;
}

// ─────────────────────────────────────────────
// Metadata for the Response
// ─────────────────────────────────────────────
export interface WordMetadata {
  generatedAt: string;
  source: string;
}
