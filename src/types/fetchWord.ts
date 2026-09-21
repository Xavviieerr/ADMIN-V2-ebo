// ---------- Supporting Types ----------

// Media item (e.g., image, illustration, etc.)
type MediaItem = {
    url: string;
    type: string;
  };
  
  // Related word (e.g., synonym or antonym)
  export type RelatedWord = {
    ota: string;
    egba: string;
  };
  
  // Word metadata info
  export type Metadata = {
    id: string;
    query_count: number;
    last_accessed: string | null;
    otaId: string;
  };
  
  // Subword entry (oho array)
  export type WordVariant = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    otoOmra: any;
    id: string;
    otaId: string;
    kere: number;
    erevwe: string;
    ekerota: string[];
    oto: string;
    idje: string[];
    upho: string;
    okpo: RelatedWord[];
    ibuebu: string[];
    orhan: string[];
    ekaeruo: string[];
    oma: MediaItem[];
    omra: string[];
    odeUfue: string[];
    uphoesio?: string;
    createdAt: string;
    updatedAt: string;
    rowVersion: number;
  };
  
  // Details for a translation entry (under efaEng/efaKor)
  export type TranslationDetails = {
    id: string;
    ekerota: string[];
    oto: string;
    idje: string[];
    okpo: RelatedWord[];
    ibuebu: string[];
    orhan: string[];
    ekaeruo: string[];
    upho?: string;
    oma: MediaItem[];
    omra: string[];
    odeUfue: string[];
    uphoesio?: string;
    createdAt: string;
    updatedAt: string;
    rowVersion: number;
  };

  // English / Korean word reference (efaEng, efaKor)
  export type LanguageWord = {
    id: string;
    otaId: string;
    kere: number;
    otaWord: string;
    details?: TranslationDetails; // Newly provided by API
    createdAt: string;
    updatedAt: string;
    rowVersion: number;
  };
  
  // Word rating info
  export type WordRating = {
    id: string;
    userId: string;
    wordId: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
  };
  
  // User who created the word
  export type UserInfo = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  
  // ---------- Main Word Object ----------
  
  export type Word = {
    id: string;
    ota: string;
    status: "pending" | "approved" | "rejected" | "in-review";
    approvedBy: string | null;
    rejectionReason: string | null;
    rejectedBy: string | null;
    reviewedBy: string | null;
    otaOkpopko: boolean;
    oka: number;
    rowVersion: number;
    createdAt: string;
    updatedAt: string;
    createdBy: UserInfo;
    directQueryCount: number;
    lastAccessed: string | null;
    metadata: Metadata[];
    oho: WordVariant[];
    efaEng: LanguageWord[];
    efaKor: LanguageWord[];
    wordRatings: WordRating[];
    totalRatings: number;
    totalReviews: number;
    averageRating: number;
  };
  
  // ---------- Pagination Info ----------
  
  export type Pagination = {
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
  
  // ---------- Root API Response ----------
  
  export type FetchWordResponse = {
    data: {
      data: Word[];
      pagination: Pagination;
    };
    message: string;
  };
  