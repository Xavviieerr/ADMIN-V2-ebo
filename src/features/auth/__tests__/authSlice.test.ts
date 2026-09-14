import { describe, it, expect } from "vitest";
import authReducer, {
  logInAdmin,
  logOutAdmin,
  selectCurrentUser,
  selectAccessToken,
  selectRefreshToken,
  selectIsSuperAdmin,
} from "@/features/auth/store/authSlice";
import type { AuthUser } from "@/features/auth/types/auth";

const mockUser: AuthUser = {
  id: "u1",
  email: "admin@test.com",
  username: "testadmin",
  firstName: "Test",
  lastName: "Admin",
  role: "admin",
  isVerified: true,
  lastLogin: "2026-01-01T00:00:00Z",
  profilePictureUrl: null,
};

const mockSuperAdmin: AuthUser = {
  ...mockUser,
  id: "u2",
  role: "super_admin",
};

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

describe("authSlice", () => {
  describe("reducer", () => {
    it("should return the initial state", () => {
      expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
    });

    it("should handle logInAdmin", () => {
      const state = authReducer(
        initialState,
        logInAdmin({
          accessToken: "at_123",
          refreshToken: "rt_456",
          user: mockUser,
        }),
      );

      expect(state.accessToken).toBe("at_123");
      expect(state.refreshToken).toBe("rt_456");
      expect(state.user).toEqual(mockUser);
    });

    it("should handle logOutAdmin", () => {
      const loggedIn = authReducer(
        initialState,
        logInAdmin({
          accessToken: "at_123",
          refreshToken: "rt_456",
          user: mockUser,
        }),
      );

      const state = authReducer(loggedIn, logOutAdmin());
      expect(state).toEqual(initialState);
    });
  });

  describe("selectors", () => {
    const state = {
      auth: {
        accessToken: "at_123",
        refreshToken: "rt_456",
        user: mockUser,
      },
    } as any;

    it("selectCurrentUser returns user", () => {
      expect(selectCurrentUser(state)).toEqual(mockUser);
    });

    it("selectAccessToken returns token", () => {
      expect(selectAccessToken(state)).toBe("at_123");
    });

    it("selectRefreshToken returns token", () => {
      expect(selectRefreshToken(state)).toBe("rt_456");
    });

    it("selectIsSuperAdmin returns false for admin", () => {
      expect(selectIsSuperAdmin(state)).toBe(false);
    });

    it("selectIsSuperAdmin returns true for super_admin", () => {
      expect(selectIsSuperAdmin({ auth: { ...state.auth, user: mockSuperAdmin } } as any)).toBe(true);
    });

    it("selectIsSuperAdmin returns false when user is null", () => {
      expect(selectIsSuperAdmin({ auth: { ...state.auth, user: null } } as any)).toBe(false);
    });
  });
});
