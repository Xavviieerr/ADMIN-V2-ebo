import { RootState } from "@/store/store";
import { AuthUser, AuthState } from "@/features/auth/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logInAdmin: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; user: AuthUser }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    logOutAdmin: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    updateCurrentUser: (
      state,
      action: PayloadAction<
        Partial<AuthUser> & {
          gender?: string;
          province?: string | null;
          town?: string | null;
          DOB?: string | null;
        }
      >,
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { logInAdmin, logOutAdmin, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectIsSuperAdmin = (state: RootState) =>
  state.auth.user?.role === "super_admin";
