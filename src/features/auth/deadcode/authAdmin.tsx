import { RootState } from "@/store/store";
import { AuthState, User } from "@/types/newTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  refreshToken: null,
  accessToken: null,
  user: null,
  isLoggedIn: false,
};

const adminAuthSlice = createSlice({
  name: "authAdmin",
  initialState,
  reducers: {
    logInAdmin: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; user: User }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
    logOutAdmin: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { logInAdmin, logOutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

// selectors
export const selectCurrentAdmin = (state: RootState) => state.authAdmin.user;
export const selectCurrentAdminAccess = (state: RootState) => state.authAdmin.accessToken;
