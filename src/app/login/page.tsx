"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Eye, EyeOff, LoaderIcon } from "lucide-react";
import { useLogin } from "@/features/auth/hooks";
import { loginSchema, LoginFormData } from "@/features/auth/validations/login";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

export default function LoginPage() {
	const { login } = useLogin();
	const { locale } = useLocale();
	const { t } = useTranslation(locale);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [obscure, setObscure] = useState(true);

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
			setLoading(true);
			await login(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#191919] relative font-dm-sans">
			<div className="h-[45vh] md:h-[40vh] w-full relative">
				<Image
					src="/login-banner.png"
					alt="Background"
					width={1580}
					height={800}
					className="absolute inset-0 w-full h-full -top-16 object-cover"
				/>
			</div>

			<div className="flex flex-col flex-1 items-center z-50 max-w-2xl max-md:rounded-2xl max-md:bg-[#181920] w-full mt-[20vh] sm:-mt-[18vh] md:-mt-[16vh]">
				<Image
					src="/logo.svg"
					alt="Guọnọ Logo"
					width={200}
					height={56}
					className="object-contain mb-14 -mt-24"
					priority
					unoptimized
				/>
				<div className="w-full text-center rounded-2xl bg-[#181920] py-10 px-4 md:px-10 md:shadow-lg ">
					<h2 className="text-2xl font-semibold text-white mb-2">
						{t("login.welcome")}
					</h2>
					<p className="text-gray-400 mb-8">{t("login.description")}</p>

					{error && (
						<ErrorMessage
							message={error}
							className="mb-6"
							onRetry={() => setError(null)}
						/>
					)}

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="flex flex-col items-start gap-2">
							<input
								{...register("identifier")}
								id="identifier"
								type="text"
								placeholder={t("login.emailPlaceholder")}
								className="input"
							/>
							{errors.identifier && (
								<p className="mt-1 text-sm text-red-400">
									{errors.identifier.message}
								</p>
							)}
						</div>

						<div className="flex flex-col items-start gap-2 relative">
							<input
								{...register("password")}
								id="password"
								type={obscure ? "password" : "text"}
								placeholder={t("login.passwordPlaceholder")}
								className="input"
							/>

							{obscure ? (
								<EyeOff
									className="absolute right-4 top-3 cursor-pointer"
									strokeWidth={1.3}
									onClick={() => setObscure(!obscure)}
								/>
							) : (
								<Eye
									className="absolute right-4 top-3 cursor-pointer"
									strokeWidth={1.3}
									onClick={() => setObscure(!obscure)}
								/>
							)}

							{errors.password && (
								<p className="mt-1 text-sm text-red-400">
									{errors.password.message}
								</p>
							)}
						</div>

						<div className="flex justify-end">
							<Link
								href="/forgot-password"
								className="text-sm text-[#F5DEB3] hover:text-[#ffe6b0] transition-colors"
							>
								{t("login.forgotPassword")}
							</Link>
						</div>

						<button
							type="submit"
							className="primary-btn flex justify-center items-center w-full mt-4"
							disabled={loading}
						>
							{loading ? (
								<>
									<LoaderIcon
										size="24"
										className="mr-2 self-center animate-spin text-primary-bg"
									/>
								</>
							) : (
								t("login.button")
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
