"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { logoutAPI } from "@/features/auth/services/authService";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { performLogoutCleanup } from "@/features/auth/utils/session";

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logout = async () => {
    const token = tokenStorage.getAccessToken();
    try {
      if (token) {
        await logoutAPI(token);
      }
    } catch {
      // Proceed with local cleanup even if server call fails
    }
    performLogoutCleanup(dispatch);
    router.push("/login");
  };

  return { logout };
}
