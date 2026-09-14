import { describe, it, expect, beforeEach, vi } from "vitest";
import Cookies from "js-cookie";
import { tokenStorage, getAccessToken } from "@/features/auth/utils/tokenStorage";

vi.mock("js-cookie", () => {
  const store: Record<string, string> = {};
  return {
    default: {
      get: (key: string) => store[key] ?? undefined,
      set: (key: string, value: string) => {
        store[key] = value;
      },
      remove: (key: string) => {
        delete store[key];
      },
    },
  };
});

describe("tokenStorage", () => {
  beforeEach(() => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userID");
    Cookies.remove("user");
  });

  describe("getAccessToken", () => {
    it("returns null when no token is set", () => {
      expect(tokenStorage.getAccessToken()).toBeNull();
    });

    it("returns the token when set", () => {
      Cookies.set("accessToken", "test_token");
      expect(tokenStorage.getAccessToken()).toBe("test_token");
    });
  });

  describe("getRefreshToken", () => {
    it("returns null when no token is set", () => {
      expect(tokenStorage.getRefreshToken()).toBeNull();
    });

    it("returns the refresh token when set", () => {
      Cookies.set("refreshToken", "refresh_test");
      expect(tokenStorage.getRefreshToken()).toBe("refresh_test");
    });
  });

  describe("setTokens", () => {
    it("sets both tokens", () => {
      tokenStorage.setTokens("at_123", "rt_456");
      expect(tokenStorage.getAccessToken()).toBe("at_123");
      expect(tokenStorage.getRefreshToken()).toBe("rt_456");
    });
  });

  describe("clear", () => {
    it("removes auth tokens only", () => {
      tokenStorage.setTokens("at_123", "rt_456");

      tokenStorage.clear();

      expect(tokenStorage.getAccessToken()).toBeNull();
      expect(tokenStorage.getRefreshToken()).toBeNull();
    });
  });
});

describe("getAccessToken (convenience)", () => {
  beforeEach(() => {
    Cookies.remove("accessToken");
  });

  it("returns empty string when no token", () => {
    expect(getAccessToken()).toBe("");
  });

  it("returns token when set", () => {
    Cookies.set("accessToken", "my_token");
    expect(getAccessToken()).toBe("my_token");
  });
});
