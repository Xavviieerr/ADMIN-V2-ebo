import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { BASE_URL } from "@/utils/constants";
import { logInAdmin, logOutAdmin } from "@/features/auth/store/authSlice";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { clearLocalSession } from "@/features/auth/utils/session";
import { AuthUser, RefreshResponse } from "@/features/auth/types/auth";

/**
 * Minimal auth state shape used by the interceptor.
 * Avoids importing RootState (which would create a circular dependency with the store).
 */
interface AuthState {
  auth: {
    refreshToken: string | null;
    user: AuthUser | null;
  };
}

/**
 * RTK Query base query factory that handles:
 * - Token injection into request headers
 * - Automatic token refresh on 401 responses (concurrency-safe)
 * - Full logout + cleanup on refresh failure
 *
 * Usage in any RTK Query createApi:
 * ```ts
 * const apiSlice = createApi({
 *   baseQuery: createBaseQueryWithReauth(),
 *   ...
 * });
 * ```
 */
export function createBaseQueryWithReauth(): BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = tokenStorage.getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  // Concurrency-safe refresh: only one refresh in flight at a time
  let refreshPromise: Promise<boolean> | null = null;

  async function performRefresh(api: {
    getState: () => unknown;
    dispatch: (action: unknown) => unknown;
  }): Promise<boolean> {
    try {
      const state = api.getState() as AuthState;
      const refreshToken = state.auth.refreshToken;
      if (!refreshToken) return false;

      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) return false;

      const data: RefreshResponse = await res.json();

      tokenStorage.setTokens(data.accessToken, data.refreshToken);

      const currentUser = (api.getState() as AuthState).auth.user;
      if (currentUser) {
        api.dispatch(
          logInAdmin({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: currentUser,
          })
        );
      }

      return true;
    } catch {
      return false;
    }
  }

  const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const succeeded = await performRefresh(api);
          refreshPromise = null;
          return succeeded;
        })();
      }

      const refreshSucceeded = await refreshPromise;

      if (refreshSucceeded) {
        result = await baseQuery(args, api, extraOptions);
      } else {
        clearLocalSession();
        api.dispatch(logOutAdmin());
      }
    }

    return result;
  };

  return baseQueryWithReauth;
}
