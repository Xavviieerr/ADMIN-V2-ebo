import { FetchWordResponse, Word } from "@/types/fetchWord";
import { GetWordReviewResponse } from "@/types/getWords";
import { WordOfDayResponse } from "@/types/wordOfDay";
import { AppEndpointBuilder } from "./types";

export interface WordReview {
  id: string;
  userId: string;
  wordId: string;
  parentId: string | null;
  rating: number;
  review: string;
  isReply: boolean;
  createdAt: string;
  updatedAt: string;
}

export const wordEndpoints = (builder: AppEndpointBuilder) => ({
  getAllWords: builder.query<
    FetchWordResponse,
    {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      createdBy?: string;
      hasAudio?: string;
      hasImage?: string;
      sortBy?: string;
      sortDir?: string;
    }
  >({
    query: ({
      page = 1,
      limit,
      search,
      status,
      createdBy,
      hasAudio,
      hasImage,
      sortBy = "ota",
      sortDir = "ASC",
    } = {}) => {
      const params = new URLSearchParams();

      params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());

      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (createdBy) params.append("createdBy", createdBy);
      if (hasAudio) params.append("hasAudio", hasAudio);
      if (hasImage) params.append("hasImage", hasImage);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortDir) params.append("sortDir", sortDir);
      return {
        url: `/word?${params.toString()}`,
        method: "GET",
      };
    },
    providesTags: ["words"],
  }),

  getWordReview: builder.query<
    GetWordReviewResponse,
    {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    }
  >({
    query: ({ page = 1, limit, search, status } = {}) => {
      const params = new URLSearchParams();

      params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      return {
        url: `/word/to-review-and-ratings?${params.toString()}`,
        method: "GET",
      };
    },
    providesTags: ["wordreview"],
  }),

  getSingleWord: builder.query<{ data: Word; message: string }, Partial<{ id: string }>>({
    query: ({ id }) => ({
      url: `/word/${id}`,
      method: "GET",
    }),
    providesTags: ["words"],
  }),

  getWordofDay: builder.query<WordOfDayResponse, void>({
    query: () => ({
      url: `/word/daily-word`,
      method: "GET",
    }),
    providesTags: ["wordofday"],
  }),

  uploadImage: builder.mutation<
    {
      thumbnail: string;
      small: string;
      medium: string;
      large: string;
      original: string;
    },
    File
  >({
    query: (file) => {
      const formData = new FormData();
      formData.append("imageFile", file);
      return {
        url: "/word/image/upload",
        method: "POST",
        body: formData,
      };
    },
  }),

  uploadAudio: builder.mutation<
    {
      lowQuality: string;
      mediumQuality: string;
      highQuality: string;
      original: string;
    },
    File
  >({
    query: (file) => {
      const formData = new FormData();
      formData.append("audioFile", file);
      return {
        url: "/word/audio/upload",
        method: "POST",
        body: formData,
      };
    },
  }),

  createWord: builder.mutation<any, any>({
    query: (wordData) => ({
      url: "/word",
      method: "POST",
      body: wordData,
    }),
    invalidatesTags: ["words"],
  }),

  approveWord: builder.mutation<any, { id: string }>({
    query: ({ id }) => ({
      url: `/word/${id}/approve`,
      method: "PATCH",
    }),
    invalidatesTags: ["words"],
  }),

  rejectWord: builder.mutation<any, { id: string; reason?: string }>({
    query: ({ id, reason }) => ({
      url: `/word/${id}/reject`,
      method: "PATCH",
      body: { rejectionReason: reason },
    }),
    invalidatesTags: ["words"],
  }),

  setWordToReview: builder.mutation<any, { id: string }>({
    query: ({ id }) => ({
      url: `/word/${id}/review`,
      method: "PATCH",
    }),
    invalidatesTags: ["words"],
  }),

  submitWordReview: builder.mutation<
    any,
    { id: string; rating: number; review: string }
  >({
    query: ({ id, rating, review }) => ({
      url: `/word/${id}/review`,
      method: "PATCH",
      body: { rating, review },
    }),
    invalidatesTags: (result, error, { id }) => [
      "words",
      { type: "wordReviews", id },
    ],
  }),

  getWordReviews: builder.query<{ data: WordReview[]; message: string }, string>({
    query: (wordId) => ({
      url: `/words/${wordId}/reviews`,
    }),
    providesTags: (result, error, wordId) => [
      { type: "wordReviews", id: wordId },
    ],
  }),

  replyToReview: builder.mutation<
    any,
    { wordId: string; parentId: string; review: string }
  >({
    query: ({ wordId, parentId, review }) => ({
      url: "/words/review/reply",
      method: "POST",
      body: { wordId, parentId, review },
    }),
    invalidatesTags: (result, error, { wordId }) => [
      { type: "wordReviews", id: wordId },
    ],
  }),

  deleteWord: builder.mutation<any, { id: string }>({
    query: ({ id }) => ({
      url: `/word/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["words"],
  }),

  updateSenseImage: builder.mutation<
    any,
    {
      wordId: string;
      senseId: string;
      senseIndex: number;
      url: string;
      imageType?: string;
    }
  >({
    query: ({ wordId, senseId, senseIndex, url, imageType = "photo" }) => ({
      url: `/word/${wordId}/sense-image`,
      method: "PATCH",
      body: {
        senseId,
        senseIndex,
        url,
        imageType,
      },
    }),
    invalidatesTags: ["words"],
  }),

  updateSenseAudio: builder.mutation<
    any,
    {
      wordId: string;
      senseId: string;
      senseIndex: number;
      url: string;
    }
  >({
    query: ({ wordId, senseId, senseIndex, url }) => ({
      url: `/word/${wordId}/sense-audio`,
      method: "PATCH",
      body: {
        senseId,
        senseIndex,
        url,
      },
    }),
    invalidatesTags: ["words"],
  }),

  updateSenseOtoAudio: builder.mutation<
    any,
    {
      wordId: string;
      senseId: string;
      senseIndex: number;
      url: string;
    }
  >({
    query: ({ wordId, senseId, senseIndex, url }) => ({
      url: `/word/${wordId}/sense-oto-audio`,
      method: "PATCH",
      body: {
        senseId,
        senseIndex,
        url,
      },
    }),
    invalidatesTags: ["words"],
  }),

  updateSenseExampleSentenceAudio: builder.mutation<
    any,
    {
      wordId: string;
      senseId: string;
      senseIndex: number;
      exampleSentenceIndex: number;
      url: string;
    }
  >({
    query: ({ wordId, senseId, senseIndex, exampleSentenceIndex, url }) => ({
      url: `/word/${wordId}/sense-example-sentence-audio`,
      method: "PATCH",
      body: {
        senseId,
        senseIndex,
        exampleSentenceIndex,
        url,
      },
    }),
    invalidatesTags: ["words"],
  }),

  updateTranslationOtoAudio: builder.mutation<
    any,
    {
      wordId: string;
      translationId: string;
      translationIndex: number;
      languageType: string;
      url: string;
    }
  >({
    query: ({
      wordId,
      translationId,
      translationIndex,
      languageType,
      url,
    }) => ({
      url: `/word/${wordId}/translation-oto-audio`,
      method: "PATCH",
      body: {
        translationId,
        translationIndex,
        languageType,
        url,
      },
    }),
    invalidatesTags: ["words"],
  }),

  updateTranslationExampleSentenceAudio: builder.mutation<
    any,
    {
      wordId: string;
      translationId: string;
      translationIndex: number;
      languageType: string;
      exampleSentenceIndex: number;
      url: string;
    }
  >({
    query: ({
      wordId,
      translationId,
      translationIndex,
      languageType,
      exampleSentenceIndex,
      url,
    }) => ({
      url: `/word/${wordId}/translation-example-sentence-audio`,
      method: "PATCH",
      body: {
        translationId,
        translationIndex,
        languageType,
        exampleSentenceIndex,
        url,
      },
    }),
    invalidatesTags: ["words"],
  }),

  deleteSenseImage: builder.mutation<
    any,
    {
      wordId: string;
      senseId: string;
      senseIndex: number;
      url: string;
      imageType: string;
    }
  >({
    query: ({ wordId, senseId, senseIndex, url, imageType }) => ({
      url: `/word/${wordId}/sense-image`,
      method: "DELETE",
      body: {
        senseId,
        senseIndex,
        url,
        imageType,
      },
    }),
    invalidatesTags: ["words"],
  }),

  deleteSenseAudio: builder.mutation<
    any,
    {
      wordId: string;
      senseId: string;
      senseIndex: number;
      url: string;
    }
  >({
    query: ({ wordId, senseId, senseIndex, url }) => ({
      url: `/word/${wordId}/sense-audio`,
      method: "DELETE",
      body: {
        senseId,
        senseIndex,
        url,
      },
    }),
    invalidatesTags: ["words"],
  }),

  createSense: builder.mutation<any, { wordId: string; senseData: any }>({
    query: ({ wordId, senseData }) => ({
      url: `/word/${wordId}/sense`,
      method: "POST",
      body: senseData,
    }),
    invalidatesTags: ["words"],
  }),

  updateSense: builder.mutation<any, { wordId: string; senseData: any }>({
    query: ({ wordId, senseData }) => ({
      url: `/word/${wordId}/sense`,
      method: "PATCH",
      body: senseData,
    }),
    invalidatesTags: ["words"],
  }),

  deleteSense: builder.mutation<
    any,
    {
      wordId: string;
      senseId: string;
      senseIndex: number;
    }
  >({
    query: ({ wordId, senseId, senseIndex }) => ({
      url: `/word/${wordId}/sense`,
      method: "DELETE",
      body: {
        senseId,
        senseIndex,
      },
    }),
    invalidatesTags: ["words"],
  }),

  createTranslation: builder.mutation<
    any,
    {
      wordId: string;
      translationData: any;
    }
  >({
    query: ({ wordId, translationData }) => ({
      url: `/word/${wordId}/translation`,
      method: "POST",
      body: translationData,
    }),
    invalidatesTags: ["words"],
  }),

  deleteTranslation: builder.mutation<
    any,
    {
      wordId: string;
      translationId: string;
      translationIndex: number;
      languageType: string;
    }
  >({
    query: ({ wordId, translationId, translationIndex, languageType }) => ({
      url: `/word/${wordId}/translation`,
      method: "DELETE",
      body: {
        translationId,
        translationIndex,
        languageType,
      },
    }),
    invalidatesTags: ["words"],
  }),

  updateTranslation: builder.mutation<
    any,
    {
      wordId: string;
      translationData: any;
    }
  >({
    query: ({ wordId, translationData }) => ({
      url: `/word/${wordId}/translation`,
      method: "PATCH",
      body: translationData,
    }),
    invalidatesTags: ["words"],
  }),

  updateTranslationAudio: builder.mutation<
    any,
    {
      wordId: string;
      translationId: string;
      translationIndex: number;
      url: string;
      languageType: string;
    }
  >({
    query: ({
      wordId,
      translationId,
      translationIndex,
      url,
      languageType,
    }) => ({
      url: `/word/${wordId}/translation-audio`,
      method: "PATCH",
      body: {
        translationId,
        translationIndex,
        url,
        languageType,
      },
    }),
    invalidatesTags: ["words"],
  }),

  deleteTranslationAudio: builder.mutation<
    any,
    {
      wordId: string;
      translationId: string;
      translationIndex: number;
      removeUrl: string;
      languageType: string;
    }
  >({
    query: ({
      wordId,
      translationId,
      translationIndex,
      removeUrl,
      languageType,
    }) => ({
      url: `/word/${wordId}/translation-audio`,
      method: "DELETE",
      body: {
        translationId,
        translationIndex,
        removeUrl,
        languageType,
      },
    }),
    invalidatesTags: ["words"],
  }),

  updateTranslationImage: builder.mutation<
    any,
    {
      wordId: string;
      translationId: string;
      translationIndex: number;
      url: string;
      imageType: string;
      languageType: string;
    }
  >({
    query: ({
      wordId,
      translationId,
      translationIndex,
      url,
      imageType,
      languageType,
    }) => ({
      url: `/word/${wordId}/translation-image`,
      method: "PATCH",
      body: {
        translationId,
        translationIndex,
        url,
        imageType,
        languageType,
      },
    }),
    invalidatesTags: ["words"],
  }),

  deleteTranslationImage: builder.mutation<
    any,
    {
      wordId: string;
      translationId: string;
      translationIndex: number;
      removeUrl: string;
      imageType: string;
      languageType: string;
    }
  >({
    query: ({
      wordId,
      translationId,
      translationIndex,
      removeUrl,
      imageType,
      languageType,
    }) => ({
      url: `/word/${wordId}/translation-image`,
      method: "DELETE",
      body: {
        translationId,
        translationIndex,
        removeUrl,
        imageType,
        languageType,
      },
    }),
    invalidatesTags: ["words"],
  }),

  approveTranslation: builder.mutation<
    any,
    {
      wordId: string;
      translationId: string;
      translationIndex: number;
      languageType: string;
    }
  >({
    query: ({ wordId, translationId, translationIndex, languageType }) => ({
      url: `/word/translation/approve`,
      method: "POST",
      body: {
        wordId,
        translationId,
        translationIndex,
        languageType,
      },
    }),
    invalidatesTags: ["words"],
  }),

  commentTranslation: builder.mutation<
    any,
    {
      wordId: string;
      translationId: string;
      translationIndex: number;
      languageType: string;
      comment: string;
    }
  >({
    query: ({
      wordId,
      translationId,
      translationIndex,
      languageType,
      comment,
    }) => ({
      url: `/word/translation-comment`,
      method: "PATCH",
      body: {
        wordId,
        translationId,
        translationIndex,
        languageType,
        comment,
      },
    }),
    invalidatesTags: ["words"],
  }),
});
