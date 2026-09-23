import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { logInAdmin } from "@/features/auth/store/authSlice";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { loginAPI } from "@/features/auth/services/authService";
import { toast } from "sonner";
import { LoginFormData } from "@/features/auth/validations/login";

export function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const login = async (data: LoginFormData) => {
    const result = await loginAPI({
      password: data.password,
      email: data.identifier.includes("@") ? data.identifier : " ",
      userName: data.identifier.includes("@") ? "" : data.identifier,
    });

    // Cookies are the single source of truth for credentials;
    // Redux keeps the user profile only.
    tokenStorage.setTokens(result.accessToken, result.refreshToken);

    dispatch(
      logInAdmin({
        user: result.user,
      }),
    );

    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get("from");
    const destination = from?.startsWith("/") ? decodeURIComponent(from) : "/home";
    router.replace(destination);

    toast.success("Login successful", {
      description: "You are now logged in",
    });
  };

  return { login };
}
