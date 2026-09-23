import { describe, it, expect } from "vitest";
import authReducer, {
  logInAdmin,
  logOutAdmin,
  selectCurrentUser,
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
          user: mockUser,
        }),
      );

      expect(state.user).toEqual(mockUser);
    });

    it("should handle logOutAdmin", () => {
      const loggedIn = authReducer(
        initialState,
        logInAdmin({
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
        user: mockUser,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    it("selectCurrentUser returns user", () => {
      expect(selectCurrentUser(state)).toEqual(mockUser);
    });

    it("selectIsSuperAdmin returns false for admin", () => {
      expect(selectIsSuperAdmin(state)).toBe(false);
    });

    it("selectIsSuperAdmin returns true for super_admin", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(selectIsSuperAdmin({ auth: { ...state.auth, user: mockSuperAdmin } } as any)).toBe(true);
    });

    it("selectIsSuperAdmin returns false when user is null", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(selectIsSuperAdmin({ auth: { ...state.auth, user: null } } as any)).toBe(false);
    });
  });
});
