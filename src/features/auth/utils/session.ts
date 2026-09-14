import { AppDispatch } from "@/store/store";
import { logOutAdmin } from "@/features/auth/store/authSlice";
import { tokenStorage } from "./tokenStorage";
import { clearPaginationState } from "@/utils/localStorage";

export function clearLocalSession(): void {
  tokenStorage.clear();
  clearPaginationState();
}

export function performLogoutCleanup(dispatch: AppDispatch): void {
  clearLocalSession();
  dispatch(logOutAdmin());
}
