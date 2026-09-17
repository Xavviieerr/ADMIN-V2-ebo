import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
} from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "@/features/auth/utils/authBaseQuery";
import { provinceEndpoints } from "./endpoints/provinceEndpoints";
import { userEndpoints } from "./endpoints/userEndpoints";
import { wordEndpoints, WordReview } from "./endpoints/wordEndpoints";
import { homeEndpoints } from "./endpoints/homeEndpoints";
import { contributorEndpoints } from "./endpoints/contributorEndpoints";
import { notificationEndpoints } from "@/features/notifications/api/notificationEndpoints";
import { supportTicketEndpoints } from "@/features/support-tickets/api/supportTicketEndpoints";
import { ValidTags } from "./endpoints/types";

export type { WordReview, ValidTags };

type MutationArg = {
  url: string;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  invalidatesTags?: Array<{
    type: ValidTags;
    id?: string | number;
  }>;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: createBaseQueryWithReauth(),
  tagTypes: [
    "provinces",
    "town",
    "admins",
    "words",
    "permissions",
    "wordreview",
    "wordofday",
    "wordReviews",
    "contributors",
    "notifications",
    "supportTickets",
  ] as readonly ValidTags[],
  endpoints: (builder) => ({
    genericMutation: builder.mutation<any, MutationArg>({
      query: ({ url, method = "POST", body }) => ({
        url,
        method,
        body,
      }),
      invalidatesTags: (_, __, arg) => arg?.invalidatesTags || [],
    }),
    ...provinceEndpoints(builder),
    ...userEndpoints(builder),
    ...wordEndpoints(builder),
    ...homeEndpoints(builder),
    ...contributorEndpoints(builder),
    ...notificationEndpoints(builder),
    ...supportTicketEndpoints(builder),
  }),
});

export const {
  usePrefetch,
  useGenericMutationMutation,
  useGetAllProvincesQuery,
  useGetSingleProvinceQuery,
  useUpdateTownMutation,
  useGetAllProvinceNoPaginationQuery,
  useGetTownsByProvinceIdQuery,
  useGetAdminUsersQuery,
  useGetSingleUserQuery,
  useGetAdminUsersSearchQuery,
  useGetSingleAdminUserQuery,
  useGetAllAdminPermissionsQuery,
  useGetSingleAdminPermissionQuery,
  useSetAdminPermissionMutation,
  useGetAllWordsQuery,
  useGetWordofDayQuery,
  useGetWordReviewQuery,
  useGetSingleWordQuery,
  useUploadImageMutation,
  useUploadAudioMutation,
  useCreateWordMutation,
  useApproveWordMutation,
  useRejectWordMutation,
  useSetWordToReviewMutation,
  useSubmitWordReviewMutation,
  useGetWordReviewsQuery,
  useReplyToReviewMutation,
  useDeleteWordMutation,
  useUpdateSenseImageMutation,
  useUpdateSenseAudioMutation,
  useUpdateSenseOtoAudioMutation,
  useUpdateSenseExampleSentenceAudioMutation,
  useUpdateTranslationOtoAudioMutation,
  useUpdateTranslationExampleSentenceAudioMutation,
  useDeleteSenseImageMutation,
  useDeleteSenseAudioMutation,
  useCreateSenseMutation,
  useUpdateSenseMutation,
  useDeleteSenseMutation,
  useCreateTranslationMutation,
  useDeleteTranslationMutation,
  useUpdateTranslationMutation,
  useUpdateTranslationAudioMutation,
  useDeleteTranslationAudioMutation,
  useUpdateTranslationImageMutation,
  useDeleteTranslationImageMutation,
  useApproveTranslationMutation,
  useCommentTranslationMutation,
  useUpdateAdminProfileMutation,
  useUpdateUserProfileMutation,
  useUpdateUsernameMutation,
  useUploadUserImageMutation,
  useApproveAdminMutation,
  useRestrictUserMutation,
  useUnrestrictUserMutation,
  useRejectUserMutation,
  useDeleteUserMutation,
  useInviteAdminMutation,
  useCreateAdminMutation,
  useLazySearchWordsQuery,
  useSetWordOfDayMutation,
  useOverrideWordOfDayMutation,
  useGetContributorsQuery,
  useGetContributorStatsQuery,
  useGetContributorByIdQuery,
  useApproveContributorMutation,
  useRejectContributorMutation,
  useSuspendContributorMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
  useGetSupportTicketsQuery,
  useGetSupportTicketByIdQuery,
  useUpdateSupportTicketStatusMutation,
} = apiSlice;
