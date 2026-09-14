export interface ProvinceResponse {
  data: {
    data: Province[]; // Array of provinces
    pagination: Pagination;
  };
  message: string;
}

export interface SingleProvinceResponse {
  data: Province;
  message: string;
}

export interface ProvinceNamesResponse {
  data: ProvinceName[];
  message: string;
}

export interface TownsResponse {
  data: Town[];
  message: string;
}

export interface ProvinceName {
  name: string;
  id?: string;
}

export interface Province {
  id: string;
  name: string;
  slug: string;
  description: string;
  towns: Town[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Town {
  id: string;
  name: string;
  slug: string;
  isWaterside: boolean;
  note: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProvinceRequest {
  id: string;
}
