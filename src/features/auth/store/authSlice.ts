import { RootState } from "@/store/store";
import { AuthUser, AuthState } from "@/features/auth/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logInAdmin: (state, action: PayloadAction<{ user: AuthUser }>) => {
      state.user = action.payload.user;
    },
    logOutAdmin: (state) => {
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
// Note: authentication truth lives in cookies (tokenStorage), not Redux.
// This slice owns the user profile only.
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsSuperAdmin = (state: RootState) =>
  state.auth.user?.role === "super_admin";
