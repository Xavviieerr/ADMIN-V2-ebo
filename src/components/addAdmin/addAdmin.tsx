"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useGenericMutationMutation } from "@/slice/requestSlice";
import LoadingSpinner from "../ui/LoadingSpinner";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

interface AddAdminProps {
  onSuccess?: () => void;
}

export default function AddAdmin({ onSuccess }: AddAdminProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [addAdmin, { isLoading }] = useGenericMutationMutation();

  // Create schema with translated messages
  const adminSchema = z.object({
    firstName: z.string().min(2, {
      message: t("common.firstNameRequired", "First name is required"),
    }),
    lastName: z.string().optional(),
    email: z
      .string()
      .email({ message: t("common.enterValidEmail", "Enter a valid email") }),
    password: z.string().min(6, {
      message: t(
        "common.passwordMinLength",
        "Password must be at least 6 characters",
      ),
    }),
    gender: z.enum(["male", "female"], {
      message: t("common.selectGender", "Select a gender"),
    }),
  });
  const form = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      gender: "male",
    },
  });

  async function onSubmit(values: z.infer<typeof adminSchema>) {
    try {
      const request = {
        url: "/admin/register",
        method: "POST" as const,
        body: values,
        invalidatesTags: [{ type: "admins" as const }],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await addAdmin(request as any).unwrap();
      toast.success(
        t("messages.adminAddedSuccessfully", "New admin added successfully!"),
      );
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(
        getErrorMessage(
          error,
          t("messages.failedToAddAdmin", "Failed to add admin"),
        ),
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* First Name */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("common.firstName", "First Name")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  className="input"
                  placeholder={t("common.lastName", "Last Name")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder={t("common.email", "Email")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  placeholder={t("common.password", "Password")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <select
                  {...field}
                  className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ffe6b0]"
                >
                  <option value="male" className="bg-[#1e1e1e]">
                    {t("common.male", "Male")}
                  </option>
                  <option value="female" className="bg-[#1e1e1e]">
                    {t("common.female", "Female")}
                  </option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="pt-4 flex gap-4 items-center w-full">
          <button onClick={onSuccess} className="secondary-btn w-full">
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="primary-btn w-full"
          >
            {isLoading ? <LoadingSpinner /> : t("common.addAdmin", "Add Admin")}
          </button>
        </div>
      </form>
    </Form>
  );
}
