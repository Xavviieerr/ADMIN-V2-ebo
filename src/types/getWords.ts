export interface GetWordReviewResponse {
  data: {
    data: WordRecord[];
    pagination: Pagination;
  };
  message: string;
}

export interface WordRecord {
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
  metadata: Metadata[];
  oho: Oho[];
}

export interface Metadata {
  id: string;
  query_count: number;
  last_accessed: string;
  otaId: string;
}

export interface Oho {
  id: string;
  otaId: string;
  kere: number;
  erevwe: string;
  ekerota: string[];
  oto: string;
  otoOmra: string;
  idje: { sentence: string }[];
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

export interface Pagination {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
