"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useGenericMutationMutation } from "@/slice/requestSlice";
import { logInAdmin, selectCurrentAdmin } from "@/slice/authAdmin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Schema: identifier can be email OR username
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Please enter your email or username")
    .refine(
      (val) => {
        // If it's an email
        if (val.includes("@")) {
          return z.string().email().safeParse(val).success;
        }
        // Otherwise treat as username
        return val.length >= 4;
      },
      {
        message: "Enter a valid email or username (min 4 characters)",
      },
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useGenericMutationMutation();
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);

      // Decide if identifier is email or username
      const body = {
        password: data.password,
        email: data.identifier.includes("@") ? data.identifier : " ",
        userName: data.identifier.includes("@") ? "" : data.identifier,
      };

      console.log("Form Data (transformed):", body);

      const result = await login({
        url: "/admin/login",
        method: "POST",
        body,
      }).unwrap();

      console.log("Login API Response:", result);

      if (result && (result.data || result.accessToken)) {
        dispatch(
          logInAdmin({
            accessToken: result?.accessToken,
            refreshToken: result?.refreshToken,
            user: result?.user || result?.data,
          }),
        );

        setTimeout(() => {
          router.replace("/dashboard");
        }, 100);

        toast.success("Login successful", {
          description: "You are now logged in",
        });
      } else {
        setError("Login failed - invalid response from server");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191919]">
      <div className="w-full max-w-md rounded-2xl bg-[#181920] p-10 shadow-lg">
        {/* Guọnọ Logo */}
        <div className="flex justify-center mb-8">
          {logoError ? (
            <div className="text-4xl font-semibold text-[#ffe6b0] tracking-wide">
              Gu<span className="o-with-dot">ọ</span>n
              <span className="o-with-dot">ọ</span>
            </div>
          ) : (
            <div className="relative w-32 h-32">
              <Image
                src="/guono-logo.png"
                alt="Guọnọ Logo"
                fill
                className="object-contain"
                priority
                onError={() => setLogoError(true)}
              />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400 mb-8">Login with your email or username</p>

        {error && (
          <ErrorMessage
            message={error}
            className="mb-6"
            onRetry={() => setError(null)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Identifier (email or username) */}
          <div>
            {/* <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Email or Username
            </label> */}
            <input
              {...register("identifier")}
              id="identifier"
              type="text"
              placeholder="Enter your email or username"
              className="block w-full rounded-md border border-gray-500 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-400 focus:border-[#F5DEB3] focus:ring-2 focus:ring-[#F5DEB3] outline-none transition"
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-400">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            {/* <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Password
            </label> */}
            <input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Enter your password"
              className="block w-full rounded-md border border-gray-500 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-400 focus:border-[#F5DEB3] focus:ring-2 focus:ring-[#F5DEB3] outline-none transition"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full cursor-pointer hover:bg-[#f5deb3]/90 bg-[#F5DEB3] text-[#1e1e1e]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
