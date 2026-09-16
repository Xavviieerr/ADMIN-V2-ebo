import { AppEndpointBuilder } from "./types";
import { WordRecord } from "@/features/home/types";

export const homeEndpoints = (builder: AppEndpointBuilder) => ({
  searchWords: builder.query<
    { data: { results: Array<{ word: WordRecord }> } },
    { q: string; mode?: string; lang?: string; limit?: number }
  >({
    query: ({ q, mode = "partial", lang = "urhobo", limit = 5 }) => ({
      url: `/search?q=${encodeURIComponent(q)}&mode=${mode}&lang=${lang}&limit=${limit}`,
      method: "GET",
    }),
  }),

  setWordOfDay: builder.mutation<
    { data: { wordOfTheday: string; metadata: { generatedAt: string; source: string } }; message: string },
    { wordId: string; scheduledDate: string; culturalNote: string }
  >({
    query: (body) => ({
      url: "/admin/word-of-the-day",
      method: "POST",
      body,
    }),
    invalidatesTags: ["wordofday"],
  }),

  overrideWordOfDay: builder.mutation<
    { message: string },
    { wordId: string }
  >({
    query: ({ wordId }) => ({
      url: `/admin/word-of-the-day/${wordId}/override`,
      method: "PATCH",
    }),
    invalidatesTags: ["wordofday"],
  }),
});
