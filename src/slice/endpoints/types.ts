import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { EndpointBuilder } from "@reduxjs/toolkit/query";

export type ValidTags =
  | "provinces"
  | "town"
  | "admins"
  | "words"
  | "permissions"
  | "wordreview"
  | "wordofday"
  | "wordReviews"
  | "contributors"
  | "notifications"
  | "supportTickets";

export type AppEndpointBuilder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  ValidTags,
  "api"
>;
