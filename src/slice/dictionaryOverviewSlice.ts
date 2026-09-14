import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchWordResponse } from "@/types/fetchWord";

interface DictionaryOverviewState {
  // Cache for different tabs and filters
  cachedData: {
    [key: string]: {
      data: FetchWordResponse | null;
      page: number;
      searchTerm: string;
      timestamp: number;
    };
  };
  // Current page for each tab/filter combination
  currentPages: {
    [key: string]: number;
  };
}

const initialState: DictionaryOverviewState = {
  cachedData: {},
  currentPages: {},
};

// Helper function to generate cache key
const getCacheKey = (
  activeTab: string,
  searchTerm: string,
  status?: string,
  createdBy?: string,
  moderateFilter?: string,
  myWordsFilter?: string
): string => {
  const parts = [
    activeTab,
    searchTerm || "",
    status || "",
    createdBy || "",
    moderateFilter || "",
    myWordsFilter || "",
  ];
  return parts.join("|");
};

const dictionaryOverviewSlice = createSlice({
  name: "dictionaryOverview",
  initialState,
  reducers: {
    // Cache the fetched words data
    cacheWordsData: (
      state,
      action: PayloadAction<{
        key: string;
        data: FetchWordResponse;
        page: number;
        searchTerm: string;
      }>
    ) => {
      state.cachedData[action.payload.key] = {
        data: action.payload.data,
        page: action.payload.page,
        searchTerm: action.payload.searchTerm,
        timestamp: Date.now(),
      };
    },
    // Set current page for a specific tab/filter combination
    setCurrentPage: (
      state,
      action: PayloadAction<{
        key: string;
        page: number;
      }>
    ) => {
      state.currentPages[action.payload.key] = action.payload.page;
    },
    // Clear cache for a specific key
    clearCache: (state, action: PayloadAction<{ key: string }>) => {
      delete state.cachedData[action.payload.key];
      delete state.currentPages[action.payload.key];
    },
    // Clear all cache
    clearAllCache: (state) => {
      state.cachedData = {};
      state.currentPages = {};
    },
  },
});

export const { cacheWordsData, setCurrentPage, clearCache, clearAllCache } =
  dictionaryOverviewSlice.actions;

// Selectors
export const selectCachedData = (state: { dictionaryOverview: DictionaryOverviewState }, key: string) =>
  state.dictionaryOverview.cachedData[key];

export const selectCurrentPage = (state: { dictionaryOverview: DictionaryOverviewState }, key: string) =>
  state.dictionaryOverview.currentPages[key] || 1;

// Export helper function for use in components
export { getCacheKey };

export default dictionaryOverviewSlice.reducer;

