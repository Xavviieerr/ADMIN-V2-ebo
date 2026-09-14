import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginAPI, refreshAPI, logoutAPI } from "@/features/auth/services/authService";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("loginAPI", () => {
  it("sends POST to /admin/login with body", async () => {
    const response = {
      user: { id: "u1" },
      accessToken: "at_123",
      refreshToken: "rt_456",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(response),
    });

    const result = await loginAPI({
      email: "admin@test.com",
      password: "secret",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/admin/login"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "admin@test.com",
          password: "secret",
        }),
      }),
    );
    expect(result).toEqual(response);
  });

  it("throws on non-ok response with message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Invalid credentials" }),
    });

    await expect(
      loginAPI({ email: "x@x.com", password: "bad" }),
    ).rejects.toThrow("Invalid credentials");
  });

  it("throws generic error when no message in response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });

    await expect(
      loginAPI({ email: "x@x.com", password: "bad" }),
    ).rejects.toThrow("Login failed");
  });
});

describe("refreshAPI", () => {
  it("sends POST to /auth/refresh with refreshToken body", async () => {
    const response = {
      accessToken: "new_at",
      refreshToken: "new_rt",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(response),
    });

    const result = await refreshAPI({ refreshToken: "old_rt" });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/refresh"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ refreshToken: "old_rt" }),
      }),
    );
    expect(result).toEqual(response);
  });

  it("throws on failure", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(refreshAPI({ refreshToken: "bad" })).rejects.toThrow(
      "Token refresh failed",
    );
  });
});

describe("logoutAPI", () => {
  it("sends POST to /auth/sessions/logout-all with Bearer token", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    await logoutAPI("test-token");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/sessions/logout-all"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    );
  });

  it("throws on failure", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(logoutAPI("test-token")).rejects.toThrow("Logout request failed");
  });
});
